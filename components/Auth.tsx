
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { email: string; name: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({ email, name: name || 'User' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-blue-500/20 mb-8 transform hover:scale-110 transition-transform cursor-pointer">
            <i className="fas fa-heartbeat text-4xl text-white"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            MediDecode <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.2em] text-[10px]">Turning Medical Handwriting into Clear Understanding</p>
        </div>

        <div className="bg-white rounded-[4rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-10 md:p-14">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-2 rounded-[2rem] mb-12">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${isLogin ? 'bg-white text-blue-600 shadow-xl shadow-slate-200/50 scale-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${!isLogin ? 'bg-white text-blue-600 shadow-xl shadow-slate-200/50 scale-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className={`grid gap-8 ${!isLogin ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Username</label>
                  <div className="relative group">
                    <i className="fas fa-user absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                    <input 
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                <div className="relative group">
                  <i className="fas fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Password</label>
                <div className="relative group">
                  <i className="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Confirm Password</label>
                  <div className="relative group">
                    <i className="fas fa-shield-alt absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                    <input 
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-8 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}
                >
                  {rememberMe && <i className="fas fa-check text-white text-[10px]"></i>}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
                  {isLogin ? 'Remember me' : 'I agree to terms'}
                </span>
              </label>
              
              {isLogin && (
                <button type="button" className="text-[11px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-all">Forgot?</button>
              )}
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-slate-900 text-white rounded-[2rem] py-6 font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-4 group active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch animate-spin text-lg"></i>
              ) : (
                <>
                  <span>{isLogin ? 'Login Now' : 'Create Account'}</span>
                  <i className="fas fa-arrow-right text-[12px] group-hover:translate-x-2 transition-transform"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center space-y-8">
            <div className="flex items-center w-full space-x-4">
              <div className="h-[1px] bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Social Connect</span>
              <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <button className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group">
                <i className="fab fa-google text-slate-400 group-hover:text-blue-600 text-xl"></i>
              </button>
              <button className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group">
                <i className="fab fa-apple text-slate-400 group-hover:text-black text-xl"></i>
              </button>
              <button className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group">
                <i className="fab fa-facebook text-slate-400 group-hover:text-blue-700 text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all"
           >
             {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
