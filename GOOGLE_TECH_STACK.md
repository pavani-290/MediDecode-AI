# Google Technology Stack: Enterprise-Grade AI Integration

MediDecode AI is architected using the highest tier of **Google AI models** to deliver clinical-standard accuracy and reliability. Below is a breakdown of the specific technologies and their roles.

## 🚀 The Core AI Models

### 1. Gemini 3 Flash (Vertex AI Tier)
- **Role**: Multimodal Handwriting Deciphering & Medical Reasoning.
- **Major Contribution**: This is the core engine that reads messy doctor penmanship. It utilizes advanced vision logic to understand clinical abbreviations (e.g., "TDS", "p.c.") that traditional OCR engines miss.
- **Role in Solution**: Acts as the primary vision interpreter for prescriptions and reports.

### 2. Gemini 2.5 Flash (Grounding Expert)
- **Role**: **GPS-Strict Pharmacy Discovery**.
- **Major Contribution**: Leverages Gemini's tool-calling capabilities to interact with the **Google Maps Tool**.
- **Real-World Impact**: Ensures that pharmacy locations are strictly filtered by the user's current coordinates, eliminating "hallucinated" or random locations.

### 3. Gemini 2.5 Flash TTS (Accessibility)
- **Role**: AI Audio Summaries.
- **Major Contribution**: Provides the "Audio Report" feature using advanced text-to-speech synthesis, making health data accessible via human-like voice summaries (`Kore` profile).

## 🛠️ Integrated Google Tools & SDKs

| Tool | Integration Point | Major Role |
| :--- | :--- | :--- |
| **@google/genai SDK** | Service Layer | Provides the enterprise interface to Vertex AI-grade Gemini models. |
| **Google Maps Tool** | Grounding Matrix | Guarantees that the "Pharmacy Finder" only shows verified, existing medical stores. |
| **Google Geolocation API** | Input Layer | Feeds high-accuracy coordinates to the AI to prevent random location results. |
| **Google Cloud Safety Filters**| Safety Matrix | Implements strict safety filters to detect and warn about dangerous drug interactions. |

## 🌟 Major Role Summary
Vertex AI features play the **critical role** of ensuring safety. The **Safety Matrix** and **GPS-Strict Pharmacy Finder** rely on Google's specialized grounding tools to ensure that AI output is tied to real-world clinical facts and actual physical locations, preventing the common AI issue of providing random or incorrect data.
