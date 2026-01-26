
import React, { useState } from 'react';
import { generateMockupImage } from '../services/geminiService';

interface MockupLabProps {
  onBack: () => void;
}

const MockupLab: React.FC<MockupLabProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: 'wireframe' | 'mockup' | 'diagram') => {
    setLoading(true);
    setError(null);
    try {
      const img = await generateMockupImage(type);
      if (img) {
        setCurrentImage(img);
      } else {
        throw new Error("Generation failed");
      }
    } catch (e) {
      setError("Failed to reach Gemini Image nodes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `MediDecode_PPT_Asset_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] pb-32">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-600 transition-all">
              <i className="fas fa-arrow-left text-sm"></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Exit Lab</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg"><i className="fas fa-flask text-sm"></i></div>
            <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">Mockup <span className="text-indigo-600">Laboratory</span></span>
          </div>
          <div></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-36 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">Presentation Assets</h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Generate high-fidelity wireframes and product mockups for your PowerPoint slides using Gemini 2.5 Image models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Asset Type</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleGenerate('wireframe')}
                  disabled={loading}
                  className="w-full text-left p-6 bg-slate-50 hover:bg-indigo-50 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center"><i className="fas fa-project-diagram"></i></div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">UI Wireframe</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Blueprint Diagrams</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleGenerate('mockup')}
                  disabled={loading}
                  className="w-full text-left p-6 bg-slate-50 hover:bg-blue-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center"><i className="fas fa-mobile-alt"></i></div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Device Mockup</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Product Visualization</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleGenerate('diagram')}
                  disabled={loading}
                  className="w-full text-left p-6 bg-slate-50 hover:bg-emerald-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center"><i className="fas fa-network-wired"></i></div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Process Flow</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Clinical Journey</p>
                    </div>
                  </div>
                </button>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-[10px] font-black text-rose-600 uppercase text-center">{error}</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Pro Tip</h4>
              <p className="text-xs font-bold leading-relaxed opacity-80">
                These images are generated in real-time. Use them in your PPT to showcase the professional design standards of MediDecode AI.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-slate-200 rounded-[4rem] h-[500px] flex items-center justify-center overflow-hidden border-8 border-white shadow-4xl relative group">
              {loading ? (
                <div className="flex flex-col items-center space-y-6">
                  <i className="fas fa-circle-notch fa-spin text-indigo-600 text-4xl"></i>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Rendering Pixel Matrix...</p>
                </div>
              ) : currentImage ? (
                <>
                  <img src={currentImage} className="w-full h-full object-cover" alt="Generated Asset" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 backdrop-blur-sm">
                    <button onClick={handleDownload} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                      <i className="fas fa-download mr-2"></i> Save Image
                    </button>
                    <button onClick={() => setCurrentImage(null)} className="bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/40 transition-all">
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 opacity-30">
                  <i className="fas fa-image text-7xl"></i>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ready for Generation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockupLab;
