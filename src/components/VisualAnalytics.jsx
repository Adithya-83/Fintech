import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon, 
  Activity, 
  Calendar, 
  RefreshCw, 
  DollarSign, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  Download,
  Check
} from 'lucide-react';
import { fetchTransactions } from '../services/api';
import { RECENT_TRANSACTIONS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { downloadTransactionsCSV } from '../utils/csvExport';

// Helper to parse currency or amount strings (e.g. "$12,052.50" or "+0.125 BTC" or 12000)
function parseUSD(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Format number to clean USD string
function formatUSD(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Format compact currency for chart axis ($12K, $1.5M)
function formatCompactUSD(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
}

// Custom Tooltip for Pie Chart
function CustomPieTooltip({ active, payload, isDark }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const item = data.payload;
    return (
      <div className={`p-3 rounded-xl border font-mono text-xs z-50 backdrop-blur-md shadow-xl ${
        isDark 
          ? 'bg-[#090e1b]/95 border-cyan-500/40 text-slate-100 shadow-[0_0_20px_rgba(0,242,254,0.2)]' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
      }`}>
        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-200 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-bold tracking-wider">{item.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
            <span>Amount:</span>
            <span className="font-bold text-slate-900 dark:text-cyan-300">
              {formatUSD(item.value)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
            <span>Share:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {item.percentage}%
            </span>
          </div>
          {item.count !== undefined && (
            <div className="flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
              <span>Orders:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {item.count}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Line Chart
function CustomLineTooltip({ active, payload, label, isDark }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`p-3.5 rounded-xl border font-mono text-xs z-50 backdrop-blur-md shadow-xl min-w-[210px] ${
        isDark 
          ? 'bg-[#090e1b]/95 border-cyan-500/40 text-slate-100 shadow-[0_0_25px_rgba(0,242,254,0.25)]' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-500" />
            {label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
            {data.count || 1} TX{data.count > 1 ? 'S' : ''}
          </span>
        </div>

        <div className="space-y-1.5">
          {data.income !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Inflows (Income):
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{formatUSD(data.income)}
              </span>
            </div>
          )}

          {data.expense !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Outflows (Expenses):
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                -{formatUSD(data.expense)}
              </span>
            </div>
          )}

          {data.volume !== undefined && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Total Volume:</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-300">
                {formatUSD(data.volume)}
              </span>
            </div>
          )}

          {data.net !== undefined && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Net Flow:</span>
              <span className={`font-bold flex items-center gap-0.5 ${
                data.net >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {data.net >= 0 ? '+' : ''}{formatUSD(data.net)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default function VisualAnalytics({ refreshTrigger }) {
  const { isDark } = useTheme();
  const [rawTransactions, setRawTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieMode, setPieMode] = useState('income_expense'); // 'income_expense' | 'by_type'
  const [lineMode, setLineMode] = useState('dual'); // 'dual' | 'volume' | 'net'
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const handleExportCSV = () => {
    const records = rawTransactions.length > 0 ? rawTransactions : RECENT_TRANSACTIONS;
    const ok = downloadTransactionsCSV(records, 'aether_statement.csv');
    if (ok) {
      setIsExported(true);
      setTimeout(() => setIsExported(false), 2500);
    }
  };

  // Load transactions from backend API
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions('ALL');
      if (Array.isArray(data) && data.length > 0) {
        setRawTransactions(data);
        setIsLiveConnected(true);
      } else {
        setRawTransactions(RECENT_TRANSACTIONS);
        setIsLiveConnected(false);
      }
    } catch {
      // Fallback gracefully to mock data
      setRawTransactions(RECENT_TRANSACTIONS);
      setIsLiveConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  // Compute metrics and chart aggregations from rawTransactions
  const {
    totalIncome,
    totalExpense,
    netFlow,
    totalVolume,
    incomeExpensePieData,
    typePieData,
    timelineData
  } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const typeAgg = {};
    const dateMap = {};

    rawTransactions.forEach((tx) => {
      const amountUSD = parseUSD(tx.amountUSD);
      const feeUSD = parseUSD(tx.fee);
      const type = (tx.type || 'BUY').toUpperCase();

      // Income vs Expense categorization
      // Income / Inflow: SELL (converting asset to cash), STAKING (yield earned), DEPOSIT (cash in)
      // Expense / Outflow: BUY (cash out to acquire asset), TRANSFER (moving cash out), plus transaction fees
      const isIncome = type === 'SELL' || type === 'STAKING' || type === 'DEPOSIT';
      const isExpense = type === 'BUY' || type === 'TRANSFER';

      if (isIncome) {
        inc += amountUSD;
      } else if (isExpense) {
        exp += amountUSD;
      } else {
        // Default treat unknown as buy/expense
        exp += amountUSD;
      }

      if (feeUSD > 0) {
        exp += feeUSD;
      }

      // Type-based aggregation
      if (!typeAgg[type]) {
        typeAgg[type] = { count: 0, total: 0 };
      }
      typeAgg[type].count += 1;
      typeAgg[type].total += amountUSD;

      // Date parsing for timeline line chart
      // Supports "2026-10-16 14:32:08", ISO strings, or simple dates
      let dateKey = 'Recent';
      if (tx.date) {
        try {
          const d = new Date(tx.date.includes(' ') ? tx.date.replace(' ', 'T') : tx.date);
          if (!isNaN(d.getTime())) {
            dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            dateKey = tx.date.split(' ')[0] || 'Recent';
          }
        } catch {
          dateKey = 'Recent';
        }
      }

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
          volume: 0,
          net: 0,
          count: 0,
          rawDate: tx.date || ''
        };
      }
      if (isIncome) {
        dateMap[dateKey].income += amountUSD;
      } else {
        dateMap[dateKey].expense += amountUSD;
      }
      dateMap[dateKey].volume += amountUSD;
      dateMap[dateKey].count += 1;
      dateMap[dateKey].net = dateMap[dateKey].income - dateMap[dateKey].expense;
    });

    const net = inc - exp;
    const vol = inc + exp;

    // Build Income vs Expense Pie Data
    const incExpTotal = inc + exp;
    const incPct = incExpTotal > 0 ? ((inc / incExpTotal) * 100).toFixed(1) : 0;
    const expPct = incExpTotal > 0 ? ((exp / incExpTotal) * 100).toFixed(1) : 0;

    const incExpData = [
      {
        name: 'Inflows / Income',
        value: inc,
        percentage: Number(incPct),
        color: isDark ? '#00ff87' : '#10b981',
        description: 'Deposits, Realized Sells & Staking Yield'
      },
      {
        name: 'Outflows / Expenses',
        value: exp,
        percentage: Number(expPct),
        color: isDark ? '#f43f5e' : '#e11d48',
        description: 'Asset Purchases, Transfers & Protocol Fees'
      }
    ];

    // Build By Type Pie Data
    const typeColors = {
      BUY: isDark ? '#00f2fe' : '#0284c7',
      SELL: isDark ? '#00ff87' : '#059669',
      STAKING: isDark ? '#a855f7' : '#7c3aed',
      DEPOSIT: isDark ? '#38bdf8' : '#2563eb',
      TRANSFER: isDark ? '#94a3b8' : '#64748b'
    };

    const typeData = Object.entries(typeAgg).map(([type, stats]) => {
      const pct = vol > 0 ? ((stats.total / vol) * 100).toFixed(1) : 0;
      return {
        name: `${type} Orders`,
        value: stats.total,
        percentage: Number(pct),
        count: stats.count,
        color: typeColors[type] || '#f59e0b'
      };
    });

    // Build chronological timeline data
    // Convert dateMap to array and sort by rawDate or insertion
    const timeline = Object.values(dateMap).sort((a, b) => {
      const dateA = new Date(a.rawDate || 0).getTime();
      const dateB = new Date(b.rawDate || 0).getTime();
      return dateA - dateB;
    });

    // Compute running cumulative net flow
    let cumulative = 0;
    timeline.forEach((item) => {
      cumulative += item.net;
      item.cumulativeNet = cumulative;
    });

    return {
      totalIncome: inc,
      totalExpense: exp,
      netFlow: net,
      totalVolume: vol,
      incomeExpensePieData: incExpData,
      typePieData: typeData,
      timelineData: timeline
    };
  }, [rawTransactions, isDark]);

  const activePieData = pieMode === 'income_expense' ? incomeExpensePieData : typePieData;

  // Chart theme colors
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const axisTextColor = isDark ? '#94a3b8' : '#64748b';
  const incomeLineColor = isDark ? '#00ff87' : '#10b981';
  const expenseLineColor = isDark ? '#f43f5e' : '#e11d48';
  const volumeLineColor = isDark ? '#00f2fe' : '#0284c7';
  const netLineColor = isDark ? '#a855f7' : '#7c3aed';

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Realtime Status & Manual Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/15 to-emerald-500/15 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400 shadow-glow-cyan">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                Visual Analytics & Cash Flow
              </h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isLiveConnected 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
              }`}>
                <Database className="w-2.5 h-2.5" />
                {isLiveConnected ? 'LIVE MONGO SYNC' : 'QUANT CACHE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Recharts visual intelligence generated from {rawTransactions.length} transaction records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0c1427] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all disabled:opacity-50"
            title="Refresh transaction data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 border shadow-sm ${
              isExported
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-glow-emerald'
                : 'bg-slate-100 dark:bg-[#0c1427] border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
            title="Download full transactions statement as CSV (aether_statement.csv)"
          >
            {isExported ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Download Statement (CSV)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflows (Income) */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#090e1d]/80 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Total Inflow
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              INCOME
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {formatUSD(totalIncome)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Realized sales, staking & deposits
          </div>
        </div>

        {/* Total Outflows (Expenses) */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#090e1d]/80 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Total Outflow
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-bold">
              EXPENSES
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {formatUSD(totalExpense)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Asset purchases & network fees
          </div>
        </div>

        {/* Net Flow */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#090e1d]/80 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-cyan-500" /> Net Cash Flow
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
              netFlow >= 0 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' 
                : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
            }`}>
              {netFlow >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {netFlow >= 0 ? 'SURPLUS' : 'DEFICIT'}
            </span>
          </div>
          <div className={`text-xl font-bold font-mono ${
            netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {netFlow >= 0 ? '+' : ''}{formatUSD(netFlow)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Net capital balance trajectory
          </div>
        </div>

        {/* Total Turnover Volume */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#090e1d]/80 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500" /> Turnover Volume
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold">
              {rawTransactions.length} TRADES
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {formatUSD(totalVolume)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Gross liquidity transferred
          </div>
        </div>
      </div>

      {/* 3. Main Visual Charts Grid: Pie Chart (Left) + Line Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pie Chart (Income vs Expenses / Category Breakdown) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col justify-between transition-colors">
          <div>
            {/* Header with Switcher */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Cash Flow Breakdown
                </h3>
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setPieMode('income_expense')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    pieMode === 'income_expense'
                      ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  In vs Out
                </button>
                <button
                  onClick={() => setPieMode('by_type')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    pieMode === 'by_type'
                      ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  By Type
                </button>
              </div>
            </div>

            {/* Donut Chart with Centered Metric */}
            <div className="relative w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
                  <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    animationDuration={800}
                  >
                    {activePieData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={entry.color}
                        stroke={activePieIndex === index ? (isDark ? '#00f2fe' : '#0f172a') : 'transparent'}
                        strokeWidth={2}
                        className="transition-all duration-300 cursor-pointer hover:opacity-90"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {pieMode === 'income_expense' ? 'Net Balance' : 'Total Flow'}
                </span>
                <span className={`text-base font-extrabold font-mono tracking-tight ${
                  pieMode === 'income_expense'
                    ? netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-900 dark:text-cyan-300'
                }`}>
                  {pieMode === 'income_expense' 
                    ? `${netFlow >= 0 ? '+' : ''}${formatUSD(netFlow)}` 
                    : formatUSD(totalVolume)
                  }
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {pieMode === 'income_expense' ? 'Income vs Expense' : `${rawTransactions.length} Orders`}
                </span>
              </div>
            </div>

            {/* Custom Interactive Legend / Breakdown List */}
            <div className="mt-4 space-y-2">
              {activePieData.map((item, index) => (
                <div
                  key={item.name}
                  onMouseEnter={() => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                    activePieIndex === index
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/40 shadow-sm'
                      : 'bg-slate-50 dark:bg-[#070b14]/60 border-slate-100 dark:border-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-md transition-transform"
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: isDark ? `0 0 8px ${item.color}80` : 'none'
                      }}
                    />
                    <div>
                      <div className="text-xs font-semibold font-mono text-slate-900 dark:text-slate-100">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {formatUSD(item.value)}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-cyan-400">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Line Chart (Transaction History Over Time) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col justify-between transition-colors">
          <div>
            {/* Header with Line Mode Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Transaction History Over Time
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Historical cash flow curves by settlement date
                  </span>
                </div>
              </div>

              {/* Line Mode Selector */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs font-mono self-start sm:self-auto">
                <button
                  onClick={() => setLineMode('dual')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineMode === 'dual'
                      ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Dual Flow
                </button>
                <button
                  onClick={() => setLineMode('volume')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineMode === 'volume'
                      ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setLineMode('net')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineMode === 'net'
                      ? 'bg-white dark:bg-cyan-500/20 text-slate-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Net Trajectory
                </button>
              </div>
            </div>

            {/* Line Chart Area */}
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={timelineData}
                  margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor} 
                    vertical={false} 
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke={axisTextColor} 
                    tick={{ fill: axisTextColor, fontSize: 11, fontFamily: 'monospace' }}
                    tickLine={{ stroke: gridColor }}
                    axisLine={{ stroke: gridColor }}
                  />
                  <YAxis 
                    stroke={axisTextColor} 
                    tick={{ fill: axisTextColor, fontSize: 11, fontFamily: 'monospace' }}
                    tickLine={{ stroke: gridColor }}
                    axisLine={{ stroke: gridColor }}
                    tickFormatter={formatCompactUSD}
                  />
                  <Tooltip content={<CustomLineTooltip isDark={isDark} />} />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: 14, 
                      fontSize: 11, 
                      fontFamily: 'monospace' 
                    }} 
                  />

                  {/* Dual Mode: Inflow and Outflow Lines */}
                  {lineMode === 'dual' && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Inflows (Income)"
                        stroke={incomeLineColor}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: incomeLineColor, strokeWidth: 1.5, stroke: isDark ? '#090e1d' : '#ffffff' }}
                        activeDot={{ r: 6, fill: incomeLineColor, stroke: isDark ? '#00f2fe' : '#0f172a', strokeWidth: 2 }}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        name="Outflows (Expenses)"
                        stroke={expenseLineColor}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: expenseLineColor, strokeWidth: 1.5, stroke: isDark ? '#090e1d' : '#ffffff' }}
                        activeDot={{ r: 6, fill: expenseLineColor, stroke: isDark ? '#f43f5e' : '#0f172a', strokeWidth: 2 }}
                        animationDuration={1000}
                      />
                    </>
                  )}

                  {/* Total Volume Mode */}
                  {lineMode === 'volume' && (
                    <Line
                      type="monotone"
                      dataKey="volume"
                      name="Daily Trading Volume"
                      stroke={volumeLineColor}
                      strokeWidth={3}
                      dot={{ r: 4, fill: volumeLineColor, strokeWidth: 1.5, stroke: isDark ? '#090e1d' : '#ffffff' }}
                      activeDot={{ r: 7, fill: volumeLineColor, stroke: '#ffffff', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                  )}

                  {/* Net Trajectory Mode */}
                  {lineMode === 'net' && (
                    <Line
                      type="monotone"
                      dataKey="cumulativeNet"
                      name="Cumulative Net Cash Flow"
                      stroke={netLineColor}
                      strokeWidth={3}
                      dot={{ r: 4, fill: netLineColor, strokeWidth: 1.5, stroke: isDark ? '#090e1d' : '#ffffff' }}
                      activeDot={{ r: 7, fill: netLineColor, stroke: '#ffffff', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Status Ticker */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-sync on Quick Trade execution
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                <span className="hidden sm:inline">
                  Timeline spans {timelineData.length} active settlement dates
                </span>
              </div>
              <div className="text-right">
                <span>Avg Daily Turnover: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatUSD(timelineData.length > 0 ? totalVolume / timelineData.length : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
