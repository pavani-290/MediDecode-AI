# MediDecode AI: Detailed Project Documentation

## 1. Executive Summary
MediDecode AI is an MVP (Minimum Viable Product) prototype designed to bridge the gap between clinical documentation and patient understanding. The project addresses the global issue of "Medical Literacy," where patients struggle to understand the complex instructions provided by healthcare providers, leading to medication errors and non-compliance.

## 2. Core Features & Functionality

### A. Intelligent Scanning (Vision AI)
The app uses vision-capable LLMs to scan images of prescriptions. Unlike standard OCR which struggles with slanted or cursive handwriting, Gemini's multimodal capabilities allow it to infer letters based on medical context (e.g., if it sees "Am...in", it knows it's likely "Amoxicillin" given the context of an infection).

### B. Medical Terminology Simplification
Each clinical term is mapped to a simplified explanation.
- **Example**: "q.i.d" is expanded to "Four times a day."
- **Lab Results**: Parameters like "Hemoglobin: 10g/dL" are not just shown as numbers but explained as "Low - indicates potential anemia."

### C. Geolocation Services
The app utilizes the browser's `navigator.geolocation` API. Once user consent is obtained:
1. Coordinates are sent to Gemini.
2. Gemini uses the **Google Maps tool** to find open, highly-rated pharmacies.
3. Interactive links are provided for one-tap navigation.

### D. Multi-Speaker & Multilingual Support
Recognizing that health issues are global, the app supports 12+ languages. The translation isn't a word-for-word replacement but a contextual medical translation ensuring terms remain accurate in the target language.

### E. Mobile-Optimized PDF Export
Mobile browsers often handle the `window.print()` command by opening a printer setup. MediDecode includes a custom **Print Options Modal** that allows mobile users to pre-set paper size (A4/Letter) and orientation (Portrait/Landscape) before generating the PDF, ensuring the layout remains professional on any device.

## 3. System Architecture
- **Stateless Analysis**: No user medical data is stored on external servers. All processing happens via API and results are kept in the user's browser via **IndexedDB**.
- **PWA Architecture**: The app uses Service Workers to cache assets, allowing it to load instantly even on slow 3G networks typical in many healthcare environments.

## 4. Safety & Ethical Considerations
- **Safety Filters**: The app implements `BLOCK_NONE` for medical categories to ensure legitimate health data isn't censored, while maintaining a strict **Medical Disclaimer** on every screen.
- **Patient Privacy**: No PII (Personally Identifiable Information) is required to use the basic decoding features.

---
*This documentation covers the full scope of Version 1.2.0.*
