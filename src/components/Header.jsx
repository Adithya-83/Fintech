import React, { useState, useEffect } from 'react';
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
  Database,
  UserCheck,
  LogIn
} from 'lucide-react';
import { BALANCE_SUMMARY, MARKET_TICKERS } from '../data/mockData';
import { getCurrentUser } from '../services/api';

export default function Header({ 
  onOpenTrade, 
  onOpenAuth, 
  currentUser, 
  onToggleMobileSidebar 
}) {
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
    <header className="sticky top-0 z-30 w-full bg-[#080d1a]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top mini-ticker bar */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-[#050811] border-b border-slate-800/40 text-[11px] font-mono overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-semibold tracking-wider">LIVE ORACLE:</span>
          </div>
          {MARKET_TICKERS.map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer">
              <span className="text-slate-300 font-bold">{ticker.symbol}</span>
              <span className="text-slate-200">${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className={`flex items-center text-[10px] ${ticker.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {ticker.isUp ? '+' : ''}{ticker.change}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
            <Database className="w-2.5 h-2.5" />
            MONGODB: CONNECTED // 27017
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">FASTAPI MOTOR</span>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <button 
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Cyber Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-sm hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search contracts, tokens, tx hashes..." 
              className="w-full bg-[#0d162b]/80 border border-slate-800/90 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
              ⌘K
            </span>
          </div>
        </div>

        {/* Center / Right: Total Balance Summary Highlight */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Total Balance Summary Box */}
          <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0d182e] to-[#0a1224] border border-cyan-500/20 shadow-[0_0_15px_rgba(0,242,254,0.06)]">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center justify-end gap-1">
                <Wallet className="w-3 h-3 text-cyan-400" />
                Portfolio Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg lg:text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                  ${BALANCE_SUMMARY.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
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
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-[#0d162b] border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0d162b] animate-pulse"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0e172a] border border-cyan-500/20 shadow-2xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 font-mono">QUANT ALERTS</span>
                    <span className="text-[10px] text-cyan-400 font-mono">3 NEW</span>
                  </div>
                  <div className="py-2 space-y-2">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-emerald-500/20">
                      <p className="text-emerald-400 font-semibold">MongoDB Synchronized</p>
                      <p className="text-slate-400 text-[11px]">8 transactions ready in database</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-cyan-500/20">
                      <p className="text-cyan-400 font-semibold">FastAPI Motor Driver Live</p>
                      <p className="text-slate-400 text-[11px]">Async connection pool established</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Auth Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#0d162b] border border-slate-800/90 hover:border-cyan-500/40 transition-all text-left"
              >
                <div className="relative">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0d162b] rounded-full"></span>
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">{profile.name}</span>
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/90 font-medium">
                    {profile.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e172a] border border-slate-800 shadow-2xl p-3 z-50 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#141f38] mb-2">
                    <p className="text-slate-100 font-bold">{profile.name}</p>
                    <p className="text-slate-400 text-[10px]">{profile.handle || profile.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-400">
                      <span>{profile.tier || "PRO TERMINAL"}</span>
                      <Shield className="w-3 h-3" />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-cyan-300 hover:bg-cyan-950/40 flex items-center justify-between"
                  >
                    <span>Authenticate / Switch User</span>
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <div className="my-1 border-t border-slate-800"></div>

                  <div className="p-2 text-[10px] text-slate-400 bg-[#080d1a] rounded-lg border border-slate-800 mb-2">
                    <span className="text-slate-500 block">DATABASE BACKEND:</span>
                    <span className="text-emerald-400 font-bold block">MongoDB (local:27017)</span>
                    <span className="text-slate-400 block">Collections: users, transactions</span>
                  </div>

                  <button 
                    onClick={() => {
                      localStorage.removeItem('aether_token');
                      localStorage.removeItem('aether_user');
                      window.location.reload();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-mono"
                  >
                    Reset Session
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
