
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

// Fixed SafetySetting type errors by using HarmCategory and HarmBlockThreshold enums from @google/genai
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

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

  try {
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
  } catch (error: any) {
    throw error;
  }
};

export const translateAnalysisResult = async (
  currentResult: AnalysisResult,
  targetLanguage: SupportedLanguage
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Translate this medical JSON structure accurately into ${targetLanguage}. Keep the logic identical.`;
  
  try {
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
  } catch (e) {
    return currentResult;
  }
};

export const findNearbyPharmacies = async (lat: number, lng: number): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: `USER CURRENT LOCATION COORDINATES: Lat ${lat}, Lng ${lng}.
    STRICT COMMAND: Find REAL, ACTIVE pharmacies within 5km of these EXACT coordinates.
    CRITICAL: DO NOT return results from the USA or Dallas unless the coordinates are actually in the USA.
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
  
  // Filter only maps results and map to our structure
  return chunks.filter((c: any) => c.maps).map((c: any) => ({
    name: c.maps.title || 'Local Pharmacy',
    uri: c.maps.uri,
    address: c.maps.address || 'Verified Nearby Location',
    distance: 'Nearby'
  })).slice(0, 3);
};

export const getSpeech = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) { return null; }
};

export const getChatResponse = async (history: ChatMessage[], message: string, context?: AnalysisResult, language: SupportedLanguage = 'English'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { 
      systemInstruction: `You are the MediDecode AI Assistant. 
      CURRENT SCAN CONTEXT: ${JSON.stringify(context || 'No document available')}. 
      LANGUAGE: ${language}.
      INSTRUCTIONS:
      1. Provide extremely accurate and CONCISE answers based strictly on the scanned medical document provided.
      2. If asked about medicines in the document, refer strictly to the detected names and dosages.
      3. For lab results, explain the status (High/Low/Normal) clearly and what it generally means clinically.
      4. Always include a clinical disclaimer that this is AI interpretation.`,
      safetySettings: SAFETY_SETTINGS 
    },
    history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
  });
  const result = await chat.sendMessage({ message });
  return result.text || "...";
};

// Added generateMockupImage to support presentation asset generation in MockupLab
export const generateMockupImage = async (type: 'wireframe' | 'mockup' | 'diagram'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompts = {
    wireframe: "A high-fidelity mobile app UI wireframe for a medical interpretation dashboard, clean white background, professional blueprint style with clinical elements.",
    mockup: "A professional 3D product mockup of a smartphone or tablet displaying the MediDecode AI medical interface, clean studio lighting, high resolution.",
    diagram: "A professional clinical data journey process flow diagram, showing document scanning to AI interpretation, clean modern medical design."
  };

  try {
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
        // Iterate through parts to find the inlineData containing the generated image bytes
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Mockup generation error:", error);
    return null;
  }
};
