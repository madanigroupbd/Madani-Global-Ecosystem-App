import React, { useState } from 'react';
import { MemberAccount, EmergencyLoan, MFSTransaction, CommissionPayout } from '../../types';
import { DebtToEquityHealthCard } from './DebtToEquityHealthCard';
import { MFSInsightsCard } from './MFSInsightsCard';
import { AIBudgetPlanner } from './AIBudgetPlanner';
import { SavingsMilestoneTracker } from './SavingsMilestoneTracker';
import { AutoPayConfig } from './AutoPayConfig';
import { MFSQRCodeGenerator } from './MFSQRCodeGenerator';
import { MFS30DayVolumeChart } from './MFS30DayVolumeChart';
import {
  PiggyBank,
  CreditCard,
  Coins,
  Wallet,
  TrendingUp,
  BarChart3,
  Building2,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface FintechSummaryProps {
  coopAccounts: MemberAccount[];
  loans?: EmergencyLoan[];
  mfsTransactions: MFSTransaction[];
  commissions: CommissionPayout[];
}

export const FintechSummary: React.FC<FintechSummaryProps> = ({
  coopAccounts = [],
  loans = [],
  mfsTransactions = [],
  commissions = []
}) => {
  const [chartMode, setChartMode] = useState<'district' | 'macro'>('district');

  // Key Calculations
  const totalSavings = coopAccounts.reduce((sum, acc) => sum + (acc.totalSavings || 0), 0);
  const totalLoanVolume = loans.reduce((sum, loan) => sum + (loan.amountRequested || 0), 0);
  const totalMFSTurnover = mfsTransactions.reduce((sum, trx) => sum + (trx.amount || 0), 0);
  const totalCommissions = commissions.reduce((sum, comm) => sum + (comm.commissionAmount || 0), 0);
  const totalDeposits = coopAccounts.reduce((sum, acc) => sum + (acc.totalDeposits || 0), 0);
  const activeMembers = coopAccounts.filter((acc) => acc.status === 'ACTIVE').length;

  // Formatting currency helper
  const formatBDT = (amount: number) => {
    return `৳${amount.toLocaleString('en-IN')} BDT`;
  };

  // District Breakdown Data Preparation
  const districtMap: { [key: string]: { district: string; savings: number; loanVolume: number } } = {};

  coopAccounts.forEach((acc) => {
    const dist = acc.district || 'Other';
    if (!districtMap[dist]) {
      districtMap[dist] = { district: dist, savings: 0, loanVolume: 0 };
    }
    districtMap[dist].savings += acc.totalSavings || 0;
  });

  loans.forEach((loan) => {
    const dist = loan.district || 'Other';
    if (!districtMap[dist]) {
      districtMap[dist] = { district: dist, savings: 0, loanVolume: 0 };
    }
    districtMap[dist].loanVolume += loan.amountRequested || 0;
  });

  const districtChartData = Object.values(districtMap);

  // Macro Category Comparison Data
  const macroChartData = [
    { category: 'Coop Savings', amount: totalSavings, fill: '#10b981' },
    { category: 'Loan Volume', amount: totalLoanVolume, fill: '#f59e0b' },
    { category: 'MFS Volume', amount: totalMFSTurnover, fill: '#06b6d4' },
    { category: 'Coop Deposits', amount: totalDeposits, fill: '#6366f1' },
    { category: 'Commissions', amount: totalCommissions, fill: '#ec4899' }
  ];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 font-sans z-50">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.fill || entry.color }} />
                {entry.name || entry.dataKey}:
              </span>
              <span className="font-mono font-bold text-slate-100">
                {formatBDT(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-950 border border-emerald-800/80 text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Fintech Ecosystem Financial Summary
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                  REAL-TIME METRICS
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidated overview of member cooperative savings, emergency loan volume, MFS transaction turnover, and entrepreneur commissions.
              </p>
            </div>
          </div>
        </div>

        {/* Chart View Toggle Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setChartMode('district')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'district'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            District Comparison
          </button>
          <button
            onClick={() => setChartMode('macro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'macro'
                ? 'bg-amber-950 text-amber-300 border border-amber-600/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Category Volume
          </button>
        </div>
      </div>

      {/* Key Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1: Total Savings */}
        <div className="bg-slate-950/80 border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute right-3 top-3 p-2.5 bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
            <PiggyBank className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 block">Total Member Savings</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 block tracking-tight">
            {formatBDT(totalSavings)}
          </strong>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <Users className="w-3.5 h-3.5" />
            <span>Across {activeMembers} Active Accounts</span>
          </div>
        </div>

        {/* Metric Card 2: Total Loan Volume */}
        <div className="bg-slate-950/80 border border-amber-900/40 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute right-3 top-3 p-2.5 bg-amber-950/80 border border-amber-800/60 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 block">Total Disbursed Loan Volume</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 block tracking-tight">
            {formatBDT(totalLoanVolume)}
          </strong>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero-Profit Emergency Loans ({loans.length} Applications)</span>
          </div>
        </div>

        {/* Metric Card 3: MFS Transaction Volume */}
        <div className="bg-slate-950/80 border border-cyan-900/40 hover:border-cyan-500/50 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute right-3 top-3 p-2.5 bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 block">MFS Transaction Turnover</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 block tracking-tight">
            {formatBDT(totalMFSTurnover)}
          </strong>
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>bKash / Nagad / Rocket API ({mfsTransactions.length} Transactions)</span>
          </div>
        </div>

        {/* Metric Card 4: Commissions & Deposits */}
        <div className="bg-slate-950/80 border border-purple-900/40 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute right-3 top-3 p-2.5 bg-purple-950/80 border border-purple-800/60 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 block">Entrepreneur Commissions</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-100 font-mono mt-1 block tracking-tight">
            {formatBDT(totalCommissions)}
          </strong>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400 mt-2 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audited Payouts ({commissions.length} Requests)</span>
          </div>
        </div>

      </div>

      {/* Debt-to-Equity & Savings-to-Loan Health Card */}
      <DebtToEquityHealthCard coopAccounts={coopAccounts} loans={loans} />

      {/* AI MFS Transaction & Spending Pattern Intelligence Card */}
      <MFSInsightsCard transactions={mfsTransactions} />

      {/* AI Budget & Savings Planner Card */}
      <AIBudgetPlanner coopAccounts={coopAccounts} mfsTransactions={mfsTransactions} loans={loans} />

      {/* Savings Milestone Tracker */}
      <SavingsMilestoneTracker coopAccounts={coopAccounts} />

      {/* Auto-Pay Configuration Tool */}
      <AutoPayConfig loans={loans} mfsTransactions={mfsTransactions} />

      {/* Shareable MFS P2P Transfer QR Code Generator */}
      <MFSQRCodeGenerator />

      {/* 30-Day MFS Transaction Frequency & Volume Recharts Visualization */}
      <MFS30DayVolumeChart mfsTransactions={mfsTransactions} />

      {/* Main Interactive Bar Chart Display */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 shadow-inner space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              {chartMode === 'district' ? 'District-Wise Comparison: Member Savings vs. Loan Volume' : 'Financial Volume Comparison Across Fintech Modules'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {chartMode === 'district'
                ? 'Visual distribution comparing total cooperative member savings deposits against disbursed emergency loans by district.'
                : 'Comparative financial volume metrics aggregated across cooperative ledger, emergency loans, MFS, and commissions.'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span className="text-slate-300">Savings (BDT)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
              <span className="text-slate-300">Loan Volume (BDT)</span>
            </div>
          </div>
        </div>

        {/* Responsive Bar Chart Container */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'district' ? (
              <BarChart
                data={districtChartData}
                margin={{ top: 15, right: 20, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="district"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#cbd5e1' }}
                />
                <Bar
                  dataKey="savings"
                  name="Total Member Savings"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="loanVolume"
                  name="Disbursed Loan Volume"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            ) : (
              <BarChart
                data={macroChartData}
                margin={{ top: 15, right: 20, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  name="Volume Amount (BDT)"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
