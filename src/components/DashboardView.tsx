import React from 'react';
import {
  Wallet,
  Recycle,
  TrendingUp,
  Leaf,
  Award,
  Zap,
  PhoneCall,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    wallet,
    transactions,
    setActiveTab,
    setAutoInvestPercentage,
    claimMilestoneBonus,
  } = useTrashPay();

  const progressPercent = Math.min(
    100,
    Math.round((wallet.balanceUGX / wallet.milestoneTargetUGX) * 100)
  );

  const remainingUGX = Math.max(0, wallet.milestoneTargetUGX - wallet.balanceUGX);
  const remainingKg = Math.max(0, Math.ceil(remainingUGX / 1000));
  const isMilestoneReached = wallet.balanceUGX >= wallet.milestoneTargetUGX;

  return (
    <div className="space-y-6">
      {/* Welcome & Member Status Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-6 border border-stone-800 text-stone-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={currentUser.fullName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-stone-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {currentUser.fullName}
              </h1>
              <span className="text-[11px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                {currentUser.memberCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
              <span>Zone: <strong className="text-stone-200">{currentUser.zone}</strong></span>
              <span>·</span>
              <span>MSISDN: <strong className="text-stone-200 font-mono">{currentUser.msisdn}</strong></span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Verified MTN MoMo</span>
            </div>
          </div>
        </div>

        {/* Quick Passbook Trigger */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('passbook')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital QR Passbook</span>
          </button>
          <button
            onClick={() => setActiveTab('agent_desk')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold px-4 py-2.5 rounded-xl text-xs border border-stone-700 transition-colors"
          >
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span>Depot Scale</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Ecological Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cash Wallet */}
        <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cash Wallet Balance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            UGX {wallet.balanceUGX.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-2">
            <span className="text-emerald-400 font-bold">● MTN MoMo</span>
            <span>· Instant cash-out</span>
          </div>
        </div>

        {/* Total Recycled */}
        <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Recycled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {wallet.totalKgRecycled.toLocaleString()} <span className="text-sm font-semibold text-stone-400">KG</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Plastics, aluminium &amp; clean cardboard
          </p>
        </div>

        {/* Yinvesta Wealth */}
        <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">MTN Yinvesta Portfolio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            UGX {wallet.yinvestaBalanceUGX.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-2">
            <span>~11.8% annual daily compound yield</span>
          </div>
        </div>

        {/* Carbon Offset */}
        <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Carbon Offset</span>
            <div className="w-8 h-8 rounded-lg bg-teal-400/10 text-teal-400 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {wallet.co2SavedKg} <span className="text-sm font-semibold text-stone-400">kg CO₂e</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Equivalent to ~{Math.round(wallet.co2SavedKg / 21)} urban trees planted
          </p>
        </div>
      </div>

      {/* Milestone Progress Banner (From the Pitch Specification) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-stone-900 border border-amber-400/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  PachiPanda Green Champion Milestone
                </h3>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  UGX 200,000 Target
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {isMilestoneReached ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Target Reached! Claim your UGX 25,000 PachiPanda Green Bonus!
                  </span>
                ) : (
                  <span>
                    Status: <strong className="text-amber-300">{remainingKg} KG away from UGX 200k Milestone!</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action button if milestone reached */}
          <div>
            {isMilestoneReached ? (
              wallet.milestoneRewardClaimed ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bonus Claimed (UGX 25,000 credited)</span>
                </div>
              ) : (
                <button
                  onClick={claimMilestoneBonus}
                  className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-md animate-bounce"
                >
                  🎉 Claim UGX 25k Champion Bonus
                </button>
              )
            ) : (
              <button
                onClick={() => setActiveTab('agent_desk')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Weigh Recyclables to Close Gap
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">
              Current Balance: <strong className="text-white">UGX {wallet.balanceUGX.toLocaleString()}</strong>
            </span>
            <span className="text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-stone-950/70 rounded-full overflow-hidden p-0.5 border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Auto-Invest Split Settings Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Automated Recycling Payout Split (MTN Yinvesta)
            </h4>
            <p className="text-xs text-stone-400">
              Automatically redirect a portion of every depot plastic drop directly into daily-interest unit trusts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {[0, 10, 20, 30].map((pct) => (
              <button
                key={pct}
                onClick={() => setAutoInvestPercentage(pct)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                  wallet.autoInvestPercentage === pct
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <span className="text-xs text-stone-400 font-medium">
            Active: <strong className="text-amber-400">{wallet.autoInvestPercentage}% Auto-Saved</strong>
          </span>
        </div>
      </div>

      {/* Quick Access Utility Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('utilities')}
          className="p-4 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 rounded-xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Umeme Yaka</div>
          <div className="text-[11px] text-stone-400">Pay electricity meters</div>
        </button>

        <button
          onClick={() => setActiveTab('airtime')}
          className="p-4 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 rounded-xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Buy Airtime</div>
          <div className="text-[11px] text-stone-400">Top-up MTN line instantly</div>
        </button>

        <button
          onClick={() => setActiveTab('yinvesta')}
          className="p-4 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 rounded-xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Yinvesta Wealth</div>
          <div className="text-[11px] text-stone-400">Daily-compounding fund</div>
        </button>

        <button
          onClick={() => setActiveTab('reporting')}
          className="p-4 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 rounded-xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-400/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Recycle className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Report Dump</div>
          <div className="text-[11px] text-stone-400">Earn micro-bounties</div>
        </button>
      </div>

      {/* Recent Activity Ledger */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Circular Economy Ledger &amp; Receipts
            </h3>
            <p className="text-xs text-stone-400">
              Synchronized transactions across USSD *284*50# and trashpay.ug
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-stone-400">
            {transactions.length} Records
          </span>
        </div>

        <div className="divide-y divide-stone-800">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    tx.isDebit
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {tx.isDebit ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-white">{tx.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                    <span>{tx.timestamp}</span>
                    <span>·</span>
                    <span className="font-mono text-stone-300">{tx.reference}</span>
                    {tx.metadata?.token && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 font-mono font-bold">
                          Token: {tx.metadata.token}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-black text-sm ${
                    tx.isDebit ? 'text-stone-300' : 'text-emerald-400'
                  }`}
                >
                  {tx.isDebit ? '-' : '+'}UGX {tx.amountUGX.toLocaleString()}
                </div>
                <div className="text-[10px] text-stone-400 uppercase font-semibold">
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
