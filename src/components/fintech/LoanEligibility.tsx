import React, { useState, useMemo } from 'react';
import { MemberAccount, MFSTransaction, LedgerEntry, EmergencyLoan } from '../../types';
import {
  Gauge,
  Calculator,
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Coins,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  UserCheck,
  Info,
  Building2,
  Award
} from 'lucide-react';

interface LoanEligibilityProps {
  coopAccounts: MemberAccount[];
  mfsTransactions: MFSTransaction[];
  coopLedger: LedgerEntry[];
  loans: EmergencyLoan[];
}

export const LoanEligibility: React.FC<LoanEligibilityProps> = ({
  coopAccounts = [],
  mfsTransactions = [],
  coopLedger = [],
  loans = []
}) => {
  // Selected Member state for calculation
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>(
    coopAccounts[0]?.accountNo || 'MDN-COOP-8801'
  );

  // Interactive Simulation Sliders
  const [simulatedExtraSavings, setSimulatedExtraSavings] = useState<number>(0);
  const [simulatedMonthlyMFS, setSimulatedMonthlyMFS] = useState<number>(0);

  // Format currency helper
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // Selected Member Account Data
  const selectedAccount = useMemo(() => {
    return coopAccounts.find((acc) => acc.accountNo === selectedAccountNo) || coopAccounts[0] || {
      id: 'acc-1',
      memberId: 'MEM-8801',
      name: 'Dr. Rafiqul Islam',
      accountNo: 'MDN-COOP-8801',
      shareBalance: 50000,
      savingsBalance: 125000,
      joiningDate: '2023-01-15',
      district: 'Dhaka Central',
      status: 'ACTIVE'
    };
  }, [coopAccounts, selectedAccountNo]);

  // Calculations for selected account
  const calculationResults = useMemo(() => {
    // 1. Total Savings Base
    const baseSavings = (selectedAccount.shareBalance || 0) + (selectedAccount.savingsBalance || 0) + simulatedExtraSavings;
    const savingsCreditLimit = baseSavings * 3.5; // 3.5x multiplier on cooperative savings

    // 2. MFS & Ledger Transaction Volume Bonus
    const totalMFSVolume = mfsTransactions.reduce((acc, t) => acc + (t.amount || 0), 0) + simulatedMonthlyMFS;
    const transactionBonus = totalMFSVolume * 0.15; // 15% credit bonus from digital transactions

    // 3. Repayment & Membership Standing Bonus
    const memberLoans = loans.filter(l => l.applicantName?.toLowerCase().includes(selectedAccount.name?.toLowerCase()) || l.nid === selectedAccount.memberId);
    const totalRepaidAmount = memberLoans.reduce((acc, l) => acc + (l.repaidAmount || 0), 0);
    const cleanRepaymentBonus = totalRepaidAmount > 0 ? 25000 : 10000;

    // 4. Existing Active Debt Deductions
    const activeOutstandingDebt = memberLoans.reduce((acc, l) => {
      const remaining = l.amountRequested - (l.repaidAmount || 0);
      return acc + (remaining > 0 ? remaining : 0);
    }, 0);

    // Gross Limit
    const grossEligibleLimit = Math.max(15000, savingsCreditLimit + transactionBonus + cleanRepaymentBonus);
    
    // Net Available Borrowing Limit
    const netBorrowingLimit = Math.max(0, grossEligibleLimit - activeOutstandingDebt);

    // Credit Rating Tier
    let creditScore = 650;
    if (baseSavings > 100000) creditScore += 120;
    if (totalMFSVolume > 50000) creditScore += 80;
    if (totalRepaidAmount > 0) creditScore += 100;
    creditScore = Math.min(900, creditScore);

    let creditTier = 'Standard';
    let tierColor = 'text-blue-400 border-blue-500 bg-blue-950/60';
    if (creditScore >= 800) {
      creditTier = 'Platinum Trustee';
      tierColor = 'text-amber-300 border-amber-500 bg-amber-950/80';
    } else if (creditScore >= 720) {
      creditTier = 'Gold Pioneer';
      tierColor = 'text-emerald-300 border-emerald-500 bg-emerald-950/80';
    } else if (creditScore >= 650) {
      creditTier = 'Silver Member';
      tierColor = 'text-teal-300 border-teal-500 bg-teal-950/80';
    }

    // Usage ratio
    const limitUsageRatio = grossEligibleLimit > 0 ? Math.min(100, Math.round((activeOutstandingDebt / grossEligibleLimit) * 100)) : 0;
    const availablePercentage = 100 - limitUsageRatio;

    return {
      baseSavings,
      savingsCreditLimit,
      totalMFSVolume,
      transactionBonus,
      cleanRepaymentBonus,
      activeOutstandingDebt,
      grossEligibleLimit,
      netBorrowingLimit,
      creditScore,
      creditTier,
      tierColor,
      limitUsageRatio,
      availablePercentage
    };
  }, [selectedAccount, simulatedExtraSavings, simulatedMonthlyMFS, mfsTransactions, loans]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-950 border border-teal-800 text-teal-400 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Cooperative Loan Eligibility & Credit Score Engine
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-md">
                ALGORITHM v3.2
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated zero-profit borrowing limit assessment based on savings deposits, MFS activity, and repayment fidelity.
            </p>
          </div>
        </div>

        {/* Member Account Selector */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 shrink-0">
          <UserCheck className="w-4 h-4 text-amber-400 ml-1.5" />
          <select
            value={selectedAccountNo}
            onChange={(e) => setSelectedAccountNo(e.target.value)}
            className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none pr-2 cursor-pointer"
          >
            {coopAccounts.map((acc) => (
              <option key={acc.accountNo} value={acc.accountNo} className="bg-slate-900 text-slate-100">
                {acc.name} ({acc.accountNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Gauge & Key Metrics on Left, Calculation Factors on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Progress Gauge & Credit Score (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-between space-y-6">
          
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-teal-400" />
              Sanctioned Credit Power
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${calculationResults.tierColor}`}>
              {calculationResults.creditTier}
            </span>
          </div>

          {/* Semi-Circular Progress Gauge SVG Dial */}
          <div className="relative w-56 h-36 flex flex-col items-center justify-end">
            <svg className="w-56 h-56 overflow-visible" viewBox="0 0 100 60">
              {/* Background Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Active Progress Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * calculationResults.availablePercentage) / 100}
                className="transition-all duration-700 ease-out"
              />
              {/* SVG Gradient Definition */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Dial Readout */}
            <div className="absolute bottom-2 flex flex-col items-center text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                Available Borrowing Limit
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {formatBDT(calculationResults.netBorrowingLimit)}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 font-mono">
                {calculationResults.availablePercentage}% of {formatBDT(calculationResults.grossEligibleLimit)} Cap
              </span>
            </div>
          </div>

          {/* Credit Score Gauge Bar */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cooperative Credit Rating Score:
              </span>
              <span className="font-bold text-amber-400 text-sm">
                {calculationResults.creditScore} / 900
              </span>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(calculationResults.creditScore / 900) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>300 (Poor)</span>
              <span>650 (Silver)</span>
              <span>750 (Gold)</span>
              <span>900 (Platinum)</span>
            </div>
          </div>

          {/* Status Note */}
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              Zero-Profit emergency loan applications up to <strong>{formatBDT(calculationResults.netBorrowingLimit)}</strong> qualify for instant automated approval without external guarantor verification.
            </span>
          </div>

        </div>

        {/* Right Column: Algorithmic Breakdown & Real-Time Simulation Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Factor Breakdown List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Borrowing Power Formula Components
            </h4>

            <div className="space-y-3 text-xs font-mono">
              
              {/* Savings Multiplier Component */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg">
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Total Cooperative Savings (3.5x Cap)</span>
                    <span className="text-[10px] text-slate-400">
                      Share ({formatBDT(selectedAccount.shareBalance)}) + Deposit ({formatBDT(selectedAccount.savingsBalance)})
                    </span>
                  </div>
                </div>
                <span className="font-bold text-emerald-400 text-sm">
                  +{formatBDT(calculationResults.savingsCreditLimit)}
                </span>
              </div>

              {/* MFS Transaction Volume Bonus */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950 border border-blue-800 text-blue-400 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Digital MFS Gateway Bonus (15%)</span>
                    <span className="text-[10px] text-slate-400">
                      Evaluated MFS Throughput: {formatBDT(calculationResults.totalMFSVolume)}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-blue-400 text-sm">
                  +{formatBDT(calculationResults.transactionBonus)}
                </span>
              </div>

              {/* Repayment History Standing */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-950 border border-amber-800 text-amber-400 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Zero-Profit Repayment Standing</span>
                    <span className="text-[10px] text-slate-400">
                      Audited on-time loan recovery history score
                    </span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm">
                  +{formatBDT(calculationResults.cleanRepaymentBonus)}
                </span>
              </div>

              {/* Existing Active Debt Deduction */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-950 border border-rose-800 text-rose-400 rounded-lg">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Existing Active Emergency Loan Debt</span>
                    <span className="text-[10px] text-slate-400">
                      Deducted from gross eligible threshold
                    </span>
                  </div>
                </div>
                <span className="font-bold text-rose-400 text-sm">
                  -{formatBDT(calculationResults.activeOutstandingDebt)}
                </span>
              </div>

            </div>
          </div>

          {/* Interactive Limit Simulation Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-teal-400" />
                Borrowing Limit Growth Simulator
              </h4>
              <button
                onClick={() => {
                  setSimulatedExtraSavings(0);
                  setSimulatedMonthlyMFS(0);
                }}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-200 underline"
              >
                Reset Simulation
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Slider 1: Add Savings */}
              <div>
                <div className="flex justify-between items-center text-slate-300 font-semibold mb-1">
                  <span>Simulate Additional Savings Deposit:</span>
                  <span className="font-mono text-emerald-400 font-bold">+{formatBDT(simulatedExtraSavings)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={simulatedExtraSavings}
                  onChange={(e) => setSimulatedExtraSavings(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Add Monthly MFS Volume */}
              <div>
                <div className="flex justify-between items-center text-slate-300 font-semibold mb-1">
                  <span>Simulate Monthly MFS Transaction Volume:</span>
                  <span className="font-mono text-blue-400 font-bold">+{formatBDT(simulatedMonthlyMFS)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="10000"
                  value={simulatedMonthlyMFS}
                  onChange={(e) => setSimulatedMonthlyMFS(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
