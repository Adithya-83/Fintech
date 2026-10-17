import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Plus, 
  ArrowUpRight, 
  ChevronDown, 
  Shield, 
  Wallet, 
  Sparkles,
  LogIn,
  Sun,
  Moon,
  Zap,
  Activity
} from 'lucide-react';
import { BALANCE_SUMMARY, MARKET_TICKERS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function Header({ 
  onOpenTrade, 
  onOpenAuth, 
  currentUser, 
  onLogout,
  onToggleMobileSidebar 
}) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const profile = currentUser || {
    name: "Alex Vance",
    handle: "@vance_quant",
    role: "Lead Quant Trader",
    tier: "PRO TERMINAL // TIER 3",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#080d1a]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      {/* Top mini-ticker bar */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-slate-100 dark:bg-[#050811] border-b border-slate-200 dark:border-slate-800/40 text-[11px] font-mono overflow-x-auto no-scrollbar transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">LIVE ORACLE:</span>
          </div>
          {MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-bold">{ticker.symbol}</span>
              <span className="text-slate-600 dark:text-slate-200">${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className={`flex items-center text-[10px] ${ticker.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {ticker.isUp ? '+' : ''}{ticker.change}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-800 flex items-center gap-1 font-semibold">
            <Activity className="w-2.5 h-2.5 text-cyan-500" />
            GAS: 12 GWEI • LATENCY: 14ms
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-400 font-semibold">NY-4 LOW LATENCY POOL</span>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <button 
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Cyber Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-sm hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search contracts, tokens, tx hashes..." 
              className="w-full bg-slate-100 dark:bg-[#0d162b]/80 border border-slate-200 dark:border-slate-800/90 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60">
              ⌘K
            </span>
          </div>
        </div>

        {/* Center / Right: Total Balance Summary & Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Total Balance Summary Box */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-gradient-to-r dark:from-[#0d182e] dark:to-[#0a1224] border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(0,242,254,0.06)] transition-colors">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center justify-end gap-1">
                <Wallet className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                Portfolio Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg lg:text-xl font-bold font-mono text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-cyan-200">
                  ${BALANCE_SUMMARY.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3" />
                  +{BALANCE_SUMMARY.change24hPercentage}%
                </span>
              </div>
            </div>

            {/* Quick Action Button: Quick Trade */}
            <button
              onClick={onOpenTrade}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-xs shadow-glow-cyan hover:opacity-95 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Quick Trade</span>
            </button>
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Functional Dark / Light Mode Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#0d162b] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center group"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#0d162b] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#0d162b] animate-pulse"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-cyan-500/20 shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono">QUANT ALERTS</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">2 NEW</span>
                  </div>
                  <div className="py-2 space-y-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-emerald-500/20">
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Limit Order Filled</p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">Bought 0.125 BTC at $96,420.00</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-cyan-500/20">
                      <p className="text-cyan-600 dark:text-cyan-400 font-semibold">Staking Yield Accrued</p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">+0.048 ETH credited to cold vault</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-[#0d162b] border border-slate-200 dark:border-slate-800/90 hover:border-cyan-500/40 transition-all text-left"
              >
                <div className="relative">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0d162b] rounded-full"></span>
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{profile.name}</span>
                    <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400/90 font-medium">
                    {profile.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0e172a] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#141f38] mb-2">
                    <p className="text-slate-900 dark:text-slate-100 font-bold">{profile.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px]">{profile.handle || profile.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>{profile.tier || "PRO TERMINAL"}</span>
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#080d1a] rounded-lg border border-slate-200 dark:border-slate-800 mb-2">
                    <span className="text-slate-400 dark:text-slate-500 block uppercase font-bold">Security Clearance:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block">TIER 3 ENCRYPTED VAULT</span>
                    <span className="text-slate-600 dark:text-slate-400 block">FIDO2 WebAuthn & JWT Active</span>
                  </div>

                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 font-mono flex items-center justify-between transition-colors"
                  >
                    <span>Sign Out // Lock Terminal</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 border border-rose-500/30 font-bold">EXIT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
