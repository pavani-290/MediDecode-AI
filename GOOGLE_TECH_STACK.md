# Google Technology Stack: AI Integration Breakdown

MediDecode AI utilizes a specialized suite of Google AI tools to ensure accuracy, grounding, and accessibility.

## 🚀 The Core AI Models

### 1. Gemini 3 Flash (Primary Engine)
- **Role**: Handwriting OCR, Medical Reasoning, and Multilingual Analysis.
- **Major Contribution**: Processes raw images of messy prescriptions and converts them into structured JSON data. It identifies complex drug names and lab parameters that traditional OCR fails to read.
- **Capabilities**: High-speed inference and deep context window for analyzing long reports.

### 2. Gemini 2.5 Flash (Grounding Expert)
- **Role**: Location-Aware Pharmacy Discovery.
- **Major Contribution**: Acts as the interface between the LLM and the physical world. It takes user GPS coordinates and finds verified local businesses.
- **Feature**: **Google Maps Grounding** ensures that pharmacy data is real and accurate, reducing hallucinations.

### 3. Gemini 2.5 Flash TTS (Accessibility)
- **Role**: Natural Text-to-Speech.
- **Major Contribution**: Converts the AI-generated medical summary into high-quality audio (`Kore` voice profile). This makes the app accessible to elderly patients or those with visual impairments.

## 🛠️ Integrated Google Tools & SDKs

| Tool | Integration Point | Function |
| :--- | :--- | :--- |
| **@google/genai SDK** | Service Layer | The official unified client for all Gemini model interactions. |
| **Google Maps Tool** | Pharmacy Finder | Provides verified grounding chunks for real-world location links. |
| **Google Search Grounding**| ChatBot (Optional) | Can be toggled for the concierge to find the latest clinical guidelines. |
| **Google Plus Jakarta Sans**| UI / Typography | Professional, high-readability font for clinical reports. |
| **Google Chrome / Android** | PWA Deployment | Optimized for installation via Chrome's PWA engine. |

## 🌟 Why this stack plays a major role:
Without **Gemini 3 Flash**, the app could not read the handwriting. Without **Gemini 2.5 Flash & Maps Tool**, the pharmacy locator would rely on outdated static databases. This integration ensures a "Live" medical assistant that understands both the paper in your hand and the world around you.
