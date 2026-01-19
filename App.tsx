
import React, { useState, useEffect } from 'react';
import { analyzeMedicalDocument, translateAnalysisResult } from './services/geminiService';
import { saveHistory, loadHistory } from './services/storageService';
import { AnalysisResult, SupportedLanguage, HistoryItem, PatientProfile } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResultView from './components/AnalysisResult';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import ChatBot from './components/ChatBot';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';

type ViewState = 'landing' | 'auth' | 'app';
type PrintSize = 'A4' | 'Letter' | 'Legal';
type PrintOrientation = 'portrait' | 'landscape';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [profile, setProfile] = useState<PatientProfile>({ tone: 'Simple' });
  const [isTranslating, setIsTranslating] = useState(false);

  // Print Logic State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSize, setPrintSize] = useState<PrintSize>('A4');
  const [printOrientation, setPrintOrientation] = useState<PrintOrientation>('portrait');

  useEffect(() => {
    const initApp = async () => {
      const savedHistory = await loadHistory();
      if (savedHistory && savedHistory.length > 0) {
        setHistory(savedHistory);
      }
      const savedUser = localStorage.getItem('medUser');
      if (savedUser) {
        try { 
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        } catch (e) {}
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (result && result.language !== language && !isAnalyzing && !isTranslating) {
      handleTranslateCurrentResult();
    }
  }, [language, result]);

  const handleTranslateCurrentResult = async () => {
    if (!result) return;
    setIsTranslating(true);
    try {
      const translated = await translateAnalysisResult(result, language);
      setResult(translated);
      const updatedHistory = history.map(item => 
        item.data.timestamp === result.timestamp ? { ...item, data: translated } : item
      );
      setHistory(updatedHistory);
      await saveHistory(updatedHistory);
    } catch (e) {
      console.error("Translation failed", e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
    localStorage.setItem('medUser', JSON.stringify(userData));
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medUser');
    setResult(null);
    setImagePreview(null);
    setView('landing');
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
        previewUrl: `data:${mimeType};base64,${base64}`
      };
      
      const newHistory = [newItem, ...history].slice(0, 5);
      setHistory(newHistory);
      await saveHistory(newHistory);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setResult(item.data);
    setImagePreview(item.previewUrl);
  };

  const handlePrintTrigger = () => {
    // Check if device is mobile/tablet (less than 1024px)
    if (window.innerWidth < 1024) {
      setShowPrintModal(true);
    } else {
      window.print();
    }
  };

  const executePrint = () => {
    setShowPrintModal(false);
    
    // Inject dynamic print styles
    const styleId = 'dynamic-print-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      @page {
        size: ${printSize} ${printOrientation};
        margin: 1cm;
      }
      @media print {
        body { margin: 0; padding: 0; }
        .report-container { width: 100% !important; max-width: none !important; margin: 0 !important; }
      }
    `;

    // Wait for style to apply, then print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onStart={() => setView('app')} 
        onLoginClick={() => setView('auth')} 
      />
    );
  }

  if (view === 'auth' && !user) {
    return (
      <div className="relative">
        <button 
          onClick={() => setView('landing')}
          className="absolute top-10 left-10 z-50 bg-white p-4 rounded-2xl shadow-xl hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100 flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Home
        </button>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 text-slate-900">
      <Header 
        currentLanguage={language} 
        onLanguageChange={setLanguage} 
        onPrint={handlePrintTrigger} 
        onLogout={handleLogout}
        onLoginClick={() => setView('auth')}
        onHome={() => setView('landing')}
        hasResult={!!result} 
        user={user}
      />
      
      <main className="max-w-6xl mx-auto px-4 pt-24 report-container">
        <div className="no-print">
          <MedicalDisclaimer />
        </div>

        {!result && !isAnalyzing && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500 no-print flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight text-center mb-8">
              Analyze Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Prescription</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 justify-center bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-user-circle text-slate-400"></i>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Patient Details</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Age" 
                      className="w-12 bg-transparent outline-none font-black text-xs text-slate-700 placeholder:text-slate-300"
                      value={profile.age || ''} 
                      onChange={e => setProfile({...profile, age: e.target.value})}
                    />
                    <select 
                      className="bg-transparent outline-none font-black text-xs text-slate-700 cursor-pointer"
                      value={profile.gender || ''} 
                      onChange={e => setProfile({...profile, gender: e.target.value})}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-brain text-blue-500"></i>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Explanation Tone</span>
                  <select 
                    className="bg-transparent outline-none font-black text-xs text-slate-700 cursor-pointer"
                    value={profile.tone} 
                    onChange={e => setProfile({...profile, tone: e.target.value as any})}
                  >
                    <option value="Simple">Friendly & Simple</option>
                    <option value="Professional">Clinical & Formal</option>
                    <option value="Reassuring">Empathetic & Soft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-8 py-5 rounded-[2rem] mb-10 flex items-center justify-between no-print shadow-xl shadow-rose-900/5">
            <span className="text-sm font-bold">{error}</span>
            <button onClick={() => setError(null)}><i className="fas fa-times"></i></button>
          </div>
        )}

        {isTranslating && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-blue-100 px-6 py-2 rounded-full shadow-lg animate-bounce no-print">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
              <i className="fas fa-language mr-2 text-lg"></i>
              Updating Translation to {language}...
            </span>
          </div>
        )}

        {!result ? (
          <div className="space-y-12 no-print">
            <FileUpload 
              onUpload={handleUpload} 
              isAnalyzing={isAnalyzing} 
              onPreviewChange={setImagePreview} 
            />
            {history.length > 0 && !isAnalyzing && (
              <div className="animate-in fade-in duration-1000">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center justify-center">
                  <i className="fas fa-history mr-3 text-indigo-500"></i> Past Reports
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {history.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleSelectHistoryItem(item)} 
                      className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl transition-all flex items-center space-x-5 group"
                    >
                      <img 
                        src={item.previewUrl} 
                        className="w-16 h-16 rounded-2xl object-cover grayscale blur-[1px] opacity-50 group-hover:grayscale-0 group-hover:blur-0 group-hover:opacity-100 transition-all duration-500" 
                      />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          {new Date(item.data.timestamp || 0).toLocaleDateString()}
                        </p>
                        <p className="font-black text-slate-800 text-sm truncate max-w-[120px]">
                          {item.data.medicines?.[0]?.name || 'Patient Report'}
                        </p>
                        <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                          {item.data.language || 'English'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
              <button 
                onClick={() => { setResult(null); setImagePreview(null); }}
                className="px-8 py-4 bg-white rounded-2xl border border-slate-200 text-slate-500 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                ← Back to Upload
              </button>
              <div className="flex items-center space-x-3">
                 <button 
                    onClick={handlePrintTrigger}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all"
                  >
                    <i className="fas fa-file-pdf mr-3"></i>
                    Export PDF
                  </button>
              </div>
            </div>
            <AnalysisResultView data={result} originalImage={imagePreview || undefined} />
          </div>
        )}
      </main>

      {/* Print Options Modal (Mobile Only) */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md no-print animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-3xl border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <i className="fas fa-file-pdf text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Print Settings</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">Configure your PDF report</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paper Size</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['A4', 'Letter', 'Legal'] as PrintSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPrintSize(size)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        printSize === size 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Orientation</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrintOrientation('portrait')}
                    className={`flex items-center justify-center space-x-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      printOrientation === 'portrait' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    <i className="fas fa-arrows-alt-v"></i>
                    <span>Portrait</span>
                  </button>
                  <button
                    onClick={() => setPrintOrientation('landscape')}
                    className={`flex items-center justify-center space-x-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      printOrientation === 'landscape' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    <i className="fas fa-arrows-alt-h"></i>
                    <span>Landscape</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <button 
                onClick={executePrint}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center justify-center space-x-3"
              >
                <i className="fas fa-cloud-download-alt"></i>
                <span>Generate PDF</span>
              </button>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <ChatBot context={result || undefined} language={language} />
      </div>
    </div>
  );
};

export default App;
