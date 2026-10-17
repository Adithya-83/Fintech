import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('testquant@aether.io');
  const [password, setPassword] = useState('strongpassword123');
  const [name, setName] = useState('Alex Vance');
  const [role, setRole] = useState('Lead Quant Trader');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let data;
      if (isRegister) {
        data = await registerUser({
          email,
          password,
          name,
          role,
        });
        setSuccess("Account registered! Session authenticated.");
      } else {
        data = await loginUser(email, password);
        setSuccess("Authentication verified! Session active.");
      }

      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#0e172a] dark:to-[#080d1a] border border-slate-200 dark:border-cyan-500/40 shadow-2xl dark:shadow-[0_0_50px_rgba(0,242,254,0.25)] font-mono text-xs relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {isRegister ? "QUANT ACCOUNT REGISTRATION" : "TERMINAL AUTHENTICATION"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Badge (Sanitized: No DB or URLs) */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-100 dark:bg-cyan-950/30 border border-slate-200 dark:border-cyan-800/40 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-slate-700 dark:text-cyan-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Multi-Sig Protocol</span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE SESSION</span>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Trader Name"
                    className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-bold">Trader Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Quant Trader, High-Frequency Specialist"
                  className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@aether.quant"
                className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-9 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-glow-cyan hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>{isRegister ? "CREATE QUANT ACCOUNT" : "SIGN IN TO TERMINAL"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-[11px]">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button 
                onClick={() => { setIsRegister(false); setError(null); }}
                className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button 
                onClick={() => { setIsRegister(true); setError(null); }}
                className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
              >
                Register
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
