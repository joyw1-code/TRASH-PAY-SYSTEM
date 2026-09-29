import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Wallet,
  Transaction,
  WasteReport,
  YinvestaGoal,
  SMSMessage,
  MaterialTariff,
  MaterialCategory,
  DumpStatus,
} from '../types/trashpay';
import {
  INITIAL_USERS,
  MATERIAL_TARIFFS,
  INITIAL_TRANSACTIONS,
  INITIAL_REPORTS,
  INITIAL_YINVESTA_GOALS,
  INITIAL_SMS_MESSAGES,
} from '../data/mockData';

interface TrashPayContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  wallet: Wallet;
  transactions: Transaction[];
  reports: WasteReport[];
  yinvestaGoals: YinvestaGoal[];
  smsMessages: SMSMessage[];
  tariffs: MaterialTariff[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showPhoneSimulator: boolean;
  setShowPhoneSimulator: (show: boolean) => void;
  unreadSmsCount: number;
  markSmsAsRead: (id: string) => void;
  
  // Business logic actions
  recordRecycleDrop: (params: {
    recyclerId: string;
    materialId: MaterialCategory;
    weightKg: number;
    zone: string;
  }) => { payout: number; yinvestaSplit: number; newBalance: number; newKg: number };
  
  buyAirtime: (params: {
    phone: string;
    amountUGX: number;
    pin: string;
  }) => { success: boolean; message: string };
  
  payUmemeYaka: (params: {
    meterNumber: string;
    amountUGX: number;
    pin: string;
  }) => { success: boolean; token?: string; message: string; unitsKwh?: number };
  
  payNssfVoluntary: (params: {
    nssfNumber: string;
    amountUGX: number;
    pin: string;
  }) => { success: boolean; receipt?: string; message: string };
  
  investInYinvesta: (params: {
    amountUGX: number;
    goalId?: string;
    pin: string;
  }) => { success: boolean; message: string };
  
  withdrawYinvesta: (params: {
    amountUGX: number;
    pin: string;
  }) => { success: boolean; message: string };
  
  setAutoInvestPercentage: (percent: number) => void;
  
  submitWasteReport: (
    report: Omit<WasteReport, 'id' | 'submittedAt' | 'status'>
  ) => WasteReport;
  
  updateReportStatus: (
    reportId: string,
    status: DumpStatus,
    agentName?: string
  ) => void;
  
  claimMilestoneBonus: () => void;
  resetDemoData: () => void;
}

const TrashPayContext = createContext<TrashPayContextType | undefined>(undefined);

export const TrashPayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('tp_current_user_id') || 'usr_elijah';
  });

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [wallet, setWallet] = useState<Wallet>(() => {
    const saved = localStorage.getItem('tp_wallet_usr_elijah');
    return saved
      ? JSON.parse(saved)
      : {
          userId: 'usr_elijah',
          balanceUGX: 185000,
          totalKgRecycled: 210,
          co2SavedKg: 388.5,
          milestoneTargetUGX: 200000,
          milestoneRewardClaimed: false,
          yinvestaBalanceUGX: 45000,
          autoInvestPercentage: 10,
          lifetimeEarnedUGX: 245000,
        };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tp_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [reports, setReports] = useState<WasteReport[]>(() => {
    const saved = localStorage.getItem('tp_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [yinvestaGoals, setYinvestaGoals] = useState<YinvestaGoal[]>(() => {
    const saved = localStorage.getItem('tp_yinvesta_goals');
    return saved ? JSON.parse(saved) : INITIAL_YINVESTA_GOALS;
  });

  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>(() => {
    const saved = localStorage.getItem('tp_sms');
    return saved ? JSON.parse(saved) : INITIAL_SMS_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showPhoneSimulator, setShowPhoneSimulator] = useState<boolean>(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tp_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('tp_wallet_usr_elijah', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('tp_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tp_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('tp_yinvesta_goals', JSON.stringify(yinvestaGoals));
  }, [yinvestaGoals]);

  useEffect(() => {
    localStorage.setItem('tp_sms', JSON.stringify(smsMessages));
  }, [smsMessages]);

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const markSmsAsRead = (id: string) => {
    setSmsMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  const unreadSmsCount = smsMessages.filter((m) => !m.read).length;

  const sendSMS = (sender: string, text: string) => {
    const newMsg: SMSMessage = {
      id: `sms_${Date.now()}`,
      recipientMsisdn: currentUser.msisdn,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setSmsMessages((prev) => [newMsg, ...prev]);
  };

  const recordRecycleDrop = ({
    recyclerId,
    materialId,
    weightKg,
    zone,
  }: {
    recyclerId: string;
    materialId: MaterialCategory;
    weightKg: number;
    zone: string;
  }) => {
    const tariff = MATERIAL_TARIFFS.find((t) => t.id === materialId) || MATERIAL_TARIFFS[0];
    const grossPayout = Math.round(weightKg * tariff.ratePerKgUGX);
    const co2Offset = Number((weightKg * tariff.co2PerKg).toFixed(1));

    const autoSplit = Math.round((grossPayout * wallet.autoInvestPercentage) / 100);
    const netCashPayout = grossPayout - autoSplit;

    const newBalance = wallet.balanceUGX + netCashPayout;
    const newKg = wallet.totalKgRecycled + weightKg;
    const newCo2 = Number((wallet.co2SavedKg + co2Offset).toFixed(1));
    const newYinvesta = wallet.yinvestaBalanceUGX + autoSplit;

    setWallet((prev) => ({
      ...prev,
      balanceUGX: newBalance,
      totalKgRecycled: newKg,
      co2SavedKg: newCo2,
      yinvestaBalanceUGX: newYinvesta,
      lifetimeEarnedUGX: prev.lifetimeEarnedUGX + grossPayout,
    }));

    const txId = `tx_${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      userId: recyclerId,
      type: 'RECYCLE_PAYOUT',
      title: `Recycle Weigh & Pay: ${weightKg}kg ${tariff.name}`,
      amountUGX: grossPayout,
      isDebit: false,
      reference: `TRP-DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'COMPLETED',
      timestamp: 'Just now',
      metadata: {
        materialType: tariff.name,
        weightKg,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Send SMS Notification
    sendSMS(
      'MTN-TrashPay',
      `TrashPay: Recycled ${weightKg} KG (${tariff.name}) at ${zone} Depot. Payout: UGX ${grossPayout.toLocaleString()} (Cash: UGX ${netCashPayout.toLocaleString()}, Yinvesta Auto-Save: UGX ${autoSplit.toLocaleString()}). Total Recycled: ${newKg} KG. Balance: UGX ${newBalance.toLocaleString()}.`
    );

    // Check Milestone:
    if (newBalance >= wallet.milestoneTargetUGX && !wallet.milestoneRewardClaimed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return {
      payout: grossPayout,
      yinvestaSplit: autoSplit,
      newBalance,
      newKg,
    };
  };

  const buyAirtime = ({
    phone,
    amountUGX,
    pin,
  }: {
    phone: string;
    amountUGX: number;
    pin: string;
  }) => {
    if (pin !== currentUser.pin) {
      return { success: false, message: 'Invalid 4-digit PIN entered. Please try again.' };
    }
    if (wallet.balanceUGX < amountUGX) {
      return {
        success: false,
        message: `Insufficient wallet balance. You have UGX ${wallet.balanceUGX.toLocaleString()}, but required UGX ${amountUGX.toLocaleString()}.`,
      };
    }

    const newBalance = wallet.balanceUGX - amountUGX;
    setWallet((prev) => ({ ...prev, balanceUGX: newBalance }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'AIRTIME_PURCHASE',
      title: `MTN Airtime Recharge (${phone === currentUser.msisdn ? 'Self' : phone})`,
      amountUGX: amountUGX,
      isDebit: true,
      reference: `AT-MTN-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'COMPLETED',
      timestamp: 'Just now',
      metadata: {
        phoneTarget: phone,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendSMS(
      'MTN-Airtime',
      `SUCCESS! UGX ${amountUGX.toLocaleString()} airtime credited to ${phone} via Africa's Talking API. TrashPay New Balance: UGX ${newBalance.toLocaleString()}.`
    );

    return { success: true, message: `Airtime of UGX ${amountUGX.toLocaleString()} sent successfully to ${phone}.` };
  };

  const payUmemeYaka = ({
    meterNumber,
    amountUGX,
    pin,
  }: {
    meterNumber: string;
    amountUGX: number;
    pin: string;
  }) => {
    if (pin !== currentUser.pin) {
      return { success: false, message: 'Invalid 4-digit PIN entered.' };
    }
    if (wallet.balanceUGX < amountUGX) {
      return {
        success: false,
        message: `Insufficient wallet balance. Balance is UGX ${wallet.balanceUGX.toLocaleString()}.`,
      };
    }

    // Generate authentic 20-digit token in 4 groups of 4 digits
    const g1 = Math.floor(1000 + Math.random() * 9000);
    const g2 = Math.floor(1000 + Math.random() * 9000);
    const g3 = Math.floor(1000 + Math.random() * 9000);
    const g4 = Math.floor(1000 + Math.random() * 9000);
    const token = `${g1}-${g2}-${g3}-${g4}`;
    const unitsKwh = Number((amountUGX / 856.2).toFixed(1)); // Realistic Umeme domestic tariff

    const newBalance = wallet.balanceUGX - amountUGX;
    setWallet((prev) => ({ ...prev, balanceUGX: newBalance }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'YAKA_ELECTRICITY',
      title: `Umeme Yaka Electricity (Meter: ${meterNumber})`,
      amountUGX: amountUGX,
      isDebit: true,
      reference: `UMM-YAK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'COMPLETED',
      timestamp: 'Just now',
      metadata: {
        meterNumber,
        token,
        unitsKwh,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendSMS(
      'Yaka-Umeme',
      `SUCCESS! Yaka Token: ${token} generated for Meter: ${meterNumber}. Amount: UGX ${amountUGX.toLocaleString()} (${unitsKwh} kWh). New Balance: UGX ${newBalance.toLocaleString()}.`
    );

    return {
      success: true,
      token,
      unitsKwh,
      message: `Token ${token} generated.`,
    };
  };

  const payNssfVoluntary = ({
    nssfNumber,
    amountUGX,
    pin,
  }: {
    nssfNumber: string;
    amountUGX: number;
    pin: string;
  }) => {
    if (pin !== currentUser.pin) {
      return { success: false, message: 'Invalid 4-digit PIN entered.' };
    }
    if (wallet.balanceUGX < amountUGX) {
      return { success: false, message: `Insufficient wallet balance.` };
    }

    const receipt = `NSSF-UG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBalance = wallet.balanceUGX - amountUGX;
    setWallet((prev) => ({ ...prev, balanceUGX: newBalance }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'NSSF_VOLUNTARY',
      title: `NSSF Voluntary Contribution (ID: ${nssfNumber})`,
      amountUGX: amountUGX,
      isDebit: true,
      reference: receipt,
      status: 'COMPLETED',
      timestamp: 'Just now',
      metadata: {
        nssfNumber,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendSMS(
      'NSSF-Uganda',
      `SUCCESS! UGX ${amountUGX.toLocaleString()} voluntary contribution received for Member ${nssfNumber}. Receipt: ${receipt}. TrashPay New Balance: UGX ${newBalance.toLocaleString()}.`
    );

    return { success: true, receipt, message: 'Voluntary NSSF contribution credited successfully.' };
  };

  const investInYinvesta = ({
    amountUGX,
    goalId,
    pin,
  }: {
    amountUGX: number;
    goalId?: string;
    pin: string;
  }) => {
    if (pin !== currentUser.pin) {
      return { success: false, message: 'Invalid 4-digit PIN.' };
    }
    if (amountUGX < 500) {
      return { success: false, message: 'Minimum investment in MTN Yinvesta is UGX 500.' };
    }
    if (wallet.balanceUGX < amountUGX) {
      return { success: false, message: 'Insufficient cash balance in TrashPay wallet.' };
    }

    const newCash = wallet.balanceUGX - amountUGX;
    const newYinvesta = wallet.yinvestaBalanceUGX + amountUGX;

    setWallet((prev) => ({
      ...prev,
      balanceUGX: newCash,
      yinvestaBalanceUGX: newYinvesta,
    }));

    if (goalId) {
      setYinvestaGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, currentUGX: g.currentUGX + amountUGX } : g))
      );
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'YINVESTA_DEPOSIT',
      title: `MTN Yinvesta Unit Trust Investment`,
      amountUGX: amountUGX,
      isDebit: true,
      reference: `YIN-SNLM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'COMPLETED',
      timestamp: 'Just now',
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendSMS(
      'Sanlam-Yinvesta',
      `SUCCESS! UGX ${amountUGX.toLocaleString()} invested into Yinvesta. Earning daily interest (~11.8% p.a.). New Balance: UGX ${newCash.toLocaleString()}. Portfolio: UGX ${newYinvesta.toLocaleString()}.`
    );

    return {
      success: true,
      message: `SUCCESS! UGX ${amountUGX.toLocaleString()} invested into Yinvesta. Earning daily interest. New Balance: UGX ${newCash.toLocaleString()}.`,
    };
  };

  const withdrawYinvesta = ({
    amountUGX,
    pin,
  }: {
    amountUGX: number;
    pin: string;
  }) => {
    if (pin !== currentUser.pin) {
      return { success: false, message: 'Invalid PIN.' };
    }
    if (wallet.yinvestaBalanceUGX < amountUGX) {
      return { success: false, message: 'Insufficient funds in Yinvesta portfolio.' };
    }

    const newYinvesta = wallet.yinvestaBalanceUGX - amountUGX;
    const newCash = wallet.balanceUGX + amountUGX;

    setWallet((prev) => ({
      ...prev,
      balanceUGX: newCash,
      yinvestaBalanceUGX: newYinvesta,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'YINVESTA_WITHDRAW',
      title: `Yinvesta Liquidation to Cash Wallet`,
      amountUGX: amountUGX,
      isDebit: false,
      reference: `YIN-WTH-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'COMPLETED',
      timestamp: 'Just now',
    };

    setTransactions((prev) => [newTx, ...prev]);

    sendSMS(
      'Sanlam-Yinvesta',
      `Yinvesta Redemption: UGX ${amountUGX.toLocaleString()} moved to TrashPay Cash Wallet. Available Cash: UGX ${newCash.toLocaleString()}.`
    );

    return { success: true, message: `Withdrawn UGX ${amountUGX.toLocaleString()} to cash wallet.` };
  };

  const setAutoInvestPercentage = (percent: number) => {
    setWallet((prev) => ({ ...prev, autoInvestPercentage: percent }));
  };

  const submitWasteReport = (
    reportData: Omit<WasteReport, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newReport: WasteReport = {
      ...reportData,
      id: `rep_${Date.now()}`,
      submittedAt: 'Just now',
      status: 'REPORTED',
    };

    setReports((prev) => [newReport, ...prev]);

    sendSMS(
      'MTN-TrashPay',
      `Trash Report Received! Ref #${newReport.id.slice(-4)} at ${newReport.locationName}. Designated zone collector alerted. Bounty: UGX ${newReport.bountyUGX.toLocaleString()} will be awarded once verified cleaned.`
    );

    return newReport;
  };

  const updateReportStatus = (reportId: string, status: DumpStatus, agentName?: string) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const isNowCleaned = status === 'CLEANED' && rep.status !== 'CLEANED';
          if (isNowCleaned) {
            // Reward reporter
            const bounty = rep.bountyUGX;
            setWallet((w) => ({
              ...w,
              balanceUGX: w.balanceUGX + bounty,
              lifetimeEarnedUGX: w.lifetimeEarnedUGX + bounty,
            }));

            const bountyTx: Transaction = {
              id: `tx_${Date.now()}`,
              userId: currentUser.id,
              type: 'REPORT_REWARD',
              title: `Citizen Dump Verification Bounty - ${rep.title}`,
              amountUGX: bounty,
              isDebit: false,
              reference: `BTY-KCCA-${Math.floor(1000 + Math.random() * 9000)}`,
              status: 'COMPLETED',
              timestamp: 'Just now',
              metadata: { reportId: rep.id },
            };
            setTransactions((t) => [bountyTx, ...t]);

            sendSMS(
              'MTN-TrashPay',
              `Bounty Credited! Dump report at ${rep.locationName} has been verified cleaned by ${agentName || 'KCCA Team'}. UGX ${bounty.toLocaleString()} credited to your TrashPay Wallet!`
            );

            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          }

          return {
            ...rep,
            status,
            assignedAgent: agentName || rep.assignedAgent,
            cleanedAt: status === 'CLEANED' ? 'Just now' : rep.cleanedAt,
          };
        }
        return rep;
      })
    );
  };

  const claimMilestoneBonus = () => {
    if (wallet.balanceUGX < wallet.milestoneTargetUGX || wallet.milestoneRewardClaimed) return;

    const bonusAmount = 25000; // UGX 25,000 PachiPanda Green Champion Bonus
    setWallet((prev) => ({
      ...prev,
      balanceUGX: prev.balanceUGX + bonusAmount,
      milestoneRewardClaimed: true,
      lifetimeEarnedUGX: prev.lifetimeEarnedUGX + bonusAmount,
    }));

    const bonusTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      type: 'RECYCLE_PAYOUT',
      title: 'PachiPanda Green Champion Milestone Bonus (UGX 200k Achieved!)',
      amountUGX: bonusAmount,
      isDebit: false,
      reference: 'PACHI-CHAMP-2026',
      status: 'COMPLETED',
      timestamp: 'Just now',
    };

    setTransactions((prev) => [bonusTx, ...prev]);

    sendSMS(
      'MTN-TrashPay',
      `CONGRATULATIONS! You unlocked the UGX 200,000 Milestone Bonus! An extra UGX 25,000 Green Champion reward has been added to your wallet. Asante sana for keeping Uganda clean!`
    );

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr_elijah');
    setWallet({
      userId: 'usr_elijah',
      balanceUGX: 185000,
      totalKgRecycled: 210,
      co2SavedKg: 388.5,
      milestoneTargetUGX: 200000,
      milestoneRewardClaimed: false,
      yinvestaBalanceUGX: 45000,
      autoInvestPercentage: 10,
      lifetimeEarnedUGX: 245000,
    });
    setTransactions(INITIAL_TRANSACTIONS);
    setReports(INITIAL_REPORTS);
    setYinvestaGoals(INITIAL_YINVESTA_GOALS);
    setSmsMessages(INITIAL_SMS_MESSAGES);
  };

  return (
    <TrashPayContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        wallet,
        transactions,
        reports,
        yinvestaGoals,
        smsMessages,
        tariffs: MATERIAL_TARIFFS,
        activeTab,
        setActiveTab,
        showPhoneSimulator,
        setShowPhoneSimulator,
        unreadSmsCount,
        markSmsAsRead,
        recordRecycleDrop,
        buyAirtime,
        payUmemeYaka,
        payNssfVoluntary,
        investInYinvesta,
        withdrawYinvesta,
        setAutoInvestPercentage,
        submitWasteReport,
        updateReportStatus,
        claimMilestoneBonus,
        resetDemoData,
      }}
    >
      {children}
    </TrashPayContext.Provider>
  );
};

export const useTrashPay = () => {
  const context = useContext(TrashPayContext);
  if (!context) {
    throw new Error('useTrashPay must be used within a TrashPayProvider');
  }
  return context;
};
