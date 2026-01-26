
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { email: string; name: string; avatar?: string }) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (platform: 'google' | 'apple' | 'facebook') => {
    setIsLoading(true);
    // Secure simulated login with persistence
    setTimeout(() => {
      const mockData = {
        google: { name: 'Google Clinical User', email: 'verified@google.md', avatar: 'https://i.pravatar.cc/150?u=google' },
        apple: { name: 'Apple ID Secure', email: 'secure@apple.md', avatar: 'https://i.pravatar.cc/150?u=apple' },
        facebook: { name: 'FB Verified Patient', email: 'patient@fb.md', avatar: 'https://i.pravatar.cc/150?u=fb' }
      };
      
      const userData = mockData[platform];
      // Persistent storage is handled in the App.tsx callback
      onLogin(userData);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email, name: name || email.split('@')[0], avatar: 'https://i.pravatar.cc/150?u=' + email });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/5 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-rose-500/5 rounded-full blur-[140px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <button onClick={onBack} className="absolute top-10 left-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 z-50 border border-slate-100">
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="w-full max-w-xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] shadow-4xl shadow-indigo-500/20 mb-8 transform hover:scale-110 hover:rotate-6 transition-all">
            <i className="fas fa-heartbeat text-4xl text-white"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            MediDecode <span className="text-indigo-600">AI</span>
          </h1>
          <p className="text-slate-400 font-bold mt-3 uppercase tracking-[0.4em] text-[10px]">Secure Clinical Portal v2.6</p>
        </div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.08)] border border-white p-10 md:p-16">
          <div className="text-center space-y-3 mb-12">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Access</h2>
             <p className="text-slate-400 text-sm font-medium italic">Integrated authentication for immediate record interpretation.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 mb-12">
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-500 rounded-3xl py-6 px-8 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group shadow-sm disabled:opacity-50"
             >
                {isLoading ? <i className="fas fa-spinner fa-spin mr-4"></i> : <i className="fab fa-google text-indigo-500 text-xl mr-5 group-hover:scale-125 transition-all"></i>}
                {isLoading ? 'Verifying...' : 'Sign in with Google'}
             </button>
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('apple')}
                className="w-full bg-white hover:bg-slate-100 border-2 border-slate-100 hover:border-slate-900 rounded-3xl py-6 px-8 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group shadow-sm disabled:opacity-50"
             >
                <i className="fab fa-apple text-slate-900 text-xl mr-5 group-hover:scale-125 transition-all"></i>
                Sign in with Apple
             </button>
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('facebook')}
                className="w-full bg-white hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-700 rounded-3xl py-6 px-8 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group shadow-sm disabled:opacity-50"
             >
                <i className="fab fa-facebook text-blue-700 text-xl mr-5 group-hover:scale-125 transition-all"></i>
                Login with Facebook
             </button>
          </div>

          <div className="flex items-center w-full space-x-6 mb-12">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Institutional Node</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Clinical Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 text-sm" placeholder="Dr. / Patient Name" />
              </div>
            )}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Registered Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 text-sm" placeholder="email@hospital.com" />
            </div>
            
            <button 
              disabled={isLoading || (!email.trim())}
              type="submit"
              className="w-full bg-slate-900 text-white rounded-3xl py-6 font-black uppercase tracking-[0.4em] text-[11px] shadow-4xl hover:bg-indigo-600 hover:-translate-y-1.5 transition-all flex items-center justify-center space-x-5 group disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? <i className="fas fa-circle-notch animate-spin text-xl"></i> : <span>{isLogin ? 'Establish Link' : 'Secure Registration'}</span>}
              {!isLoading && <i className="fas fa-chevron-right text-[10px] group-hover:translate-x-2 transition-all"></i>}
            </button>
          </form>

          <div className="mt-12 text-center">
             <button onClick={() => setIsLogin(!isLogin)} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all border-b border-transparent hover:border-indigo-200 pb-1">
               {isLogin ? "No portal link? Register Patient node" : "Existing Node? Back to Linkage"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
