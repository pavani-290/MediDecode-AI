# MediDecode AI 🏥 🧠

**Turning Medical Handwriting into Clear Understanding.**

MediDecode AI is a sophisticated health-tech web application designed to empower patients by deciphering complex, often illegible medical prescriptions and lab reports. Using state-of-the-art Google Vertex AI-grade models, the app translates clinical shorthand and messy handwriting into simple, everyday language across 12+ native languages.

---

## 🌟 Powered by Google AI
This application is built exclusively using the **Google Gemini ecosystem**, leveraging cutting-edge multimodal and grounding technologies:

- **Gemini 3 Flash (Vertex AI-grade)**: The "brain" of the app, handling advanced handwriting OCR and medical reasoning.
- **Gemini 2.5 Flash**: Orchestrates real-world grounding for location-based pharmacy discovery.
- **Gemini 2.5 Flash TTS**: Provides high-fidelity, natural medical voice summaries.
- **Google Maps Tool**: Integrated directly into the AI workflow for verified, proximity-locked pharmacy information.
- **@google/genai SDK**: The core framework for seamless AI communication.

---

## 🚀 Key Features

1.  **Handwriting Deciphering**: Reads messy doctor penmanship and clinical abbreviations (TDS, OD, etc.) that standard scanners miss.
2.  **Human-Centric Explanations**: Translates complex jargon (like "Hypokalemia") into plain language ("Low Potassium").
3.  **Visual Dose Mapping**: Auto-generates a clear Morning / Afternoon / Evening / Night chart for all medications.
4.  **Smart Lab Interpretation**: Instantly flags lab results as Normal, High, or Low with color-coded visual bars.
5.  **GPS-Strict Pharmacy Finder**: Pinpoints the 3 closest verified pharmacies based strictly on your live coordinates.
6.  **AI Audio Summaries**: An "Audio Report" feature that reads the medical summary aloud for accessibility.
7.  **Safety Matrix**: Cross-references all scanned medicines to warn about dangerous drug-drug interactions.
8.  **12+ Native Languages**: One-click translation into Hindi, Bengali, Tamil, Spanish, Arabic, and more.
9.  **24/7 Health Concierge**: An AI Chatbot to answer follow-up questions about your scan at any time.
10. **Professional PDF Exports**: Generates a clean, printable report to share with your family or other doctors.

---

## 🛠️ Technology Stack

- **Frontend**: React (ESM), Tailwind CSS, FontAwesome.
- **AI Engine**: Google Gemini API (Vertex AI Tier).
- **Grounding**: Google Maps API integration via GenAI Tools.
- **Storage**: IndexedDB & LocalStorage for persistent local privacy.

---

## 📦 Getting Started

1. Clone the repository.
2. Install dependencies.
3. Set your `API_KEY` in the environment.
4. Launch with `npm start` or your preferred local server.

---

## ⚠️ Medical Disclaimer

This application is for **Health Awareness and Education purposes only**. It does not provide medical advice. Always consult a qualified medical professional before making any health decisions.
