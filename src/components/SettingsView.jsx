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
  Database,
  Copy,
  ExternalLink
} from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';

export default function SettingsView() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [accentColor, setAccentColor] = useState('cyan');
  const [saved, setSaved] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  const mongoUri = "mongodb://localhost:27017";
  const databaseName = "fintech_db";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(mongoUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1427]/90 to-[#090e1d]/90 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold font-mono text-slate-100">
            Terminal Configuration & Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Manage your algorithmic trading parameters, MongoDB connection string, and theme preferences.
        </p>
      </div>

      {/* Prominent MongoDB Compass Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1c38] via-[#0b152b] to-[#071022] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-glow-cyan">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">MongoDB Database & Compass Configuration</h3>
              <p className="text-[11px] text-slate-400">FastAPI backend connected via <span className="text-cyan-300">motor</span> async driver</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE // PORT 27017
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-400 text-[10px] uppercase block">
              MongoDB Compass Connection String:
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060a14] border border-slate-800 text-cyan-300 font-bold">
              <span className="flex-1 truncate">{mongoUri}</span>
              <button
                onClick={handleCopyUri}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Copy connection string"
              >
                {copiedUri ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Paste this in <strong className="text-slate-200">MongoDB Compass</strong> to view collections.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-[#060a14] border border-slate-800 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Database Name:</span>
              <span className="text-emerald-400 font-bold">{databaseName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Collections:</span>
              <span className="text-cyan-300 font-bold">users, transactions</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Python Driver:</span>
              <span className="text-slate-200">motor (AsyncIOMotorClient)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">FastAPI API Docs:</span>
              <a 
                href="http://127.0.0.1:8000/docs" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                http://localhost:8000/docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Security & 2FA */}
        <div className="p-6 rounded-2xl bg-[#0c1427]/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-200 uppercase">Cryptographic Security</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d1a] border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Hardware Key (YubiKey)</span>
                <span className="text-[10px] text-slate-400">WebAuthn FIDO2 active</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d1a] border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">IP Whitelist Enforcement</span>
                <span className="text-[10px] text-slate-400">Only authorized VPC nodes</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080d1a] border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Auto-Lock Session</span>
                <span className="text-[10px] text-slate-400">Lock after 15m idle</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-2xl bg-[#0c1427]/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-200 uppercase">High-Frequency API Key</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Live Trading API Key</label>
              <div className="relative">
                <input 
                  type={apiKeyVisible ? "text" : "password"} 
                  readOnly 
                  value="aeth_live_99f2b841a0e719c84918e7d23a54b9" 
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-slate-300 pr-10 font-mono"
                />
                <button 
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                >
                  {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-slate-300 space-y-1">
              <span className="text-cyan-400 font-bold block">Rate Limits:</span>
              <p>5,000 requests/sec • Sub-millisecond direct memory routing enabled.</p>
            </div>
          </div>
        </div>

        {/* Theme Accents */}
        <div className="p-6 rounded-2xl bg-[#0c1427]/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Terminal className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-slate-200 uppercase">Pro Cyber Theme Customization</h3>
          </div>

          <div>
            <label className="text-slate-400 block mb-2">Neon Accent Glow Profile</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAccentColor('cyan')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  accentColor === 'cyan' 
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-glow-cyan' 
                    : 'border-slate-800 bg-[#080d1a] text-slate-400'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-cyan-400 mx-auto mb-1.5 shadow-[0_0_8px_#00f2fe]" />
                <span>Cyber Cyan</span>
              </button>

              <button
                onClick={() => setAccentColor('green')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  accentColor === 'green' 
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-glow-green' 
                    : 'border-slate-800 bg-[#080d1a] text-slate-400'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-400 mx-auto mb-1.5 shadow-[0_0_8px_#00ff87]" />
                <span>Matrix Green</span>
              </button>

              <button
                onClick={() => setAccentColor('purple')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  accentColor === 'purple' 
                    ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-[0_0_8px_#a855f7]' 
                    : 'border-slate-800 bg-[#080d1a] text-slate-400'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-purple-400 mx-auto mb-1.5 shadow-[0_0_8px_#a855f7]" />
                <span>Synth Purple</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quant Engine Settings */}
        <div className="p-6 rounded-2xl bg-[#0c1427]/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-200 uppercase">Quant Execution Engine</h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block mb-1">Max Slippage Tolerance</span>
              <div className="flex gap-2">
                {['0.05%', '0.1%', '0.5%', 'Custom'].map((val) => (
                  <button 
                    key={val}
                    className="flex-1 py-1.5 rounded-lg bg-[#080d1a] border border-slate-800 hover:border-cyan-500/50 text-slate-300 text-center"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-glow-cyan"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Settings Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
