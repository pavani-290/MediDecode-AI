import React, { useState, useEffect, useRef } from 'react';
import { analyzeMedicalDocument, translateAnalysisResult } from './services/geminiService';
import { saveHistory, loadHistory } from './services/storageService';
import { AnalysisResult, SupportedLanguage, HistoryItem, PatientProfile } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResultView from './components/AnalysisResult';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';

type ViewState = 'landing' | 'auth' | 'app' | 'info';
type InfoType = 'services' | 'contact' | 'privacy' | 'terms' | 'standards';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [infoType, setInfoType] = useState<InfoType>('services');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<{ email: string; name: string; avatar?: string } | null>(null);
  const [profile] = useState<PatientProfile>({ tone: 'Simple' });
  
  const analysisRef = useRef<any>(null);

  useEffect(() => {
    const initApp = async () => {
      const savedHistory = await loadHistory();
      if (savedHistory) setHistory(savedHistory);
      
      const savedUser = localStorage.getItem('medUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      const savedLang = localStorage.getItem('medLang') as SupportedLanguage;
      if (savedLang) setLanguage(savedLang);
    };
    initApp();
  }, []);

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    localStorage.setItem('medLang', newLang);
    
    if (result && result.language !== newLang) {
      setIsAnalyzing(true);
      try {
        const translated = await translateAnalysisResult(result, newLang);
        setResult(translated);
      } catch (e) {
        console.error("Translation failed", e);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleUpload = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeMedicalDocument(base64, mimeType, language, profile);
      setResult(data);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        data,
        previewUrl: mimeType.includes('pdf') ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' : `data:${mimeType};base64,${base64}`,
        fileType: mimeType
      };
      const newHistory = [newItem, ...history].slice(0, 10);
      setHistory(newHistory);
      await saveHistory(newHistory);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Ensure document is clear.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setImagePreview(item.previewUrl);
    setFileType(item.fileType);
    setResult(item.data);
    setView('app');
  };

  const handleBackToScanner = () => {
    setResult(null);
    setImagePreview(null);
    setFileType('');
    setError(null);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medUser');
    setView('landing');
  };

  const handleDownload = () => {
    if (analysisRef.current) {
      analysisRef.current.downloadPDF();
    }
  };

  if (view === 'landing') return (
    <LandingPage 
      onStart={() => setView('app')} 
      onLoginClick={() => setView('auth')} 
      onNavigateInfo={(t) => { setInfoType(t as any); setView('info'); }} 
      user={user}
    />
  );

  if (view === 'auth' && !user) return (
    <Auth onLogin={(u) => { 
      setUser(u); 
      localStorage.setItem('medUser', JSON.stringify(u));
      setView('app'); 
    }} onBack={() => setView('landing')} />
  );

  if (view === 'info') return (
    <InfoPage 
      type={infoType as any} 
      onBack={() => setView(result ? 'app' : 'landing')} 
      onAction={() => setView('app')} 
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
      <Header 
        currentLanguage={language} 
        onLanguageChange={handleLanguageChange} 
        onPrint={handleDownload} 
        onLogout={handleLogout} 
        onLoginClick={() => setView('auth')} 
        onHome={() => setView('landing')} 
        hasResult={!!result} 
        user={user} 
      />
      <main className="max-w-7xl mx-auto px-6 pt-36 md:pt-40 report-container relative z-10">
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-8 rounded-[3rem] mb-10 text-rose-700 flex justify-between items-center shadow-2xl animate-in slide-in-from-top-4 no-print relative z-10">
            <span className="font-black text-sm uppercase tracking-widest">{error}</span>
            <button onClick={() => setError(null)}><i className="fas fa-times"></i></button>
          </div>
        )}
        {!result ? (
          <div className="space-y-16 animate-in fade-in duration-1000 no-print">
            <div className="text-center max-w-2xl mx-auto space-y-6">
               <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Clinical <span className="text-blue-600">Flash-Scan.</span></h1>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Deciphering Handwriting with Vertex AI Precision.</p>
            </div>
            <FileUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} onPreviewChange={(url, type) => { setImagePreview(url); setFileType(type); }} />
            {history.length > 0 && !isAnalyzing && (
              <div className="max-w-5xl mx-auto space-y-10">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] text-center">Previous Scan History</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {history.map(item => (
                    <div key={item.id} onClick={() => handleSelectHistoryItem(item)} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-2xl transition-all group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><i className={`fas ${item.fileType.includes('pdf') ? 'fa-file-pdf' : 'fa-image'}`}></i></div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">{new Date(item.data.timestamp).toLocaleDateString()}</p>
                          <p className="font-black text-slate-800 text-xs truncate max-w-[120px]">{item.data.medicines?.[0]?.name || 'Lab Report'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResultView ref={analysisRef} data={result} originalImage={imagePreview || undefined} fileType={fileType} onBack={handleBackToScanner} />
        )}
      </main>
      <ChatBot context={result || undefined} language={language} />
    </div>
  );
};

export default App;