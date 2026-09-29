import React, { useState } from 'react';
import {
  Scale,
  Recycle,
  CheckCircle2,
  Scan,
  UserCheck,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  FileCheck,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';
import { MaterialCategory } from '../types/trashpay';

export const AgentCollectionDesk: React.FC = () => {
  const { users, tariffs, recordRecycleDrop, currentUser, wallet } = useTrashPay();

  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory>('PET_BOTTLES');
  const [weightKg, setWeightKg] = useState<number>(25);
  const [lastPayoutSummary, setLastPayoutSummary] = useState<{
    payout: number;
    yinvestaSplit: number;
    newBalance: number;
    newKg: number;
    materialName: string;
    weight: number;
  } | null>(null);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];
  const activeTariff = tariffs.find((t) => t.id === selectedMaterial) || tariffs[0];

  const grossPayout = Math.round(weightKg * activeTariff.ratePerKgUGX);
  const yinvestaSplit = Math.round((grossPayout * wallet.autoInvestPercentage) / 100);
  const netCashPayout = grossPayout - yinvestaSplit;
  const co2Offset = Number((weightKg * activeTariff.co2PerKg).toFixed(1));

  const handleProcessDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg <= 0) return;

    const res = recordRecycleDrop({
      recyclerId: selectedUser.id,
      materialId: selectedMaterial,
      weightKg,
      zone: selectedUser.zone || 'Bwaise',
    });

    setLastPayoutSummary({
      ...res,
      materialName: activeTariff.name,
      weight: weightKg,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Agent Collection &amp; Weighing Terminal
            </h2>
            <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              Bwaise Depot Hub
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Weigh recyclables, compute official market tariffs, and disburse instant wallet credits to community recyclers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
          <Truck className="w-4 h-4 text-amber-400" />
          <span>Depot Aggregated Stock: <strong className="text-white">1,840 KG</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scale & Weigh Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleProcessDrop}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-sm"
          >
            {/* 1. Recycler Identification */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                <span>1. Select Recycler / Scan QR Passbook</span>
                <span className="text-[11px] text-amber-400 lowercase font-normal">
                  Passbook ID or Phone
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUserId(u.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedUserId === u.id
                        ? 'bg-amber-400/10 border-amber-400 text-white'
                        : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-700"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs truncate">{u.fullName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {u.memberCode} · {u.zone}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Material Classification */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                2. Recyclable Material Stream &amp; Official Tariff
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tariffs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedMaterial(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMaterial === t.id
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-xs'
                        : 'bg-stone-800/50 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{t.name}</span>
                      <span className="text-xs font-mono font-black text-amber-400">
                        UGX {t.ratePerKgUGX.toLocaleString()} / KG
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Weight Measurement on Calibrated Scale */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>3. Digital Scale Weight (Kilograms)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[5, 15, 25, 45, 80].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className="px-2 py-0.5 text-[10px] font-mono bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors"
                    >
                      {preset}kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Scale Visual Dial */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                    {weightKg.toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-stone-400">KG</span>
                </div>

                <div className="w-full sm:w-2/3 space-y-1">
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-500">
                    <span>1 KG</span>
                    <span>75 KG</span>
                    <span>150 KG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] text-stone-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Confirm Weigh &amp; Disburse UGX {grossPayout.toLocaleString()}</span>
            </button>
          </form>
        </div>

        {/* Live Calculation Receipt & Split Preview */}
        <div className="space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 border-b border-stone-800 pb-2">
              Payout &amp; Environmental Split Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Material:</span>
                <strong className="text-stone-200">{activeTariff.name}</strong>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Tariff Rate:</span>
                <strong className="text-stone-200 font-mono">
                  UGX {activeTariff.ratePerKgUGX.toLocaleString()} / KG
                </strong>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Net Weight:</span>
                <strong className="text-stone-200 font-mono">{weightKg} KG</strong>
              </div>
              <div className="border-t border-stone-800 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white">Gross Valuation:</span>
                <span className="text-amber-400 font-mono">
                  UGX {grossPayout.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Yinvesta Auto-Split Notice */}
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span>Recycler Auto-Save Split:</span>
                <span>{wallet.autoInvestPercentage}%</span>
              </div>
              <div className="flex justify-between text-stone-300 text-[11px]">
                <span>Cash to TrashPay Wallet:</span>
                <span className="font-mono font-bold text-white">
                  UGX {netCashPayout.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-300 text-[11px]">
                <span>Diverted to Yinvesta Unit Trust:</span>
                <span className="font-mono font-bold text-emerald-400">
                  UGX {yinvestaSplit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Carbon Offset Factor */}
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <span className="text-teal-400 font-bold">🌿 Carbon Mitigation:</span>
              <span>{co2Offset} kg CO₂e avoided</span>
            </div>
          </div>

          {/* Last Payout Success Card */}
          {lastPayoutSummary && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Payout Disbursed to {selectedUser.fullName}!</span>
              </div>
              <p className="text-xs text-stone-300">
                Credited <strong className="text-white">UGX {lastPayoutSummary.payout.toLocaleString()}</strong> for {lastPayoutSummary.weight} KG of {lastPayoutSummary.materialName}.
              </p>
              <div className="text-[11px] font-mono text-stone-400 pt-1">
                New Recycler Balance: UGX {lastPayoutSummary.newBalance.toLocaleString()} · Cumulative: {lastPayoutSummary.newKg} KG
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
