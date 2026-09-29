import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Target,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Truck,
  Shield,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const YinvestaWealthView: React.FC = () => {
  const {
    wallet,
    currentUser,
    yinvestaGoals,
    investInYinvesta,
    withdrawYinvesta,
    setAutoInvestPercentage,
  } = useTrashPay();

  const [activeSubTab, setActiveSubTab] = useState<'PORTFOLIO' | 'GOALS'>('PORTFOLIO');
  const [investMode, setInvestMode] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [amountUGX, setAmountUGX] = useState<number>(15000);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Annualized return estimate
  const annualRate = 0.118; // 11.8% p.a.
  const estimatedDailyYield = Math.round((wallet.yinvestaBalanceUGX * annualRate) / 365);
  const estimatedMonthlyYield = Math.round((wallet.yinvestaBalanceUGX * annualRate) / 12);

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (investMode === 'DEPOSIT') {
      const res = investInYinvesta({
        amountUGX,
        goalId: selectedGoalId || undefined,
        pin,
      });
      if (res.success) {
        setStatusMsg({ success: true, text: res.message });
        setPin('');
      } else {
        setStatusMsg({ success: false, text: res.message });
      }
    } else {
      const res = withdrawYinvesta({
        amountUGX,
        pin,
      });
      if (res.success) {
        setStatusMsg({ success: true, text: res.message });
        setPin('');
      } else {
        setStatusMsg({ success: false, text: res.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              MTN Yinvesta Wealth Studio
            </h2>
            <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
              Sanlam Unit Trust Partner
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Divert recycling cash-out directly into high-yield, daily-interest micro-savings starting from as low as UGX 500.
          </p>
        </div>

        <div className="flex gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('PORTFOLIO')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
              activeSubTab === 'PORTFOLIO'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Unit Trust Portfolio
          </button>
          <button
            onClick={() => setActiveSubTab('GOALS')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-colors ${
              activeSubTab === 'GOALS'
                ? 'bg-amber-400 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Goal Savings ({yinvestaGoals.length})
          </button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            Total Yinvesta Valuation
          </div>
          <div className="text-3xl font-black text-amber-400 tracking-tight font-mono">
            UGX {wallet.yinvestaBalanceUGX.toLocaleString()}
          </div>
          <p className="text-xs text-stone-400">
            Backed by Government of Uganda Treasury Securities via Sanlam Investments.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            Daily Compounding Yield
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">
            +UGX {estimatedDailyYield} <span className="text-xs font-normal text-stone-400">/ day</span>
          </div>
          <p className="text-xs text-stone-400">
            Current Rate: <strong className="text-white">11.8% Annual Net Yield</strong>
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">
            Est. Monthly Growth
          </div>
          <div className="text-3xl font-black text-white tracking-tight font-mono">
            +UGX {estimatedMonthlyYield.toLocaleString()}
          </div>
          <p className="text-xs text-stone-400">
            Passive wealth generated without taking any market equity risk.
          </p>
        </div>
      </div>

      {activeSubTab === 'PORTFOLIO' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Module: Deposit or Withdraw */}
          <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInvestMode('DEPOSIT');
                    setStatusMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    investMode === 'DEPOSIT'
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  Invest / Deposit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInvestMode('WITHDRAW');
                    setStatusMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    investMode === 'WITHDRAW'
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  Withdraw to Cash
                </button>
              </div>

              <span className="text-xs text-stone-400">
                Cash Wallet: <strong className="text-white">UGX {wallet.balanceUGX.toLocaleString()}</strong>
              </span>
            </div>

            <form onSubmit={handleTransaction} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-stone-300 font-bold">
                  {investMode === 'DEPOSIT' ? 'Deposit Amount (UGX)' : 'Withdrawal Amount (UGX)'}
                </label>
                <div className="flex gap-2">
                  {[5000, 15000, 30000, 50000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountUGX(preset)}
                      className={`flex-1 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-colors ${
                        amountUGX === preset
                          ? 'bg-stone-700 text-amber-400 border-amber-400/40'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {preset / 1000}k
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={amountUGX}
                  onChange={(e) => setAmountUGX(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-sm outline-hidden focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500">
                  Minimum deposit starting at UGX 500. Zero account maintenance fees.
                </span>
              </div>

              {investMode === 'DEPOSIT' && (
                <div className="space-y-1">
                  <label className="block text-stone-300 font-bold">
                    Allocate to Specific Goal (Optional)
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white outline-hidden focus:border-amber-400"
                  >
                    <option value="">General Liquid Portfolio</option>
                    {yinvestaGoals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} (Target: UGX {g.targetUGX.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1 pt-1 border-t border-stone-800">
                <div className="flex justify-between items-center">
                  <label className="text-stone-300 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirm with 4-Digit PIN</span>
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    PIN: {currentUser.pin}
                  </span>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest text-lg outline-hidden focus:border-amber-400"
                />
              </div>

              {statusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    statusMsg.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  {statusMsg.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>
                  {investMode === 'DEPOSIT'
                    ? `Confirm UGX ${amountUGX.toLocaleString()} Investment`
                    : `Confirm UGX ${amountUGX.toLocaleString()} Withdrawal`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Auto-Split Explainer Card */}
          <div className="space-y-4">
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" />
                Automated Drop Payout Split
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                When you bring your bags to a TrashPay collection depot, our system automatically diverts your chosen percentage into this compounding account before crediting the rest in cash.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-amber-300">
                  <span>Current Setting:</span>
                  <span>{wallet.autoInvestPercentage}% Auto-Invested</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 20, 30].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setAutoInvestPercentage(pct)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        wallet.autoInvestPercentage === pct
                          ? 'bg-amber-400 text-stone-950 border-amber-300'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-xs text-stone-300 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Sanlam Regulated Security</span>
              </div>
              <p className="text-stone-400 text-[11px]">
                Licensed by Capital Markets Authority (CMA) Uganda and Bank of Uganda under the National Payment Systems Act.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Goal-Based Savings View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {yinvestaGoals.map((goal) => {
            const goalPct = Math.min(100, Math.round((goal.currentUGX / goal.targetUGX) * 100));
            return (
              <div
                key={goal.id}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                    {goal.category === 'SCHOOL_FEES' ? (
                      <GraduationCap className="w-5 h-5" />
                    ) : goal.category === 'EQUIPMENT' ? (
                      <Truck className="w-5 h-5" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white">{goal.title}</h3>
                  <div className="flex justify-between text-xs text-stone-400 font-mono">
                    <span>Saved: <strong className="text-white">UGX {goal.currentUGX.toLocaleString()}</strong></span>
                    <span>Target: UGX {goal.targetUGX.toLocaleString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                      style={{ width: `${goalPct}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] font-bold text-amber-400">
                    {goalPct}% Funded
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-500 text-[10px]">Due {goal.targetDate}</span>
                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setActiveSubTab('PORTFOLIO');
                    }}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-[11px] transition-colors"
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
