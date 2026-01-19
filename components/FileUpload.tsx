
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
  onPreviewChange?: (url: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isAnalyzing, onPreviewChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. For faster results and stability, please upload an image under 5MB.");
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        if (onPreviewChange) onPreviewChange(reader.result as string);
        onUpload(base64, file.type);
      };
      reader.onerror = () => setError("Failed to read file. Please try again.");
      reader.readAsDataURL(file);
    }
  };

  const triggerInput = () => fileInputRef.current?.click();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-8 no-print">
      <div 
        onClick={!isAnalyzing ? triggerInput : undefined}
        className={`group relative overflow-hidden border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
          isAnalyzing ? 'bg-slate-50 border-slate-200 cursor-default' : 'bg-white border-blue-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10'
        }`}
      >
        <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} disabled={isAnalyzing} />
        
        {preview ? (
          <div className="text-center w-full">
            <div className="relative w-full mb-8">
              <img src={preview} alt="Document" className="max-h-80 mx-auto rounded-3xl shadow-lg border border-slate-100" />
              {isAnalyzing && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="w-full h-1.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] absolute top-0 left-0 animate-scan"></div>
                  <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px]"></div>
                </div>
              )}
            </div>
            
            <div className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
              isAnalyzing ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}>
              {isAnalyzing ? (
                <>
                  <i className="fas fa-spinner fa-spin text-lg"></i>
                  <span>Analyzing Report...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-redo"></i>
                  <span>Upload Different File</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <i className="fas fa-camera-retro text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Prescription Scanner</h3>
            <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto font-medium leading-relaxed">
              Upload a clear photo. <br/>
              <span className="text-blue-500 font-bold">Recommended size: 1MB - 3MB for fastest results.</span>
            </p>
            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}
            
            <div className={`mt-10 inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
              isAnalyzing ? 'bg-indigo-600 text-white opacity-50' : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}>
              {isAnalyzing ? (
                <i className="fas fa-spinner fa-spin text-lg"></i>
              ) : (
                <i className="fas fa-cloud-upload-alt"></i>
              )}
              <span>{isAnalyzing ? 'Processing...' : 'Select File'}</span>
            </div>
            <p className="mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Maximum File Size: 5MB</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center space-x-4 border border-emerald-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm"><i className="fas fa-sun"></i></div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Use Bright Light</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl flex items-center space-x-4 border border-amber-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm"><i className="fas fa-compress-arrows-alt"></i></div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-tighter">Crop to Text</span>
        </div>
        <div className="bg-indigo-50 p-4 rounded-2xl flex items-center space-x-4 border border-indigo-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm"><i className="fas fa-bolt"></i></div>
          <span className="text-xs font-bold text-indigo-800 uppercase tracking-tighter">Fast Analysis</span>
        </div>
      </div>

      {!preview && !isAnalyzing && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
            <i className="fas fa-lightbulb text-amber-500 mr-3"></i> 
            Pro-Tips for Speed & Success
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Resolution</span>
                <i className="fas fa-mobile-alt text-slate-300"></i>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                Standard smartphone photos (**1080p to 2K**) are perfect. You don't need 4K; smaller clear photos process much faster.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="bg-indigo-100 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cropping</span>
                <i className="fas fa-crop text-slate-300"></i>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                If the prescription is small but the paper is large, **crop the image to just the text section** to speed up AI recognition.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Format</span>
                <i className="fas fa-image text-slate-300"></i>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                **Use JPG instead of PNG** when possible. JPG compresses medical documents better without losing the clarity of the handwriting.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-10 text-center animate-pulse">
          <p className="text-slate-800 font-black text-xs uppercase tracking-[0.3em]">Deciphering Clinical Data with Gemini Flash...</p>
          <p className="text-slate-400 text-[10px] font-bold mt-2 italic">Large files may take up to 15 seconds to process.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes scan {0% {top: 0%;} 100% {top: 100%;}} .animate-scan {animation: scan 2.5s ease-in-out infinite;}` }} />
    </div>
  );
};

export default FileUpload;
