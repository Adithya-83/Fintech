import React from 'react';
import { 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus
} from 'lucide-react';
import { ASSET_ALLOCATION } from '../data/mockData';

export default function PortfolioView({ onOpenTrade }) {
  const assetsWithDetails = [
    { ...ASSET_ALLOCATION[0], holdings: "0.2653 BTC", avgBuy: "$68,400.00", pnl: "+$7,420.50", pnlPct: "+40.9%", yieldApy: "-" },
    { ...ASSET_ALLOCATION[1], holdings: "5.6120 ETH", avgBuy: "$2,850.00", pnl: "+$3,568.20", pnlPct: "+22.3%", yieldApy: "4.8% (Staked)" },
    { ...ASSET_ALLOCATION[2], holdings: "94.84 Shares", avgBuy: "$118.20", pnl: "+$2,333.10", pnlPct: "+20.8%", yieldApy: "0.2%" },
    { ...ASSET_ALLOCATION[3], holdings: "42.13 SOL", avgBuy: "$225.00", pnl: "-$451.20", pnlPct: "-4.7%", yieldApy: "6.9% (Staked)" },
    { ...ASSET_ALLOCATION[4], holdings: "7,524.05 USDC", avgBuy: "$1.00", pnl: "+$391.25", pnlPct: "+5.2%", yieldApy: "5.2% (Treasury)" },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-none transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              Institutional Asset Vault
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Direct custody positions • Cryptographically verified execution records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenTrade}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:opacity-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-200 uppercase mb-4 tracking-wider flex items-center justify-between">
          <span>Active Asset Positions</span>
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">5 ASSETS RUNNING</span>
        </h3>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-[#0a1020]/90">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Holdings</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Avg Cost</th>
                <th className="py-3 px-4">Unrealized P&L</th>
                <th className="py-3 px-4">Yield / Staking</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {assetsWithDetails.map((asset) => (
                <tr key={asset.ticker} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{asset.name}</span>
                        <span className="text-[10px] text-slate-500">{asset.ticker}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-200">
                    {asset.holdings}
                  </td>
                  <td className="py-4 px-4 font-bold text-cyan-600 dark:text-cyan-300">
                    ${asset.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                    {asset.avgBuy}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold flex items-center gap-1 ${asset.pnl.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {asset.pnl.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {asset.pnl} ({asset.pnlPct})
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {asset.yieldApy}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={onOpenTrade}
                      className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/80 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors text-[11px] font-bold"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
