import React from 'react';
import { TrashPayProvider, useTrashPay } from './context/TrashPayContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { QRPassbookView } from './components/QRPassbookView';
import { AgentCollectionDesk } from './components/AgentCollectionDesk';
import { TrashReportingView } from './components/TrashReportingView';
import { UtilitiesView } from './components/UtilitiesView';
import { AirtimeView } from './components/AirtimeView';
import { YinvestaWealthView } from './components/YinvestaWealthView';
import { PachiPandaPitchView } from './components/PachiPandaPitchView';
import { USSDPhoneSimulator } from './components/USSDPhoneSimulator';
import { Smartphone, X, ExternalLink, Leaf, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, showPhoneSimulator, setShowPhoneSimulator } = useTrashPay();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Dual-View Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Web Portal Screen Container */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'passbook' && <QRPassbookView />}
            {activeTab === 'agent_desk' && <AgentCollectionDesk />}
            {activeTab === 'reporting' && <TrashReportingView />}
            {activeTab === 'utilities' && <UtilitiesView />}
            {activeTab === 'airtime' && <AirtimeView />}
            {activeTab === 'yinvesta' && <YinvestaWealthView />}
            {activeTab === 'pachipanda' && <PachiPandaPitchView />}
          </div>

          {/* Feature Phone Simulator Dock (Side-by-Side or Floating) */}
          {showPhoneSimulator && (
            <div className="w-full xl:w-[350px] shrink-0 sticky top-20 bg-stone-900/60 p-4 rounded-3xl border border-stone-800 shadow-xl backdrop-blur-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                    Live USSD Channel (*284*50#)
                  </span>
                </div>
                <button
                  onClick={() => setShowPhoneSimulator(false)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
                  title="Close Phone Simulator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <USSDPhoneSimulator />
            </div>
          )}
        </div>
      </main>

      {/* Floating Toggle if Simulator Closed */}
      {!showPhoneSimulator && (
        <button
          onClick={() => setShowPhoneSimulator(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border-2 border-amber-300 transition-transform active:scale-95"
        >
          <Smartphone className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-mono font-bold tracking-tight">Open USSD Phone (*284*50#)</span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 text-stone-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="font-extrabold text-white">TrashPay</span>
            <span>·</span>
            <span>MTN Uganda × WWF PachiPanda Innovation Challenge 2026</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Team: <strong>Joy Wabule</strong> &amp; <strong>Elijah Nizeyimana</strong></span>
            <span>·</span>
            <span className="text-amber-400 font-mono">Bwaise &amp; Katanga Circular Pilots</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TrashPayProvider>
      <MainContent />
    </TrashPayProvider>
  );
}
