
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, AnalysisResult, SupportedLanguage } from '../types';

interface ChatBotProps {
  context?: AnalysisResult;
  language?: SupportedLanguage;
}

// Add types for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ChatBot: React.FC<ChatBotProps> = ({ context, language = 'English' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const baseSuggestions: Record<string, string[]> = {
      'English': ["What medicines were found?", "Explain dosage instructions", "Any warnings found?"],
      'Hindi': ["कौन सी दवाएं मिलीं?", "खुराक समझाएं", "खतरे की चेतावनी?"]
    };

    if (context && context.medicines && context.medicines.length > 0) {
      const medName = context.medicines[0].name;
      setSuggestions([`What is ${medName}?`, `Side effects for ${medName}?`, "Explain this report"]);
    } else {
      setSuggestions(baseSuggestions[language] || baseSuggestions['English']);
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language, context]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    const userMsg: ChatMessage = { role: 'user', text: cleanText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getChatResponse([...messages, userMsg], cleanText, context, language as SupportedLanguage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: "Medical reasoning service is temporarily busy. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 w-20 h-20 rounded-[2.5rem] shadow-4xl flex items-center justify-center transition-all z-50 border-[6px] border-white group chatbot-trigger ${isOpen ? 'bg-rose-500 scale-90' : 'bg-slate-900 hover:scale-110 active:scale-95 shadow-indigo-500/20'}`}
      >
        {isOpen ? <i className="fas fa-times text-2xl text-white"></i> : <i className="fas fa-stethoscope text-3xl text-white"></i>}
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-8 w-[520px] max-w-[calc(100vw-4rem)] h-[800px] max-h-[85vh] bg-white/95 backdrop-blur-3xl rounded-[3.5rem] shadow-4xl flex flex-col z-50 overflow-hidden border border-white/60 animate-in fade-in slide-in-from-bottom-12 duration-500 chatbot-window">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 p-10 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex items-center relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center mr-6 backdrop-blur-md border border-white/20">
                <i className={`fas ${isListening ? 'fa-microphone text-rose-400 animate-pulse' : 'fa-robot text-rose-400'} text-2xl`}></i>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest text-rose-400">Clinical Concierge</h3>
                <div className="flex items-center mt-2">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]'}`}></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{isListening ? 'Voice Portal Open' : 'Clinical Node Active'}</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 bg-slate-50/20">
            {messages.length === 0 && (
              <div className="text-center py-16 px-8 space-y-8">
                <div className="w-24 h-24 bg-white rounded-[3rem] shadow-xl border border-slate-100 flex items-center justify-center mx-auto text-indigo-600 text-4xl"><i className="fas fa-comment-medical"></i></div>
                <h4 className="text-slate-900 font-black text-2xl tracking-tight leading-none">AI Medical Assistant</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">Ask follow-up questions about your scan results. Voice input is supported.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] p-7 rounded-[2.5rem] text-sm font-bold leading-relaxed shadow-lg ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('-') || line.startsWith('*') ? 'ml-2 mb-1' : 'mb-2'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex flex-wrap gap-2.5 mb-8">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-[9px] bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 border border-slate-100 px-5 py-3 rounded-2xl transition-all font-black uppercase tracking-widest active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
            
            <div className={`flex items-center bg-slate-100 rounded-[2.5rem] px-6 py-5 border transition-all ${input.trim() || isListening ? 'border-indigo-500 bg-white shadow-2xl ring-8 ring-indigo-500/5' : 'border-slate-200'}`}>
              <button 
                onClick={toggleListening}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
              >
                <i className={`fas ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
              </button>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder={isListening ? "Listening now..." : "Ask Clinical Assistant..."}
                className="bg-transparent flex-1 text-sm outline-none font-bold text-slate-700 placeholder:text-slate-400 ml-5"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className={`ml-5 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-xl rotate-0' : 'text-slate-300'}`}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
