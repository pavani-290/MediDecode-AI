
import React, { useState, useRef } from 'react';
import QRScanner from './QRScanner';

interface FileUploadProps {
  onUpload: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
  onPreviewChange?: (url: string | null, type: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isAnalyzing, onPreviewChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 2500; 
          if (width > height && width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          } else if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("FILE EXCEEDS 50MB LIMIT");
        return;
      }
      setError(null);
      try {
        const previewUrl = file.type.includes('pdf') ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' : URL.createObjectURL(file);
        setPreview(previewUrl);
        let base64 = "";
        if (!file.type.includes('pdf')) {
          base64 = await compressImage(file);
        } else {
          base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
          });
        }
        if (onPreviewChange) onPreviewChange(previewUrl, file.type);
        onUpload(base64, file.type);
      } catch (err) {
        setError("Processing Error. Try high-res scan.");
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-16 no-print">
      <div 
        className={`group relative overflow-hidden rounded-[4rem] p-12 md:p-24 flex flex-col items-center justify-center transition-all duration-700 glass-card border-4 ${
          isAnalyzing ? 'border-rose-400/50 shadow-2xl shadow-rose-500/10' : 'border-white/60 hover:border-indigo-500/50 hover:shadow-4xl shadow-2xl'
        }`}
      >
        <input type="file" className="hidden" ref={fileInputRef} accept="image/*,.pdf" onChange={handleFileChange} disabled={isAnalyzing} />
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-20 flex flex-col items-center justify-center space-y-8">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl shadow-3xl animate-pulse">
               <i className="fas fa-brain"></i>
            </div>
            <div className="text-center space-y-3">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Deciphering Handwriting...</h4>
              <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em]">Vertex Clinical Node in Progress</p>
            </div>
          </div>
        )}

        {preview ? (
          <div className="text-center w-full animate-in zoom-in-95 duration-500 relative z-10">
            <div className="relative inline-block">
               <img src={preview} alt="Doc" className="max-h-96 rounded-[3rem] shadow-4xl border-[12px] border-white mx-auto mb-10" />
               <div className="absolute top-0 left-0 w-full h-full rounded-[3rem] border-2 border-indigo-500/20 pointer-events-none"></div>
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={() => fileInputRef.current?.click()} className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl">Replace Document</button>
            </div>
          </div>
        ) : (
          <div className="text-center relative z-10 space-y-10">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto text-white text-4xl shadow-2xl group-hover:rotate-6 transition-all duration-500">
              <i className="fas fa-file-medical"></i>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Portal Upload</h3>
              <p className="text-slate-500 text-base font-medium max-w-sm mx-auto leading-relaxed opacity-70">Decipher messy handwriting and shorthand from prescriptions or lab reports up to 50MB.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-900 text-white px-14 py-7 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-4xl hover:bg-indigo-600 hover:-translate-y-1.5 transition-all active:scale-95"
              >
                <i className="fas fa-camera mr-4"></i>
                Upload Clinical Doc
              </button>
              <button 
                onClick={() => setShowQRScanner(true)}
                className="bg-white text-indigo-600 border-2 border-indigo-100 px-14 py-7 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95"
              >
                <i className="fas fa-qrcode mr-4"></i>
                Scan QR Portal
              </button>
            </div>

            <div className="flex justify-center space-x-6">
              <span className="flex items-center space-x-2 text-[10px] font-black uppercase text-indigo-400 tracking-widest"><i className="fas fa-check-circle"></i> <span>Prescription</span></span>
              <span className="flex items-center space-x-2 text-[10px] font-black uppercase text-rose-400 tracking-widest"><i className="fas fa-check-circle"></i> <span>Lab Report</span></span>
              <span className="flex items-center space-x-2 text-[10px] font-black uppercase text-emerald-400 tracking-widest"><i className="fas fa-check-circle"></i> <span>PDF (50MB)</span></span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: 'fa-shield-halved', title: 'Privacy Matrix', desc: 'Clinical data is cleared immediately after session node ends.', theme: 'bg-indigo-600' },
          { icon: 'fa-microscope', title: 'Deep Logic', desc: 'Gemini 3 Flash identifies shorthand patterns like TDS or p.c.', theme: 'bg-rose-500' },
          { icon: 'fa-language', title: 'Global Reach', desc: 'Instant native translation into 12+ clinical dialects.', theme: 'bg-emerald-500' }
        ].map((item, i) => (
          <div key={i} className="bg-white/60 glass-card p-10 rounded-[3rem] border border-white/80 shadow-lg flex items-start space-x-6 hover:-translate-y-2 transition-all">
            <div className={`w-14 h-14 ${item.theme} text-white rounded-2xl flex items-center justify-center text-xl shadow-xl shrink-0`}><i className={`fas ${item.icon}`}></i></div>
            <div className="space-y-2">
               <h5 className="font-black text-slate-900 text-sm tracking-tight">{item.title}</h5>
               <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {showQRScanner && <QRScanner onScan={() => setShowQRScanner(false)} onClose={() => setShowQRScanner(false)} />}
    </div>
  );
};

export default FileUpload;
