
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage, AnalysisResult, SupportedLanguage } from '../types';

interface ChatBotProps {
  context?: AnalysisResult;
  language?: SupportedLanguage;
}

const ChatBot: React.FC<ChatBotProps> = ({ context, language = 'English' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseSuggestions: Record<string, string[]> = {
      'English': ["How do I upload a scan?", "What can this AI detect?", "Tips for record keeping"],
      'Hindi': ["स्कैन कैसे अपलोड करें?", "यह AI क्या पहचान सकता है?", "रिकॉर्ड रखने के टिप्स"]
    };

    if (context && context.medicines && context.medicines.length > 0) {
      const medName = context.medicines[0].name;
      setSuggestions([
        `Interactions for ${medName}?`,
        `Missed dose of ${medName}?`,
        `Side effects of ${medName}?`
      ]);
    } else {
      setSuggestions(baseSuggestions[language] || baseSuggestions['English']);
    }
  }, [language, context]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Fix: Added explicit cast for language to SupportedLanguage to match service signature
      const response = await getChatResponse(messages, text, context, language as SupportedLanguage);
      const parts = response.split('[SUGGESTION]');
      const mainText = parts[0].trim();
      const newSuggestions = parts.slice(1).map(s => s.trim().replace(/^[-*]\s*/, ''));

      setMessages(prev => [...prev, { role: 'model', text: mainText }]);
      if (newSuggestions.length > 0) setSuggestions(newSuggestions);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg = error.message?.includes('fetch') 
        ? "Network connection error. Please check your internet and try again."
        : "The service is currently overwhelmed. Please wait a moment and try again.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 border-4 border-white group overflow-hidden chatbot-trigger"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <i className="fas fa-times text-xl relative z-10"></i> : <i className="fas fa-stethoscope text-2xl relative z-10"></i>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500 chatbot-window">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-md border border-white/10">
                <i className="fas fa-user-md text-blue-400"></i>
              </div>
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-blue-400">MediDecode Concierge</h3>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_#10b981]"></div>
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">Live Help</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {messages.length === 0 && (
              <div className="text-center py-10 px-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                   <i className="fas fa-comment-medical text-2xl"></i>
                </div>
                <h4 className="text-slate-900 font-black text-sm uppercase tracking-tight mb-2">How can I assist?</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic italic">
                  Ask me anything about the scan results or app usage.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm font-semibold leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 rounded-br-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t bg-white">
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-[10px] bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 border border-slate-100 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-tighter truncate max-w-full"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-slate-100 rounded-2xl px-5 py-4 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask your health query..."
                className="bg-transparent flex-1 text-sm outline-none font-bold text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSend(input)}
                className="text-blue-600 hover:text-blue-700 transition-colors ml-3 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-50"
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
