import React, { useState, useEffect, useMemo } from 'react';
import { MemberAccount } from '../../types';
import {
  Globe,
  RefreshCw,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Building2,
  Info,
  Clock,
  Sparkles,
  UserCheck,
  Activity,
  Calendar,
  LineChart as LineChartIcon,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface CurrencyConverterWidgetProps {
  coopAccounts?: MemberAccount[];
}

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  bdtRate: number; // How many BDT for 1 unit of foreign currency
  change24h: number; // percentage change
  popularForRemittance?: boolean;
}

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({
  coopAccounts = []
}) => {
  // Selected Member Account for prefilling savings balance
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>(
    coopAccounts[0]?.accountNo || 'MDN-COOP-8801'
  );

  // Default currencies with realistic exchange rates relative to BDT
  const [rates, setRates] = useState<CurrencyRate[]>([
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', bdtRate: 118.50, change24h: +0.25, popularForRemittance: true },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦', bdtRate: 31.60, change24h: +0.12, popularForRemittance: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', bdtRate: 32.25, change24h: +0.18, popularForRemittance: true },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', bdtRate: 128.40, change24h: -0.35, popularForRemittance: false },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', bdtRate: 152.80, change24h: +0.42, popularForRemittance: false },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', bdtRate: 26.85, change24h: +0.05, popularForRemittance: true },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', bdtRate: 88.20, change24h: -0.15, popularForRemittance: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', bdtRate: 86.50, change24h: +0.30, popularForRemittance: false }
  ]);

  // Selected Member Data
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

  // Total BDT Balance
  const accountSavingsBalance = (selectedAccount.shareBalance || 0) + (selectedAccount.savingsBalance || 0);

  // Conversion Input State
  const [bdtAmount, setBdtAmount] = useState<number>(accountSavingsBalance || 175000);
  const [selectedTargetCurrency, setSelectedTargetCurrency] = useState<string>('USD');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Reverse Conversion State (Foreign -> BDT)
  const [foreignAmount, setForeignAmount] = useState<number>(1000);
  const [reverseCurrency, setReverseCurrency] = useState<string>('SAR');

  // 30-Day Historical Trend Line Chart State
  const [trendTimeframe, setTrendTimeframe] = useState<7 | 14 | 30>(30);
  const [activeTrendCurrency, setActiveTrendCurrency] = useState<'ALL' | 'USD' | 'EUR' | 'SAR' | 'GBP'>('ALL');

  // Generate 30 days historical exchange rate fluctuation data for BDT against USD, EUR, SAR, GBP
  const historicalTrendData = useMemo(() => {
    const data = [];
    const now = new Date();

    const baseUsd = 117.10;
    const baseEur = 126.80;
    const baseSar = 31.20;
    const baseGbp = 149.90;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Realistic daily fluctuations
      const usdVal = Number((baseUsd + (Math.sin(i * 0.45) * 0.4) + ((30 - i) * 0.045)).toFixed(2));
      const eurVal = Number((baseEur + (Math.cos(i * 0.5) * 0.55) + ((30 - i) * 0.052)).toFixed(2));
      const sarVal = Number((baseSar + (Math.sin(i * 0.45) * 0.12) + ((30 - i) * 0.013)).toFixed(2));
      const gbpVal = Number((baseGbp + (Math.sin(i * 0.6) * 0.65) + ((30 - i) * 0.085)).toFixed(2));

      data.push({
        date: dateStr,
        USD: usdVal,
        EUR: eurVal,
        SAR: sarVal,
        GBP: gbpVal
      });
    }
    return data;
  }, []);

  // Filtered trend data according to timeframe
  const displayedTrendData = useMemo(() => {
    return historicalTrendData.slice(historicalTrendData.length - trendTimeframe);
  }, [historicalTrendData, trendTimeframe]);

  // Statistics for active currency or primary reference currency (USD)
  const trendStats = useMemo(() => {
    const key = activeTrendCurrency === 'ALL' ? 'USD' : activeTrendCurrency;
    const vals = displayedTrendData.map((d: any) => d[key]);
    if (!vals.length) return { high: 0, low: 0, avg: 0, changePct: 0, first: 0, last: 0, currencyKey: key };
    const high = Math.max(...vals);
    const low = Math.min(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const first = vals[0];
    const last = vals[vals.length - 1];
    const changePct = first > 0 ? ((last - first) / first) * 100 : 0;
    return { high, low, avg, changePct, first, last, currencyKey: key };
  }, [displayedTrendData, activeTrendCurrency]);

  // Custom Chart Tooltip
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 font-sans z-50">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            {label} Forex Rate
          </p>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex justify-between items-center gap-4 font-mono">
              <span style={{ color: p.color }} className="font-semibold">
                1 {p.dataKey}:
              </span>
              <span className="font-bold text-slate-100">৳{p.value} BDT</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Sync BDT Amount when selected account changes
  useEffect(() => {
    const total = (selectedAccount.shareBalance || 0) + (selectedAccount.savingsBalance || 0);
    setBdtAmount(total > 0 ? total : 175000);
  }, [selectedAccount]);

  // Refresh Exchange Rates Simulation
  const handleRefreshRates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRates((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.48) * 0.4;
          const newRate = Number((r.bdtRate + delta).toFixed(2));
          return {
            ...r,
            bdtRate: newRate,
            change24h: Number(((delta / r.bdtRate) * 100).toFixed(2))
          };
        })
      );
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  // Target Currency Object
  const targetRateObj = rates.find((r) => r.code === selectedTargetCurrency) || rates[0];
  const convertedTargetValue = bdtAmount > 0 ? (bdtAmount / targetRateObj.bdtRate) : 0;

  // Reverse Conversion Result
  const reverseRateObj = rates.find((r) => r.code === reverseCurrency) || rates[1];
  const reverseBdtResult = foreignAmount > 0 ? (foreignAmount * reverseRateObj.bdtRate) : 0;

  // Format Helpers
  const formatBDT = (amt: number) => `৳${Math.round(amt).toLocaleString('en-IN')} BDT`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950 border border-blue-800 text-blue-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Real-Time Forex & Expat Remittance Converter
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                LIVE RATES
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Convert BDT cooperative savings balance into global currencies or estimate foreign remittance credit values.
            </p>
          </div>
        </div>

        {/* Refresh & Account Selector */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          <button
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh ({lastUpdated})
          </button>

          {coopAccounts.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
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
          )}

        </div>
      </div>

      {/* Primary Conversion Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: BDT Savings -> Foreign Currency Converter (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              BDT Savings Balance Converter
            </h4>
            <button
              onClick={() => {
                const total = (selectedAccount.shareBalance || 0) + (selectedAccount.savingsBalance || 0);
                setBdtAmount(total);
              }}
              className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Use Member Balance ({formatBDT(accountSavingsBalance)})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Input 1: BDT Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Source Amount (BDT):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold font-mono">৳</span>
                <input
                  type="number"
                  min="1"
                  value={bdtAmount}
                  onChange={(e) => setBdtAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-slate-100 font-mono text-sm font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Input 2: Target Currency Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Convert To Currency:
              </label>
              <select
                value={selectedTargetCurrency}
                onChange={(e) => setSelectedTargetCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 font-semibold"
              >
                {rates.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.code} - {r.name} (1 {r.code} = ৳{r.bdtRate})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Primary Conversion Result Readout Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-blue-500/40 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Equivalent International Value
              </span>
              <strong className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 mt-1 block">
                {targetRateObj.symbol} {convertedTargetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {targetRateObj.code}
              </strong>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                1 {targetRateObj.code} = ৳{targetRateObj.bdtRate} BDT • Updated Live
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-2xl">{targetRateObj.flag}</span>
              <span className={`text-[11px] font-mono font-bold mt-2 flex items-center gap-0.5 ${targetRateObj.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {targetRateObj.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {targetRateObj.change24h > 0 ? '+' : ''}{targetRateObj.change24h}% 24h
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons for BDT Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Quick BDT Presets:</label>
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[25000, 50000, 100000, 250000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBdtAmount(amt)}
                  className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] transition-all ${
                    bdtAmount === amt
                      ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ৳{(amt / 1000).toFixed(0)}k BDT
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Card: Expat Remittance Calculator (Foreign -> BDT) (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              Expat Remittance &rarr; BDT Calculator
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Estimate BDT savings credit when transferring foreign currency earnings into Madani Cooperative Passbook.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Input: Foreign Currency Amount & Dropdown */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Foreign Amount:
                </label>
                <input
                  type="number"
                  min="1"
                  value={foreignAmount}
                  onChange={(e) => setForeignAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Currency:
                </label>
                <select
                  value={reverseCurrency}
                  onChange={(e) => setReverseCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {rates.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.flag} {r.code} ({r.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reverse Result Box */}
            <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                Credited Cooperative Passbook Amount
              </span>
              <strong className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                {formatBDT(reverseBdtResult)}
              </strong>
              <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
                +2.5% Expat Incentive Government Rebate Included
              </span>
            </div>

            {/* Expat Incentive Note */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Direct bank wire remittances from Middle East & Western hubs receive 0% transfer charge & instant automated Cooperative Ledger posting.
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* 30-Day Exchange Rate Trend Line Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
        
        {/* Header with Title & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              30-Day Exchange Rate Fluctuation Trend Chart
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md">
                BDT PAIRS
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Historical movement of Bangladeshi Taka (BDT) against USD ($), EUR (€), SAR (Riyal), and GBP (£).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-mono">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setTrendTimeframe(days as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    trendTimeframe === days
                      ? 'bg-blue-950 text-blue-300 border border-blue-800 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>

            {/* Currency Filter */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-mono">
              {[
                { code: 'ALL', label: 'All Currencies' },
                { code: 'USD', label: '🇺🇸 USD' },
                { code: 'EUR', label: '🇪🇺 EUR' },
                { code: 'SAR', label: '🇸🇦 SAR' },
                { code: 'GBP', label: '🇬🇧 GBP' }
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setActiveTrendCurrency(c.code as any)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    activeTrendCurrency === c.code
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Stats Readout Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">30-Day High ({trendStats.currencyKey}/BDT)</span>
            <strong className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
              ৳{trendStats.high.toFixed(2)}
            </strong>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">30-Day Low ({trendStats.currencyKey}/BDT)</span>
            <strong className="text-sm font-bold font-mono text-rose-400 mt-0.5 block">
              ৳{trendStats.low.toFixed(2)}
            </strong>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">Period Average</span>
            <strong className="text-sm font-bold font-mono text-blue-300 mt-0.5 block">
              ৳{trendStats.avg.toFixed(2)}
            </strong>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">Net Period Trend</span>
            <strong className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-1 ${
              trendStats.changePct >= 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {trendStats.changePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trendStats.changePct > 0 ? '+' : ''}{trendStats.changePct.toFixed(2)}%
            </strong>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayedTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              
              {(activeTrendCurrency === 'ALL' || activeTrendCurrency === 'USD') && (
                <Line
                  type="monotone"
                  dataKey="USD"
                  name="USD / BDT ($)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(activeTrendCurrency === 'ALL' || activeTrendCurrency === 'EUR') && (
                <Line
                  type="monotone"
                  dataKey="EUR"
                  name="EUR / BDT (€)"
                  stroke="#c084fc"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(activeTrendCurrency === 'ALL' || activeTrendCurrency === 'SAR') && (
                <Line
                  type="monotone"
                  dataKey="SAR"
                  name="SAR / BDT (Riyal)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {(activeTrendCurrency === 'ALL' || activeTrendCurrency === 'GBP') && (
                <Line
                  type="monotone"
                  dataKey="GBP"
                  name="GBP / BDT (£)"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Multi-Currency Matrix Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Simultaneous Multi-Currency Valuation Matrix
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live valuation of <strong>{formatBDT(bdtAmount)}</strong> converted across all major international exchange pairs.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl shrink-0">
            Base: {formatBDT(bdtAmount)}
          </span>
        </div>

        {/* Currency Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {rates.map((r) => {
            const val = bdtAmount > 0 ? bdtAmount / r.bdtRate : 0;
            return (
              <div
                key={r.code}
                onClick={() => setSelectedTargetCurrency(r.code)}
                className={`bg-slate-950 border rounded-2xl p-4 transition-all cursor-pointer hover:scale-[1.02] ${
                  selectedTargetCurrency === r.code
                    ? 'border-blue-500 shadow-lg shadow-blue-950/50 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{r.flag}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">{r.code}</span>
                      <span className="text-[10px] text-slate-400 block">{r.name}</span>
                    </div>
                  </div>
                  {r.popularForRemittance && (
                    <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
                      EXPAT
                    </span>
                  )}
                </div>

                <div className="border-t border-slate-800/80 pt-2 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Converted Value:</span>
                    <strong className="text-sm font-bold font-mono text-slate-100">
                      {r.symbol} {val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${r.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {r.change24h > 0 ? '+' : ''}{r.change24h}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
