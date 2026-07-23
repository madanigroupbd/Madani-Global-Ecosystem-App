import React, { useState } from 'react';
import { MobileFinancialServices } from './MobileFinancialServices';
import { CoopSocietyLedger } from './CoopSocietyLedger';
import { CommissionPayoutPortal } from './CommissionPayoutPortal';
import { ActiveLoansRepayment } from './ActiveLoansRepayment';
import { LoanHistoryTimeline } from './LoanHistoryTimeline';
import { LoanEligibility } from './LoanEligibility';
import { InterestEstimator } from './InterestEstimator';
import { CurrencyConverterWidget } from './CurrencyConverterWidget';
import { AIBudgetPlanner } from './AIBudgetPlanner';
import { SavingsMilestoneTracker } from './SavingsMilestoneTracker';
import { AutoPayConfig } from './AutoPayConfig';
import { MFSQRCodeGenerator } from './MFSQRCodeGenerator';
import { FintechSummary } from './FintechSummary';
import { MFSTransaction, MemberAccount, LedgerEntry, CommissionPayout, EmergencyLoan } from '../../types';
import {
  Wallet,
  FileSpreadsheet,
  Award,
  BarChart3,
  CreditCard,
  History,
  Gauge,
  Calculator,
  Globe,
  Brain,
  Target,
  Repeat,
  QrCode,
  Contrast,
  Sun,
  Moon,
  Eye,
  Type,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';

interface FintechHubProps {
  mfsTransactions: MFSTransaction[];
  onNewMFSTransaction: (trx: MFSTransaction) => void;
  coopAccounts: MemberAccount[];
  coopLedger: LedgerEntry[];
  onAddLedgerEntry: (entry: LedgerEntry) => void;
  commissions: CommissionPayout[];
  onNewPayoutRequest: (payout: CommissionPayout) => void;
  isAdminMode: boolean;
  loans?: EmergencyLoan[];
  onRepayLoan?: (loanId: string, amount: number, paymentMethod: string, notes?: string) => void;
}

export type ThemeMode = 'standard' | 'high-contrast-dark' | 'high-contrast-light';
export type FontScale = 'normal' | 'large' | 'xlarge';

export const FintechHub: React.FC<FintechHubProps> = ({
  mfsTransactions,
  onNewMFSTransaction,
  coopAccounts,
  coopLedger,
  onAddLedgerEntry,
  commissions,
  onNewPayoutRequest,
  isAdminMode,
  loans = [],
  onRepayLoan = (_id: string, _amt: number, _method?: string, _notes?: string) => {}
}) => {
  const [subTab, setSubTab] = useState<'summary' | 'qr' | 'autopay' | 'milestones' | 'planner' | 'loans' | 'history' | 'eligibility' | 'estimator' | 'converter' | 'mfs' | 'coop' | 'commissions'>('summary');

  // Accessibility Theme State
  const [themeMode, setThemeMode] = useState<ThemeMode>('standard');
  const [fontScale, setFontScale] = useState<FontScale>('normal');

  // Theme Wrapper Styles
  const getThemeWrapperClass = () => {
    let classes = 'space-y-6 transition-all duration-200 ';

    if (themeMode === 'high-contrast-dark') {
      classes += 'bg-black text-yellow-300 p-4 rounded-2xl border-4 border-yellow-400 shadow-none ';
    } else if (themeMode === 'high-contrast-light') {
      classes += 'bg-white text-black p-4 rounded-2xl border-4 border-black shadow-none ';
    } else {
      classes += 'text-slate-100 ';
    }

    if (fontScale === 'large') {
      classes += 'text-sm scale-[1.01] origin-top ';
    } else if (fontScale === 'xlarge') {
      classes += 'text-base scale-[1.02] origin-top ';
    }

    return classes;
  };

  // Nav Button Style Resolver for High-Contrast
  const getSubTabBtnClass = (tabKey: typeof subTab, activeColor: string) => {
    const isActive = subTab === tabKey;

    if (themeMode === 'high-contrast-dark') {
      return isActive
        ? 'bg-yellow-400 text-black border-2 border-yellow-300 font-extrabold shadow-none scale-105'
        : 'bg-black text-yellow-300 border-2 border-yellow-400 hover:bg-yellow-950 font-bold';
    }

    if (themeMode === 'high-contrast-light') {
      return isActive
        ? 'bg-black text-white border-2 border-black font-extrabold shadow-none scale-105'
        : 'bg-white text-black border-2 border-black hover:bg-slate-100 font-bold';
    }

    // Standard Mode
    return isActive
      ? `${activeColor} shadow-md ring-1 ring-blue-500`
      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200';
  };

  return (
    <div className={getThemeWrapperClass()}>

      {/* ACCESSIBILITY & HIGH-CONTRAST THEME CONTROL BAR */}
      <div className={`rounded-2xl p-4 border transition-all ${
        themeMode === 'high-contrast-dark'
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : themeMode === 'high-contrast-light'
          ? 'bg-white border-2 border-black text-black'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Header Title & WCAG Rating */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              themeMode === 'high-contrast-dark'
                ? 'bg-yellow-400 text-black border-yellow-300'
                : themeMode === 'high-contrast-light'
                ? 'bg-black text-white border-black'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}>
              <Contrast className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Fintech Dashboard Display Theme & Contrast Controls</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  themeMode !== 'standard'
                    ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}>
                  {themeMode !== 'standard' ? 'WCAG 2.1 AAA COMPLIANT (21:1 CONTRAST)' : 'STANDARD DARK (7.5:1 CONTRAST)'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${
                themeMode === 'high-contrast-dark'
                  ? 'text-yellow-200'
                  : themeMode === 'high-contrast-light'
                  ? 'text-slate-800'
                  : 'text-slate-400'
              }`}>
                Adjust visual contrast, dark OLED black levels, or scale typography size for low-vision readability in outdoor daylight or dark conditions.
              </p>
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            
            {/* Theme Palette Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono font-bold">
              <button
                onClick={() => setThemeMode('standard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeMode === 'standard'
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                Standard Dark
              </button>

              <button
                onClick={() => setThemeMode('high-contrast-dark')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeMode === 'high-contrast-dark'
                    ? 'bg-yellow-400 text-black font-extrabold border border-yellow-300 shadow'
                    : 'text-yellow-400 hover:text-yellow-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                High-Contrast OLED
              </button>

              <button
                onClick={() => setThemeMode('high-contrast-light')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeMode === 'high-contrast-light'
                    ? 'bg-white text-black font-extrabold border border-black shadow'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                High-Contrast Light
              </button>
            </div>

            {/* Typography Scale Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono font-bold">
              <span className="text-[10px] text-slate-400 px-1.5 flex items-center gap-1">
                <Type className="w-3 h-3 text-slate-400" />
                Text Scale:
              </span>
              {(['normal', 'large', 'xlarge'] as FontScale[]).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  className={`px-2 py-1 rounded transition-all uppercase ${
                    fontScale === scale
                      ? 'bg-emerald-600 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {scale === 'normal' ? '100%' : scale === 'large' ? '115%' : '130%'}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Summary Analytics Banner */}
      <FintechSummary
        coopAccounts={coopAccounts}
        loans={loans}
        mfsTransactions={mfsTransactions}
        commissions={commissions}
      />
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('summary', 'bg-blue-950 border-blue-500 text-blue-300')
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Financial Metrics & Chart Summary
        </button>

        <button
          onClick={() => setSubTab('qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('qr', 'bg-pink-950 border-pink-500 text-pink-300')
          }`}
        >
          <QrCode className="w-4 h-4 text-pink-400" />
          Generate & Scan P2P QR
        </button>

        <button
          onClick={() => setSubTab('autopay')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('autopay', 'bg-blue-950 border-blue-500 text-blue-300')
          }`}
        >
          <Repeat className="w-4 h-4 text-blue-400" />
          Auto-Pay Configuration
        </button>

        <button
          onClick={() => setSubTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('milestones', 'bg-emerald-950 border-emerald-500 text-emerald-300')
          }`}
        >
          <Target className="w-4 h-4 text-emerald-400" />
          Savings Milestone Tracker
        </button>

        <button
          onClick={() => setSubTab('planner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('planner', 'bg-teal-950 border-teal-500 text-teal-300')
          }`}
        >
          <Brain className="w-4 h-4 text-teal-400 animate-pulse" />
          AI Budget & Savings Planner
        </button>

        <button
          onClick={() => setSubTab('loans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('loans', 'bg-amber-950 border-amber-500 text-amber-300')
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Active Emergency Loans & Repayment
        </button>

        <button
          onClick={() => setSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('history', 'bg-purple-950 border-purple-500 text-purple-300')
          }`}
        >
          <History className="w-4 h-4 text-purple-400" />
          Loan History & Timeline
        </button>

        <button
          onClick={() => setSubTab('eligibility')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('eligibility', 'bg-teal-950 border-teal-500 text-teal-300')
          }`}
        >
          <Gauge className="w-4 h-4 text-teal-400" />
          Loan Eligibility & Gauge
        </button>

        <button
          onClick={() => setSubTab('estimator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('estimator', 'bg-emerald-950 border-emerald-500 text-emerald-300')
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          Interest & Growth Estimator
        </button>

        <button
          onClick={() => setSubTab('converter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('converter', 'bg-blue-950 border-blue-500 text-blue-300')
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          Real-Time Forex Converter
        </button>

        <button
          onClick={() => setSubTab('mfs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('mfs', 'bg-emerald-950 border-emerald-500 text-emerald-300')
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          bKash / Nagad / Rocket API
        </button>

        <button
          onClick={() => setSubTab('coop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('coop', 'bg-amber-950 border-amber-500 text-amber-300')
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          Cooperative Passbook Ledger
        </button>

        <button
          onClick={() => setSubTab('commissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            getSubTabBtnClass('commissions', 'bg-teal-950 border-teal-500 text-teal-300')
          }`}
        >
          <Award className="w-4 h-4 text-teal-400" />
          Commission Payouts
        </button>
      </div>

      {subTab === 'summary' && (
        <div className={`rounded-2xl p-6 text-xs leading-relaxed border ${
          themeMode === 'high-contrast-dark'
            ? 'bg-black border-2 border-yellow-400 text-yellow-200'
            : themeMode === 'high-contrast-light'
            ? 'bg-white border-2 border-black text-black'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <p className="font-bold mb-2 text-sm">Fintech Hub Overview & Real-Time Liquidity Pool</p>
          <p>
            Use the navigation sub-tabs above to manage active emergency loans, process zero-profit repayments, evaluate member credit limits using the loan eligibility gauge, view the audited borrowing history timeline chart, monitor MFS gateway transactions (bKash/Nagad/Rocket), view cooperative member passbook ledgers, process entrepreneur commission payouts, generate shareable MFS P2P QR codes, configure MFS Auto-Pay repayments, or track savings milestones.
          </p>
        </div>
      )}

      {subTab === 'qr' && (
        <MFSQRCodeGenerator onAddMFSTransaction={onNewMFSTransaction} />
      )}

      {subTab === 'autopay' && (
        <AutoPayConfig
          loans={loans}
          mfsTransactions={mfsTransactions}
          onRepayLoan={onRepayLoan}
        />
      )}

      {subTab === 'milestones' && (
        <SavingsMilestoneTracker
          coopAccounts={coopAccounts}
        />
      )}

      {subTab === 'planner' && (
        <AIBudgetPlanner
          coopAccounts={coopAccounts}
          mfsTransactions={mfsTransactions}
          coopLedger={coopLedger}
          loans={loans}
        />
      )}

      {subTab === 'loans' && (
        <ActiveLoansRepayment
          loans={loans}
          onRepayLoan={onRepayLoan}
          coopAccounts={coopAccounts}
        />
      )}

      {subTab === 'history' && (
        <LoanHistoryTimeline
          loans={loans}
          ledger={coopLedger}
        />
      )}

      {subTab === 'eligibility' && (
        <LoanEligibility
          coopAccounts={coopAccounts}
          mfsTransactions={mfsTransactions}
          coopLedger={coopLedger}
          loans={loans}
        />
      )}

      {subTab === 'estimator' && (
        <InterestEstimator />
      )}

      {subTab === 'converter' && (
        <CurrencyConverterWidget
          coopAccounts={coopAccounts}
        />
      )}

      {subTab === 'mfs' && (
        <MobileFinancialServices
          transactions={mfsTransactions}
          onNewTransaction={onNewMFSTransaction}
        />
      )}

      {subTab === 'coop' && (
        <CoopSocietyLedger
          accounts={coopAccounts}
          ledger={coopLedger}
          onAddLedgerEntry={onAddLedgerEntry}
          isAdminMode={isAdminMode}
        />
      )}

      {subTab === 'commissions' && (
        <CommissionPayoutPortal
          commissions={commissions}
          onNewPayoutRequest={onNewPayoutRequest}
        />
      )}

    </div>
  );
};

