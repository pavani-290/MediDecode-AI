# MediDecode AI 🏥 🧠

**Turning Medical Handwriting into Clear Understanding.**

MediDecode AI is a sophisticated health-tech web application designed to empower patients by deciphering complex, often illegible medical prescriptions and lab reports. Using state-of-the-art Generative AI, the app translates clinical shorthand and messy handwriting into simple, everyday language across 12+ native languages.

---

## 🚀 Key Features

- **Prescription Decoding**: Advanced OCR and LLM-based deciphering of doctor handwriting.
- **Medicine Breakdown**: Explains general purpose, usage, side-effects, and warnings for every detected medicine.
- **Lab Report Analysis**: Visualizes lab results (like CBC, Thyroid) with color-coded status bars and plain-language explanations.
- **Nearby Pharmacies**: Dynamic geolocation-based pharmacy search powered by **Google Maps Grounding**.
- **Multilingual Support**: Instant translation into 12+ languages (Hindi, Bengali, Spanish, etc.).
- **AI Concierge**: An intelligent chatbot to answer follow-up questions about scan results.
- **Voice Summaries**: Integrated Text-to-Speech for audible report summaries.
- **PDF Export**: Generate professional PDF reports with custom settings for mobile and desktop.
- **PWA Ready**: Install as a native app on iOS, Android, or Desktop.

---

## 🛠️ Technology Stack

- **Frontend**:  python,React (ESM), Tailwind CSS, FontAwesome.
- **AI Engine**: Google Gemini API (@google/genai).
- **Core Models**: 
  - `gemini-3-flash-preview` and vertex AI (Primary Analysis & Chat)
  - `gemini-2.5-flash` (Maps Grounding & Pharmacies)
  - `gemini-2.5-flash-preview-tts` (Text-to-Speech)
- **Deployment & PWA**: Service Workers, IndexedDB for local storage.

---

## 📦 Installation

1. Clone the repository.
2. Install dependencies (standard NPM/Yarn setup).
3. Configure your environment variable:
   ```env
   API_KEY=your_google_gemini_api_key
   ```
4. Run the development server.

---

## ⚠️ Medical Disclaimer

This application is for **Health Awareness and Education purposes only**. It does not provide medical advice. The AI analysis may contain errors. Always consult a qualified medical professional before making any health decisions.

---

## 📄 License
MIT License. Created for health literacy awareness.
