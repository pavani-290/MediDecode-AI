
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
  onNavigateInfo?: (type: 'services' | 'contact' | 'privacy' | 'terms' | 'standards') => void;
  user?: { name: string } | null;
}

const LogoMark = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-2xl transition-all group-hover:bg-rose-500 group-hover:rotate-6 relative overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>
    <i className="fas fa-heartbeat text-xl relative z-10"></i>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick, onNavigateInfo, user }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const workflowSteps = [
    { num: '01', title: 'Clinical Capture', desc: 'High-res vision input for documents up to 50MB.', icon: 'fa-camera-retro', color: 'bg-indigo-500' },
    { num: '02', title: 'AI Deciphering', desc: 'Gemini 3 Flash handles shorthand and script.', icon: 'fa-brain', color: 'bg-rose-500' },
    { num: '03', title: 'Strict Grounding', desc: 'Verified data mapped to real coordinates.', icon: 'fa-map-pin', color: 'bg-emerald-500' },
    { num: '04', title: 'Insight Delivery', desc: 'Professional reports in 12+ native languages.', icon: 'fa-file-medical-alt', color: 'bg-amber-500' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdff] relative pointer-events-auto">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 md:px-10 py-4 ${scrolled ? 'bg-white/80 backdrop-blur-3xl border-b border-slate-100 py-3 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <LogoMark />
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">MediDecode <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={(e) => { e.preventDefault(); onLoginClick(); }}
              className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer relative z-10"
            >
              Portal Access
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onStart(); }}
              className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 cursor-pointer relative z-10"
            >
              Start Scan <i className="fas fa-bolt ml-2 text-rose-400"></i>
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-48 pb-24 px-6 relative overflow-visible z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10 text-center lg:text-left relative z-30">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-white/80 glass-card rounded-full shadow-xl">
               <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
               <span className="text-slate-600 text-[10px] font-extrabold uppercase tracking-[0.3em]">Vertex AI Clinical Node</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500">Decoded.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
              The professional visual portal for deciphering prescriptions and complex lab reports with extreme precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button 
                onClick={(e) => { e.preventDefault(); onStart(); }}
                className="bg-slate-900 text-white px-12 py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-4xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
              >
                Begin Analysis <i className="fas fa-long-arrow-right ml-4 group-hover:translate-x-3 transition-transform"></i>
              </button>
              <button 
                onClick={() => onNavigateInfo?.('services')} 
                className="bg-white/50 backdrop-blur-lg border-2 border-slate-100 text-slate-900 px-12 py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all cursor-pointer"
              >
                The Tech Stack
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 hidden lg:block animate-float relative z-10">
             <div className="bg-white/90 glass-card rounded-[4rem] shadow-4xl p-12 space-y-10 border border-white/60">
                 <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-indigo-500/20"><i className="fas fa-signature"></i></div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Vision Logic</p>
                       <p className="text-3xl font-black text-slate-900 tracking-tighter">Verified</p>
                    </div>
                 </div>
                 <div className="relative h-32 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 w-2 bg-gradient-to-b from-rose-500 to-indigo-600 h-full shadow-[0_0_20px_#f43f5e] animate-scan"></div>
                    <div className="p-8 space-y-3">
                       <div className="h-3 w-48 bg-slate-200 rounded-full opacity-60"></div>
                       <div className="h-3 w-32 bg-slate-200 rounded-full opacity-60"></div>
                       <div className="h-3 w-40 bg-slate-200 rounded-full opacity-60"></div>
                    </div>
                 </div>
                 <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-3xl transform hover:scale-105 transition-transform">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Decoded Shorthand</p>
                    <p className="text-sm font-bold italic opacity-90">"TDS - Take 1 tablet three times daily, strictly p.c. (after meals)."</p>
                 </div>
             </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-32 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, i) => (
            <div key={i} className="relative p-12 bg-white/70 glass-card rounded-[3.5rem] border border-slate-100 group hover:-translate-y-3 transition-all pointer-events-auto">
              <span className={`absolute top-10 right-10 text-5xl font-black opacity-5 group-hover:opacity-20 transition-opacity ${step.color.replace('bg-', 'text-')}`}>{step.num}</span>
              <div className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-2xl`}>
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{step.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-24 px-6 md:px-12 border-t border-slate-100 bg-white relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start space-x-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
               <LogoMark />
               <span className="font-black text-2xl tracking-tighter uppercase text-slate-900">MediDecode <span className="text-indigo-600">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
               Global pioneer in transparent clinical interpretation through Vertex AI logic.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
             {[
               { name: 'PRIVACY', type: 'privacy' },
               { name: 'STANDARDS', type: 'standards' },
               { name: 'SUPPORT', type: 'contact' }
             ].map(item => (
               <button 
                key={item.name} 
                onClick={() => onNavigateInfo?.(item.type as any)}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-[#94a3b8] hover:text-indigo-600 transition-all cursor-pointer relative z-10"
               >
                {item.name}
               </button>
             ))}
          </div>

          <div className="bg-[#f0fdf4] px-10 py-4 rounded-3xl border border-[#dcfce7] flex items-center space-x-4 shadow-sm">
            <span className="w-3 h-3 bg-[#22c55e] rounded-full shadow-[0_0_12px_#22c55e]"></span>
            <span className="text-[11px] font-black uppercase text-[#166534] tracking-[0.3em]">Node Online</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 MediDecode AI Clinical Portal • All Clinical Data Encrypted</p>
           <div className="flex space-x-8">
              <a href="#" className="text-slate-300 hover:text-indigo-600 transition-all text-lg cursor-pointer"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-slate-300 hover:text-indigo-600 transition-all text-lg cursor-pointer"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-slate-300 hover:text-indigo-600 transition-all text-lg cursor-pointer"><i className="fab fa-github"></i></a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
