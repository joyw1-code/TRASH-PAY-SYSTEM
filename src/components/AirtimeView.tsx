import React, { useState } from 'react';
import {
  PhoneCall,
  Zap,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const AirtimeView: React.FC = () => {
  const { currentUser, wallet, buyAirtime } = useTrashPay();

  const [recipientType, setRecipientType] = useState<'SELF' | 'OTHER'>('SELF');
  const [targetPhone, setTargetPhone] = useState<string>(currentUser.msisdn);
  const [amountUGX, setAmountUGX] = useState<number>(3000);
  const [pin, setPin] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const beneficiaries = [
    { name: 'Self', phone: currentUser.msisdn },
    { name: 'Sarah Nakato (Sister)', phone: '+256782334455' },
    { name: 'Depot Team Bwaise', phone: '+256701889922' },
  ];

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const res = buyAirtime({
      phone: targetPhone,
      amountUGX,
      pin,
    });

    if (res.success) {
      setStatusMsg({ success: true, text: res.message });
      setPin('');
    } else {
      setStatusMsg({ success: false, text: res.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            MTN Airtime &amp; Bundles Recharge
          </h2>
          <span className="text-[10px] font-bold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
            Africa's Talking Gateway
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          Purchase instant MTN airtime and voice/data bundles directly from your recycling earnings.
        </p>
      </div>

      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Recipient Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Choose Recipient
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRecipientType('SELF');
                setTargetPhone(currentUser.msisdn);
              }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                recipientType === 'SELF'
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Self ({currentUser.msisdn})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRecipientType('OTHER');
                setTargetPhone('+2567');
              }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                recipientType === 'OTHER'
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Other Number / Beneficiary</span>
            </button>
          </div>
        </div>

        {recipientType === 'OTHER' && (
          <div className="space-y-2">
            <label className="text-xs text-stone-300 font-bold block">
              Enter Recipient MTN Phone Number
            </label>
            <input
              type="tel"
              required
              value={targetPhone}
              onChange={(e) => setTargetPhone(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono text-sm outline-hidden focus:border-amber-400"
              placeholder="+256 7XX XXX XXX"
            />
            {/* Quick Contacts */}
            <div className="flex gap-2 text-[11px] text-stone-400 items-center">
              <span>Quick:</span>
              {beneficiaries.map((b) => (
                <button
                  key={b.phone}
                  type="button"
                  onClick={() => setTargetPhone(b.phone)}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Airtime Denominations */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Select Airtime Tier (UGX)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 2000, 3000, 5000, 10000, 20000].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setAmountUGX(tier)}
                className={`py-2 rounded-xl border text-center font-mono font-bold text-xs transition-all ${
                  amountUGX === tier
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                {tier >= 1000 ? `${tier / 1000}k` : tier}
              </button>
            ))}
          </div>
        </div>

        {/* Form Action */}
        <form onSubmit={handleBuy} className="space-y-4 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-stone-300 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Enter 4-Digit Wallet PIN</span>
              </label>
              <span className="text-stone-500 font-mono text-[10px]">
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
            <span>Confirm UGX {amountUGX.toLocaleString()} Airtime Top-Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
