import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  ShieldCheck, 
  Wallet
} from 'lucide-react';
import { BALANCE_SUMMARY } from '../data/mockData';

export default function MetricsCards() {
  const cards = [
    {
      title: "TOTAL NET BALANCE",
      value: `$${BALANCE_SUMMARY.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: `+$${BALANCE_SUMMARY.change24hAmount.toLocaleString()} (${BALANCE_SUMMARY.change24hPercentage}%)`,
      isPositive: true,
      timeframe: "vs yesterday",
      icon: DollarSign,
      accentColor: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-slate-200 dark:border-cyan-500/30",
      textColor: "text-cyan-600 dark:text-cyan-400",
      iconBg: "bg-cyan-50 dark:bg-[#101b33]",
      glowColor: "shadow-sm dark:shadow-[0_0_25px_rgba(0,242,254,0.12)]",
      badgeText: "REAL-TIME",
    },
    {
      title: "6-MONTH REALIZED GAINS",
      value: `+$${BALANCE_SUMMARY.realizedProfit6M.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: "+39.9% Portfolio Growth",
      isPositive: true,
      timeframe: "Last 180 days",
      icon: TrendingUp,
      accentColor: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-slate-200 dark:border-emerald-500/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-[#101b33]",
      glowColor: "shadow-sm dark:shadow-[0_0_25px_rgba(0,255,135,0.12)]",
      badgeText: "ALPHA +14.2%",
    },
    {
      title: "AVAILABLE BUYING POWER",
      value: `$${BALANCE_SUMMARY.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: `${BALANCE_SUMMARY.cashApy}% APY Yield Active`,
      isPositive: true,
      timeframe: "USDC Treasury Vault",
      icon: Wallet,
      accentColor: "from-blue-500/20 to-indigo-500/10",
      borderColor: "border-slate-200 dark:border-blue-500/30",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-[#101b33]",
      glowColor: "shadow-sm dark:shadow-[0_0_25px_rgba(59,130,246,0.12)]",
      badgeText: "INSTANT LIQUIDITY",
    },
    {
      title: "SHARPE RATIO & QUANT RISK",
      value: `${BALANCE_SUMMARY.sharpeRatio}`,
      change: `Win Rate: ${BALANCE_SUMMARY.winRate} • Max DD: ${BALANCE_SUMMARY.maxDrawdown}`,
      isPositive: true,
      timeframe: "Low Risk Exposure",
      icon: ShieldCheck,
      accentColor: "from-purple-500/20 to-cyan-500/10",
      borderColor: "border-slate-200 dark:border-purple-500/30",
      textColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-[#101b33]",
      glowColor: "shadow-sm dark:shadow-[0_0_25px_rgba(168,85,247,0.12)]",
      badgeText: "OPTIMAL",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`
              relative p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 
              border ${card.borderColor} ${card.glowColor} backdrop-blur-md 
              hover:translate-y-[-2px] transition-all duration-300 group overflow-hidden
            `}
          >
            {/* Top ambient glow blob */}
            <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-br ${card.accentColor} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none opacity-50 dark:opacity-100`} />

            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg} border border-slate-200 dark:border-slate-700/60 ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value */}
            <div className="relative z-10 mb-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
                {card.value}
              </span>
            </div>

            {/* Subtext and Pill */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 relative z-10 text-xs">
              <div className="flex items-center gap-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="truncate">{card.change}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 font-bold">
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
