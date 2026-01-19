
import { GoogleGenAI, Type, Chat, GenerateContentResponse, Modality } from "@google/genai";
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
          dosageStatus: { 
            type: Type.STRING, 
            description: "If dosage is clearly visible, provide it. If the handwriting is illegible or dosage is missing, strictly return: 'Dosage unclear from image'." 
          },
          interactionWarning: { type: Type.STRING, description: "Check if detected medicines conflict with each other." }
        },
        required: ["name", "purpose", "usage", "sideEffects", "warnings", "dosageStatus"]
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
        },
        required: ["parameter", "value", "unit", "referenceRange", "status", "explanation"]
      }
    },
    shorthandDecoded: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          meaning: { type: Type.STRING }
        },
        required: ["term", "meaning"]
      }
    },
    keyRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    confidenceScore: { type: Type.INTEGER },
    ocrNotes: { type: Type.STRING }
  },
  required: ["summary", "medicines", "keyRecommendations", "confidenceScore"]
};

// Configuration to prevent medical queries from being blocked by safety filters
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
];

/**
 * Helper to handle retries for transient network errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isNetworkError = error instanceof TypeError || error.message?.toLowerCase().includes('fetch');
    const isServerError = error.status >= 500;
    
    if (retries > 0 && (isNetworkError || isServerError)) {
      console.warn(`Retry attempt left: ${retries}. Error: ${error.message}`);
      await new Promise(r => setTimeout(r, 1500));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

/**
 * Analyzes medical documents using Gemini 3 Flash.
 */
export const analyzeMedicalDocument = async (
  base64Image: string, 
  mimeType: string, 
  language: SupportedLanguage = 'English',
  profile?: PatientProfile
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview"; 
    
    const prompt = `Act as an expert clinical pharmacist and lab technician.
    Analyze the provided image for HEALTH AWARENESS and EDUCATION ONLY.
    
    CONTEXT: Patient is ${profile?.age || 'unknown age'} ${profile?.gender || ''}. Tone: ${profile?.tone || 'Simple'}.
    
    TASKS:
    1. OCR decipher handwriting.
    2. Explain medicines & lab parameters in ${language}.
    3. If dosage is illegible, strictly return "Dosage unclear from image".
    4. Provide clear warnings about medical context.`;

    const response = await ai.models.generateContent({
      model,
      contents: { 
        parts: [
          { inlineData: { data: base64Image, mimeType } }, 
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
    if (!text) {
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error("This document was flagged by safety filters. Please ensure it is a valid medical document.");
      }
      throw new Error("Analysis failed. The image might be too blurry or blocked.");
    }
    
    return { ...JSON.parse(text), timestamp: Date.now(), language };
  });
};

/**
 * Finds nearby pharmacies using Gemini 2.5 Flash and Maps tool.
 */
export const findNearbyPharmacies = async (lat: number, lng: number): Promise<any> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });
  // Switched to gemini-2.5-flash for more stable Google Maps grounding support
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: "Find 3 highly-rated pharmacies near my current location. Return a list of places.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });

  // Extract results from grounding chunks
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && Array.isArray(chunks)) {
    return chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        name: chunk.maps.title || "Nearby Pharmacy",
        uri: chunk.maps.uri || "#",
        address: chunk.maps.address || 'Click for location',
        distance: 'Nearby'
      }))
      .slice(0, 3);
  }

  return [];
};

export const translateAnalysisResult = async (
  result: AnalysisResult,
  targetLanguage: SupportedLanguage
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return result;

  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate this medical analysis to ${targetLanguage}. Keep clinical terms accurate. Data: ${JSON.stringify(result)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        safetySettings: SAFETY_SETTINGS
      }
    });
    return { ...JSON.parse(response.text || '{}'), timestamp: result.timestamp, language: targetLanguage };
  });
};

export const getSpeech = async (text: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  try {
    const ai = new GoogleGenAI({ apiKey });
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

export const getChatResponse = async (
  history: ChatMessage[],
  message: string,
  context?: AnalysisResult,
  language: SupportedLanguage = 'English'
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key missing.";

  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are "MediDecode Concierge", a clinical education assistant.
    PURPOSE: Explain the current decoded medical report and answer health awareness questions.
    STRICT RULE: You are NOT a doctor. Always include a disclaimer.
    
    REPORT CONTEXT: ${context ? JSON.stringify(context) : 'None uploaded.'}
    
    RESPONSE RULES:
    1. Language: ${language}.
    2. Be helpful but cautious.
    3. Format suggestions as [SUGGESTION] Question? at the end.`;

    const chat: Chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { 
        systemInstruction,
        safetySettings: SAFETY_SETTINGS
      },
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    const responseText = result.text;
    
    if (!responseText) {
      if (result.candidates?.[0]?.finishReason === 'SAFETY') {
        return "I'm sorry, but I cannot answer that specific question due to safety restrictions. Please consult your doctor for clinical advice.";
      }
      return "I encountered an issue processing your request. Please try rephrasing.";
    }

    return responseText;
  });
};
