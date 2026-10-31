import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricsCards from './components/MetricsCards';
import PortfolioChart from './components/PortfolioChart';
import AssetAllocation from './components/AssetAllocation';
import TransactionsTable from './components/TransactionsTable';
import PortfolioView from './components/PortfolioView';
import SettingsView from './components/SettingsView';
import QuickTradeModal from './components/QuickTradeModal';
import AuthModal from './components/AuthModal';
import { getCurrentUser } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check stored auth state or load from FastAPI
  useEffect(() => {
    const savedUser = localStorage.getItem('aether_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user cache:", e);
      }
    }

    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleOrderPlaced = () => {
    // Increment trigger to refresh transactions from MongoDB
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient neon glow spheres */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Layout Container (offset by sidebar width on desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header with Profile & Total Balance Summary */}
        <Header 
          currentUser={currentUser}
          onOpenTrade={() => setIsTradeModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <>
              {/* 1. Core FinTech KPI Metrics */}
              <MetricsCards />

              {/* 2. Main Chart Area & Asset Allocation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 6-Month Portfolio Growth Chart (Takes 2 columns) */}
                <div className="lg:col-span-2">
                  <PortfolioChart />
                </div>

                {/* Donut Chart Asset Allocation (Takes 1 column) */}
                <div className="lg:col-span-1">
                  <AssetAllocation />
                </div>
              </div>

              {/* 3. Recent Transactions Ledger (Live from MongoDB) */}
              <TransactionsTable refreshTrigger={refreshTrigger} />
            </>
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView onOpenTrade={() => setIsTradeModalOpen(true)} />
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <TransactionsTable refreshTrigger={refreshTrigger} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <PortfolioChart />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AssetAllocation />
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1427]/90 to-[#090e1d]/90 border border-slate-800 font-mono text-xs space-y-4">
                  <h3 className="font-bold text-slate-100 uppercase text-sm">Quant Alpha Diagnostics</h3>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between p-2 rounded-lg bg-[#080d1a]">
                      <span>Sharpe Ratio (Annualized)</span>
                      <span className="text-emerald-400 font-bold">2.84</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[#080d1a]">
                      <span>Sortino Ratio</span>
                      <span className="text-cyan-400 font-bold">3.42</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[#080d1a]">
                      <span>Information Ratio</span>
                      <span className="text-purple-400 font-bold">1.78</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-[#080d1a]">
                      <span>Maximum Drawdown (180d)</span>
                      <span className="text-emerald-400 font-bold">-5.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Quick Trade / Order Execution Modal (Writes to MongoDB) */}
      <QuickTradeModal 
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Authentication Modal (FastAPI + MongoDB JWT) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
