import { LayoutDashboard, ChevronRight, Terminal, Github, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-3.5 text-sm transition-all duration-300 group relative",
      active ? "text-white bg-blue-500/10" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]"
    )}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />}
    <Icon size={18} className={cn("transition-all duration-300", active ? "text-blue-400 scale-110" : "group-hover:text-slate-300 group-hover:scale-105")} />
    <span className={cn("font-medium tracking-wide", active ? "opacity-100" : "opacity-80 group-hover:opacity-100")}>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto text-blue-500/50" />}
  </button>
);

export const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#07080a] border-r border-white/[0.05] flex flex-col z-50">
      <div className="p-8 flex items-center gap-4 border-b border-white/[0.03]">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-600/20 flex items-center justify-center rounded-lg border border-blue-500/30 group cursor-pointer hover:border-blue-400/50 transition-all">
            <Terminal size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#07080a] animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Minutes</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck size={10} className="text-emerald-500" />
            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold">Secure Node</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-10">
        <div className="px-8 mb-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">System Navigation</p>
        </div>
        <NavItem 
          icon={LayoutDashboard} 
          label="Operational Desk" 
          active={true} 
          onClick={() => {}} 
        />
        <div className="px-8 mt-12 mb-6">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Documentation</p>
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <a 
          href="https://github.com/Caleb-Gawthroupe/minutes" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/[0.03] hover:bg-white/[0.06] rounded-lg border border-white/[0.05]"
        >
          <Github size={14} />
          <span>View Mainframe</span>
        </a>
      </div>
    </aside>
  );
};
