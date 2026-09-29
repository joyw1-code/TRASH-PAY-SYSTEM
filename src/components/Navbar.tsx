import React from 'react';
import {
  Recycle,
  Smartphone,
  QrCode,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    setCurrentUser,
    activeTab,
    setActiveTab,
    showPhoneSimulator,
    setShowPhoneSimulator,
    resetDemoData,
  } = useTrashPay();

  return (
    <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-500 flex items-center justify-center text-stone-950 font-black shadow-md">
              <Recycle className="w-6 h-6 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  TrashPay
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded">
                  MTN Rails
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium hidden sm:block">
                PachiPanda Challenge 2026 · USSD &amp; Web Circular Economy
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'passbook', label: 'QR Passbook' },
              { id: 'agent_desk', label: 'Agent Depot Desk' },
              { id: 'reporting', label: 'Citizen Reports' },
              { id: 'utilities', label: 'Utilities (Yaka)' },
              { id: 'airtime', label: 'Airtime' },
              { id: 'yinvesta', label: 'Yinvesta Wealth' },
              { id: 'pachipanda', label: 'PachiPanda Pitch' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-stone-800 text-amber-400 shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions & Persona Selector */}
          <div className="flex items-center gap-2">
            {/* Phone Toggle */}
            <button
              onClick={() => setShowPhoneSimulator(!showPhoneSimulator)}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                showPhoneSimulator
                  ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
              title="Toggle Feature Phone USSD Simulator"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline font-mono font-bold">*284*50#</span>
            </button>

            {/* User Persona Switcher */}
            <div className="flex items-center bg-stone-800/90 border border-stone-700 rounded-lg p-1">
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const target = users.find((u) => u.id === e.target.value);
                  if (target) setCurrentUser(target);
                }}
                className="bg-transparent text-xs text-stone-200 font-medium outline-hidden pr-2 cursor-pointer"
              >
                <option value="usr_elijah" className="bg-stone-800 text-stone-200">
                  Elijah Nizeyimana (Recycler)
                </option>
                <option value="usr_joy" className="bg-stone-800 text-stone-200">
                  Joy Wabule (Depot Agent)
                </option>
                <option value="usr_sarah" className="bg-stone-800 text-stone-200">
                  Sarah Nakato (Katanga Recycler)
                </option>
              </select>
            </div>

            {/* Reset State Helper */}
            <button
              onClick={resetDemoData}
              title="Reset Demo State"
              className="p-2 text-stone-400 hover:text-amber-400 bg-stone-800/60 border border-stone-700/60 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Submenu Tabs */}
        <div className="lg:hidden flex overflow-x-auto space-x-1 pb-2 pt-1 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'passbook', label: 'Passbook' },
            { id: 'agent_desk', label: 'Agent Desk' },
            { id: 'reporting', label: 'Reports' },
            { id: 'utilities', label: 'Utilities' },
            { id: 'airtime', label: 'Airtime' },
            { id: 'yinvesta', label: 'Yinvesta' },
            { id: 'pachipanda', label: 'PachiPanda' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 text-[11px] whitespace-nowrap font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-300 bg-stone-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
