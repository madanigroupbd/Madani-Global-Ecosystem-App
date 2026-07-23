import React, { useState, useMemo } from 'react';
import { MemberAccount, EmergencyLoan } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  Scale,
  PieChart as PieIcon,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  DollarSign,
  PiggyBank,
  CreditCard,
  Building2,
  BarChart2,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface DebtToEquityHealthCardProps {
  coopAccounts?: MemberAccount[];
  loans?: EmergencyLoan[];
}

export const DebtToEquityHealthCard: React.FC<DebtToEquityHealthCardProps> = ({
  coopAccounts = [],
  loans = []
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Format BDT Helper
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // Filtered Data based on District
  const filteredAccounts = useMemo(() => {
    if (selectedDistrict === 'ALL') return coopAccounts;
    return coopAccounts.filter((acc) => (acc.district || 'Other') === selectedDistrict);
  }, [coopAccounts, selectedDistrict]);

  const filteredLoans = useMemo(() => {
    if (selectedDistrict === 'ALL') return loans;
    return loans.filter((l) => (l.district || 'Other') === selectedDistrict);
  }, [loans, selectedDistrict]);

  // Unique Districts List
  const districtList = useMemo(() => {
    const districts = new Set<string>();
    coopAccounts.forEach((acc) => acc.district && districts.add(acc.district));
    loans.forEach((l) => l.district && districts.add(l.district));
    return Array.from(districts);
  }, [coopAccounts, loans]);

  // Key Solvency & Leverage Metrics Calculation
  const healthMetrics = useMemo(() => {
    // Total Savings
    const totalSavings = filteredAccounts.reduce((sum, acc) => sum + (acc.totalSavings || 0), 0);

    // Active Outstanding Loan Balance (amountRequested - repaidAmount)
    const activeOutstandingDebt = filteredLoans.reduce((sum, l) => {
      const remaining = (l.amountRequested || 0) - (l.repaidAmount || 0);
      return sum + Math.max(0, remaining);
    }, 0);

    // Total Repaid Amount
    const totalRepaidDebt = filteredLoans.reduce((sum, l) => sum + (l.repaidAmount || 0), 0);

    // Net Capital Solvency Reserve
    const netLiquidityReserve = Math.max(0, totalSavings - activeOutstandingDebt);

    // Coverage Ratio = Savings / Outstanding Debt * 100
    const savingsToLoanRatio = activeOutstandingDebt > 0 ? (totalSavings / activeOutstandingDebt) * 100 : 999;
    
    // Leverage Ratio = Debt / Savings * 100
    const debtToEquityRatio = totalSavings > 0 ? (activeOutstandingDebt / totalSavings) * 100 : 0;

    // Health Rating Determination
    let healthRating = 'A+ Optimal Solvency';
    let ratingColor = 'text-emerald-400 border-emerald-500 bg-emerald-950/80';
    let healthDescription = 'Cooperative capital pool holds strong liquidity buffer. Outstanding loan debt is less than 50% of total savings.';
    let riskLevel = 'LOW';

    if (debtToEquityRatio > 75) {
      healthRating = 'C High Leverage Caution';
      ratingColor = 'text-rose-400 border-rose-500 bg-rose-950/80';
      healthDescription = 'Active loan disbursements exceed 75% of total savings reserves. Additional lending should be monitored.';
      riskLevel = 'HIGH';
    } else if (debtToEquityRatio > 50) {
      healthRating = 'B Balanced Leverage';
      ratingColor = 'text-amber-400 border-amber-500 bg-amber-950/80';
      healthDescription = 'Cooperative maintains a stable 1:1.5 to 1:2 savings-to-loan ratio. Risk exposure is well balanced.';
      riskLevel = 'MODERATE';
    }

    return {
      totalSavings,
      activeOutstandingDebt,
      totalRepaidDebt,
      netLiquidityReserve,
      savingsToLoanRatio,
      debtToEquityRatio,
      healthRating,
      ratingColor,
      healthDescription,
      riskLevel
    };
  }, [filteredAccounts, filteredLoans]);

  // Donut Pie Chart Data
  const pieChartData = [
    { name: 'Net Liquidity Reserve', value: healthMetrics.netLiquidityReserve, color: '#10b981' },
    { name: 'Active Disbursed Debt', value: healthMetrics.activeOutstandingDebt, color: '#f59e0b' },
    { name: 'Recovered Debt Pool', value: healthMetrics.totalRepaidDebt, color: '#06b6d4' }
  ];

  // District Health Bar Comparison Chart
  const districtHealthData = useMemo(() => {
    const map: { [key: string]: { district: string; savings: number; activeDebt: number } } = {};

    coopAccounts.forEach((acc) => {
      const d = acc.district || 'Other';
      if (!map[d]) map[d] = { district: d, savings: 0, activeDebt: 0 };
      map[d].savings += acc.totalSavings || 0;
    });

    loans.forEach((l) => {
      const d = l.district || 'Other';
      if (!map[d]) map[d] = { district: d, savings: 0, activeDebt: 0 };
      const rem = Math.max(0, (l.amountRequested || 0) - (l.repaidAmount || 0));
      map[d].activeDebt += rem;
    });

    return Object.values(map);
  }, [coopAccounts, loans]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 font-sans z-50">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{payload[0].name || payload[0].payload.district}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-950 border border-teal-800 text-teal-400 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Debt-to-Equity & Capital Solvency Health Card
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-teal-950 text-teal-300 border border-teal-800 rounded-md">
                FINANCIAL HEALTH RATIO
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated solvency assessment measuring cooperative member savings reserves against outstanding zero-profit emergency loans.
            </p>
          </div>
        </div>

        {/* District Filter Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5 shrink-0">
          <Building2 className="w-4 h-4 text-teal-400 ml-1.5" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none pr-2 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100">All Ecosystem Districts</option>
            {districtList.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-slate-100">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Savings to Loan Coverage */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Savings-to-Loan Coverage</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {healthMetrics.savingsToLoanRatio > 900 ? '999%+' : `${healthMetrics.savingsToLoanRatio.toFixed(1)}%`}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              {(healthMetrics.savingsToLoanRatio / 100).toFixed(2)}x Capital Coverage
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Debt-to-Equity Leverage Ratio */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Debt-to-Equity Leverage</span>
            <strong className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              {healthMetrics.debtToEquityRatio.toFixed(1)}%
            </strong>
            <span className="text-[10px] text-amber-500 font-mono mt-1 block">Active Debt vs Savings</span>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800/60 text-amber-400 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Net Solvency Capital Buffer */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Net Liquidity Buffer</span>
            <strong className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">
              {formatBDT(healthMetrics.netLiquidityReserve)}
            </strong>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">Unencumbered Reserves</span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Health Rating Badge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Solvency Status</span>
            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold border mt-1 ${healthMetrics.ratingColor}`}>
              {healthMetrics.healthRating}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Risk Profile: {healthMetrics.riskLevel}
            </span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: Recharts Donut Chart on Left & Leverage Meter + District Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recharts Donut Distribution Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-400" />
              Capital Reserve Breakdown
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Total: {formatBDT(healthMetrics.totalSavings)}</span>
          </div>

          {/* Recharts Pie/Donut Chart */}
          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Central Donut Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Solvency Ratio</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {(100 - healthMetrics.debtToEquityRatio).toFixed(0)}% Safe
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="w-full space-y-2 text-xs font-mono">
            {pieChartData.map((item) => (
              <div key={item.name} className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-2 px-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-semibold">{item.name}</span>
                </div>
                <span className="font-bold text-slate-100">{formatBDT(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Leverage Gauge Meter Bar & District Bar Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Solvency Meter Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Cooperative Leverage Capacity Meter
              </span>
              <span className="text-emerald-400 font-bold">
                {healthMetrics.debtToEquityRatio.toFixed(1)}% / 100% Max Threshold
              </span>
            </div>

            {/* Gauge Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  healthMetrics.debtToEquityRatio > 75
                    ? 'bg-rose-500'
                    : healthMetrics.debtToEquityRatio > 50
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, healthMetrics.debtToEquityRatio)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>0% (100% Liquid)</span>
              <span>25% (Conservative)</span>
              <span>50% (Optimal)</span>
              <span>75% (Alert)</span>
              <span>100%+ (Overleveraged)</span>
            </div>

            {/* Description Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{healthMetrics.healthDescription}</span>
            </div>
          </div>

          {/* District Comparison Recharts Bar Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                District Solvency Comparison: Savings vs. Outstanding Debt
              </h4>
              <span className="text-[10px] font-mono text-slate-400">BDT Metrics</span>
            </div>

            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtHealthData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="district" stroke="#94a3b8" fontSize={10} tickLine={false} dy={5} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="savings" name="Member Savings" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="activeDebt" name="Active Debt" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
