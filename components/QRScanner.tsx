
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
        setError("Camera access denied. Please allow camera permissions in your browser settings to scan QR codes.");
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
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[3.5rem] overflow-hidden shadow-4xl relative">
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xl"
            aria-label="Close Scanner"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Health Link Scanner</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Scan prescriptions or report portals</p>
          </div>

          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group border-4 border-slate-50">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <i className="fas fa-video-slash text-3xl"></i>
                </div>
                <p className="text-xs font-bold text-rose-600 leading-relaxed max-w-xs">{error}</p>
                <button onClick={onClose} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Close Scanner</button>
              </div>
            ) : (
              <>
                <video ref={videoRef} className="w-full h-full object-cover scale-110" />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanner Viewfinder Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-blue-500/50 rounded-[2rem] relative">
                     <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-blue-500 rounded-tl-3xl -ml-2 -mt-2"></div>
                     <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-blue-500 rounded-tr-3xl -mr-2 -mt-2"></div>
                     <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-blue-500 rounded-bl-3xl -ml-2 -mb-2"></div>
                     <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-blue-500 rounded-br-3xl -mr-2 -mb-2"></div>
                     <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_25px_#3b82f6] animate-scan"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
              </>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex items-center space-x-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
               <i className="fas fa-qrcode text-xl"></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-wider">
              Align the medical QR code within the frame to instantly link to patient resources or verified pharmacies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
