# MediDecode AI: Project & AI Integration Documentation

## 1. Project Overview
MediDecode AI is a next-generation medical literacy tool designed to simplify clinical communications for patients. By combining **Google Vision AI** and **Generative Grounding**, it transforms complex medical documents into actionable knowledge.

## 2. Integrated Google AI Technologies

### A. Computer Vision & Handwriting Recognition
Powered by **Gemini 3 Flash**, the application utilizes advanced vision-to-text processing. 
- **Major Role**: It deciphers "Doctor's Handwriting," which is notoriously difficult for traditional systems. The model uses clinical context (e.g., surrounding symptoms or lab values) to accurately predict illegible words.

### B. Real-World Grounding (Google Maps)
Unlike standard chatbots, MediDecode AI is "grounded" in reality.
- **Integration**: The app uses the **Google Maps tool** via **Gemini 2.5 Flash**.
- **Function**: When a user shares their location, the AI doesn't just "guess" where pharmacies are; it retrieves verified listings, addresses, and navigation links directly from Google's live maps database.

### C. Contextual Multilingual Translation
Translation is handled by **Gemini 3 Flash** to ensure medical accuracy.
- **Role**: Translating "TDS" (Three times a day) correctly into "दिन में तीन बार" (Hindi) or "Tres veces al día" (Spanish) while maintaining the clinical weight of the instruction.

### D. Audio Synthesis (Text-to-Speech)
The **Gemini 2.5 Flash TTS** model is used to create an inclusive experience.
- **Role**: It converts the decoded summary into a natural voice, allowing patients to listen to their prescription details on the go.

## 3. Key Functional Modules

| Module | Google Tech Used | Technical Implementation |
| :--- | :--- | :--- |
| **OCR Scanner** | Gemini 3 Flash | Multimodal input (image + text prompt) with JSON schema output. |
| **Pharmacy Locator** | Gemini 2.5 Flash + Maps | Grounding metadata extraction from lat/lng coordinates. |
| **AI Concierge** | Gemini 3 Flash | Stateful chat session with system instructions for medical safety. |
| **PDF Export** | Browser Native | Dynamic CSS injection for mobile-responsive print layouts. |
| **Offline Access** | PWA Service Workers | Caching logic for 24/7 availability on mobile devices. |

## 4. Medical Safety & Accuracy
Safety is at the core of our AI integration:
- **Safety Filters**: Configured with `BLOCK_NONE` for clinical categories to prevent false blocks of valid medical terms (like 'blood' or 'surgery').
- **Explicit Disclaimers**: The AI is instructed to always remind users that it is an "Educational Assistant" and not a "Doctor."

## 5. Summary of Innovation
The major innovation of MediDecode AI lies in its ability to combine **Vision**, **Reasoning**, **Location**, and **Voice** into a single, unified patient experience—all powered by the **Google Gemini API**.
