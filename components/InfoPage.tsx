
import React from 'react';

interface InfoPageProps {
  type: 'services' | 'contact' | 'privacy' | 'terms' | 'standards';
  onBack: () => void;
  onAction?: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ type, onBack, onAction }) => {
  const renderContent = () => {
    switch (type) {
      case 'services':
        return (
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">Our Services</h2>
              <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Premium AI-powered clinical record decoding.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: 'fa-file-signature', title: 'Handwriting Decoding', desc: 'Surgical precision in reading messy clinical penmanship using Gemini 3 Vision.' },
                { icon: 'fa-language', title: 'Multilingual Support', desc: 'Instant conversion into 12+ native languages with medical context preservation.' },
                { icon: 'fa-capsules', title: 'Drug Analytics', desc: 'Detailed breakdown of purpose, dosage schedules, and clinical side effects.' },
                { icon: 'fa-location-crosshairs', title: 'GPS Locator', desc: 'Strict grounded pharmacy discovery based on verified live coordinates.' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-500 transition-all group">
                   <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                      <i className={`fas ${s.icon} text-xl`}></i>
                   </div>
                   <h3 className="text-xl font-black mb-3 text-slate-800">{s.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'standards':
        return (
          <div className="space-y-16">
             <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">Clinical Standards</h2>
                <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Ensuring the highest levels of safety, accuracy, and medical ethics.</p>
             </div>
             <div className="max-w-4xl mx-auto space-y-8">
                {[
                   { title: 'Grounding Protocol', desc: 'All pharmacy and medical store data is strictly grounded in Google Maps API, ensuring zero hallucinations for physical locations.' },
                   { title: 'Handwriting Integrity', desc: 'Our Gemini 3 Flash engine uses a specialized medical corpus to verify deciphered text against known pharmacological patterns.' },
                   { title: 'Privacy First Architecture', desc: 'Patient scans are processed in secure, volatile memory and purged immediately upon session closure unless explicitly saved.' },
                   { title: 'Clinical Safety Matrix', desc: 'Every analysis includes a mandatory cross-reference against global drug interaction databases to flag high-risk combinations.' }
                ].map((std, i) => (
                   <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-6">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-6 text-indigo-600">
                            <i className="fas fa-shield-halved"></i>
                         </div>
                         {std.title}
                      </h4>
                      <p className="text-slate-500 text-base font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-6">{std.desc}</p>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em]">Get in Touch</p>
                <h2 className="text-5xl font-black tracking-tighter text-slate-900">Support Center</h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">Questions about technical decoding or hospital integrations? Our clinical tech team is ready to assist.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><i className="fas fa-envelope text-2xl"></i></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</p><p className="text-slate-800 font-black text-lg">support@medidecode.ai</p></div>
                </div>
                <div className="flex items-center space-x-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><i className="fas fa-headset text-2xl"></i></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Node</p><p className="text-slate-800 font-black text-lg">Help Center Available 24/7</p></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[4rem] p-16 text-white shadow-4xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               <h3 className="text-3xl font-black tracking-tight">Message Support</h3>
               <div className="space-y-6">
                 <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700" placeholder="Your Name" />
                 <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700" placeholder="Email Address" />
                 <textarea className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700 h-32" placeholder="Describe your inquiry..."></textarea>
                 <button className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-500/20">Send Secure Message</button>
               </div>
            </div>
          </div>
        );
      case 'privacy':
      case 'terms':
        return (
          <div className="max-w-4xl mx-auto space-y-12 bg-white p-16 md:p-24 rounded-[4rem] border border-slate-100 shadow-2xl">
             <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900">{type === 'privacy' ? 'Privacy Matrix' : 'Terms of Service'}</h2>
                <p className="font-black text-blue-600 uppercase tracking-widest text-[10px]">Version 2.0.1 • Updated January 2026</p>
             </div>
             
             <div className="space-y-10 text-slate-600 leading-relaxed font-medium text-lg">
                <section className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-900">1. Clinical Data Handling</h3>
                   <p>MediDecode AI employs end-to-end encryption for all visual uploads. Our Gemini 3 Vision Node processes data in volatile RAM and ensures immediate purging after interpretation.</p>
                </section>
                <section className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-900">2. HIPAA Compliance</h3>
                   <p>While we operate as a health interpretation assistant, we treat all data with HIPAA-grade security standards. No identifying patient information is stored on our persistent cloud nodes.</p>
                </section>
                <section className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-900">3. User Responsibility</h3>
                   <p>MediDecode is a clinical auxiliary tool. All interpretations must be verified with a licensed healthcare provider before any medication is consumed or discontinued.</p>
                </section>
                <div className="pt-16 border-t border-slate-100 flex justify-between items-center">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Protected by Clinical-Grade Encryption</p>
                   <button onClick={onBack} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">Acknowledge</button>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] selection:bg-blue-600 selection:text-white pb-40">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-all shadow-lg active:scale-90">
              <i className="fas fa-arrow-left text-sm"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600">Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl"><i className="fas fa-heartbeat text-sm"></i></div>
            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">MediDecode <span className="text-indigo-600">AI</span></span>
          </div>
          <button onClick={onAction || onBack} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">Open Scanner</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 pt-40 animate-in fade-in slide-in-from-bottom-12 duration-700">
        {renderContent()}
      </main>
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 no-print z-50">
         <button onClick={onBack} className="bg-slate-900 text-white px-12 py-5 rounded-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] text-[10px] font-black uppercase tracking-[0.4em] flex items-center space-x-4 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95">
           <i className="fas fa-home"></i>
           <span>Back to Home</span>
         </button>
      </div>
    </div>
  );
};

export default InfoPage;
