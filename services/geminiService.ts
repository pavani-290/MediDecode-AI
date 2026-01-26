
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
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
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
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
    contents: `FIND REAL PHYSICAL PHARMACIES AT THE EXACT COORDINATES: Lat ${lat}, Lng ${lng}.
    STRICT REQUIREMENT: Use Google Maps Tool to discover ONLY verified medical stores or pharmacies within a 5km radius of these EXACT coordinates. 
    DO NOT return results from other cities.
    Return strictly a JSON array: [{name: string, uri: string, address: string}].`,
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
    name: c.maps.title,
    uri: c.maps.uri,
    address: c.maps.address || 'Verified Medical Store',
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
      1. Provide accurate, evidence-based, and CONCISE answers based strictly on the scanned medical data.
      2. For follow-up questions, refer to detected medicines, dosages, and lab values in the context.
      3. If asked general health questions, answer briefly and always include a clinical disclaimer.
      4. Avoid jargon. Use plain language.`,
      safetySettings: SAFETY_SETTINGS 
    },
    history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
  });
  const result = await chat.sendMessage({ message });
  return result.text || "...";
};

export const generateMockupImage = async (type: 'wireframe' | 'mockup' | 'diagram'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let prompt = '';
  if (type === 'wireframe') prompt = 'A professional UI wireframe for a medical app dashboard.';
  else if (type === 'mockup') prompt = 'High-fidelity 3D mockup of a medical smartphone app.';
  else prompt = 'Clinical journey flowchart diagram.';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
  } catch (e) { return null; }
};
