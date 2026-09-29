import React from 'react';
import {
  Award,
  Leaf,
  Users,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const PachiPandaPitchView: React.FC = () => {
  const { wallet, reports, setActiveTab } = useTrashPay();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Presentation Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-xl text-stone-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full">
                MTN Uganda × WWF Innovation Challenge 2026
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              TRASHPAY
            </h1>
            <p className="text-sm font-semibold text-amber-300 mt-1">
              Turning Waste into Income and Cleaner Neighbourhoods
            </p>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400">Team Contacts</span>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>joywabule1@gmail.com</span>
            </div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Elijah Nizeyimana (+256 792 422 855)</span>
            </div>
          </div>
        </div>

        {/* Challenge Theme Alignment */}
        <div className="mt-6 space-y-2">
          <div className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
            2026 Challenge Theme
          </div>
          <p className="text-lg font-bold text-white italic">
            "Nature Meets Innovation: Unlocking Africa’s Green Economy"
          </p>
          <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
            A digital circular-economy platform that rewards recycling, empowers communities to report waste, and creates green livelihoods — built directly on MTN’s digital rails.
          </p>
        </div>
      </div>

      {/* 3 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-base text-white">Recycle-to-Earn Wallet</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Users or collectors record recycled kilograms and receive value directly into a secure digital wallet. Earnings pay for airtime, Umeme Yaka electricity, voluntary NSSF, or micro-savings via MTN Yinvesta.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-base text-white">Citizen Trash Reporting</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Anyone can take a photo of dumped waste, pin the coordinates, and notify the responsible collector or municipal authority (KCCA). Reports are tracked from submission to verified collection with micro-bounties.
          </p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-400/10 text-teal-400 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-base text-white">Smart Collection Network</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Zone-based depot agents receive optimized work orders, weigh material on calibrated scales, pay recyclers instantly, and aggregate clean recyclables for sale to industrial off-takers.
          </p>
        </div>
      </div>

      {/* Live Measurable Outcomes Dashboard */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Measurable PachiPanda Outcomes in Target Zones
            </h3>
            <p className="text-xs text-stone-400">
              Piloting in Kampala informal settlements (Bwaise &amp; Katanga) and Western Hub (Kasese)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            PILOT PHASE 1
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Diverted</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-1">
              {wallet.totalKgRecycled} KG
            </div>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">CO₂ Avoided</span>
            <div className="text-xl font-black text-teal-400 font-mono mt-1">
              {wallet.co2SavedKg} kg
            </div>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Reports Resolved</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {reports.filter((r) => r.status === 'CLEANED').length} / {reports.length}
            </div>
          </div>
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Paid to Community</span>
            <div className="text-xl font-black text-white font-mono mt-1">
              UGX {wallet.lifetimeEarnedUGX.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Why TrashPay is Competitive */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Why TrashPay is Competitive &amp; Partnership-Ready
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Built for Uganda's Reality:</strong> Works flawlessly on basic feature phones (2G USSD <span className="font-mono text-amber-400 font-bold">*284*50#</span>) and smartphones (<span className="text-stone-300 font-mono">trashpay.ug</span>).
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Deep MTN Native Integration:</strong> Direct synergy with MTN Mobile Money, Airtime distribution, and Sanlam Yinvesta micro-savings.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Commercial &amp; Social Value:</strong> Waste pickers get formalized, live above subsistence income, cities stay clean, and municipal drainage blockages drop.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Multi-Stakeholder Architecture:</strong> Attracts KCCA, private aggregators, WWF, schools, and circular economy corporate sponsors.
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs inline-flex items-center gap-2 shadow-md transition-all"
        >
          <span>Explore TrashPay Interactive Prototype</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
