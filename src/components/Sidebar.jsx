import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ArrowLeftRight, 
  Settings, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Cpu, 
  Copy, 
  Check,
  Zap,
  Radio
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const [copied, setCopied] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, count: '5 Assets' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, count: '11' },
    { id: 'analytics', label: 'Quant Analytics', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleCopyWallet = () => {
    navigator.clipboard.writeText("0x71C94829F8a06eDe2E181283626159f81C434b92");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 shadow-glow-cyan">
                <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400 animate-pulse-slow" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500 text-lg">
                    AETHER
                  </span>
                  <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-slate-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-800/60 font-semibold">
                    v2.4
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider">NEXT-GEN QUANT TERMINAL</p>
              </div>
            </div>
          </div>

          {/* Real-time Institutional Feed Badge (No DB strings or ports) */}
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0d162b] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">FEED STATUS</span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">12ms // LIVE FEED</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-mono font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-slate-100 dark:bg-gradient-to-r dark:from-cyan-950/50 dark:via-slate-900/60 dark:to-transparent text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-sm dark:shadow-[0_0_20px_rgba(0,242,254,0.15)] font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/40 border border-transparent'}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-r shadow-[0_0_10px_#00f2fe]" />
                )}
                
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'text-cyan-500 dark:text-cyan-400 rotate-90' : 'text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            );
          })}

          {/* Quick Quant Strategy Banner */}
          <div className="pt-6 px-1">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#0c1830] dark:to-[#081020] border border-slate-200 dark:border-cyan-500/20 relative overflow-hidden group transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="text-[11px] font-mono text-slate-800 dark:text-cyan-300 font-bold tracking-wider">ALGO-TRADING BOT</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Delta-neutral hedging active. 24h Yield: <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">+1.42%</span>
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <span>EXECUTION POOL</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">TIER 1 LIQUIDITY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer User Wallet & Security */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-[#080d1a] transition-colors">
          <div className="p-3 rounded-xl bg-white dark:bg-[#0e1629] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted Vault</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                SECURE
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#080c16] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="truncate max-w-[140px]">0x71C9...4b92</span>
              <button 
                onClick={handleCopyWallet}
                className="text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors p-1"
                title="Copy address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
