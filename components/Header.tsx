
import React from 'react';
import { SupportedLanguage } from '../types';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onPrint: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  onHome: () => void;
  hasResult: boolean;
  user: { name: string } | null;
}

const Header: React.FC<HeaderProps> = ({ 
  currentLanguage, 
  onLanguageChange, 
  onPrint, 
  onLogout, 
  onLoginClick, 
  onHome,
  hasResult, 
  user 
}) => {
  const languages: SupportedLanguage[] = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Tamil', 
    'Marathi', 'Gujarati', 'Kannada', 'Spanish', 'French', 'Arabic'
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-b border-slate-100 z-40 px-6 py-5 shadow-xl shadow-indigo-500/5 no-print">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={onHome} 
          className="flex items-center space-x-4 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <i className="fas fa-heartbeat text-xl"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">
            MediDecode <span className="text-indigo-600">AI</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button 
            onClick={onHome}
            className="hidden md:flex items-center space-x-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
          >
            <i className="fas fa-house"></i>
            <span>Portal</span>
          </button>

          {hasResult && (
            <button 
              onClick={onPrint}
              className="flex items-center space-x-3 bg-rose-500 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
            >
              <i className="fas fa-file-pdf"></i>
              <span className="hidden xs:block">Export PDF</span>
            </button>
          )}

          <div className="relative group">
            <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl px-5 py-3 hover:border-indigo-400 transition-all cursor-pointer shadow-sm">
              <i className="fas fa-globe text-indigo-500 mr-3"></i>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{currentLanguage}</span>
              <i className="fas fa-chevron-down text-[10px] ml-4 text-slate-300"></i>
            </div>
            <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-4xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors ${currentLanguage === lang ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-10 w-[2px] bg-slate-100 mx-1"></div>
          
          {user ? (
            <div className="relative group">
              <button className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border-2 border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                <i className="fas fa-user-circle text-2xl"></i>
              </button>
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-4xl border border-slate-100 py-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="px-6 py-3 border-b border-slate-50 mb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Active Node</p>
                  <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-6 py-3 text-[10px] text-rose-500 hover:bg-rose-50 font-black uppercase tracking-widest transition-colors flex items-center"
                >
                  <i className="fas fa-power-off mr-3"></i>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl hover:shadow-indigo-500/20 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
