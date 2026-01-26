
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
    // Simulate OAuth Login with persistence
    setTimeout(() => {
      const mockNames = { google: 'Google User', apple: 'Apple ID User', facebook: 'FB User' };
      const mockEmails = { google: 'google@gmail.com', apple: 'apple@icloud.com', facebook: 'fb@facebook.com' };
      const userData = { email: mockEmails[platform], name: mockNames[platform] };
      onLogin(userData);
      setIsLoading(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email, name: name || 'Valued User' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      <button onClick={onBack} className="absolute top-10 left-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95 z-50">
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-2xl shadow-blue-500/20 mb-6 transform hover:scale-105 transition-transform">
            <i className="fas fa-heartbeat text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            MediDecode <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-[9px]">Patient Security First Environment</p>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-12">
          <div className="text-center space-y-2 mb-10">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Your Portal</h2>
             <p className="text-slate-400 text-xs font-medium">Use social login for instant, secure access.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-10">
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-500 rounded-2xl py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group"
             >
                <i className="fab fa-google text-blue-500 text-lg mr-4 group-hover:scale-110 transition-transform"></i>
                Continue with Google
             </button>
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('apple')}
                className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-slate-900 rounded-2xl py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group"
             >
                <i className="fab fa-apple text-slate-900 text-lg mr-4 group-hover:scale-110 transition-transform"></i>
                Sign in with Apple
             </button>
             <button 
                disabled={isLoading}
                onClick={() => handleSocialLogin('facebook')}
                className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-blue-700 rounded-2xl py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center transition-all group"
             >
                <i className="fab fa-facebook text-blue-700 text-lg mr-4 group-hover:scale-110 transition-transform"></i>
                Login with Facebook
             </button>
          </div>

          <div className="flex items-center w-full space-x-4 mb-10">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Or use Credentials</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Username</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-blue-500 transition-all font-bold text-slate-700" placeholder="Enter name" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-blue-500 transition-all font-bold text-slate-700" placeholder="Enter email" />
            </div>
            
            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center space-x-4 group disabled:opacity-50"
            >
              {isLoading ? <i className="fas fa-circle-notch animate-spin text-lg"></i> : <span>{isLogin ? 'Login Portal' : 'Create Account'}</span>}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all">
               {isLogin ? "Need an account? Sign up here" : "Back to Login"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
