import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  RefreshCw, 
  Search, 
  UserCheck, 
  UserX, 
  Lock, 
  Key, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  CartesianGrid
} from 'recharts';
import { fetchAdminStats, updateUserRole } from '../services/api';

const TYPE_COLORS = {
  BUY: '#10b981',      // Emerald
  SELL: '#f43f5e',     // Rose
  STAKING: '#06b6d4',  // Cyan
  DEPOSIT: '#3b82f6',  // Blue
  TRANSFER: '#8b5cf6', // Purple
  SWAP: '#f59e0b',     // Amber
};

export default function AdminDashboard({ currentUser, onNavigate }) {
  const isAdmin = currentUser?.role === 'admin';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadPlatformStats = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
      if (data?.recentUsers) {
        setUsersList(data.recentUsers);
      }
    } catch (err) {
      setError(err.message || "Failed to load platform-wide admin analytics");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadPlatformStats();
    }
  }, [isAdmin, loadPlatformStats]);

  // Handle promoting / demoting users
  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user.id);
    setActionSuccess(null);
    setError(null);

    try {
      await updateUserRole(user.id, newRole);
      setActionSuccess(`User ${user.email} role updated to "${newRole.toUpperCase()}".`);
      // Update local state
      setUsersList((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      // Reload overall platform stats
      loadPlatformStats();
    } catch (err) {
      setError(err.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // CSV Export for Platform Analytics
  const handleExportCSV = () => {
    if (!stats) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Users", stats.totalUsers],
      ["Total Transactions", stats.totalTransactions],
      ["Total Volume (USD)", stats.totalVolumeUSD],
      ["Average Order Value", stats.avgTransactionValue],
      ["Active Users (24h)", stats.activeUsers24h],
      ["RBAC Security Protocol", "PyJWT HS256 / Role Protected"],
      [],
      ["Transaction Type", "Aggregated Volume (USD)", "Count"],
    ];

    Object.entries(stats.volumeByType || {}).forEach(([t, vol]) => {
      rows.push([t, vol, stats.countByType?.[t] || 0]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aether_platform_admin_analytics_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Strict Access Guard: If not admin, render 403 Forbidden Access Denied screen
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[650px] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-900 border border-rose-500/60">
            <Lock className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30 uppercase mb-3">
          SECURITY PROTOCOL // HTTP 403 FORBIDDEN
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          ADMIN CLEARANCE REQUIRED
        </h2>

        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400 font-mono mb-6 leading-relaxed">
          Access to Platform-Wide Telemetry and Role Governance is restricted strictly to accounts with the <code className="text-rose-500 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">'admin'</code> role. 
          Your current session is authenticated as <span className="text-cyan-600 dark:text-cyan-400 font-bold">'{currentUser?.role || 'user'}'</span>.
        </p>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1324] border border-slate-200 dark:border-slate-800 text-left font-mono text-xs max-w-md w-full mb-6 space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>Attempted Resource:</span>
            <span className="text-slate-800 dark:text-slate-200">GET /api/admin/stats</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Required Role Claim:</span>
            <span className="text-amber-500 font-bold">role: "admin"</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Enforcement Strategy:</span>
            <span className="text-emerald-500 font-bold">PyJWT Bearer + FastAPI Depends</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Quant Terminal</span>
          </button>
        </div>
      </div>
    );
  }

  // Transform volume by type for Recharts
  const chartData = stats?.volumeByType
    ? Object.entries(stats.volumeByType).map(([type, volume]) => ({
        type,
        volume,
        count: stats.countByType?.[type] || 0,
        color: TYPE_COLORS[type] || '#06b6d4'
      }))
    : [];

  const filteredUsers = usersList.filter((u) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-[#0c162d] dark:via-[#091124] dark:to-[#070d1c] border border-slate-200 dark:border-amber-500/30 shadow-lg dark:shadow-[0_0_35px_rgba(245,158,11,0.08)] relative overflow-hidden transition-all">
        {/* Amber accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500" />

        <div className="flex items-start gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-500 shadow-glow-amber">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                Platform Admin Terminal
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold uppercase">
                RBAC ROOT ACCESS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                TIER 5 CLEARANCE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              Live platform-wide transaction analytics, system telemetry & user role governance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={loading || !stats}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
            title="Export CSV Audit"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit CSV</span>
          </button>

          <button
            onClick={loadPlatformStats}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono text-xs font-bold shadow-glow-amber transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Syncing..." : "Sync Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Core Platform-Wide Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-cyan-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Total Platform Users
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {loading ? "..." : (stats?.totalUsers ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              +{stats?.activeUsers24h ?? 1} active
            </span>
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Registered accounts across all security tiers
          </p>
        </div>

        {/* Total Platform Transaction Volume */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-amber-500/30 shadow-sm transition-all hover:border-amber-500/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Platform-Wide Volume
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              {loading ? "..." : (stats?.formattedTotalVolume || "$0.00")}
            </span>
            <span className="text-[11px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              USD Live
            </span>
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Aggregated institutional capital executed
          </p>
        </div>

        {/* Total Transactions Processed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Total Executed Orders
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {loading ? "..." : (stats?.totalTransactions ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              99.9% Success
            </span>
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Cryptographic ledger entries in MongoDB
          </p>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-purple-500/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Average Order Value
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {loading ? "..." : `$${(stats?.avgTransactionValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <span className="text-[11px] font-mono text-purple-500 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              Institutional
            </span>
          </div>
          <p className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            Mean order volume per transaction
          </p>
        </div>
      </div>

      {/* 2. Platform-wide Visual Chart Section: Volume by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart: Platform Volume By Type (Takes 2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold font-mono text-slate-900 dark:text-slate-100 text-sm uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Platform Volume by Transaction Type
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Aggregated USD flow across all trader operations
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              AGGREGATED TELEMETRY
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="type" 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155', opacity: 0.4 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155', opacity: 0.4 }}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl font-mono text-xs text-white">
                          <p className="font-bold text-amber-400 mb-1">{data.type} ORDERS</p>
                          <p className="text-slate-200">Volume: <span className="font-bold">${data.volume.toLocaleString()}</span></p>
                          <p className="text-slate-400 text-[11px]">Count: {data.count} transactions</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security & RBAC Node Telemetry (Takes 1 col) */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 uppercase text-sm">
                RBAC Security Status
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-600 dark:text-slate-400">Role Enforcement</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  STRICT (403)
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-600 dark:text-slate-400">Token Standard</span>
                <span className="text-cyan-500 font-bold">PyJWT HS256</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-600 dark:text-slate-400">Admin Endpoint</span>
                <span className="text-amber-500 font-bold truncate max-w-[150px]">/api/admin/stats</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-600 dark:text-slate-400">Database Driver</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">Motor (AsyncIO)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-600 dark:text-slate-400">Active Admin</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[130px]">
                  {currentUser?.email || "admin@aether.io"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
            <span className="font-bold uppercase block mb-0.5">Policy Notice</span>
            Only accounts possessing the 'admin' role can query platform-wide aggregation and promote other traders.
          </div>
        </div>
      </div>

      {/* 3. Platform User Governance & RBAC Management Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1427]/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold font-mono text-slate-900 dark:text-slate-100 text-sm uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              Platform User Governance & Role Management
            </h3>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Inspect registered accounts and govern role-based access permissions
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter users or roles..."
              className="w-full bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] uppercase">
                <th className="pb-3 font-semibold">User / Handle</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role (RBAC)</th>
                <th className="pb-3 font-semibold">Security Tier</th>
                <th className="pb-3 font-semibold text-right">Action / Govern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No users matching search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isUserAdmin = user.role === 'admin';
                  const isCurrent = user.email === currentUser?.email;

                  return (
                    <tr key={user.id || user.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.handle || `@${user.email?.split('@')[0]}`}</div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {user.email}
                      </td>
                      <td className="py-3">
                        {isUserAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                            <Users className="w-3 h-3" />
                            USER
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        {user.tier || (isUserAdmin ? "ADMIN ACCESS" : "PRO TERMINAL")}
                      </td>
                      <td className="py-3 text-right">
                        {isCurrent ? (
                          <span className="text-[10px] text-slate-400 italic px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/60">
                            Current Active Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRoleToggle(user)}
                            disabled={updatingId === user.id}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all inline-flex items-center gap-1 ${
                              isUserAdmin
                                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                            }`}
                          >
                            {updatingId === user.id ? (
                              <span>Updating...</span>
                            ) : isUserAdmin ? (
                              <>
                                <UserX className="w-3 h-3" />
                                <span>Demote to User</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                <span>Promote to Admin</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
