
import React from 'react';

interface InfoPageProps {
  type: 'services' | 'contact' | 'privacy' | 'terms' | 'help';
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
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Our Services</h2>
              <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">AI-powered medical document analysis for health awareness.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: 'fa-file-signature', title: 'Handwriting Decoding', desc: 'State-of-the-art OCR trained specifically on clinical shorthand and messy penmanship.' },
                { icon: 'fa-language', title: 'Multilingual Results', desc: 'Instant medical report conversion into over 12 native languages including Hindi and Spanish.' },
                { icon: 'fa-capsules', title: 'Drug Information', desc: 'Detailed breakdown of purpose, common usage, and basic side effects for deciphered medicines.' },
                { icon: 'fa-chart-line', title: 'Lab Trend Tracking', desc: 'Visual indicators for lab reports, helping you understand parameters like CBC, Thyroid, and more.' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-500 transition-all group">
                   <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                      <i className={`fas ${s.icon} text-2xl`}></i>
                   </div>
                   <h3 className="text-2xl font-black mb-4 text-slate-800">{s.title}</h3>
                   <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <h2 className="text-5xl font-black tracking-tighter text-slate-900">Get In Touch</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">Have questions about the app or need technical support? Our clinical tech team is ready to assist you.</p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                    <i className="fas fa-map-marked-alt text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Address</p>
                    <p className="text-slate-800 font-black">123 Health Tech Plaza, Silicon Valley, CA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                    <i className="fas fa-phone-alt text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-slate-800 font-black">+1 (555) 000-MEDIC</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <i className="fas fa-envelope-open-text text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email ID</p>
                    <p className="text-slate-800 font-black">support@medidecode.ai</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-3xl space-y-8">
               <h3 className="text-2xl font-black">Direct Message</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Full Name</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700" placeholder="John Doe" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Email Address</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700" placeholder="john@example.com" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Message</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700 h-40" placeholder="Describe your query..."></textarea>
                 </div>
                 <button className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">Send To Support</button>
               </div>
            </div>
          </div>
        );
      case 'privacy':
      case 'terms':
        return (
          <div className="max-w-4xl mx-auto space-y-10 bg-white p-12 md:p-24 rounded-[4rem] border border-slate-100 shadow-2xl">
             <h2 className="text-5xl font-black tracking-tighter text-slate-900">{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h2>
             <div className="space-y-8 text-slate-600 leading-relaxed font-medium text-lg">
                <p className="font-black text-blue-600 uppercase tracking-widest text-[10px]">Version 1.2.0 • May 2026</p>
                <section className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-900">1. Data Security</h3>
                   <p>Your clinical privacy is our priority. We use zero-knowledge OCR processing which means images are parsed in memory and destroyed immediately after interpretation unless you choose to save them to your local history.</p>
                </section>
                <section className="space-y-4">
                   <h3 className="text-2xl font-black text-slate-900">2. Non-Clinical Usage</h3>
                   <p>MediDecode AI is an educational tool for health awareness. It does not replace professional diagnosis. Users agree to consult doctors for any medical decision or prescription change.</p>
                </section>
                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                   <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Global Health Tech Alliance 2026</p>
                   <button onClick={onBack} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">Accept Terms</button>
                </div>
             </div>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-16">
            <div className="text-center space-y-6">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">Support Hub</h2>
               <p className="text-slate-400 font-medium text-xl">Quick answers to common clinical decoding questions.</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
              {[
                { q: 'How do I ensure the best AI scan?', a: 'Place the document on a flat, solid-colored surface with good overhead lighting. Try to keep the phone steady and focus directly on the handwritten text.' },
                { q: 'Is this available as a mobile app?', a: 'Yes! Simply click the "Install App" button in our main menu or footer to add MediDecode to your home screen natively.' },
                { q: 'Can it read all medical shorthand?', a: 'Gemini is trained on standard clinical abbreviations (e.g., q.i.d, t.d.s). However, highly idiosyncratic doctor shorthand may sometimes require manual verification.' },
                { q: 'How do I export my explained report?', a: 'Once the analysis is complete, click the "Download PDF" button in the header or result view to save a high-quality summary.' }
              ].map((f, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-4 hover:border-blue-200 transition-all">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">{f.q}</h4>
                   <p className="text-slate-500 font-medium leading-relaxed text-lg">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white pb-32">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
              <i className="fas fa-arrow-left"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-heartbeat text-sm"></i>
            </div>
            <span className="font-black text-lg tracking-tighter text-slate-900">MediDecode <span className="text-blue-600">AI</span></span>
          </div>

          <button onClick={onAction} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            Launch App
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-48 animate-in fade-in slide-in-from-bottom-12 duration-700">
        {renderContent()}
      </main>
      
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 no-print z-50">
         <button onClick={onBack} className="bg-slate-900 text-white px-10 py-5 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-blue-600 transition-all active:scale-95">
           <i className="fas fa-home"></i>
           <span>Home</span>
         </button>
      </div>
    </div>
  );
};

export default InfoPage;
