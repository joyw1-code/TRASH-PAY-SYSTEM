import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneOff,
  CornerDownLeft,
  Delete,
  MessageSquare,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTrashPay } from '../context/TrashPayContext';

type USSDStep =
  | 'IDLE'
  | 'DIALING'
  | 'REG_WELCOME'
  | 'REG_NAME'
  | 'REG_ZONE'
  | 'REG_PIN'
  | 'REG_SUCCESS'
  | 'MAIN_MENU'
  | 'BALANCE_DISPLAY'
  | 'AIRTIME_RECIPIENT'
  | 'AIRTIME_OTHER_NUM'
  | 'AIRTIME_AMOUNT'
  | 'AIRTIME_PIN'
  | 'AIRTIME_SUCCESS'
  | 'UTILITY_CHOOSE'
  | 'YAKA_METER'
  | 'YAKA_AMOUNT'
  | 'YAKA_PIN'
  | 'YAKA_SUCCESS'
  | 'NSSF_MEMBER'
  | 'NSSF_AMOUNT'
  | 'NSSF_PIN'
  | 'NSSF_SUCCESS'
  | 'YINVESTA_MENU'
  | 'YINVESTA_AMOUNT'
  | 'YINVESTA_PIN'
  | 'YINVESTA_SUCCESS'
  | 'REPORT_DUMP_ZONE'
  | 'REPORT_DUMP_SEVERITY'
  | 'REPORT_DUMP_CONFIRM'
  | 'REPORT_DUMP_SUCCESS'
  | 'ERROR_SCREEN';

export const USSDPhoneSimulator: React.FC = () => {
  const {
    currentUser,
    wallet,
    buyAirtime,
    payUmemeYaka,
    payNssfVoluntary,
    investInYinvesta,
    submitWasteReport,
    smsMessages,
    markSmsAsRead,
  } = useTrashPay();

  const [dialPadInput, setDialPadInput] = useState<string>('*284*50#');
  const [ussdStep, setUssdStep] = useState<USSDStep>('IDLE');
  const [promptInput, setPromptInput] = useState<string>('');
  const [ussdMessage, setUssdMessage] = useState<string>('');
  const [activeTab, setActivePhoneTab] = useState<'screen' | 'sms'>('screen');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Temporary session payload
  const [sessionData, setSessionData] = useState<{
    regName?: string;
    regZone?: string;
    regPin?: string;
    airtimeTarget?: string;
    airtimeAmount?: number;
    meterNumber?: string;
    yakaAmount?: number;
    lastToken?: string;
    nssfNumber?: string;
    nssfAmount?: number;
    yinvestaAmount?: number;
    reportZone?: string;
    reportSeverity?: 'MODERATE' | 'CRITICAL' | 'HAZARDOUS';
    lastError?: string;
  }>({});

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Audio not supported or blocked
    }
  };

  const handleDialCode = (code = dialPadInput) => {
    playClickSound();
    if (code.trim() === '*284*50#') {
      setUssdStep('DIALING');
      setTimeout(() => {
        // If user has PIN, open Main Menu; otherwise show Registration
        if (currentUser.pin) {
          setUssdStep('MAIN_MENU');
          setPromptInput('');
        } else {
          setUssdStep('REG_WELCOME');
          setPromptInput('');
        }
      }, 500);
    } else {
      setUssdStep('ERROR_SCREEN');
      setUssdMessage('Connection error or invalid MMI code.\nPlease dial *284*50# for TrashPay.');
    }
  };

  const endCall = () => {
    playClickSound();
    setUssdStep('IDLE');
    setPromptInput('');
    setSessionData({});
  };

  const handleKeypadPress = (val: string) => {
    playClickSound();
    if (ussdStep === 'IDLE') {
      setDialPadInput((prev) => prev + val);
    } else {
      setPromptInput((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    playClickSound();
    if (ussdStep === 'IDLE') {
      setDialPadInput((prev) => prev.slice(0, -1));
    } else {
      setPromptInput((prev) => prev.slice(0, -1));
    }
  };

  const submitUSSDResponse = () => {
    playClickSound();
    const input = promptInput.trim();

    switch (ussdStep) {
      // --- REGISTRATION FLOW ---
      case 'REG_WELCOME':
        if (input === '1') {
          setUssdStep('REG_NAME');
          setPromptInput('');
        } else {
          endCall();
        }
        break;

      case 'REG_NAME':
        if (input.length > 1) {
          setSessionData((p) => ({ ...p, regName: input }));
          setUssdStep('REG_ZONE');
          setPromptInput('');
        }
        break;

      case 'REG_ZONE':
        const zoneMap: Record<string, string> = {
          '1': 'Bwaise',
          '2': 'Katanga',
          '3': 'Kasese',
          '4': 'Kawempe',
        };
        const selectedZone = zoneMap[input] || 'Bwaise';
        setSessionData((p) => ({ ...p, regZone: selectedZone }));
        setUssdStep('REG_PIN');
        setPromptInput('');
        break;

      case 'REG_PIN':
        if (input.length === 4) {
          setSessionData((p) => ({ ...p, regPin: input }));
          setUssdStep('REG_SUCCESS');
          setPromptInput('');
        }
        break;

      // --- MAIN MENU FLOW ---
      case 'MAIN_MENU':
        if (input === '1') {
          // Check Balance & KG
          setUssdStep('BALANCE_DISPLAY');
          setPromptInput('');
        } else if (input === '2') {
          // Quick Report Waste Dump
          setUssdStep('REPORT_DUMP_ZONE');
          setPromptInput('');
        } else if (input === '3') {
          // Buy Airtime
          setUssdStep('AIRTIME_RECIPIENT');
          setPromptInput('');
        } else if (input === '4') {
          // Pay Utilities
          setUssdStep('UTILITY_CHOOSE');
          setPromptInput('');
        } else if (input === '5') {
          // MTN Yinvesta
          setUssdStep('YINVESTA_MENU');
          setPromptInput('');
        } else if (input === '0') {
          endCall();
        } else {
          // invalid choice
          setPromptInput('');
        }
        break;

      // --- BALANCE DISPLAY ---
      case 'BALANCE_DISPLAY':
        endCall();
        break;

      // --- AIRTIME FLOW ---
      case 'AIRTIME_RECIPIENT':
        if (input === '1') {
          setSessionData((p) => ({ ...p, airtimeTarget: currentUser.msisdn }));
          setUssdStep('AIRTIME_AMOUNT');
          setPromptInput('');
        } else if (input === '2') {
          setUssdStep('AIRTIME_OTHER_NUM');
          setPromptInput('');
        }
        break;

      case 'AIRTIME_OTHER_NUM':
        if (input.length >= 9) {
          setSessionData((p) => ({ ...p, airtimeTarget: input }));
          setUssdStep('AIRTIME_AMOUNT');
          setPromptInput('');
        }
        break;

      case 'AIRTIME_AMOUNT':
        const amt = parseInt(input, 10);
        if (!isNaN(amt) && amt >= 500) {
          setSessionData((p) => ({ ...p, airtimeAmount: amt }));
          setUssdStep('AIRTIME_PIN');
          setPromptInput('');
        }
        break;

      case 'AIRTIME_PIN':
        const resAirtime = buyAirtime({
          phone: sessionData.airtimeTarget || currentUser.msisdn,
          amountUGX: sessionData.airtimeAmount || 3000,
          pin: input,
        });
        if (resAirtime.success) {
          setUssdStep('AIRTIME_SUCCESS');
        } else {
          setUssdStep('ERROR_SCREEN');
          setUssdMessage(resAirtime.message);
        }
        setPromptInput('');
        break;

      // --- UTILITIES FLOW ---
      case 'UTILITY_CHOOSE':
        if (input === '1') {
          setUssdStep('YAKA_METER');
          setPromptInput('');
        } else if (input === '2') {
          setUssdStep('NSSF_MEMBER');
          setPromptInput('');
        }
        break;

      case 'YAKA_METER':
        if (input.length >= 6) {
          setSessionData((p) => ({ ...p, meterNumber: input }));
          setUssdStep('YAKA_AMOUNT');
          setPromptInput('');
        }
        break;

      case 'YAKA_AMOUNT':
        const yamt = parseInt(input, 10);
        if (!isNaN(yamt) && yamt >= 2000) {
          setSessionData((p) => ({ ...p, yakaAmount: yamt }));
          setUssdStep('YAKA_PIN');
          setPromptInput('');
        }
        break;

      case 'YAKA_PIN':
        const yakaRes = payUmemeYaka({
          meterNumber: sessionData.meterNumber || '04152637891',
          amountUGX: sessionData.yakaAmount || 50000,
          pin: input,
        });
        if (yakaRes.success) {
          setSessionData((p) => ({ ...p, lastToken: yakaRes.token }));
          setUssdStep('YAKA_SUCCESS');
        } else {
          setUssdStep('ERROR_SCREEN');
          setUssdMessage(yakaRes.message);
        }
        setPromptInput('');
        break;

      case 'NSSF_MEMBER':
        if (input.length >= 6) {
          setSessionData((p) => ({ ...p, nssfNumber: input }));
          setUssdStep('NSSF_AMOUNT');
          setPromptInput('');
        }
        break;

      case 'NSSF_AMOUNT':
        const namt = parseInt(input, 10);
        if (!isNaN(namt) && namt >= 5000) {
          setSessionData((p) => ({ ...p, nssfAmount: namt }));
          setUssdStep('NSSF_PIN');
          setPromptInput('');
        }
        break;

      case 'NSSF_PIN':
        const nssfRes = payNssfVoluntary({
          nssfNumber: sessionData.nssfNumber || 'NSSF-89102',
          amountUGX: sessionData.nssfAmount || 20000,
          pin: input,
        });
        if (nssfRes.success) {
          setUssdStep('NSSF_SUCCESS');
        } else {
          setUssdStep('ERROR_SCREEN');
          setUssdMessage(nssfRes.message);
        }
        setPromptInput('');
        break;

      // --- YINVESTA FLOW ---
      case 'YINVESTA_MENU':
        if (input === '1') {
          setUssdStep('YINVESTA_AMOUNT');
          setPromptInput('');
        } else {
          endCall();
        }
        break;

      case 'YINVESTA_AMOUNT':
        const yinvAmt = parseInt(input, 10);
        if (!isNaN(yinvAmt) && yinvAmt >= 500) {
          setSessionData((p) => ({ ...p, yinvestaAmount: yinvAmt }));
          setUssdStep('YINVESTA_PIN');
          setPromptInput('');
        }
        break;

      case 'YINVESTA_PIN':
        const yinvRes = investInYinvesta({
          amountUGX: sessionData.yinvestaAmount || 15000,
          pin: input,
        });
        if (yinvRes.success) {
          setUssdStep('YINVESTA_SUCCESS');
        } else {
          setUssdStep('ERROR_SCREEN');
          setUssdMessage(yinvRes.message);
        }
        setPromptInput('');
        break;

      // --- TRASH REPORT FLOW ---
      case 'REPORT_DUMP_ZONE':
        const zMap: Record<string, string> = {
          '1': 'Bwaise',
          '2': 'Katanga',
          '3': 'Kasese',
          '4': 'Kawempe',
        };
        const dumpZone = zMap[input] || 'Bwaise';
        setSessionData((p) => ({ ...p, reportZone: dumpZone }));
        setUssdStep('REPORT_DUMP_SEVERITY');
        setPromptInput('');
        break;

      case 'REPORT_DUMP_SEVERITY':
        let sev: 'MODERATE' | 'CRITICAL' | 'HAZARDOUS' = 'CRITICAL';
        if (input === '1') sev = 'MODERATE';
        if (input === '2') sev = 'CRITICAL';
        if (input === '3') sev = 'HAZARDOUS';
        setSessionData((p) => ({ ...p, reportSeverity: sev }));
        setUssdStep('REPORT_DUMP_CONFIRM');
        setPromptInput('');
        break;

      case 'REPORT_DUMP_CONFIRM':
        if (input === '1') {
          submitWasteReport({
            title: `USSD Dump Alert (${sessionData.reportZone})`,
            zone: sessionData.reportZone || 'Bwaise',
            description: `Citizen alert via USSD *284*50#. Unmanaged pile obstructing community access.`,
            locationName: `${sessionData.reportZone} Sector Hub`,
            lat: 0.3541,
            lng: 32.5612,
            photoUrl:
              'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
            reporterMsisdn: currentUser.msisdn,
            reporterName: currentUser.fullName,
            severity: sessionData.reportSeverity || 'CRITICAL',
            bountyUGX: 5000,
          });
          setUssdStep('REPORT_DUMP_SUCCESS');
          setPromptInput('');
        } else {
          endCall();
        }
        break;

      default:
        endCall();
        break;
    }
  };

  const remainingKgToMilestone = Math.max(
    0,
    Math.round((wallet.milestoneTargetUGX - wallet.balanceUGX) / 1000)
  );

  return (
    <div className="flex flex-col items-center">
      {/* Phone Casing */}
      <div className="relative w-[320px] bg-gradient-to-b from-stone-800 to-stone-950 p-4 rounded-[40px] shadow-2xl border-4 border-stone-700/80">
        {/* Speaker slot & branding */}
        <div className="flex items-center justify-between px-3 pt-1 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] tracking-wider font-semibold text-stone-400 uppercase">
              MTN-UG 4G
            </span>
          </div>
          <div className="w-12 h-1.5 bg-stone-700 rounded-full mx-auto"></div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-stone-400 hover:text-white transition-colors"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Tab switcher: Screen vs SMS */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex gap-1 bg-stone-900/90 p-0.5 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setActivePhoneTab('screen')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'screen'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              USSD Screen
            </button>
            <button
              onClick={() => setActivePhoneTab('sms')}
              className={`px-3 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                activeTab === 'sms'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>SMS ({smsMessages.length})</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 font-bold">
            *284*50#
          </span>
        </div>

        {/* SCREEN AREA */}
        <div className="relative w-full h-[250px] bg-[#d9e8c4] border-4 border-stone-900 rounded-lg p-2.5 shadow-inner overflow-hidden font-mono text-stone-900 text-xs flex flex-col justify-between select-none">
          {activeTab === 'sms' ? (
            // SMS Inbox View
            <div className="h-full flex flex-col overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
              <div className="text-[11px] font-bold border-b border-stone-600 pb-1 flex justify-between items-center text-stone-950">
                <span>INBOX ({smsMessages.length})</span>
                <span className="text-[9px] text-stone-700">MTN SIM 1</span>
              </div>
              {smsMessages.map((sms) => (
                <div
                  key={sms.id}
                  onClick={() => markSmsAsRead(sms.id)}
                  className={`p-1.5 rounded border text-[10px] leading-tight ${
                    sms.read
                      ? 'bg-[#c9dcb2] border-stone-400/70 text-stone-800'
                      : 'bg-[#b8d49a] border-stone-600 font-semibold text-stone-950 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between text-[9px] font-bold text-stone-900 mb-0.5">
                    <span>{sms.sender}</span>
                    <span>{sms.timestamp}</span>
                  </div>
                  <p>{sms.text}</p>
                </div>
              ))}
            </div>
          ) : (
            // USSD Interactive Screen
            <div className="h-full flex flex-col justify-between">
              {ussdStep === 'IDLE' && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-2">
                  <div className="text-[10px] text-stone-700 tracking-wide">
                    MTN UGANDA · READY
                  </div>
                  <div className="text-xl font-black text-stone-950 tracking-wider">
                    {dialPadInput || '_'}
                  </div>
                  <p className="text-[10px] text-stone-600 mt-2">
                    Dial <span className="font-bold text-stone-900">*284*50#</span> to open TrashPay
                  </p>
                </div>
              )}

              {ussdStep === 'DIALING' && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-2">
                  <div className="animate-spin w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full"></div>
                  <div className="text-sm font-bold text-stone-950">Running USSD code...</div>
                  <div className="text-[10px] text-stone-700">*284*50#</div>
                </div>
              )}

              {/* USSD MODAL SCREEN DIALOG */}
              {ussdStep !== 'IDLE' && ussdStep !== 'DIALING' && (
                <div className="h-full flex flex-col justify-between text-[11px] leading-snug">
                  <div className="overflow-y-auto max-h-[175px] pr-1">
                    {/* Welcome / Reg */}
                    {ussdStep === 'REG_WELCOME' && (
                      <div>
                        <p className="font-bold mb-1">Welcome to TrashPay Uganda!</p>
                        <p>1. Register Now</p>
                        <p>2. Exit</p>
                      </div>
                    )}
                    {ussdStep === 'REG_NAME' && (
                      <div>
                        <p className="font-bold mb-1">TrashPay Registration</p>
                        <p>Enter your Full Name:</p>
                      </div>
                    )}
                    {ussdStep === 'REG_ZONE' && (
                      <div>
                        <p className="font-bold mb-1">Select Zone:</p>
                        <p>1. Bwaise</p>
                        <p>2. Katanga</p>
                        <p>3. Kasese</p>
                        <p>4. Other</p>
                      </div>
                    )}
                    {ussdStep === 'REG_PIN' && (
                      <div>
                        <p className="font-bold mb-1">Create 4-digit PIN</p>
                        <p>To secure your wallet:</p>
                      </div>
                    )}
                    {ussdStep === 'REG_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">Registration Successful!</p>
                        <p>Your TrashPay Wallet is active.</p>
                        <p className="mt-1">Dial *284*50# anytime to check balance and pay bills.</p>
                      </div>
                    )}

                    {/* MAIN MENU */}
                    {ussdStep === 'MAIN_MENU' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">TrashPay (*284*50#)</p>
                        <p>1. Check Balance & KG</p>
                        <p>2. Report Waste Dump</p>
                        <p>3. Buy Airtime</p>
                        <p>4. Pay Utilities</p>
                        <p>5. MTN Yinvesta</p>
                        <p>0. Exit</p>
                      </div>
                    )}

                    {/* BALANCE */}
                    {ussdStep === 'BALANCE_DISPLAY' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">TrashPay Balance</p>
                        <p>Total Recycled: <span className="font-bold">{wallet.totalKgRecycled} KG</span></p>
                        <p>Current Balance: <span className="font-bold">UGX {wallet.balanceUGX.toLocaleString()}</span></p>
                        <p className="mt-1 text-[10px] text-stone-700">
                          Status: {remainingKgToMilestone > 0 ? `${remainingKgToMilestone} KG away from UGX 200k Milestone!` : '★ UGX 200k Milestone Achieved!'}
                        </p>
                      </div>
                    )}

                    {/* AIRTIME */}
                    {ussdStep === 'AIRTIME_RECIPIENT' && (
                      <div>
                        <p className="font-bold mb-1">Buy MTN Airtime</p>
                        <p>Select Recipient:</p>
                        <p>1. Self ({currentUser.msisdn})</p>
                        <p>2. Other Number</p>
                      </div>
                    )}
                    {ussdStep === 'AIRTIME_OTHER_NUM' && (
                      <div>
                        <p className="font-bold mb-1">Buy Airtime</p>
                        <p>Enter Recipient Phone (e.g. 0770123456):</p>
                      </div>
                    )}
                    {ussdStep === 'AIRTIME_AMOUNT' && (
                      <div>
                        <p className="font-bold mb-1">Buy Airtime</p>
                        <p>Enter Amount (UGX):</p>
                      </div>
                    )}
                    {ussdStep === 'AIRTIME_PIN' && (
                      <div>
                        <p className="font-bold mb-1">Confirm Airtime</p>
                        <p>UGX {sessionData.airtimeAmount?.toLocaleString()} to {sessionData.airtimeTarget}</p>
                        <p className="mt-1">Enter your 4-digit PIN:</p>
                      </div>
                    )}
                    {ussdStep === 'AIRTIME_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">SUCCESS!</p>
                        <p>UGX {sessionData.airtimeAmount?.toLocaleString()} airtime credited.</p>
                        <p className="mt-1">New Balance: UGX {wallet.balanceUGX.toLocaleString()}.</p>
                      </div>
                    )}

                    {/* UTILITIES */}
                    {ussdStep === 'UTILITY_CHOOSE' && (
                      <div>
                        <p className="font-bold mb-1">Pay Utilities</p>
                        <p>1. Umeme Yaka</p>
                        <p>2. Voluntary NSSF</p>
                      </div>
                    )}
                    {ussdStep === 'YAKA_METER' && (
                      <div>
                        <p className="font-bold mb-1">Umeme Yaka Electricity</p>
                        <p>Enter Umeme Meter Number:</p>
                        <p className="text-[9px] text-stone-600">(e.g. 04152637891)</p>
                      </div>
                    )}
                    {ussdStep === 'YAKA_AMOUNT' && (
                      <div>
                        <p className="font-bold mb-1">Umeme Yaka</p>
                        <p>Enter Amount (UGX):</p>
                      </div>
                    )}
                    {ussdStep === 'YAKA_PIN' && (
                      <div>
                        <p className="font-bold mb-1">Authorize Yaka</p>
                        <p>Meter: {sessionData.meterNumber}</p>
                        <p>Amt: UGX {sessionData.yakaAmount?.toLocaleString()}</p>
                        <p className="mt-1">Enter 4-digit PIN:</p>
                      </div>
                    )}
                    {ussdStep === 'YAKA_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-0.5">SUCCESS!</p>
                        <p className="text-[10px]">Yaka Token:</p>
                        <p className="font-mono font-bold text-stone-950 bg-stone-300/60 p-0.5 text-center my-0.5">
                          {sessionData.lastToken || '4920-3819-5820-1928'}
                        </p>
                        <p className="text-[10px]">New Balance: UGX {wallet.balanceUGX.toLocaleString()}.</p>
                      </div>
                    )}
                    {ussdStep === 'NSSF_MEMBER' && (
                      <div>
                        <p className="font-bold mb-1">Voluntary NSSF</p>
                        <p>Enter NSSF Member ID:</p>
                      </div>
                    )}
                    {ussdStep === 'NSSF_AMOUNT' && (
                      <div>
                        <p className="font-bold mb-1">NSSF Contribution</p>
                        <p>Enter Amount (UGX):</p>
                      </div>
                    )}
                    {ussdStep === 'NSSF_PIN' && (
                      <div>
                        <p className="font-bold mb-1">Confirm NSSF</p>
                        <p>Member: {sessionData.nssfNumber}</p>
                        <p>Enter 4-digit PIN:</p>
                      </div>
                    )}
                    {ussdStep === 'NSSF_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">SUCCESS!</p>
                        <p>NSSF Contribution processed.</p>
                        <p className="mt-1">New Balance: UGX {wallet.balanceUGX.toLocaleString()}.</p>
                      </div>
                    )}

                    {/* YINVESTA */}
                    {ussdStep === 'YINVESTA_MENU' && (
                      <div>
                        <p className="font-bold mb-1">MTN Yinvesta Wealth</p>
                        <p>1. Invest with Yinvesta</p>
                        <p className="text-[9px] text-stone-700">(Starting from UGX 500)</p>
                      </div>
                    )}
                    {ussdStep === 'YINVESTA_AMOUNT' && (
                      <div>
                        <p className="font-bold mb-1">Invest with Yinvesta</p>
                        <p>Enter Investment Amount (UGX):</p>
                      </div>
                    )}
                    {ussdStep === 'YINVESTA_PIN' && (
                      <div>
                        <p className="font-bold mb-1">Authorize Yinvesta</p>
                        <p>Amount: UGX {sessionData.yinvestaAmount?.toLocaleString()}</p>
                        <p>Enter 4-digit PIN:</p>
                      </div>
                    )}
                    {ussdStep === 'YINVESTA_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">SUCCESS!</p>
                        <p>UGX {sessionData.yinvestaAmount?.toLocaleString()} invested into Yinvesta.</p>
                        <p>Earning daily interest.</p>
                        <p className="mt-1">New Balance: UGX {wallet.balanceUGX.toLocaleString()}.</p>
                      </div>
                    )}

                    {/* REPORT DUMP */}
                    {ussdStep === 'REPORT_DUMP_ZONE' && (
                      <div>
                        <p className="font-bold mb-1">Report Waste Dump</p>
                        <p>Select Zone:</p>
                        <p>1. Bwaise 2. Katanga</p>
                        <p>3. Kasese 4. Kawempe</p>
                      </div>
                    )}
                    {ussdStep === 'REPORT_DUMP_SEVERITY' && (
                      <div>
                        <p className="font-bold mb-1">Dump Size:</p>
                        <p>1. Moderate</p>
                        <p>2. Critical (Blocking Drain)</p>
                        <p>3. Hazardous</p>
                      </div>
                    )}
                    {ussdStep === 'REPORT_DUMP_CONFIRM' && (
                      <div>
                        <p className="font-bold mb-1">Submit Report?</p>
                        <p>Zone: {sessionData.reportZone}</p>
                        <p>Bounty: UGX 5,000 on cleanup.</p>
                        <p className="mt-1">1. Yes, Send Alert</p>
                        <p>2. Cancel</p>
                      </div>
                    )}
                    {ussdStep === 'REPORT_DUMP_SUCCESS' && (
                      <div>
                        <p className="font-bold text-stone-950 mb-1">Alert Dispatched!</p>
                        <p>Zone collector notified.</p>
                        <p className="mt-1">You will receive an SMS when verified cleaned.</p>
                      </div>
                    )}

                    {/* ERROR */}
                    {ussdStep === 'ERROR_SCREEN' && (
                      <div>
                        <p className="font-bold text-red-950 mb-1">Notice</p>
                        <p className="text-[10px]">{ussdMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* Input field inside USSD Dialog */}
                  {![
                    'BALANCE_DISPLAY',
                    'AIRTIME_SUCCESS',
                    'YAKA_SUCCESS',
                    'NSSF_SUCCESS',
                    'YINVESTA_SUCCESS',
                    'REG_SUCCESS',
                    'REPORT_DUMP_SUCCESS',
                    'ERROR_SCREEN',
                  ].includes(ussdStep) ? (
                    <div className="border-t border-stone-600/70 pt-1 flex items-center gap-1">
                      <span className="font-bold">&gt;</span>
                      <input
                        type="text"
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitUSSDResponse()}
                        autoFocus
                        className="bg-transparent border-none outline-hidden w-full font-mono font-bold text-stone-950 text-xs"
                        placeholder="Reply..."
                      />
                    </div>
                  ) : (
                    <div className="border-t border-stone-600/70 pt-1 text-center font-bold text-[10px] text-stone-800">
                      Press [End] or [Send] to close
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Bar (Softkeys) */}
        <div className="grid grid-cols-2 gap-2 my-2 px-1">
          {ussdStep === 'IDLE' ? (
            <button
              onClick={() => handleDialCode(dialPadInput)}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call / Dial</span>
            </button>
          ) : (
            <button
              onClick={submitUSSDResponse}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Send / OK</span>
            </button>
          )}

          <button
            onClick={endCall}
            className="py-1.5 px-3 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End / Back</span>
          </button>
        </div>

        {/* Feature Phone Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2 px-1 pt-1">
          {[
            { key: '1', sub: 'oo' },
            { key: '2', sub: 'abc' },
            { key: '3', sub: 'def' },
            { key: '4', sub: 'ghi' },
            { key: '5', sub: 'jkl' },
            { key: '6', sub: 'mno' },
            { key: '7', sub: 'pqrs' },
            { key: '8', sub: 'tuv' },
            { key: '9', sub: 'wxyz' },
            { key: '*', sub: '+' },
            { key: '0', sub: '␣' },
            { key: '#', sub: '⌂' },
          ].map(({ key, sub }) => (
            <button
              key={key}
              onClick={() => handleKeypadPress(key)}
              className="h-11 bg-gradient-to-b from-stone-700 to-stone-800 hover:from-stone-600 hover:to-stone-700 active:bg-amber-400 active:text-stone-950 text-white rounded-xl flex flex-col items-center justify-center border-b-2 border-stone-900 shadow-sm transition-transform active:translate-y-0.5"
            >
              <span className="font-bold text-sm leading-none">{key}</span>
              <span className="text-[9px] text-stone-400 uppercase tracking-tighter leading-none mt-0.5">
                {sub}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Utility Keys */}
        <div className="flex justify-between items-center px-2 pt-2.5">
          <button
            onClick={handleBackspace}
            className="text-[10px] text-stone-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <span className="text-[10px] text-amber-400/90 font-semibold tracking-wider">
            MTN TRASHPAY
          </span>
          <button
            onClick={() => {
              setDialPadInput('*284*50#');
              handleDialCode('*284*50#');
            }}
            className="text-[10px] text-amber-400 hover:text-amber-300 font-mono font-bold underline"
          >
            Quick Dial
          </button>
        </div>
      </div>

      {/* Quick Test Actions Palette */}
      <div className="mt-3 w-[320px] bg-stone-900/90 border border-stone-800 rounded-xl p-3 text-xs text-stone-300">
        <div className="flex items-center justify-between font-bold text-amber-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> 1-Click USSD Test Presets
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            onClick={() => {
              setUssdStep('MAIN_MENU');
              setPromptInput('');
            }}
            className="py-1 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-left transition-colors"
          >
            ✦ Main Menu
          </button>
          <button
            onClick={() => {
              setUssdStep('BALANCE_DISPLAY');
              setPromptInput('');
            }}
            className="py-1 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-left transition-colors"
          >
            ✦ Check Balance
          </button>
          <button
            onClick={() => {
              setUssdStep('AIRTIME_PIN');
              setSessionData({ airtimeTarget: currentUser.msisdn, airtimeAmount: 3000 });
              setPromptInput('4829');
            }}
            className="py-1 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-left transition-colors"
          >
            ✦ Airtime UGX 3k
          </button>
          <button
            onClick={() => {
              setUssdStep('YAKA_PIN');
              setSessionData({ meterNumber: '04152637891', yakaAmount: 50000 });
              setPromptInput('4829');
            }}
            className="py-1 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-left transition-colors"
          >
            ✦ Yaka UGX 50k
          </button>
          <button
            onClick={() => {
              setUssdStep('YINVESTA_PIN');
              setSessionData({ yinvestaAmount: 15000 });
              setPromptInput('4829');
            }}
            className="col-span-2 py-1 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 text-left transition-colors"
          >
            ✦ MTN Yinvesta Deposit (UGX 15,000)
          </button>
        </div>
      </div>
    </div>
  );
};
