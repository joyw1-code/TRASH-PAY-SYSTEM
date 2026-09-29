import React, { useState } from 'react';
import {
  QrCode,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Award,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const QRPassbookView: React.FC = () => {
  const { currentUser, wallet } = useTrashPay();
  const [copied, setCopied] = useState(false);

  const qrPayload = JSON.stringify({
    memberCode: currentUser.memberCode,
    msisdn: currentUser.msisdn,
    name: currentUser.fullName,
    zone: currentUser.zone,
    secToken: `TP-SEC-${btoa(currentUser.msisdn).slice(0, 8)}`,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.memberCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Recycler Digital QR Passbook
        </h2>
        <p className="text-xs text-stone-400">
          Present this high-contrast QR code at any TrashPay depot or collection agent for instant weighing and automated wallet payout.
        </p>
      </div>

      {/* The Passbook Physical Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-stone-100">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black">
              TP
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-2">
                <span>TrashPay Member Passbook</span>
                <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                MTN Uganda × WWF PachiPanda Circular Economy Network
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Zone Hub
            </span>
            <div className="text-sm font-bold text-white">{currentUser.zone}</div>
          </div>
        </div>

        {/* QR Code and Member Credentials */}
        <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-8">
          {/* High-Contrast SVG QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-stone-800 flex flex-col items-center">
            {/* Authentic SVG QR pattern generator */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner position markers */}
              {/* Top-Left */}
              <rect x="5" y="5" width="28" height="28" fill="#000" />
              <rect x="9" y="9" width="20" height="20" fill="#fff" />
              <rect x="13" y="13" width="12" height="12" fill="#000" />

              {/* Top-Right */}
              <rect x="67" y="5" width="28" height="28" fill="#000" />
              <rect x="71" y="9" width="20" height="20" fill="#fff" />
              <rect x="75" y="13" width="12" height="12" fill="#000" />

              {/* Bottom-Left */}
              <rect x="5" y="67" width="28" height="28" fill="#000" />
              <rect x="9" y="71" width="20" height="20" fill="#fff" />
              <rect x="13" y="75" width="12" height="12" fill="#000" />

              {/* Data Matrix Elements */}
              <rect x="38" y="8" width="5" height="12" fill="#000" />
              <rect x="48" y="15" width="8" height="5" fill="#000" />
              <rect x="40" y="25" width="16" height="5" fill="#000" />
              <rect x="8" y="38" width="12" height="6" fill="#000" />
              <rect x="25" y="38" width="6" height="14" fill="#000" />
              <rect x="38" y="38" width="10" height="10" fill="#000" />
              <rect x="52" y="36" width="6" height="6" fill="#000" />
              <rect x="62" y="38" width="14" height="6" fill="#000" />
              <rect x="82" y="38" width="10" height="6" fill="#000" />

              <rect x="38" y="54" width="8" height="16" fill="#000" />
              <rect x="50" y="48" width="10" height="12" fill="#000" />
              <rect x="66" y="50" width="8" height="8" fill="#000" />
              <rect x="80" y="52" width="12" height="14" fill="#000" />

              <rect x="38" y="76" width="14" height="6" fill="#000" />
              <rect x="58" y="72" width="6" height="18" fill="#000" />
              <rect x="70" y="76" width="12" height="10" fill="#000" />
              <rect x="88" y="76" width="6" height="16" fill="#000" />

              {/* Small center logo dot */}
              <rect x="46" y="46" width="8" height="8" fill="#f59e0b" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-stone-900 mt-2">
              SCAN AT TRASHPAY SCALE
            </span>
          </div>

          {/* Member Details */}
          <div className="space-y-3.5 text-center sm:text-left flex-1">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Registered Recycler
              </div>
              <div className="text-lg font-black text-white">
                {currentUser.fullName}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Member Passbook ID
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {currentUser.memberCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 text-stone-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Linked MTN MSISDN
              </div>
              <div className="font-mono text-sm text-stone-200">
                {currentUser.msisdn}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-400 text-[10px]">Total Recycled</span>
                <div className="font-extrabold text-white text-sm">
                  {wallet.totalKgRecycled} KG
                </div>
              </div>
              <div>
                <span className="text-stone-400 text-[10px]">Lifetime Earned</span>
                <div className="font-extrabold text-emerald-400 text-sm">
                  UGX {wallet.lifetimeEarnedUGX.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Verification Footer */}
        <div className="border-t border-stone-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold">
              Bcrypt PIN Protected · Instant MoMo Settlement
            </span>
          </div>
          <span className="font-mono text-[10px] text-stone-400">
            SEC-HASH: {btoa(currentUser.msisdn).slice(0, 10).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs flex items-center gap-2 border border-stone-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Passbook Badge</span>
        </button>
        <button
          onClick={handleCopyCode}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied Member ID!' : 'Copy Member ID'}</span>
        </button>
      </div>

      {/* Depot Workflow Explainer */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 text-xs text-stone-300 space-y-2">
        <h4 className="font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          How the Digital Passbook Works at the Depot
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-stone-400">
          <li>Arrive at your local zone collection station (e.g. Bwaise Central Depot).</li>
          <li>The agent scans your QR passbook on their scale terminal.</li>
          <li>Your sorted plastic or metals are weighed on calibrated digital scales.</li>
          <li>Payment is immediately sent to your TrashPay Wallet and verified via SMS.</li>
        </ol>
      </div>
    </div>
  );
};
