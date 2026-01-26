
import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'https://esm.sh/jsqr@1.4.0';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play();
          requestAnimationFrame(tick);
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera permissions in your browser settings to scan clinical QR codes.");
        setIsScanning(false);
      }
    };

    const tick = () => {
      if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas) {
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (context) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              onScan(code.data);
              stopCamera();
              return;
            }
          }
        }
      }
      if (isScanning) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const stopCamera = () => {
      setIsScanning(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    startCamera();

    return () => {
      stopCamera();
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScan, isScanning]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-500">
      <div className="w-full max-w-xl bg-white rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative border border-white/20">
        <div className="absolute top-8 right-8 z-20">
          <button 
            onClick={onClose}
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-rose-500 hover:border-rose-400 transition-all shadow-2xl active:scale-90"
            aria-label="Close Scanner"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-10 md:p-14 space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Clinical Portal Scanner</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Secure Medical Document Linkage</p>
          </div>

          <div className="relative aspect-square rounded-[3.5rem] overflow-hidden bg-slate-950 shadow-inner group border-4 border-slate-50 ring-1 ring-slate-200">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 shadow-inner">
                  <i className="fas fa-video-slash text-4xl"></i>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Hardware Blocked</p>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">{error}</p>
                </div>
                <button onClick={onClose} className="bg-slate-900 text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-rose-600 transition-colors">Close Interface</button>
              </div>
            ) : (
              <>
                <video ref={videoRef} className="w-full h-full object-cover scale-105" />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanner Viewfinder Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 border-2 border-indigo-500/30 rounded-[2.5rem] relative">
                     {/* Corner Accents */}
                     <div className="absolute top-0 left-0 w-16 h-16 border-t-[10px] border-l-[10px] border-indigo-500 rounded-tl-[2.5rem] -ml-2 -mt-2"></div>
                     <div className="absolute top-0 right-0 w-16 h-16 border-t-[10px] border-r-[10px] border-indigo-500 rounded-tr-[2.5rem] -mr-2 -mt-2"></div>
                     <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[10px] border-l-[10px] border-indigo-500 rounded-bl-[2.5rem] -ml-2 -mb-2"></div>
                     <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[10px] border-r-[10px] border-indigo-500 rounded-br-[2.5rem] -mr-2 -mb-2"></div>
                     
                     {/* Scanning Line Animation */}
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_40px_rgba(79,70,229,0.8)] animate-scan"></div>
                     
                     <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <i className="fas fa-qrcode text-6xl text-white animate-pulse"></i>
                     </div>
                  </div>
                </div>
                
                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
              </>
            )}
          </div>

          <div className="bg-indigo-50/50 p-8 rounded-[3rem] border border-indigo-100/50 flex items-center space-x-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shrink-0 border border-indigo-50">
               <i className="fas fa-shield-halved text-2xl"></i>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Secure Grounding Node</p>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Scan valid medical QR codes to instantly decipher reports or link verified pharmacies from health portals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
