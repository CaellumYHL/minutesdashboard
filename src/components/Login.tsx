import { useState } from 'react';
import { Terminal, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = ({ setToken }: { setToken: (t: string) => void }) => {
  const [inputToken, setInputToken] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.startsWith('github_pat_') || inputToken.startsWith('ghp_')) {
      setToken(inputToken);
    } else {
      setError('Invalid token format. Please use a valid GitHub Access Token.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] flex items-center justify-center p-4 grid-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="technical-border glass-card w-full max-w-md p-8 md:p-12 relative z-10"
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative group cursor-default">
            <Terminal size={32} className="text-blue-400 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0a0f16]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">Minutes Control</h1>
          <p className="text-slate-400 text-sm font-medium">Enter your credentials to access the strategic command center.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Lock size={12} /> Access Token (Password)
            </label>
            <div className="relative group">
              <input
                type="password"
                value={inputToken}
                onChange={(e) => {
                  setInputToken(e.target.value);
                  setError('');
                }}
                placeholder="github_pat_xxxxxxxx..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-amber-500 text-xs mt-2 flex items-center gap-1 font-medium">
                <Zap size={12} /> {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-unique flex items-center justify-center gap-2 mt-2"
          >
            <span>Initialize Session</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/5 rounded-full border border-blue-500/10 text-blue-400/80">
            <ShieldCheck size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Encrypted Local Session</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
