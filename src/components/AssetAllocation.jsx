import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { ASSET_ALLOCATION, BALANCE_SUMMARY } from '../data/mockData';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-cyan-500/40 shadow-xl backdrop-blur-md font-mono text-xs z-50">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-bold text-slate-800 dark:text-slate-100">{data.name} ({data.ticker})</span>
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          Allocation: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{data.percentage}%</span>
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          Value: <span className="text-emerald-600 dark:text-emerald-400 font-bold">${data.value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AssetAllocation() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col justify-between transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Asset Allocation
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold">
            5 ASSETS HELD
          </span>
        </div>

        {/* Donut Chart with Center Total */}
        <div className="relative w-full h-52 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={ASSET_ALLOCATION}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {ASSET_ALLOCATION.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="transparent"
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Holdings</span>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-slate-100">
              ${BALANCE_SUMMARY.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% ALLOCATED</span>
          </div>
        </div>

        {/* Asset Breakdown List */}
        <div className="mt-4 space-y-2">
          {ASSET_ALLOCATION.map((asset, index) => {
            const isHovered = activeIndex === index;
            return (
              <div 
                key={asset.ticker}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`
                  flex items-center justify-between p-2 rounded-xl transition-all font-mono text-xs
                  ${isHovered 
                    ? 'bg-slate-100 dark:bg-[#121c33] border border-cyan-500/40' 
                    : 'bg-slate-50 dark:bg-[#080d1a]/60 border border-slate-200 dark:border-slate-800/60'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{asset.name}</span>
                    <span className="text-[10px] text-slate-500">{asset.category} • {asset.ticker}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">${asset.value.toLocaleString()}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-cyan-300 font-bold">
                      {asset.percentage}%
                    </span>
                  </div>
                  <span className={`text-[10px] flex items-center justify-end gap-0.5 ${asset.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {asset.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rebalance Advice Banner */}
      <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-[#090f20] border border-slate-200 dark:border-cyan-500/20 text-[11px] font-mono flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400">Rebalance Target:</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-semibold cursor-pointer hover:underline">
          AUTO-REBALANCE READY
        </span>
      </div>
    </div>
  );
}
