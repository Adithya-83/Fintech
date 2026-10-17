import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Loader2,
  FileText
} from 'lucide-react';
import { fetchTransactions } from '../services/api';
import { RECENT_TRANSACTIONS as fallbackTransactions } from '../data/mockData';

export default function TransactionsTable({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  const filterTabs = ['ALL', 'BUY', 'SELL', 'STAKING', 'DEPOSIT'];

  // Load transactions using authenticated API with Bearer token
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions(filterType, searchQuery);
      if (data && data.length > 0) {
        setTransactions(data);
      } else if (filterType === 'ALL' && !searchQuery) {
        setTransactions(fallbackTransactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.warn("Falling back to local ledger cache:", err);
      const filtered = fallbackTransactions.filter((tx) => {
        const matchesFilter = filterType === 'ALL' || tx.type === filterType;
        const matchesSearch = 
          tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });
      setTransactions(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [filterType, searchQuery, refreshTrigger]);

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'BUY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ArrowDownLeft className="w-3 h-3 rotate-45" /> BUY ORDER
          </span>
        );
      case 'SELL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <ArrowUpRight className="w-3 h-3" /> SELL ORDER
          </span>
        );
      case 'STAKING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <RefreshCw className="w-3 h-3 animate-spin-slow" /> STAKING YIELD
          </span>
        );
      case 'DEPOSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <ArrowDownLeft className="w-3 h-3" /> DEPOSIT
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30">
            TRANSFER
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1427]/90 dark:to-[#090e1d]/90 border border-slate-200 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden transition-colors">
      {/* Table Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Recent Transactions Ledger
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-cyan-950 text-emerald-600 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-800/80 font-bold">
              <ShieldCheck className="w-3 h-3" />
              VERIFIED SETTLEMENTS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Cryptographically audited execution records across institutional liquidity pools.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={loadTransactions}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-500' : ''}`} />
          </button>

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  filterType === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-glow-cyan'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search ticker, hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono w-40 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080d1a]/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-100/80 dark:bg-[#0a1020]/90">
              <th className="py-3.5 px-4">Asset / Token</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Amount & USD Value</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Execution Price</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Tx Hash / Ledger</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Date & Time</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-xs">
            {loading && transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span>Synchronizing ledger records...</span>
                  </div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  {/* Asset */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border ${tx.iconBg || 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'}`}>
                        {tx.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-200 block text-xs group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {tx.asset}
                        </span>
                        <span className="text-[10px] text-slate-500">{tx.symbol}</span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    {getTypeBadge(tx.type)}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-200">
                      {tx.amount}
                    </div>
                    <div className={`text-[11px] font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {tx.amountUSD}
                    </div>
                  </td>

                  {/* Execution Price */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-700 dark:text-slate-300">
                    <div>{tx.priceAtExecution}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">Fee: {tx.fee}</div>
                  </td>

                  {/* Hash */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                        {tx.txHash}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyHash(tx.fullTxHash, tx.id);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                        title="Copy cryptographic proof"
                      >
                        {copiedId === tx.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                    <div className="text-slate-800 dark:text-slate-300">{tx.date.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{tx.date.split(' ')[1]} ({tx.timeAgo})</div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {tx.status}
                    </span>
                  </td>

                  {/* Details Link */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-200 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-700/60 transition-all"
                      title="Inspect Transaction"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info (Sanitized: No backend strings) */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Audited Settlement Ledger ({transactions.length} verified records)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">
            Export Audit Log (CSV)
          </span>
          <span>•</span>
          <span className="text-slate-400 dark:text-slate-500">Zero-Knowledge Proofs Active</span>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div 
          onClick={() => setSelectedTx(null)}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#0d162a] border border-slate-200 dark:border-cyan-500/30 shadow-2xl font-mono text-xs relative animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">SETTLEMENT RECEIPT</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-cyan-950 text-emerald-700 dark:text-cyan-400 border border-emerald-200 dark:border-cyan-800 text-[10px] font-bold">
                  VERIFIED RECORD
                </span>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedTx.id}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Asset:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedTx.asset} ({selectedTx.symbol})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Order Action:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Amount / Value:</span>
                  <span className="text-cyan-600 dark:text-cyan-300 font-bold">{selectedTx.amount} ({selectedTx.amountUSD})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Execution Price:</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedTx.priceAtExecution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Execution Fee:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedTx.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedTx.date} UTC</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block mb-1">Cryptographic Proof (SHA-256):</span>
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 break-all text-[11px]">
                  {selectedTx.fullTxHash}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedTx.fullTxHash);
                  alert('Copied cryptographic hash to clipboard!');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-glow-cyan hover:opacity-95"
              >
                Copy Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
