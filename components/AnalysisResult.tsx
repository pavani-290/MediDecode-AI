
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { getSpeech, findNearbyPharmacies } from '../services/geminiService';

interface AnalysisResultProps {
  data: AnalysisResult;
  originalImage?: string;
}

interface Pharmacy {
  name: string;
  address: string;
  distance: string;
  uri: string;
}

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

const AnalysisResultView: React.FC<AnalysisResultProps> = ({ data, originalImage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }

    setLocLoading(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const results = await findNearbyPharmacies(
            position.coords.latitude,
            position.coords.longitude
          );
          setPharmacies(results);
          if (results.length === 0) setLocError("No pharmacies found nearby.");
        } catch (err) {
          setLocError("Failed to fetch nearby stores.");
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        setLocLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocError("Location access denied. Please enable location to find nearby pharmacies.");
        } else {
          setLocError("Could not determine your location. Please check your settings.");
        }
      }
    );
  };

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioBase64 = await getSpeech(data.summary);
      if (audioBase64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decode(audioBase64);
        const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("Speech generation failed", e);
      setIsSpeaking(false);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-500';
      case 'Borderline': return 'bg-amber-500';
      case 'High':
      case 'Low': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'Borderline': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'High':
      case 'Low': return 'bg-rose-50 border-rose-100 text-rose-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  const isDosageUnclear = (status: string) => status.toLowerCase().includes('unclear');

  return (
    <div className="w-full space-y-12 pb-20 report-container">
      
      {/* Document Preview Section */}
      {originalImage && (
        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 no-print">
          <button 
            onClick={() => setShowOriginal(!showOriginal)}
            className="w-full flex items-center justify-between text-slate-900 group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-file-image"></i>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">Original Prescription Source</h3>
            </div>
            <i className={`fas fa-chevron-${showOriginal ? 'up' : 'down'} text-slate-300 group-hover:text-blue-500 transition-all`}></i>
          </button>
          
          {showOriginal && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="max-w-2xl mx-auto rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl">
                <img src={originalImage} alt="Prescription Source" className="w-full object-contain max-h-[500px]" />
              </div>
              <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest italic">This is the original clinical document you uploaded.</p>
            </div>
          )}
        </section>
      )}

      {/* Report Quick Summary */}
      <section className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center">
            <span className="w-2 h-8 bg-blue-600 rounded-full mr-4 shadow-lg shadow-blue-500/50"></span>
            AI Deciphered Summary
          </h2>
          <button 
            onClick={handleSpeak}
            className={`no-print flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg'}`}
          >
            <i className={`fas ${isSpeaking ? 'fa-spinner fa-spin' : 'fa-volume-up'}`}></i>
            <span>{isSpeaking ? 'Speaking...' : 'Listen to Summary'}</span>
          </button>
        </div>
        <p className="text-slate-600 text-xl leading-relaxed font-medium">
          {data.summary}
        </p>
      </section>

      {/* Lab Results: Color Coded Progress Bars */}
      {data.labResults && data.labResults.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-xl font-black text-slate-800 flex items-center px-4">
            <i className="fas fa-chart-line text-emerald-500 mr-4"></i> Lab Result Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.labResults.map((result, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{result.parameter}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.unit} • Ref: {result.referenceRange}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusBgClass(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{result.value}</span>
                  </div>
                  
                  <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStatusColorClass(result.status)} shadow-sm transition-all duration-1000`}
                      style={{ width: result.status === 'Normal' ? '100%' : '50%' }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-bold leading-relaxed pt-2">
                    {result.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Medicines Card View */}
      <section className="space-y-8">
        <h2 className="text-xl font-black text-slate-800 flex items-center px-4">
          <i className="fas fa-prescription-bottle-alt text-blue-500 mr-4"></i> Medication Profile
        </h2>
        <div className="space-y-6">
          {data.medicines.map((med, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{med.name}</h3>
                  <div className={`mt-2 flex items-center ${isDosageUnclear(med.dosageStatus) ? 'text-rose-600' : 'text-slate-500'}`}>
                    {isDosageUnclear(med.dosageStatus) && <i className="fas fa-exclamation-triangle mr-2 text-xs"></i>}
                    <p className={`text-[11px] font-black uppercase tracking-widest`}>{med.dosageStatus}</p>
                  </div>
                </div>
                {med.interactionWarning && (
                  <div className="bg-rose-600 text-white text-[10px] font-black px-6 py-3 rounded-2xl flex items-center shadow-xl shadow-rose-900/10">
                    <i className="fas fa-exclamation-triangle mr-3 text-lg"></i> RISK DETECTED
                  </div>
                )}
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Usage</h4>
                  <p className="text-slate-800 font-bold text-lg">{med.purpose}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Side Effects</h4>
                  <div className="flex flex-wrap gap-2">
                    {med.sideEffects.map((e, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warning</h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed border-l-4 border-amber-400 pl-4 bg-amber-50/20 py-2">
                    {med.warnings}
                  </p>
                </div>
                {med.interactionWarning && (
                  <div className="md:col-span-3 bg-rose-50 p-6 rounded-3xl border border-rose-200 text-sm font-bold text-rose-700">
                    ⚠️ {med.interactionWarning}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Pharmacy Locator */}
      <section className="bg-slate-900 p-12 rounded-[3.5rem] text-white no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h2 className="text-2xl font-black flex items-center">
            <i className="fas fa-map-marked-alt text-cyan-400 mr-4"></i> Nearby Pharmacies
          </h2>
          <button 
            onClick={fetchPharmacies}
            disabled={locLoading}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center"
          >
            {locLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sync mr-2"></i>}
            Refresh Location
          </button>
        </div>

        {locError ? (
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] text-rose-400 flex items-center space-x-4">
            <i className="fas fa-exclamation-circle text-2xl"></i>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">Location Unavailable</p>
              <p className="text-xs font-medium opacity-80 mt-1">{locError}</p>
            </div>
          </div>
        ) : locLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 h-32"></div>
            ))}
          </div>
        ) : pharmacies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((p, i) => (
              <a 
                key={i} 
                href={p.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex-1 pr-4">
                  <p className="font-black text-lg group-hover:text-cyan-400 transition-colors">{p.name}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">{p.address}</p>
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mt-2">{p.distance}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-all">
                  <i className="fas fa-external-link-alt text-sm"></i>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 italic text-sm">
            Please allow location access to see pharmacies near you.
          </div>
        )}
      </section>
    </div>
  );
};

export default AnalysisResultView;
