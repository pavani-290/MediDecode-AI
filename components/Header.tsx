
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
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 z-40 px-4 py-3 shadow-sm no-print">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div 
          onClick={onHome} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <i className="fas fa-heartbeat text-lg"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 hidden sm:block">
            MediDecode <span className="text-blue-600">AI</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={onHome}
            className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>

          {hasResult && (
            <button 
              onClick={onPrint}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              title="Download/Print PDF Report"
            >
              <i className="fas fa-file-pdf"></i>
              <span className="hidden xs:block">Download PDF</span>
            </button>
          )}

          <div className="relative group">
            <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer">
              <i className="fas fa-globe text-blue-500 mr-2"></i>
              <span className="text-xs font-bold text-slate-700">{currentLanguage}</span>
              <i className="fas fa-chevron-down text-[10px] ml-2 text-slate-400"></i>
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${currentLanguage === lang ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
          
          {user ? (
            <div className="relative group">
              <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                <i className="fas fa-user-circle text-xl"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="px-4 py-2 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 font-bold transition-colors flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2 text-xs"></i>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
