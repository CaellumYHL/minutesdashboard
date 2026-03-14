import { useState } from 'react';
import { Zap, Activity, Users, Send, CheckCircle2, PlayCircle, Terminal, RefreshCcw, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ label, value, subtext, icon: Icon, trend }: { label: string, value: string, subtext: string, icon: any, trend?: string }) => (
  <div className="technical-border glass-card p-6 group cursor-default hover:bg-white/[0.02] transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-xl transition-all duration-300 group-hover:rotate-6">
        <Icon size={22} className="text-blue-400" />
      </div>
      {trend && (
        <span className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          {trend}
        </span>
      )}
    </div>
    <p className="text-[11px] font-black font-mono text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-3xl font-black text-white tracking-tighter stat-value">{value}</h3>
    </div>
    <div className="flex items-center gap-1.5 mt-3">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      <p className="text-[10px] text-slate-500 font-medium">{subtext}</p>
    </div>
  </div>
);

export const Dashboard = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastPing, setLastPing] = useState<string | null>(null);

  const handlePing = async () => {
    setIsTriggering(true);
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || "Caleb-Gawthroupe";
    const REPO_NAME = import.meta.env.VITE_REPO_NAME || "minutes";

    if (!GITHUB_TOKEN) {
      alert("ERR_CONFIG_MISSING: VITE_GITHUB_TOKEN not found in environment.");
      setIsTriggering(false);
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'ping-pipeline',
        }),
      });

      if (response.ok) {
        setLastPing(new Date().toLocaleTimeString());
      } else {
        const error = await response.json();
        alert(`ERR_DISPATCH_FAILED: ${error.message || 'UNKNOWN_ERROR'}`);
      }
    } catch (err) {
      alert("ERR_NETWORK_TIMEOUT: Mainframe connection lost.");
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto grid-bg min-h-full py-4">
      <header className="mb-12 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 rounded uppercase tracking-widest font-mono">
              Live Environment
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] text-emerald-500 font-bold uppercase font-mono">Syncing</span>
            </div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter italic">STRATEGIC COMMAND</h2>
          <p className="text-slate-400 font-mono text-sm flex items-center gap-2">
            <span className="text-blue-500 opacity-50 font-bold">//</span> SYSTEM_RUNTIME: <span className="text-white font-bold">ACTIVE</span>
            <span className="w-1 h-3 bg-blue-500/30 mx-1" />
            VOD_STATUS: <span className="text-emerald-500 font-bold">STABLE</span>
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <button className="p-3 text-slate-500 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black font-mono text-amber-500 uppercase tracking-wider">Overclock Active</span>
            </div>
            <button 
              disabled={isTriggering}
              onClick={handlePing}
              className="btn-unique group disabled:opacity-50 disabled:grayscale overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isTriggering ? (
                <RefreshCcw size={18} className="animate-spin" />
              ) : (
                <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
              )}
              <span className="relative z-10">{isTriggering ? 'Inhabiting Pipeline...' : 'Run Pipeline'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Civic Reach" 
          value="12,482" 
          subtext="Tracking 12% WoW" 
          icon={Users} 
          trend="+12%" 
        />
        <StatCard 
          label="Pulse Rate" 
          value="8.2%" 
          subtext="Avg. User Interest" 
          icon={Activity} 
        />
        <StatCard 
          label="Kernel Health" 
          value="99.99%" 
          subtext="No recent outages" 
          icon={CheckCircle2} 
        />
        <StatCard 
          label="Last Broadcast" 
          value={lastPing || "09:00:00"} 
          subtext="Standard cron run" 
          icon={Send} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="technical-border bg-gradient-to-b from-[#16191f] to-[#0f1115] p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Terminal size={120} />
            </div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black font-mono text-blue-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Kernel Execution Logs
              </h3>
              <div className="flex gap-1.5">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/5 border border-white/10" />)}
              </div>
            </div>
            <div className="bg-black/40 p-6 font-mono text-[11px] leading-relaxed text-slate-400 space-y-3 max-h-[400px] overflow-y-auto border border-white/[0.03] rounded-lg custom-scrollbar backdrop-blur-sm">
              <AnimatePresence mode="popLayout">
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                  <span className="text-white/20">01</span>
                  <span className="text-blue-500 font-bold">[SYS]</span>
                  <span>Kernel initialized. Spooling drivers...</span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex gap-4">
                   <span className="text-white/20">02</span>
                  <span className="text-emerald-500 font-bold">[NET]</span>
                  <span>Gateway handshake successful: <span className="text-slate-300 underline underline-offset-4 decoration-emerald-500/30 cursor-pointer">tmmis.api.gov</span></span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-4">
                   <span className="text-white/20">03</span>
                  <span className="text-slate-500 font-bold">[CMD]</span>
                  <span>Scanning Registry: <span className="text-blue-400/80">Bylaw_2024_Fetch</span></span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
                   <span className="text-white/20">04</span>
                  <span className="text-emerald-500 font-bold">[DB]</span>
                  <span>ChromaDB Ingestion: <span className="text-white font-bold">+14</span> vector chunks indexed.</span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-4">
                   <span className="text-white/20">05</span>
                  <span className="text-blue-500 font-bold">[AI]</span>
                  <span>Agent <span className="italic text-slate-300">'Hunter-Alpha'</span> auditing file #PH11.4...</span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex gap-4">
                   <span className="text-white/20">06</span>
                  <span className="text-amber-500 font-bold">[GEN]</span>
                  <span>Graphic buffer flushed: 3/3 slides ready in <span className="text-white font-bold">/visuals/</span></span>
                </motion.p>
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex gap-4">
                   <span className="text-white/20">07</span>
                  <span className="text-emerald-500 font-bold">[SUCCESS]</span>
                  <span className="tracking-tight italic font-bold">Instagram broadcast completed. Connection closed.</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-slate-600 px-2">
              <span>ACTIVE_THREAD: 0x8BE92</span>
              <span>MEMORY_ALLOC: 124MB</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="technical-border bg-gradient-to-br from-[#16191f] to-[#0f1115] p-8 rounded-xl shadow-xl">
            <h3 className="text-xs font-black font-mono text-white mb-8 uppercase tracking-[0.2em]">Service Infrastructure</h3>
            <div className="space-y-6">
              {[
                { name: 'IG Graph API', status: 'Optimal', color: 'text-emerald-400' },
                { name: 'OpenRouter L3', status: 'Active', color: 'text-emerald-400' },
                { name: 'GitHub Actions', status: 'Stable', color: 'text-emerald-400' },
                { name: 'ImgBB Cloud', status: 'Warning', color: 'text-amber-400' },
                { name: 'Vapi Voice', status: 'Legacy', color: 'text-slate-500' },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono tracking-tight">{svc.name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${svc.color}`}>{svc.status}</span>
                    <div className={`w-1 h-1 rounded-full ${svc.color.replace('text', 'bg')}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 border border-white/[0.05] hover:border-white/10 rounded-lg text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest transition-all hover:bg-white/[0.02]">
              Re-Diagnostics
            </button>
          </div>

          <div className="technical-border bg-blue-600/5 p-8 border-blue-500/20 rounded-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-blue-500/5 rotate-12 transition-transform group-hover:rotate-0 duration-700">
               <Zap size={100} />
            </div>
            <h3 className="text-xs font-black font-mono text-blue-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
               Intelligence Brief
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Core logic updated. <span className="text-white font-bold">Robo-Lobbyist</span> integration is now handling direct feedback loops for Ward 10 inquiries. Artificial latency reduced by 40%.
            </p>
            <div className="mt-6 flex gap-2">
               <div className="w-1/3 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-blue-500" />
               </div>
               <div className="w-2/3 h-1 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
