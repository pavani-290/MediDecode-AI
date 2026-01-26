
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
                { icon: 'fa-file-signature', title: 'Handwriting Decoding', desc: 'Surgical precision in reading messy clinical penmanship.' },
                { icon: 'fa-language', title: 'Multilingual Support', desc: 'Instant conversion into 12+ native languages.' },
                { icon: 'fa-capsules', title: 'Drug Analytics', desc: 'Detailed breakdown of purpose, dosage, and side effects.' },
                { icon: 'fa-location-crosshairs', title: 'GPS Locator', desc: 'Strict grounded pharmacy discovery based on live location.' }
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
                <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Ensuring the highest levels of safety and accuracy.</p>
             </div>
             <div className="max-w-4xl mx-auto space-y-8">
                {[
                   { title: 'Grounding Protocol', desc: 'All pharmacy data is strictly grounded in Google Maps API, ensuring zero hallucinations for physical locations.' },
                   { title: 'Handwriting Integrity', desc: 'Gemini 3 Flash uses contextual medical vocabulary to verify deciphered text against known clinical patterns.' },
                   { title: 'Zero Data Retention', desc: 'Scans are processed in volatile memory and destroyed immediately unless you save to local history.' },
                   { title: 'Safety Matrix', desc: 'Integrated medical interaction blocks to alert users of potential drug conflicts before consumption.' }
                ].map((std, i) => (
                   <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                         <i className="fas fa-shield-halved text-blue-600 mr-4"></i>
                         {std.title}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{std.desc}</p>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">Support Center</h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed">Questions about technical support? Our team is ready to assist.</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><i className="fas fa-envelope text"></i></div>
                  <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Support Email</p><p className="text-slate-800 font-bold text-sm">support@medidecode.ai</p></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6">
               <h3 className="text-xl font-black">Message Support</h3>
               <div className="space-y-4">
                 <input className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700" placeholder="Your Name" />
                 <textarea className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-3 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700 h-28" placeholder="How can we help?"></textarea>
                 <button className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-blue-500 active:scale-95 transition-all">Submit</button>
               </div>
            </div>
          </div>
        );
      case 'privacy':
      case 'terms':
        return (
          <div className="max-w-3xl mx-auto space-y-8 bg-white p-12 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-xl">
             <h2 className="text-4xl font-black tracking-tighter text-slate-900">{type === 'privacy' ? 'Privacy Policy' : 'Medical Standards'}</h2>
             <div className="space-y-6 text-slate-600 leading-relaxed font-medium text-base">
                <p className="font-black text-blue-600 uppercase tracking-widest text-[9px]">v1.2.0 • May 2026</p>
                <section className="space-y-3">
                   <h3 className="text-xl font-black text-slate-900">Clinical Integrity</h3>
                   <p>MediDecode uses specialized clinical grounding to ensure deciphered instructions match valid medical protocols.</p>
                </section>
                <div className="pt-10 border-t border-slate-100">
                   <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all">Confirm</button>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white pb-32">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-600 transition-all">
              <i className="fas fa-arrow-left text-sm"></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><i className="fas fa-heartbeat text-sm"></i></div>
            <span className="font-black text-lg tracking-tighter text-slate-900">MediDecode <span className="text-blue-600">AI</span></span>
          </div>
          <button onClick={onAction} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/10 active:scale-95">Launch App</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 pt-36 animate-in fade-in slide-in-from-bottom-8 duration-500">
        {renderContent()}
      </main>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 no-print z-50">
         <button onClick={onBack} className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-blue-600 transition-all active:scale-95">
           <i className="fas fa-home"></i>
           <span>Home</span>
         </button>
      </div>
    </div>
  );
};

export default InfoPage;
