import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  Coins,
  ShieldCheck,
  Percent,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const InterestEstimator: React.FC = () => {
  // Mode selection: Savings Growth vs Loan Cost Comparison
  const [calculationMode, setCalculationMode] = useState<'savings' | 'loan'>('savings');

  // Input Parameters
  const [principal, setPrincipal] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3000);
  const [horizonMonths, setHorizonMonths] = useState<number>(24);

  // Model Rates
  const [profitShareModel, setProfitShareModel] = useState<'Mudarabah' | 'CoopDividend' | 'FixedWelfare'>('Mudarabah');

  // Format BDT
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // Profit Rates Mapping
  const profitRates: { [key: string]: { rate: number; name: string; description: string } } = {
    Mudarabah: {
      rate: 0.085, // 8.5% p.a.
      name: 'Mudarabah Profit-Share (8.5% Est. p.a.)',
      description: 'Shariah-compliant profit distribution based on halal trade pool performance.'
    },
    CoopDividend: {
      rate: 0.102, // 10.2% p.a.
      name: 'Cooperative Society Dividend Pool (10.2% Est. p.a.)',
      description: 'Annual surplus dividend shared equally among active cooperative members.'
    },
    FixedWelfare: {
      rate: 0.070, // 7.0% p.a.
      name: 'Fixed Welfare Return (7.0% Est. p.a.)',
      description: 'Conservative growth pool dedicated for micro-entrepreneur seed funding.'
    }
  };

  // Conventional Interest Rate for Comparison (12.5% p.a.)
  const conventionalLoanRate = 0.125;

  // Monthly Projection Generation
  const projectionData = useMemo(() => {
    const data: Array<{
      monthLabel: string;
      monthNum: number;
      cumulativePrincipal: number;
      projectedSavingsGrowth: number;
      zeroProfitLoanCost: number;
      conventionalLoanCost: number;
      interestSaved: number;
    }> = [];

    const selectedRate = profitRates[profitShareModel].rate;
    const monthlyRate = selectedRate / 12;
    const monthlyLoanRate = conventionalLoanRate / 12;

    let currentSavings = principal;
    let totalInvestedPrincipal = principal;

    // Loan calculations
    // For Zero-profit loan: User pays back principal / horizonMonths each month. Total interest = 0.
    // For Conventional loan: Interest added monthly based on remaining balance.
    let remainingLoanBalance = principal;
    let totalConventionalInterest = 0;
    const monthlyLoanPrincipalRepayment = principal / horizonMonths;

    for (let m = 1; m <= horizonMonths; m++) {
      // Savings calculation
      currentSavings = (currentSavings + monthlyContribution) * (1 + monthlyRate);
      totalInvestedPrincipal += monthlyContribution;

      // Loan interest calculation
      if (remainingLoanBalance > 0) {
        const monthInterest = remainingLoanBalance * monthlyLoanRate;
        totalConventionalInterest += monthInterest;
        remainingLoanBalance = Math.max(0, remainingLoanBalance - monthlyLoanPrincipalRepayment);
      }

      data.push({
        monthLabel: `M${m}`,
        monthNum: m,
        cumulativePrincipal: Math.round(totalInvestedPrincipal),
        projectedSavingsGrowth: Math.round(currentSavings),
        zeroProfitLoanCost: Math.round(principal), // 0% interest, constant total cost equal to principal
        conventionalLoanCost: Math.round(principal + totalConventionalInterest), // Principal + accumulated interest
        interestSaved: Math.round(totalConventionalInterest)
      });
    }

    return data;
  }, [principal, monthlyContribution, horizonMonths, profitShareModel]);

  // Final Summary Numbers
  const finalMonth = projectionData[projectionData.length - 1] || {
    cumulativePrincipal: principal,
    projectedSavingsGrowth: principal,
    conventionalLoanCost: principal,
    interestSaved: 0
  };

  const totalDividendsEarned = Math.max(0, finalMonth.projectedSavingsGrowth - finalMonth.cumulativePrincipal);
  const totalInterestSavedOnLoan = finalMonth.interestSaved;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 font-sans z-50">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">Month {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Interest & Profit-Share Growth Estimator
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                PROJECTION ENGINE
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate member cooperative savings growth or calculate interest savings on zero-profit emergency welfare loans over custom horizons.
            </p>
          </div>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setCalculationMode('savings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              calculationMode === 'savings'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            Savings Growth Projector
          </button>
          <button
            onClick={() => setCalculationMode('loan')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              calculationMode === 'loan'
                ? 'bg-amber-950 text-amber-300 border border-amber-600/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            0% Interest Loan Savings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {calculationMode === 'savings' ? 'Initial Deposit / Principal' : 'Requested Loan Amount'}
            </span>
            <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{formatBDT(principal)}</strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Base Capital</span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {calculationMode === 'savings' ? 'Monthly Savings Contribution' : 'Horizon Tenure'}
            </span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {calculationMode === 'savings' ? formatBDT(monthlyContribution) : `${horizonMonths} Months`}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">Recurring Allocation</span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {calculationMode === 'savings' ? 'Projected Final Balance' : 'Zero-Profit Repayment Total'}
            </span>
            <strong className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">
              {calculationMode === 'savings' ? formatBDT(finalMonth.projectedSavingsGrowth) : formatBDT(principal)}
            </strong>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">
              {calculationMode === 'savings' ? `Includes ${formatBDT(totalDividendsEarned)} Dividends` : '0% Interest Charged'}
            </span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {calculationMode === 'savings' ? 'Estimated Annual Yield' : 'Conventional Interest Saved'}
            </span>
            <strong className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              {calculationMode === 'savings'
                ? `${(profitRates[profitShareModel].rate * 100).toFixed(1)}% p.a.`
                : formatBDT(totalInterestSavedOnLoan)}
            </strong>
            <span className="text-[10px] text-amber-500 font-mono mt-1 block">
              {calculationMode === 'savings' ? profitShareModel : 'vs 12.5% Commercial Microfinance'}
            </span>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800/60 text-amber-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Section: Controls & Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            Simulation Input Controls
          </h4>

          <div className="space-y-4 text-xs">
            
            {/* Input 1: Principal Amount */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>{calculationMode === 'savings' ? 'Initial Savings Deposit (BDT):' : 'Loan Amount Requested (BDT):'}</span>
                <span className="font-mono text-emerald-400 font-bold">{formatBDT(principal)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Input 2: Monthly Deposit (Savings mode only) */}
            {calculationMode === 'savings' && (
              <div>
                <div className="flex justify-between text-slate-300 font-semibold mb-1">
                  <span>Monthly Contribution (BDT):</span>
                  <span className="font-mono text-teal-400 font-bold">{formatBDT(monthlyContribution)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-teal-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Input 3: Time Horizon */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Time Horizon / Tenure:</span>
                <span className="font-mono text-amber-400 font-bold">{horizonMonths} Months</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono pt-1">
                {[6, 12, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setHorizonMonths(m)}
                    className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] transition-all ${
                      horizonMonths === m
                        ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Profit Share Model (Savings mode) */}
            {calculationMode === 'savings' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Cooperative Profit-Sharing Model:</label>
                <select
                  value={profitShareModel}
                  onChange={(e) => setProfitShareModel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="Mudarabah">Mudarabah Halal Pool (Est. 8.5% p.a.)</option>
                  <option value="CoopDividend">Cooperative Annual Dividend (Est. 10.2% p.a.)</option>
                  <option value="FixedWelfare">Micro-Seed Welfare Fund (Est. 7.0% p.a.)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                  {profitRates[profitShareModel].description}
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Madani Welfare Standard
              </span>
              <p>
                All interest rates and profit ratios are strictly audited in accordance with Islamic cooperative microfinance guidelines.
              </p>
            </div>

          </div>
        </div>

        {/* Responsive Line Chart Column (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                {calculationMode === 'savings'
                  ? 'Projected Savings Growth Curve vs. Base Principal'
                  : 'Zero-Profit Welfare Loan Cost vs. Conventional Interest Debt'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {calculationMode === 'savings'
                  ? `Simulating ${horizonMonths}-month cumulative compounding returns with ${profitRates[profitShareModel].name}.`
                  : `Comparing Madani 0% welfare loan repayments against standard 12.5% microfinance interest charges.`}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              {calculationMode === 'savings' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-slate-400 inline-block" />
                    <span className="text-slate-300">Base Principal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                    <span className="text-emerald-400 font-bold">With Dividends</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                    <span className="text-emerald-400 font-bold">Madani 0% Welfare</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                    <span className="text-rose-400">12.5% Commercial</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Line Chart */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {calculationMode === 'savings' ? (
                <LineChart data={projectionData} margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} dy={8} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="cumulativePrincipal"
                    name="Invested Principal"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedSavingsGrowth"
                    name="Projected Total Balance"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </LineChart>
              ) : (
                <LineChart data={projectionData} margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} dy={8} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `৳${(val / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="zeroProfitLoanCost"
                    name="Madani 0% Welfare Cost"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conventionalLoanCost"
                    name="12.5% Commercial Cost"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: '#f43f5e' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </div>
  );
};
