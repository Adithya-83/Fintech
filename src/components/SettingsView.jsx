import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Terminal, 
  Cpu, 
  Eye, 
  EyeOff, 
  Check, 
  Save, 
  Sliders, 
  Bell, 
  Globe, 
  User, 
  Lock,
  Sun,
  Moon,
  Clock,
  Sparkles
} from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function SettingsView() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [accentColor, setAccentColor] = useState('cyan');
  const [saved, setSaved] = useState(false);

  // User Preference States
  const [currency, setCurrency] = useState('USD');
  const [timeframe, setTimeframe] = useState('6M');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15m');
  const [notifyExecution, setNotifyExecution] = useState(true);
  const [notifyVolatility, setNotifyVolatility] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(false);

  // Profile States
  const [traderName, setTraderName] = useState(USER_PROFILE.name);
  const [traderHandle, setTraderHandle] = useState(USER_PROFILE.handle);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-none transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
          <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            Terminal Configuration & User Preferences
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Customize your trading environment, display preferences, notifications, and security keys.
        </p>
      </div>

      {/* Replaced Space: Standard User Preferences Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0d162a]/95 dark:to-[#090e1d]/95 border border-slate-200 dark:border-cyan-500/30 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono text-xs transition-colors">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">General User Preferences</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Personalize display currency, default charting, and privacy</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            AUTO-SYNCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              Base Display Currency
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { code: 'USD', symbol: '$' },
                { code: 'EUR', symbol: '€' },
                { code: 'GBP', symbol: '£' },
                { code: 'JPY', symbol: '¥' },
                { code: 'BTC', symbol: '₿' },
                { code: 'ETH', symbol: 'Ξ' },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`p-2 rounded-xl border font-bold text-center transition-all ${
                    currency === c.code
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-sm">{c.symbol}</span>
                  <span className="text-[10px]">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Chart Timeframe */}
          <div className="space-y-2">
            <label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              Default Chart Horizon
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`p-2 rounded-xl border font-bold text-center transition-all ${
                    timeframe === tf
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d1a] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {tf} Horizon
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Theme Fast Switch */}
          <div className="space-y-2.5">
            <label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Display & Privacy Options
            </label>

            {/* Privacy Mask Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">Privacy Mode</span>
                <span className="text-[10px] text-slate-500">Mask balance values ($ ••••)</span>
              </div>
              <input 
                type="checkbox" 
                checked={privacyMode} 
                onChange={(e) => setPrivacyMode(e.target.checked)} 
                className="w-4 h-4 accent-cyan-500 cursor-pointer" 
              />
            </div>

            {/* Dark / Light Mode Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">Theme Mode</span>
                  <span className="text-[10px] text-slate-500">Current: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Switch to {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Notifications & Quant Alerts */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Bell className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase">Alerts & Notifications</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Trade Execution Alerts</span>
                <span className="text-[10px] text-slate-500">Push notifications on order settlement</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyExecution} 
                onChange={(e) => setNotifyExecution(e.target.checked)} 
                className="accent-cyan-500 w-4 h-4 cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Volatility Spike Warnings</span>
                <span className="text-[10px] text-slate-500">Alerts for asset movements {'>'} 3%</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyVolatility} 
                onChange={(e) => setNotifyVolatility(e.target.checked)} 
                className="accent-cyan-500 w-4 h-4 cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Weekly Portfolio Audit Digest</span>
                <span className="text-[10px] text-slate-500">Sharpe ratio & P&L executive report</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyDigest} 
                onChange={(e) => setNotifyDigest(e.target.checked)} 
                className="accent-cyan-500 w-4 h-4 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Cryptographic Security & FIDO2 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase">Cryptographic Security</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Hardware Key (YubiKey)</span>
                <span className="text-[10px] text-slate-500">WebAuthn FIDO2 active</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Lock Session Idle</span>
                <span className="text-[10px] text-slate-500">Timeout threshold: {sessionTimeout}</span>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                <option value="5m">5 mins</option>
                <option value="15m">15 mins</option>
                <option value="30m">30 mins</option>
                <option value="1h">1 hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">256-Bit JWT Session Token</span>
                <span className="text-[10px] text-slate-500">Encrypted token stored securely</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* High-Frequency API Key */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Key className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase">Live Trading API Key</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-500 dark:text-slate-400 block mb-1">Restricted API Key (Read/Trade)</label>
              <div className="relative">
                <input 
                  type={apiKeyVisible ? "text" : "password"} 
                  readOnly 
                  value="aeth_live_99f2b841a0e719c84918e7d23a54b9" 
                  className="w-full bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 pr-10 font-mono"
                />
                <button 
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500"
                >
                  {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-cyan-950/20 border border-slate-200 dark:border-cyan-800/40 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold block">Execution Rate Limit:</span>
              <p>5,000 requests/sec • Sub-millisecond direct memory routing enabled.</p>
            </div>
          </div>
        </div>

        {/* Quant Execution Engine & Save */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Cpu className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase">Quant Execution Parameters</h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Max Slippage Tolerance</span>
              <div className="flex gap-2">
                {['0.05%', '0.1%', '0.5%', 'Custom'].map((val) => (
                  <button 
                    key={val}
                    className="flex-1 py-1.5 rounded-lg bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 text-center font-bold"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-glow-cyan hover:opacity-95 transition-all"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
