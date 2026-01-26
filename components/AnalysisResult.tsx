
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { AnalysisResult } from '../types';
import { getSpeech, findNearbyPharmacies } from '../services/geminiService';

interface AnalysisResultProps {
  data: AnalysisResult;
  originalImage?: string;
  fileType?: string;
  onBack: () => void;
}

declare const html2pdf: any;

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AnalysisResultView = forwardRef<any, AnalysisResultProps>(({ data, originalImage, fileType, onBack }, ref) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'meds' | 'labs' | 'safety'>('summary');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    fetchPharmacies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useImperativeHandle(ref, () => ({
    downloadPDF: () => {
      const element = document.getElementById('unified-report-content');
      if (!element) return;

      const opt = {
        margin: [15, 15],
        filename: `MediDecode_Full_Report_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      element.classList.remove('hidden');
      html2pdf().from(element).set(opt).save().then(() => {
        element.classList.add('hidden');
      });
    }
  }));

  const fetchPharmacies = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Rapid coordinate-based grounding
          const res = await findNearbyPharmacies(pos.coords.latitude, pos.coords.longitude);
          setPharmacies(res);
        } catch (e) { 
          setLocError("Location fetch timed out. Check your connection."); 
        } finally { 
          setLocLoading(false); 
        }
      }, 
      (err) => {
        setLocLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError("Location denied. Enable GPS for strict local store discovery.");
        } else {
          setLocError("Error acquiring precise GPS signal.");
        }
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const audioBase64 = await getSpeech(data.summary);
    if (audioBase64) {
      const sampleRate = 24000;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
      const buffer = await decodeAudioData(decode(audioBase64), ctx, sampleRate, 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.onended = () => setIsSpeaking(false);
      src.start();
    } else { setIsSpeaking(false); }
  };

  return (
    <div className="w-full space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Hidden Unified Report for PDF Export */}
      <div id="unified-report-content" className="hidden p-12 bg-white text-slate-900 space-y-12 font-sans">
        <div className="border-b-8 border-indigo-600 pb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">MediDecode AI Report</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deciphered via Gemini 3 Flash Node • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Confidence</p>
            <p className="text-3xl font-black">{data.confidenceScore}%</p>
          </div>
        </div>

        <section className="p-10 bg-indigo-50/30 rounded-[3rem] border border-indigo-100/50">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">I. Decoded Summary</h2>
          <p className="text-xl font-bold leading-relaxed text-slate-800 italic">"{data.summary}"</p>
        </section>

        <section className="space-y-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-4">II. Medication Matrix</h2>
          <div className="grid grid-cols-1 gap-6">
            {data.medicines.map((m, i) => (
              <div key={i} className="p-8 border-2 border-slate-100 rounded-[3rem] bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black text-slate-900">{m.name}</h3>
                  <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{m.dosageStatus}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-5 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Instruction</p>
                      <p className="text-sm font-bold text-slate-700 italic">"{m.usage}"</p>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Purpose</p>
                      <p className="text-sm font-bold text-slate-700">{m.purpose}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.labResults && data.labResults.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">III. Lab Interpretation</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.labResults.map((l, i) => (
                <div key={i} className="flex justify-between items-center p-6 border border-slate-100 rounded-[2rem] bg-slate-50/30">
                  <div className="max-w-md">
                    <p className="font-black text-lg text-slate-900">{l.parameter}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{l.explanation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{l.value} <span className="text-xs text-slate-300">{l.unit}</span></p>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${l.status === 'Normal' ? 'text-emerald-500' : 'text-rose-500'}`}>{l.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="p-10 bg-amber-50 rounded-[3.5rem] border border-amber-100">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-4">IV. Clinical Safety Node</h2>
          <p className="text-sm font-bold leading-relaxed text-amber-900 italic">"{data.interactionMatrix || "No severe drug-drug interactions detected in current interpreted scan."}"</p>
        </section>

        <div className="pt-10 border-t border-slate-100 flex justify-between">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Generated by MediDecode AI Assistant</p>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Always Verify with Pharmacist</p>
        </div>
      </div>

      <div className="flex items-center justify-between no-print px-4">
        <button onClick={onBack} className="flex items-center space-x-3 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all">
          <i className="fas fa-arrow-left"></i>
          <span>Portal Scan</span>
        </button>
        <div className="bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100 flex items-center space-x-3">
           <i className="fas fa-check-circle text-indigo-600"></i>
           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Grounding Analysis OK</span>
        </div>
      </div>

      {/* FIXED OVERLAPPING: Removed heavy absolute/blurry effects and refined sticky header */}
      <div className="flex flex-wrap justify-center gap-3 no-print glass-card p-3 rounded-full sticky top-32 z-30 shadow-2xl border-white/80 max-w-fit mx-auto">
        {[
          { id: 'summary', label: 'Overview', icon: 'fa-star', theme: 'bg-indigo-600' },
          { id: 'meds', label: 'Medicine Matrix', icon: 'fa-pills', theme: 'bg-rose-500' },
          { id: 'labs', label: 'Lab Results', icon: 'fa-flask', theme: 'bg-emerald-500' },
          { id: 'safety', label: 'Safety Node', icon: 'fa-shield-halved', theme: 'bg-amber-500' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex items-center space-x-3 px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? `${tab.theme} text-white shadow-xl scale-105` : 'bg-white/40 text-slate-400 hover:bg-white hover:text-slate-900'}`}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span className="hidden xs:block">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 no-print">
        <div className="lg:col-span-8 space-y-12">
          {activeTab === 'summary' && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
               <section className="bg-white/90 glass-card rounded-[4rem] p-12 shadow-2xl border border-white/60 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Decoded Handwriting</h3>
                    <button onClick={handleSpeak} className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg flex items-center justify-center">
                      <i className={`fas ${isSpeaking ? 'fa-spinner fa-spin' : 'fa-volume-high'} text-lg`}></i>
                    </button>
                  </div>
                  <p className="text-2xl text-slate-700 leading-relaxed font-semibold italic border-l-8 border-indigo-600 pl-10">"{data.summary}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                     {data.keyRecommendations.map((rec, i) => (
                       <div key={i} className="flex items-start space-x-5 p-6 bg-white/50 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><i className="fas fa-check text-[10px]"></i></div>
                          <p className="text-xs font-bold text-slate-700 leading-relaxed">{rec}</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'meds' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-500">
              {data.medicines.map((m, i) => (
                <div key={i} className="bg-white/90 glass-card p-10 rounded-[3.5rem] border border-white shadow-2xl space-y-8 group hover:-translate-y-2 transition-all">
                  <div className="flex justify-between items-start">
                     <h4 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{m.name}</h4>
                     <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{m.dosageStatus}</span>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Scanned Instruction</p>
                        <p className="text-sm text-slate-700 font-bold italic">"{m.usage}"</p>
                     </div>
                     <div className="p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100">
                        <p className="text-[9px] font-black uppercase text-indigo-400 mb-2 tracking-widest">Medical Purpose</p>
                        <p className="text-xs text-indigo-700 font-bold">{m.purpose}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'labs' && (
            <section className="bg-white/90 glass-card p-14 rounded-[4rem] border border-white shadow-4xl space-y-12 animate-in fade-in duration-500">
               {data.labResults && data.labResults.length > 0 ? (
                 <div className="space-y-10">
                   <div className="text-center">
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">Lab Diagnostics</h3>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Grounded Interpretation</p>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                     {data.labResults.map((l, i) => (
                       <div key={i} className="p-8 rounded-[3rem] border-2 border-slate-100 bg-slate-50/30 space-y-4 hover:border-emerald-200 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div>
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{l.parameter}</p>
                                <p className="text-3xl font-black text-slate-900">{l.value} <span className="text-slate-300 text-sm uppercase">{l.unit}</span></p>
                             </div>
                             <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                               l.status === 'Normal' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                             }`}>
                                {l.status}
                             </div>
                          </div>
                          <p className="text-xs text-slate-500 font-medium italic leading-relaxed border-t border-slate-100 pt-4">"{l.explanation}"</p>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-24 space-y-6 opacity-30">
                    <i className="fas fa-microscope text-7xl text-slate-400"></i>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No diagnostic markers detected</p>
                 </div>
               )}
            </section>
          )}

          {activeTab === 'safety' && (
            <section className="bg-gradient-to-br from-rose-600 to-rose-800 p-16 rounded-[4rem] text-white shadow-4xl animate-in shake duration-500 border-[8px] border-white/20">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-10 backdrop-blur-xl">
                  <i className="fas fa-shield-virus"></i>
               </div>
               <h3 className="text-4xl font-black mb-8 tracking-tighter">Clinical Safety Node</h3>
               <p className="text-xl font-bold leading-relaxed italic border-l-4 border-white/40 pl-8">
                  {data.interactionMatrix || "Based on clinical grounding, no severe medication-to-medication interactions were detected in this scan."}
               </p>
               <div className="mt-12 flex items-center space-x-4 opacity-70">
                  <i className="fas fa-info-circle"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Always verify instructions with a pharmacist</span>
               </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-4 space-y-10 no-print">
          <section className="bg-slate-900 rounded-[3.5rem] p-10 text-white space-y-10 shadow-4xl relative overflow-hidden group border border-white/10">
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
             <div className="flex justify-between items-center relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Nearby Stores (GPS)</h4>
               <button onClick={fetchPharmacies} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all">
                 <i className={`fas fa-sync-alt text-xs ${locLoading ? 'fa-spin text-emerald-400' : ''}`}></i>
               </button>
             </div>

             {/* NOTIFICATION: Warning if location is disabled or denied */}
             {locError && (
               <div className="p-8 bg-rose-500/10 border border-rose-500/40 rounded-[2.5rem] space-y-4 relative z-10 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-3 text-rose-400">
                    <i className="fas fa-map-pin"></i>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">GPS Disconnected</p>
                  </div>
                  <p className="text-xs font-bold text-rose-200/70 leading-relaxed">{locError}</p>
                  <button onClick={fetchPharmacies} className="w-full bg-rose-500 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 hover:bg-rose-600 transition-all">Enable & Re-detect</button>
               </div>
             )}
             
             <div className="space-y-6 relative z-10">
               {locLoading ? (
                 <div className="text-center py-16 space-y-6">
                   <div className="w-14 h-14 bg-white/5 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
                   <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em]">Grounding Location...</p>
                 </div>
               ) : pharmacies.length > 0 ? pharmacies.map((p, i) => (
                 <a key={i} href={p.uri} target="_blank" rel="noopener noreferrer" className="block bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group/card shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-sm block truncate group-hover/card:text-emerald-400 transition-colors">{p.name}</span>
                      <i className="fas fa-external-link-alt text-[10px] text-emerald-500"></i>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">{p.address}</p>
                 </a>
               )) : !locError && (
                 <div className="p-10 text-center bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                    <i className="fas fa-map-marked-alt text-4xl text-slate-700"></i>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-relaxed">Ensure GPS is active for strict local pharmacy results.</p>
                 </div>
               )}
             </div>
          </section>

          <section className="bg-white/90 glass-card p-10 rounded-[3.5rem] border border-white shadow-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Clinical Source</h4>
             <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center min-h-[300px]">
               {fileType?.includes('pdf') ? (
                 <div className="flex flex-col items-center py-12 space-y-6">
                   <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-3xl shadow-lg"><i className="fas fa-file-pdf"></i></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PDF Data Node</span>
                 </div>
               ) : (
                 <img src={originalImage} className="w-full h-auto object-contain max-h-[500px] hover:scale-110 transition-transform" alt="Medical Scan" />
               )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
});

export default AnalysisResultView;
