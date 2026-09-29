import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Receipt,
  AlertCircle,
  Lock,
  ArrowRight,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const UtilitiesView: React.FC = () => {
  const { wallet, currentUser, payUmemeYaka, payNssfVoluntary } = useTrashPay();

  const [utilityType, setUtilityType] = useState<'YAKA' | 'NSSF'>('YAKA');
  const [meterNumber, setMeterNumber] = useState<string>('04152637891');
  const [nssfNumber, setNssfNumber] = useState<string>('NSSF-89102-UG');
  const [amountUGX, setAmountUGX] = useState<number>(50000);
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [generatedReceipt, setGeneratedReceipt] = useState<{
    type: 'YAKA' | 'NSSF';
    token?: string;
    receiptNumber?: string;
    amount: number;
    account: string;
    unitsKwh?: number;
    newBalance: number;
    timestamp: string;
  } | null>(null);

  const [copiedToken, setCopiedToken] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (utilityType === 'YAKA') {
      const res = payUmemeYaka({
        meterNumber,
        amountUGX,
        pin,
      });

      if (res.success) {
        setGeneratedReceipt({
          type: 'YAKA',
          token: res.token,
          amount: amountUGX,
          account: meterNumber,
          unitsKwh: res.unitsKwh,
          newBalance: wallet.balanceUGX - amountUGX,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setPin('');
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = payNssfVoluntary({
        nssfNumber,
        amountUGX,
        pin,
      });

      if (res.success) {
        setGeneratedReceipt({
          type: 'NSSF',
          receiptNumber: res.receipt,
          amount: amountUGX,
          account: nssfNumber,
          newBalance: wallet.balanceUGX - amountUGX,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setPin('');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Utilities &amp; Statutory Savings Engine
          </h2>
          <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
            Live Settlement
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          Convert recycled waste into prepaid electricity (Umeme Yaka tokens) and voluntary NSSF pension contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bill Form */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-sm">
          {/* Bill Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Select Utility Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUtilityType('YAKA');
                  setErrorMsg('');
                  setAmountUGX(50000);
                }}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  utilityType === 'YAKA'
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                    : 'bg-stone-800/60 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>1. Umeme Yaka</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUtilityType('NSSF');
                  setErrorMsg('');
                  setAmountUGX(25000);
                }}
                className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  utilityType === 'NSSF'
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                    : 'bg-stone-800/60 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>2. Voluntary NSSF</span>
              </button>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-4 text-xs">
            {utilityType === 'YAKA' ? (
              <div className="space-y-1">
                <label className="block text-stone-300 font-bold">
                  Umeme Prepaid Meter Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 04152637891 (11 digits)"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm outline-hidden focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500">
                  Demo Default: 04152637891 (Verified Household Meter)
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-stone-300 font-bold">
                  NSSF Member ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NSSF-89102-UG"
                  value={nssfNumber}
                  onChange={(e) => setNssfNumber(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm outline-hidden focus:border-amber-400"
                />
              </div>
            )}

            {/* Amount Selection */}
            <div className="space-y-1.5">
              <label className="block text-stone-300 font-bold">
                Payment Amount (UGX)
              </label>
              <div className="flex gap-2">
                {[10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountUGX(amt)}
                    className={`flex-1 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-colors ${
                      amountUGX === amt
                        ? 'bg-stone-700 text-amber-400 border-amber-400/40'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {amt / 1000}k
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="2000"
                step="1000"
                required
                value={amountUGX}
                onChange={(e) => setAmountUGX(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-sm outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Security PIN Authorization */}
            <div className="space-y-1 pt-1 border-t border-stone-800">
              <div className="flex justify-between items-center">
                <label className="text-stone-300 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter 4-Digit Wallet PIN</span>
                </label>
                <span className="text-[10px] text-stone-500 font-mono">
                  Default: {currentUser.pin}
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

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Authorize UGX {amountUGX.toLocaleString()} Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Generated Receipt Display */}
        <div className="space-y-4">
          {generatedReceipt ? (
            <div className="bg-stone-900 border-2 border-emerald-500/40 rounded-2xl p-6 text-stone-100 space-y-4 shadow-xl relative overflow-hidden animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Payment Successful</h3>
                    <p className="text-[10px] text-stone-400">
                      {generatedReceipt.timestamp} · TrashPay Settlement
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-stone-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  CONFIRMED
                </span>
              </div>

              {generatedReceipt.type === 'YAKA' && (
                <div className="space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Generated 20-Digit Umeme Yaka Token
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 tracking-wider select-all">
                      {generatedReceipt.token}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleCopy(generatedReceipt.token || '')}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedToken ? 'Token Copied!' : 'Copy 20-Digit Token'}</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-800/80 pt-2 grid grid-cols-2 gap-2 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-500 text-[10px]">Meter Number</span>
                      <div className="font-mono font-bold text-white">
                        {generatedReceipt.account}
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px]">Power Credited</span>
                      <div className="font-bold text-emerald-400">
                        {generatedReceipt.unitsKwh} kWh
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {generatedReceipt.type === 'NSSF' && (
                <div className="space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      Voluntary NSSF Statutory Receipt
                    </span>
                    <div className="text-lg font-black font-mono text-amber-400">
                      {generatedReceipt.receiptNumber}
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 text-center">
                    Credited to Member: <strong className="text-white">{generatedReceipt.account}</strong>
                  </p>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-stone-300 pt-1 border-t border-stone-800">
                <div className="flex justify-between">
                  <span>Amount Deducted:</span>
                  <span className="font-mono font-bold text-white">
                    UGX {generatedReceipt.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>New Wallet Balance:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    UGX {generatedReceipt.newBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Utility Receipt</span>
              </button>
            </div>
          ) : (
            <div className="bg-stone-900/60 border border-dashed border-stone-800 rounded-2xl p-8 text-center space-y-3 text-stone-400">
              <Receipt className="w-10 h-10 mx-auto text-stone-600 stroke-[1.5]" />
              <h4 className="text-sm font-bold text-stone-300">
                No Active Receipt Generated
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Fill the meter or NSSF contribution form and authorize with your PIN to generate instantaneous 20-digit tokens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
