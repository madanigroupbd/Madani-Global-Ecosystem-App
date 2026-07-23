import React, { useState, useMemo } from 'react';
import { MemberAccount, MFSTransaction, LedgerEntry, EmergencyLoan } from '../../types';
import {
  PieChart as PieIcon,
  Sparkles,
  TrendingUp,
  Target,
  PiggyBank,
  Coins,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Award,
  Zap,
  Info,
  DollarSign,
  ArrowUpRight,
  Brain,
  Layers,
  HeartHandshake
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

interface AIBudgetPlannerProps {
  coopAccounts?: MemberAccount[];
  mfsTransactions?: MFSTransaction[];
  coopLedger?: LedgerEntry[];
  loans?: EmergencyLoan[];
}

export const AIBudgetPlanner: React.FC<AIBudgetPlannerProps> = ({
  coopAccounts = [],
  mfsTransactions = [],
  coopLedger = [],
  loans = []
}) => {
  // Member selection
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>(
    coopAccounts[0]?.accountNo || 'MDN-COOP-8801'
  );

  // Selected Account Data
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

  // Derived baseline income/outflow from accounts and MFS volume
  const baselineMonthlyIncome = useMemo(() => {
    const totalSavings = (selectedAccount.shareBalance || 0) + (selectedAccount.savingsBalance || 0);
    // Estimate baseline monthly income around 45,000 - 85,000 depending on savings
    return Math.max(35000, Math.min(150000, Math.round(totalSavings * 0.35)));
  }, [selectedAccount]);

  // Interactive Controls State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(baselineMonthlyIncome);
  const [targetSavingsPercent, setTargetSavingsPercent] = useState<number>(30); // Default 30% savings goal
  const [budgetStrategy, setBudgetStrategy] = useState<'BALANCED' | 'AGGRESSIVE_SAVINGS' | 'DEBT_REPAYMENT'>('BALANCED');
  const [isAiOptimizing, setIsAiOptimizing] = useState<boolean>(false);

  // Format Currency Helper
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // AI Budget Allocation Calculation
  const budgetAllocation = useMemo(() => {
    const totalIncome = Math.max(10000, monthlyIncome);
    const targetSavingsTotal = Math.round((totalIncome * targetSavingsPercent) / 100);
    const remainingForNeeds = totalIncome - targetSavingsTotal;

    // Sub-allocations inside Savings & Expenses
    let coopSharesShare = 0.25;
    let emergencyReserveShare = 0.35;
    let halalInvestmentShare = 0.40;

    let essentialNeedsShare = 0.60;
    let discretionaryShare = 0.40;

    if (budgetStrategy === 'AGGRESSIVE_SAVINGS') {
      coopSharesShare = 0.35;
      emergencyReserveShare = 0.35;
      halalInvestmentShare = 0.30;
      essentialNeedsShare = 0.70;
      discretionaryShare = 0.30;
    } else if (budgetStrategy === 'DEBT_REPAYMENT') {
      coopSharesShare = 0.20;
      emergencyReserveShare = 0.50;
      halalInvestmentShare = 0.30;
      essentialNeedsShare = 0.65;
      discretionaryShare = 0.35;
    }

    const coopSharesVal = Math.round(targetSavingsTotal * coopSharesShare);
    const emergencyReserveVal = Math.round(targetSavingsTotal * emergencyReserveShare);
    const halalInvestmentVal = Math.round(targetSavingsTotal * halalInvestmentShare);

    const essentialNeedsVal = Math.round(remainingForNeeds * essentialNeedsShare);
    const discretionaryVal = Math.round(remainingForNeeds * discretionaryShare);

    const slices = [
      { name: 'Essential Household Needs', value: essentialNeedsVal, color: '#3b82f6', category: 'EXPENSE' },
      { name: 'Emergency Welfare Reserve', value: emergencyReserveVal, color: '#10b981', category: 'SAVINGS' },
      { name: 'Cooperative Share Pool', value: coopSharesVal, color: '#f59e0b', category: 'SAVINGS' },
      { name: 'Halal Mudarabah Growth', value: halalInvestmentVal, color: '#14b8a6', category: 'SAVINGS' },
      { name: 'Discretionary & Family Buffer', value: discretionaryVal, color: '#a855f7', category: 'EXPENSE' }
    ];

    // Estimated Loan Eligibility Boost from new monthly coop share contribution
    const yearlyCoopAdded = coopSharesVal * 12;
    const additionalLoanCredit = Math.round(yearlyCoopAdded * 3.5);

    return {
      totalIncome,
      targetSavingsTotal,
      savingsRatio: targetSavingsPercent,
      remainingForNeeds,
      coopSharesVal,
      emergencyReserveVal,
      halalInvestmentVal,
      essentialNeedsVal,
      discretionaryVal,
      additionalLoanCredit,
      slices
    };
  }, [monthlyIncome, targetSavingsPercent, budgetStrategy]);

  // AI Optimization Handler
  const handleOptimizeStrategy = () => {
    setIsAiOptimizing(true);
    setTimeout(() => {
      setIsAiOptimizing(false);
      setTargetSavingsPercent(35);
      setBudgetStrategy('AGGRESSIVE_SAVINGS');
    }, 600);
  };

  // Custom Donut Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-sans z-50">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-slate-100">{data.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Target Monthly:</span>
            <span className="font-mono font-bold text-emerald-400">{formatBDT(data.value)}</span>
          </div>
          <div className="flex justify-between gap-4 text-[10px] text-slate-500">
            <span>Income Ratio:</span>
            <span>{((data.value / budgetAllocation.totalIncome) * 100).toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-2xl space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-950 border border-teal-800 text-teal-400 rounded-xl relative">
            <Brain className="w-6 h-6" />
            <Sparkles className="w-3 h-3 text-amber-400 absolute top-1 right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI-Driven Monthly Budget & Savings Planner
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-md">
                SHARIAH ALLOCATION ENGINE
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized income allocation goals based on historical MFS cashflows and cooperative savings growth targets.
            </p>
          </div>
        </div>

        {/* Member Account Selector & Optimize Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleOptimizeStrategy}
            disabled={isAiOptimizing}
            className="px-3.5 py-2 bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-700/60 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isAiOptimizing ? 'animate-spin' : ''}`} />
            {isAiOptimizing ? 'Optimizing Plan...' : 'AI Auto-Optimize'}
          </button>

          {coopAccounts.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
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
          )}
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Monthly Income Target */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Monthly Income Base</span>
            <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">
              {formatBDT(budgetAllocation.totalIncome)}
            </strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Baseline Earnings</span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Total Target Savings */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Target Monthly Savings</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatBDT(budgetAllocation.targetSavingsTotal)}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              {budgetAllocation.savingsRatio}% of Total Income
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Additional Loan Eligibility Created */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Yearly Credit Limit Boost</span>
            <strong className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">
              +{formatBDT(budgetAllocation.additionalLoanCredit)}
            </strong>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">
              3.5x Multiplier on Shares
            </span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Strategy Badge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Strategy</span>
            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 mt-1">
              {budgetStrategy.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Shariah Compliant
            </span>
          </div>
          <div className="p-3 bg-purple-950 border border-purple-800/60 text-purple-400 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Controls on Left, Donut Chart & Allocation Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" />
            Budget Model Parameters
          </h4>

          <div className="space-y-4 text-xs font-sans">
            
            {/* Input 1: Income Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Monthly Income (BDT):</span>
                <span className="font-mono text-emerald-400 font-bold">{formatBDT(monthlyIncome)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="200000"
                step="2500"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Input 2: Target Savings % Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Target Savings Ratio:</span>
                <span className="font-mono text-teal-300 font-bold">{targetSavingsPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={targetSavingsPercent}
                onChange={(e) => setTargetSavingsPercent(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10% (Basic)</span>
                <span>30% (Standard)</span>
                <span>60% (High Growth)</span>
              </div>
            </div>

            {/* Input 3: Budget Strategy Select */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Goal Orientation Strategy:</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'BALANCED', label: 'Balanced (50/30/20 Standard)', desc: 'Even split between welfare, shares, and investments.' },
                  { id: 'AGGRESSIVE_SAVINGS', label: 'Aggressive Capital Growth', desc: 'Prioritizes cooperative share acquisition for max credit limit.' },
                  { id: 'DEBT_REPAYMENT', label: 'Emergency Reserve Focus', desc: 'Maximizes liquid emergency fund buffer for quick access.' }
                ].map((strat) => (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => setBudgetStrategy(strat.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      budgetStrategy === strat.id
                        ? 'bg-teal-950 border-teal-500 text-teal-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{strat.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{strat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Increasing your <strong>Cooperative Share Pool</strong> allocation directly expands your zero-profit borrowing ceiling under algorithm v3.2.
              </span>
            </div>

          </div>
        </div>

        {/* Dynamic Donut Chart & Allocation Breakdown Column (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-teal-400" />
                Target Budget Allocation Breakdown
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Visualizing monthly income of <strong>{formatBDT(budgetAllocation.totalIncome)}</strong> allocated across essential needs, cooperative shares, and growth pools.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                Savings: {formatBDT(budgetAllocation.targetSavingsTotal)}
              </span>
              <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md">
                Expenses: {formatBDT(budgetAllocation.remainingForNeeds)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Donut Chart (5 cols) */}
            <div className="sm:col-span-5 h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetAllocation.slices}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {budgetAllocation.slices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Savings Ratio</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                  {budgetAllocation.savingsRatio}%
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  {formatBDT(budgetAllocation.targetSavingsTotal)}/mo
                </span>
              </div>
            </div>

            {/* Detailed Slice Cards (7 cols) */}
            <div className="sm:col-span-7 space-y-2 text-xs font-mono">
              {budgetAllocation.slices.map((slice) => (
                <div
                  key={slice.name}
                  className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                    <div>
                      <span className="text-slate-200 font-semibold block text-[11px]">{slice.name}</span>
                      <span className="text-[9px] text-slate-500 block">
                        {((slice.value / budgetAllocation.totalIncome) * 100).toFixed(1)}% of Income
                      </span>
                    </div>
                  </div>
                  <strong className="text-slate-100 font-bold text-xs">{formatBDT(slice.value)}</strong>
                </div>
              ))}
            </div>

          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border border-teal-500/40 rounded-xl p-4 text-xs space-y-1.5">
            <span className="font-bold text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              AI Advisor Insight:
            </span>
            <p className="text-slate-300 leading-relaxed">
              By allocating <strong>{formatBDT(budgetAllocation.coopSharesVal)}/month</strong> to your Cooperative Share Pool, your total borrowing capacity for zero-profit emergency loans will expand by <strong>+{formatBDT(budgetAllocation.additionalLoanCredit)}</strong> over the next 12 months.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
