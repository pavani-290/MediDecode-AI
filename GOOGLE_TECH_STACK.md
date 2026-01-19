# Google Technology Stack Breakdown

MediDecode AI leverages the latest advancements in the Google Gemini ecosystem to deliver a high-performance, intelligent healthcare experience.

## 🌟 Major Role: Gemini 3 Flash
The **Gemini 3 Flash** model plays the most critical role in this application. It handles the "Vision-to-Text" OCR deciphering of complex medical handwriting. Its low latency and high reasoning capability allow it to distinguish between similar-looking drug names and provide clinical context instantly.

## 🛠️ Detailed Tech Integration

| Technology | Role in Project | Key Benefit |
| :--- | :--- | :--- |
| **Gemini 3 Flash** | Document Analysis & OCR | Deciphers illegible handwriting and extracts structured medical data. |
| **Gemini 2.5 Flash** | Dynamic Map Search | Powers the pharmacy locator using **Google Maps Grounding** to find real-world stores. |
| **Gemini 2.5 Flash TTS** | Audio Accessibility | Converts text summaries into natural-sounding speech for patients with visual impairments. |
| **Google Maps Tool** | Grounding Service | Allows the AI to verify the existence and locations of pharmacies near the user's GPS coordinates. |
| **Google Fonts** | UI/UX Design | Uses *Plus Jakarta Sans* for a modern, clean, and professional medical interface. |
| **Google Generative AI SDK** | API Communication | The unified `@google/genai` library facilitates all real-time interactions with AI models. |

## Why Google AI?
The integration of **Grounding with Google Search/Maps** sets this app apart, ensuring that the information provided (like location of stores) isn't hallucinated but retrieved from up-to-date real-world data.
