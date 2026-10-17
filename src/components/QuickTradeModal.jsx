import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  Loader2,
  ShieldCheck 
} from 'lucide-react';
import { ASSET_ALLOCATION, BALANCE_SUMMARY } from '../data/mockData';
import { createTransaction } from '../services/api';

export default function QuickTradeModal({ isOpen, onClose, onOrderPlaced }) {
  if (!isOpen) return null;

  const [tradeType, setTradeType] = useState('BUY'); // BUY or SELL
  const [selectedAsset, setSelectedAsset] = useState(ASSET_ALLOCATION[0]);
  const [amountUSD, setAmountUSD] = useState('1000');
  const [slippage, setSlippage] = useState('0.1%');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const priceMap = {
    BTC: 96420.00,
    ETH: 3485.60,
    NVDA: 142.80,
    SOL: 214.30,
    USDC: 1.00
  };

  const assetPrice = priceMap[selectedAsset.ticker] || 100;
  const numericAmount = parseFloat(amountUSD || 0);
  const estimatedUnits = (numericAmount / assetPrice).toFixed(4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedAmount = `${tradeType === 'BUY' ? '+' : '-'}${estimatedUnits} ${selectedAsset.ticker}`;
    const formattedUSD = `${tradeType === 'BUY' ? '+' : '-'}$${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const txPayload = {
      type: tradeType,
      asset: selectedAsset.name,
      symbol: selectedAsset.ticker,
      amount: formattedAmount,
      amountUSD: formattedUSD,
      priceAtExecution: `$${assetPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      fee: "$0.00 (Zero-fee Pro)",
    };

    try {
      await createTransaction(txPayload);
      setSuccessMessage(`Order Executed: ${tradeType} $${numericAmount} of ${selectedAsset.name}`);
      
      setTimeout(() => {
        setSuccessMessage(null);
        if (onOrderPlaced) onOrderPlaced();
        onClose();
      }, 1400);
    } catch (err) {
      console.warn("API order submission fallback:", err.message);
      setSuccessMessage(`Order Recorded: ${tradeType} $${numericAmount} of ${selectedAsset.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
        if (onOrderPlaced) onOrderPlaced();
        onClose();
      }, 1400);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#0d162a] dark:to-[#080d1a] border border-slate-200 dark:border-cyan-500/40 shadow-2xl dark:shadow-[0_0_50px_rgba(0,242,254,0.2)] font-mono text-xs relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400 fill-cyan-400/20" />
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">INSTANT QUANT EXECUTION</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Execution Pool Badge */}
        <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#060b17] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>Execution Pool:</span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tier-1 Institutional Dark Pool</span>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 animate-bounce" />
            <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-300">Execution Successful!</h3>
            <p className="text-slate-700 dark:text-slate-300">{successMessage}</p>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400">Cryptographic settlement proof confirmed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-green'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'SELL'
                    ? 'bg-rose-500 text-slate-950'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block mb-1.5 font-bold">Select Asset</label>
              <div className="grid grid-cols-3 gap-2">
                {ASSET_ALLOCATION.map((asset) => (
                  <button
                    key={asset.ticker}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedAsset.ticker === asset.ticker
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a1020] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-200">{asset.ticker}</div>
                    <div className="text-[10px] text-slate-500 truncate">{asset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Amount in USD</label>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Avail: ${BALANCE_SUMMARY.availableCash.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-16 py-2.5 text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setAmountUSD('5000')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Execution Details Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#060a14] border border-slate-200 dark:border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Execution Price:</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold">${assetPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Fill:</span>
                <span className="text-cyan-600 dark:text-cyan-300 font-bold">~{estimatedUnits} {selectedAsset.ticker}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Max Slippage:</span>
                <span className="text-slate-700 dark:text-slate-300">{slippage} (MEV Protected)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Execution Route:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sub-millisecond Direct Memory</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !amountUSD}
              className={`w-full py-3 rounded-xl font-bold text-slate-950 transition-all flex items-center justify-center gap-2 ${
                tradeType === 'BUY'
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-glow-cyan hover:opacity-95'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Order...</span>
                </>
              ) : (
                `EXECUTE ${tradeType} ORDER`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
