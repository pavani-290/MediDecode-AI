
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick }) => {
  const [installing, setInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // Capture the install prompt for supported browsers
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('App is ready to be installed');
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setInstalling(false);
      setShowInstallGuide(false);
    });
  }, []);

  const handleInstallApp = async () => {
    setInstalling(true);
    
    // Artificial delay to simulate "preparing application files" for a more native feel
    await new Promise(r => setTimeout(r, 1200));

    if (deferredPrompt) {
      // Browser supports native installation (Chrome/Android/Edge)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
      setInstalling(false);
    } else {
      // Show custom "Native App Store" styled guide
      setShowInstallGuide(true);
      setInstalling(false);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-xl bg-slate-900/40 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <i className="fas fa-heartbeat text-white text-lg"></i>
          </div>
          <span className="font-black text-xl tracking-tighter">MediDecode <span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it works</a>
          <button onClick={handleInstallApp} className="hover:text-blue-400 transition-colors">Install App</button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onLoginClick}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-4"
          >
            Login
          </button>
          <button 
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-3/5 space-y-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <span>Turning Medical Handwriting into Clear Understanding</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Understand Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Prescriptions.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0">
            Can't read your doctor's handwriting? We turn complex medical reports into simple words you can understand. No more confusion, just clear health guidance.
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <button 
              onClick={onStart}
              className="bg-white text-slate-900 px-12 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl shadow-blue-500/10 group flex items-center"
            >
              Start Decoding Now
              <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button 
              onClick={handleInstallApp}
              disabled={installing}
              className="border-2 border-slate-700/50 backdrop-blur-md px-10 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:border-blue-400 transition-all flex items-center space-x-3"
            >
              <i className={`fas ${installing ? 'fa-spinner fa-spin' : 'fa-download'} text-lg`}></i>
              <span>{installing ? 'Preparing App...' : 'Download Full App'}</span>
            </button>
          </div>
        </div>

        <div className="lg:w-2/5 relative hidden lg:block">
           <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-[4rem] p-10 h-full flex flex-col items-center justify-center shadow-3xl text-center space-y-8 overflow-hidden group">
                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform">
                  <i className="fas fa-magic text-white"></i>
                </div>
                <h3 className="text-3xl font-black">AI Magic</h3>
                <p className="text-slate-400 font-medium">Upload any messy prescription and see it turn into plain English instantly.</p>
                <div className="w-full bg-slate-800 rounded-3xl p-6 border border-white/5">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                        <i className="fas fa-check"></i>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Status</p>
                        <p className="text-sm font-black">Ready to Install</p>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Custom Native-Style Install Overlay */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[3rem] p-8 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-500/20">
                <i className="fas fa-heartbeat text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black mb-1 tracking-tight">MediDecode AI</h3>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Application Bundle Ready</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                  <i className="fas fa-microchip"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase">Compatibility</p>
                   <p className="text-sm font-bold text-slate-200">Optimized for your device</p>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                <p className="text-xs font-bold text-slate-300 text-center">To complete the installation:</p>
                
                {platform === 'ios' ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-4">
                       <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                       <p className="text-xs text-slate-300">Tap the <i className="fas fa-share-square mx-1 text-blue-400"></i> share icon</p>
                    </div>
                    <div className="flex items-center space-x-4">
                       <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                       <p className="text-xs text-slate-300">Select <span className="text-white font-black">"Add to Home Screen"</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-4">
                       <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                       <p className="text-xs text-slate-300">Tap the <i className="fas fa-ellipsis-v mx-1 text-blue-400"></i> menu button</p>
                    </div>
                    <div className="flex items-center space-x-4">
                       <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                       <p className="text-xs text-slate-300">Tap <span className="text-white font-black">"Install App"</span></p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => setShowInstallGuide(false)}
              className="w-full mt-8 bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Download Started
            </button>
          </div>
        </div>
      )}

      {/* Stats section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
         {[
           { val: '99.8%', label: 'OCR Accuracy' },
           { val: '150+', label: 'Medical Terms' },
           { val: '12+', label: 'Local Languages' },
           { val: 'Zero', label: 'Clinical Fees' }
         ].map((stat, i) => (
           <div key={i} className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
              <p className="text-3xl font-black text-blue-400 mb-1 tracking-tighter">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
           </div>
         ))}
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-12 py-32 border-t border-white/5">
        <div className="text-center mb-24 space-y-6">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">What we do</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight italic">Simple. Fast. Safe.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">We make healthcare reports easy for everyone to read.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: 'fa-pen-nib', title: 'Reads Messy Writing', desc: 'Can\'t read your prescription? We decode even the hardest doctor handwriting.', color: 'text-blue-500' },
            { icon: 'fa-book-open', title: 'Everyday Words', desc: 'We explain complex medical terms in simple, clear language that anyone can understand.', color: 'text-emerald-500' },
            { icon: 'fa-shield-virus', title: 'Side-Effect Alerts', desc: 'Learn about common side effects and what to watch out for with your medicines.', color: 'text-indigo-500' },
            { icon: 'fa-globe-americas', title: 'Your Own Language', desc: 'Get results in Hindi, Bengali, Tamil, Spanish, and many more native languages.', color: 'text-amber-500' },
            { icon: 'fa-file-pdf', title: 'PDF Downloads', desc: 'Save your explained report as a clean PDF to show your family or keep for yourself.', color: 'text-purple-500' },
            { icon: 'fa-robot', title: 'Ask Questions', desc: 'Have a doubt? Chat with our AI assistant anytime to learn more about your health.', color: 'text-rose-500' }
          ].map((feature, i) => (
            <div key={i} className="group p-10 bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/5 hover:border-blue-500/50 transition-all duration-500">
              <div className={`w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center ${feature.color} mb-8 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 md:px-12 text-center bg-slate-900/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <i className="fas fa-heartbeat"></i>
              </div>
              <span className="font-black text-xl tracking-tighter">MediDecode <span className="text-blue-500">AI</span></span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">&copy; 2026 MediDecode AI. All Rights Reserved.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"><i className="fab fa-twitter"></i></a>
            <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
