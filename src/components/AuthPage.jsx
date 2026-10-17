import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Cpu, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { loginUser, signupUser } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage({ onLoginSuccess }) {
  const { isDark, toggleTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Lead Quant Trader');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Quick fill helper for testing demo credentials
  const handleQuickDemo = () => {
    setEmail('testquant@aether.io');
    setPassword('strongpassword123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let result;
      if (isSignUp) {
        result = await signupUser({
          email,
          password,
          name: name || 'Quant Trader',
          role: role || 'Lead Quant Trader',
        });
        setSuccessMessage("Account created & authenticated! Redirecting to Dashboard...");
      } else {
        result = await loginUser(email, password);
        setSuccessMessage("Authentication verified! Launching Quant Terminal...");
      }

      // Smooth transition to Dashboard
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(result.user, result.access_token);
        }
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c15] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200">
      {/* Background ambient glowing spheres */}
      <div className="fixed top-[-10%] left-[15%] w-[550px] h-[550px] bg-cyan-600/10 dark:bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-emerald-600/10 dark:bg-emerald-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-[#0d162b] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 shadow-sm transition-all flex items-center gap-2 text-xs font-mono"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        {/* Terminal Logo Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 shadow-glow-cyan mb-3">
            <Cpu className="w-7 h-7 text-cyan-500 dark:text-cyan-400 animate-pulse-slow" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">
            AETHER // CAPITAL
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-widest mt-1 uppercase">
            Quant Investment Terminal • Secure Gateway
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1120]/90 border border-slate-200 dark:border-cyan-500/30 shadow-xl dark:shadow-[0_0_50px_rgba(0,242,254,0.15)] backdrop-blur-xl relative transition-colors">
          {/* Status Header Badge (Sanitized: No DB or ports) */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">TERMINAL STATUS:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-cyan-950 text-emerald-600 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-800/60 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              TLS 1.3 SECURE
            </span>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 rounded-xl font-bold transition-all duration-200 ${
                !isSignUp 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-glow-cyan' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 rounded-xl font-bold transition-all duration-200 ${
                isSignUp 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-glow-cyan' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {isSignUp && (
              <>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-semibold">
                    Full Name / Handle
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-semibold">
                    Trader Specialization / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Quant Trader, Algorithmic Specialist"
                    className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-[11px]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase block mb-1 font-semibold">
                Trader Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@aether.quant"
                  className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 dark:text-slate-400 text-[10px] uppercase font-semibold">
                  Master Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 transition-colors"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Quick Fill Demo</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-glow-cyan hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Secure Session...</span>
              ) : (
                <>
                  <span>{isSignUp ? "INITIALIZE QUANT ACCOUNT" : "AUTHENTICATE & ENTER TERMINAL"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Help Banner */}
          {!isSignUp && (
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-[#070d1a] border border-slate-200 dark:border-slate-800/80 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Demo Login:</span>
              <code className="text-cyan-600 dark:text-cyan-300 font-bold">testquant@aether.io / strongpassword123</code>
            </div>
          )}

          {/* Security Architecture Footnote (Sanitized) */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500">
            <div className="p-1 rounded bg-slate-100 dark:bg-[#060a14]">
              <span className="text-slate-700 dark:text-slate-400 block font-bold">CRYPTOGRAPHY</span>
              <span>256-Bit Salt</span>
            </div>
            <div className="p-1 rounded bg-slate-100 dark:bg-[#060a14]">
              <span className="text-slate-700 dark:text-slate-400 block font-bold">JWT TOKENS</span>
              <span>Bearer Auth</span>
            </div>
            <div className="p-1 rounded bg-slate-100 dark:bg-[#060a14]">
              <span className="text-slate-700 dark:text-slate-400 block font-bold">ENCRYPTION</span>
              <span>Multi-Sig</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
