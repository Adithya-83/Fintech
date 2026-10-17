import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  ArrowUpRight
} from 'lucide-react';
import { PORTFOLIO_GROWTH_DATA } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

// Custom cyber tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const balance = payload[0].value;
    const benchmark = data.benchmark;
    const alpha = balance - benchmark;

    return (
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#090e1b]/95 border border-slate-200 dark:border-cyan-500/40 shadow-xl dark:shadow-[0_0_25px_rgba(0,242,254,0.25)] backdrop-blur-xl font-mono text-xs z-50 min-w-[210px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-bold">
            <Calendar className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            {label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
            CONFIRMED
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Portfolio Value:</span>
            <span className="font-bold text-slate-900 dark:text-cyan-300 text-sm">
              ${balance.toLocaleString()}
            </span>
          </div>

          {benchmark && (
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Benchmark (SPX):</span>
              <span className="text-slate-700 dark:text-slate-300">${benchmark.toLocaleString()}</span>
            </div>
          )}

          {data.profit && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Alpha Over Index:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +${Math.abs(alpha).toLocaleString()}
              </span>
            </div>
          )}

          {data.btc && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>BTC Reference:</span>
              <span className="text-amber-500 font-bold">${data.btc.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function PortfolioChart() {
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState('6M');
  const [chartMode, setChartMode] = useState('both'); // 'portfolio', 'both'
  const timeframes = ['1M', '3M', '6M', '1Y', 'ALL'];

  const chartData = PORTFOLIO_GROWTH_DATA[timeframe] || PORTFOLIO_GROWTH_DATA['6M'];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden transition-colors">
      {/* Background neon grid lines */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Header section with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wide uppercase flex items-center gap-2">
              Portfolio Growth Performance
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-cyan-950 text-emerald-600 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-800/60 font-semibold">
              ORACLE VERIFIED
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-300 dark:via-teal-200 dark:to-emerald-400">
              $75,240.50
            </span>
            <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+39.95% ($21,480.50) 6M Growth</span>
            </div>
          </div>
        </div>

        {/* Timeframe & Display toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              onClick={() => setChartMode('portfolio')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chartMode === 'portfolio' 
                  ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-slate-200 dark:border-cyan-500/30 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Net Value
            </button>
            <button
              onClick={() => setChartMode('both')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chartMode === 'both' 
                  ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-slate-200 dark:border-cyan-500/30 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Vs SPX Index
            </button>
          </div>

          {/* Timeframe pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-all duration-200 font-semibold ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-80 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cyberGradientPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#00ff87" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00ff87" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="cyberGradientBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#1e293b' : '#e2e8f0'} 
              vertical={false} 
              opacity={0.8}
            />

            <XAxis 
              dataKey="date" 
              stroke={isDark ? '#64748b' : '#94a3b8'} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontFamily: 'monospace' }} 
              axisLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
              tickLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
            />

            <YAxis 
              stroke={isDark ? '#64748b' : '#94a3b8'} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11, fontFamily: 'monospace' }} 
              axisLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
              tickLine={{ stroke: isDark ? '#1e293b' : '#e2e8f0' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['dataMin - 3000', 'dataMax + 4000']}
            />

            <Tooltip content={<CustomTooltip />} />

            {chartMode === 'both' && (
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#cyberGradientBenchmark)"
                name="S&P 500 Index"
              />
            )}

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#00f2fe"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#cyberGradientPortfolio)"
              dot={{ r: 4, fill: '#00ff87', stroke: isDark ? '#080c15' : '#ffffff', strokeWidth: 2 }}
              activeDot={{ 
                r: 7, 
                fill: '#00f2fe', 
                stroke: '#ffffff', 
                strokeWidth: 2, 
                className: 'filter drop-shadow-[0_0_12px_#00f2fe]' 
              }}
              name="Aether Portfolio"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Performance Stats */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-bold">6-Month High</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">$78,920.00</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Oct 14, 2026</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-bold">6-Month Low</span>
          <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">$48,150.00</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">May 02, 2026</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-bold">Benchmark Beta</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">0.88 // Balanced</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Alpha: +14.2%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-bold">Automated Hedging</span>
          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">ACTIVE // 100%</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Zero Slippage</span>
        </div>
      </div>
    </div>
  );
}
