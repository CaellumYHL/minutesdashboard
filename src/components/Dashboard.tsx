import { useState, useEffect } from 'react';
import { Activity, Send, CheckCircle2, PlayCircle, Terminal, RefreshCcw, Bell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const StatCard = ({ label, value, unit, subtext, icon: Icon, trend }: { label: string, value: string, unit?: string, subtext: string, icon: any, trend?: string }) => (
  <div className="glass-card p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 aspect-[5/3] w-full max-w-none">
    {/* Top: label + badge */}
    <div className="flex justify-between items-center">
      <p className="text-[11px] font-black font-mono text-slate-500 uppercase tracking-[0.15em]">{label}</p>
      {trend && (
        <span className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          {trend}
        </span>
      )}
    </div>
    {/* Middle: icon + big value */}
    <div className="flex flex-col items-start gap-3">
      <div className="p-4 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-2xl transition-all duration-300 group-hover:rotate-6">
        <Icon size={32} className="text-blue-400" />
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <h3 className="text-5xl font-black text-white tracking-tighter stat-value">{value}</h3>
        {unit && <span className="text-lg font-bold text-slate-400 tracking-tight">{unit}</span>}
      </div>
    </div>
    {/* Bottom: status dot + subtext */}
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      <p className="text-[10px] text-slate-500 font-medium">{subtext}</p>
    </div>
  </div>
);

export const Dashboard = ({ token }: { token: string }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [stats, setStats] = useState({
    totalRuns: 0,
    latestRunStatus: 'Unknown',
    lastRunTime: 'Never',
    isLoading: true
  });
  const [commits, setCommits] = useState<any[]>([]);
  const [isCommitsLoading, setIsCommitsLoading] = useState(true);

  const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || "Caleb-Gawthroupe";
  const REPO_NAME = import.meta.env.VITE_REPO_NAME || "minutes";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=1`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.workflow_runs && data.workflow_runs.length > 0) {
            const latestRun = data.workflow_runs[0];
            const date = new Date(latestRun.updated_at);
            
            setStats({
              totalRuns: data.total_count,
              latestRunStatus: latestRun.conclusion || latestRun.status,
              lastRunTime: date.toLocaleString(),
              isLoading: false
            });
          } else {
             setStats((prev: any) => ({ ...prev, isLoading: false }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch GitHub stats", e);
        setStats((prev: any) => ({ ...prev, isLoading: false, latestRunStatus: 'Error' }));
      }

      try {
        const commitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=7`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`
          }
        });
        if (commitResponse.ok) {
           const commitData = await commitResponse.json();
           setCommits(commitData);
        }
      } catch (e) {
        console.error("Failed to fetch Github commits", e);
      } finally {
        setIsCommitsLoading(false);
      }
    };
    fetchStats();
    
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [token, REPO_OWNER, REPO_NAME]);

  const handlePing = async () => {
    setIsTriggering(true);

    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'ping-pipeline',
        }),
      });

      if (!response.ok) {
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
    <div className="w-full grid-bg min-h-screen py-10 px-6 sm:px-12 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-12">
        <header className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.05]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] text-slate-300 font-medium">System Online</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm">
            Monitor civic data pipelines and trigger manual social media broadcasts.
          </p>
        </div>
        
        <div className="flex gap-6 items-center">
          <button className="p-3 text-slate-500 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-4" />
          <div className="flex gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black font-mono text-amber-500 uppercase tracking-wider">Overclock Active</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 w-full">
          <StatCard 
            label="Total Pipeline Runs" 
            value={stats.isLoading ? "..." : stats.totalRuns.toString()} 
            unit="Pipeline Runs"
            subtext="Historically executed workflows" 
            icon={Activity} 
          />
          <StatCard 
            label="Latest Conclusion" 
            value={stats.isLoading ? "..." : stats.latestRunStatus === 'success' ? 'Stable' : stats.latestRunStatus} 
            subtext={stats.latestRunStatus === 'success' ? "All tests passed" : "Review logs required"} 
            icon={CheckCircle2} 
            trend={stats.latestRunStatus === 'success' ? "PASS" : undefined}
          />
        </div>
        
        <div className="glass-card px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-xl transition-all duration-300 group-hover:rotate-6">
              <Send size={28} className="text-blue-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-black font-mono text-slate-500 uppercase tracking-[0.15em]">Last Execution</p>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stats.isLoading ? "..." : stats.lastRunTime}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.02] px-4 py-2.5 rounded-lg border border-white/[0.05]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">Most recent workflow activity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Terminal size={180} />
            </div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal size={16} className="text-slate-400" />
                Recent Repository Activity
              </h3>
              <div className="flex gap-1.5">
                {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
              </div>
            </div>
            <div className="bg-[#0A0A0A] p-6 font-mono text-xs leading-loose text-slate-400 space-y-4 max-h-[480px] overflow-y-auto rounded-xl border border-white/[0.05]">
              <AnimatePresence mode="popLayout">
                {isCommitsLoading ? (
                  <p className="animate-pulse">Fetching latest repository transactions...</p>
                ) : commits.length > 0 ? (
                  commits.map((commit, index) => (
                    <motion.p key={commit.sha} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0">
                      <span className="text-blue-500 font-bold shrink-0">[{commit.sha.substring(0, 7)}]</span>
                      <span className="text-slate-300 truncate" title={commit.commit.message}>{commit.commit.message.split('\n')[0]}</span>
                      <span className="text-slate-500 sm:ml-auto shrink-0 w-24 text-right">{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                    </motion.p>
                  ))
                ) : (
                  <p className="text-amber-500/80">No recent activity found or access denied.</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="glass-card p-10">
            <h3 className="text-sm font-semibold text-white mb-8">Service Health</h3>
            <div className="space-y-6">
              {[
                { name: 'GitHub Actions Pipeline', status: stats.latestRunStatus === 'success' ? 'Operational' : 'Review Required', color: stats.latestRunStatus === 'success' ? 'text-slate-300' : 'text-amber-400' },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between group cursor-default">
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{svc.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${svc.color.replace('text', 'bg')} ${svc.status === 'Operational' ? 'bg-emerald-500' : ''}`} />
                    <span className={`text-xs font-medium ${svc.status === 'Operational' ? 'text-emerald-500' : svc.color}`}>{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-2.5 border border-white/10 hover:border-white/20 rounded-lg text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.02]">
              Run Full Diagnostics
            </button>
          </div>
          
          <button 
            disabled={isTriggering}
            onClick={handlePing}
            className="w-full mt-12 relative bg-blue-600 hover:bg-blue-500 text-white font-bold py-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:grayscale overflow-hidden group shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            {isTriggering ? (
              <RefreshCcw size={20} className="animate-spin" />
            ) : (
              <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
            )}
            <span className="relative z-10 text-sm tracking-wide">
              {isTriggering ? 'INHABITING PIPELINE...' : 'RUN PIPELINE'}
            </span>
          </button>
        </div>
      </div>
    </div>
   </div>
  );
};