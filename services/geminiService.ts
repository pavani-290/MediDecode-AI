
import { GoogleGenAI, Type, Chat, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AnalysisResult, SupportedLanguage, PatientProfile, ChatMessage } from "../types";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    medicines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          purpose: { type: Type.STRING },
          usage: { type: Type.STRING },
          sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.STRING },
          dosageStatus: { type: Type.STRING },
          interactionWarning: { type: Type.STRING },
          schedule: {
            type: Type.OBJECT,
            properties: {
              morning: { type: Type.BOOLEAN },
              afternoon: { type: Type.BOOLEAN },
              evening: { type: Type.BOOLEAN },
              night: { type: Type.BOOLEAN },
              beforeFood: { type: Type.BOOLEAN }
            }
          }
        },
        required: ["name", "purpose", "usage", "dosageStatus"]
      }
    },
    labResults: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          parameter: { type: Type.STRING },
          value: { type: Type.STRING },
          unit: { type: Type.STRING },
          referenceRange: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["Normal", "Borderline", "High", "Low"] },
          explanation: { type: Type.STRING }
        }
      }
    },
    interactionMatrix: { type: Type.STRING, description: "Detailed check of how all detected meds interact." },
    keyRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    confidenceScore: { type: Type.INTEGER }
  },
  required: ["summary", "medicines", "keyRecommendations", "confidenceScore"]
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

/**
 * Helper to handle API calls with exponential backoff for 503/429 errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let delay = 1000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isOverloaded = error?.message?.includes('503') || error?.message?.includes('overloaded');
      const isRateLimited = error?.message?.includes('429');
      
      if ((isOverloaded || isRateLimited) && i < maxRetries - 1) {
        console.warn(`Gemini API busy (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  return await fn(); // Final attempt
}

export const analyzeMedicalDocument = async (
  base64Data: string, 
  mimeType: string, 
  language: SupportedLanguage = 'English',
  profile?: PatientProfile
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a world-class Clinical Pharmacist.
  Decipher messy medical handwriting and complex reports with surgical precision.
  1. Map instructions (1-0-1, TDS) to the structured schedule.
  2. Output only valid JSON in ${language}.
  3. Ensure 50MB capable reasoning logic.`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: { 
        parts: [
          { inlineData: { data: base64Data, mimeType } }, 
          { text: "Analyze this medical document and return JSON following the clinical schema." }
        ] 
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        safetySettings: SAFETY_SETTINGS,
        thinkingConfig: { thinkingBudget: 1500 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Analysis failed. Try a clearer scan.");
    return { ...JSON.parse(text), timestamp: Date.now(), language };
  });
};

export const translateAnalysisResult = async (
  currentResult: AnalysisResult,
  targetLanguage: SupportedLanguage
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Translate this medical JSON structure accurately into ${targetLanguage}. Keep the logic identical.`;
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: JSON.stringify(currentResult) },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        safetySettings: SAFETY_SETTINGS
      }
    });

    const text = response.text;
    if (!text) return currentResult;
    return { ...JSON.parse(text), timestamp: currentResult.timestamp, language: targetLanguage };
  });
};

export const findNearbyPharmacies = async (lat: number, lng: number): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: `USER CURRENT LOCATION COORDINATES: Lat ${lat}, Lng ${lng}.
      STRICT COMMAND: Find REAL, ACTIVE pharmacies within 5km of these EXACT coordinates.
      If coordinates point to India (e.g., Tirupati), only return stores in that specific city or neighborhood.
      ONLY USE RESULTS FROM THE GOOGLE MAPS TOOL.
      Return strictly a JSON array of objects: [{name: string, uri: string, address: string}].`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { 
          retrievalConfig: { 
            latLng: { latitude: lat, longitude: lng } 
          } 
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks || chunks.length === 0) return [];
    
    return chunks.filter((c: any) => c.maps).map((c: any) => ({
      name: c.maps.title || 'Local Pharmacy',
      uri: c.maps.uri,
      address: c.maps.address || 'Verified Nearby Location',
      distance: 'Nearby'
    })).slice(0, 3);
  });
};

export const getSpeech = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) { return null; }
};

export const getChatResponse = async (history: ChatMessage[], message: string, context?: AnalysisResult, language: SupportedLanguage = 'English'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are the MediDecode AI Concierge, a highly specialized medical assistant.
  
  CURRENT SCAN DATA: ${context ? JSON.stringify(context) : 'No document currently scanned.'}
  TARGET LANGUAGE: ${language}
  
  STRICT BEHAVIOR RULES:
  1. ACCURACY & CONCISENESS: Provide direct, clear, and medically accurate answers. Use bullet points for readability.
  2. DISCLAIMER: Every response MUST conclude with a brief, bold disclaimer: "This is an AI interpretation. Please verify all information with your physician."
  3. Respond only in ${language}.`;

  return withRetry(async () => {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { 
        systemInstruction,
        safetySettings: SAFETY_SETTINGS,
        thinkingConfig: { thinkingBudget: 1000 }
      },
      history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
    });
    
    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't process that.";
  });
};

export const generateMockupImage = async (type: 'wireframe' | 'mockup' | 'diagram'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompts = {
    wireframe: "A high-fidelity mobile app UI wireframe for a medical interpretation dashboard.",
    mockup: "A professional 3D product mockup of a smartphone displaying the MediDecode AI medical interface.",
    diagram: "A professional clinical data journey process flow diagram."
  };

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompts[type] }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    });
  } catch (error) {
    console.error("Mockup generation error:", error);
    return null;
  }
};
