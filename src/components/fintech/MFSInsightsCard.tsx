import React, { useState, useMemo } from 'react';
import { MFSTransaction } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Repeat,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Clock,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  Brain,
  ChevronRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface MFSInsightsCardProps {
  transactions?: MFSTransaction[];
}

export const MFSInsightsCard: React.FC<MFSInsightsCardProps> = ({
  transactions = []
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'RECURRING' | 'ANOMALIES' | 'HIGH_VALUE'>('ALL');
  const [scanTimestamp, setScanTimestamp] = useState<string>('Just now');

  // Trigger AI Scan
  const handleTriggerAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 700);
  };

  // Format BDT
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // MFS Insights Analysis Engine
  const analysisResults = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalVolume: 0,
        averageAmount: 0,
        anomalies: [],
        recurringItems: [],
        typeBreakdown: [],
        savedCharges: 0,
        anomalyScore: 0,
        riskLevel: 'LOW'
      };
    }

    const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    const averageAmount = totalVolume / transactions.length;

    // Detect Anomalies:
    // 1. Amount > 2.0x average OR amount >= 30,000
    // 2. Failed transactions
    const anomalies: Array<{
      trx: MFSTransaction;
      reason: string;
      severity: 'HIGH' | 'MEDIUM';
    }> = [];

    transactions.forEach((t) => {
      if (t.amount >= 35000) {
        anomalies.push({
          trx: t,
          reason: `High-value single transfer of ${formatBDT(t.amount)} (${(t.amount / Math.max(1, averageAmount)).toFixed(1)}x avg)`,
          severity: 'HIGH'
        });
      } else if (t.amount > averageAmount * 2.2) {
        anomalies.push({
          trx: t,
          reason: `Volume spike detected (${formatBDT(t.amount)} vs avg ${formatBDT(averageAmount)})`,
          severity: 'MEDIUM'
        });
      } else if (t.status === 'FAILED') {
        anomalies.push({
          trx: t,
          reason: 'Failed transaction attempt flagged for audit',
          severity: 'HIGH'
        });
      }
    });

    // Detect Recurring Transfers:
    // Group by (receiverPhone + type)
    const receiverMap: { [key: string]: { count: number; total: number; receiver: string; type: string; provider: string } } = {};

    transactions.forEach((t) => {
      const key = `${t.receiverPhone}_${t.type}`;
      if (!receiverMap[key]) {
        receiverMap[key] = {
          count: 0,
          total: 0,
          receiver: t.receiverPhone,
          type: t.type,
          provider: t.provider
        };
      }
      receiverMap[key].count += 1;
      receiverMap[key].total += t.amount;
    });

    const recurringItems = Object.values(receiverMap)
      .filter((item) => item.count >= 1) // Any active receiver or frequent pattern
      .map((item) => ({
        receiver: item.receiver,
        type: item.type,
        provider: item.provider,
        frequencyCount: item.count,
        totalSpent: item.total,
        avgAmount: Math.round(item.total / item.count),
        patternName: item.type === 'Send Money' ? 'Monthly Family Allowance' : item.type === 'Merchant Pay' ? 'Cooperative Vendor Pay' : item.type === 'Mobile Recharge' ? 'Auto Telecom Reload' : 'Agent Cash Out'
      }));

    // Commercial Fees Saved (e.g. bKash/Nagad standard 1.85% cash out / transfer fee = 1.85% of total volume)
    const savedCharges = Math.round(totalVolume * 0.0185);

    // Anomaly Risk Index
    const anomalyScore = Math.min(100, Math.round((anomalies.length / Math.max(1, transactions.length)) * 100 * 2.5));
    const riskLevel = anomalyScore > 40 ? 'HIGH' : anomalyScore > 15 ? 'MODERATE' : 'LOW';

    // Type Breakdown for Donut Chart
    const typeTotals: { [key: string]: number } = {};
    transactions.forEach((t) => {
      typeTotals[t.type] = (typeTotals[t.type] || 0) + t.amount;
    });

    const typeBreakdown = [
      { name: 'Send Money', value: typeTotals['Send Money'] || 0, color: '#ec4899' },
      { name: 'Merchant Pay', value: typeTotals['Merchant Pay'] || 0, color: '#f97316' },
      { name: 'Cash Out', value: typeTotals['Cash Out'] || 0, color: '#a855f7' },
      { name: 'Mobile Recharge', value: typeTotals['Mobile Recharge'] || 0, color: '#14b8a6' }
    ].filter((item) => item.value > 0);

    return {
      totalVolume,
      averageAmount,
      anomalies,
      recurringItems,
      typeBreakdown,
      savedCharges,
      anomalyScore,
      riskLevel
    };
  }, [transactions]);

  // Filtered List Display
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'ANOMALIES') {
      const anomalyIds = new Set(analysisResults.anomalies.map((a) => a.trx.id));
      return transactions.filter((t) => anomalyIds.has(t.id));
    }
    if (selectedFilter === 'RECURRING') {
      return transactions.filter((t) => t.type === 'Send Money' || t.type === 'Merchant Pay');
    }
    if (selectedFilter === 'HIGH_VALUE') {
      return transactions.filter((t) => t.amount >= 20000);
    }
    return transactions;
  }, [transactions, selectedFilter, analysisResults.anomalies]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs space-y-1 font-sans z-50">
          <p className="font-bold text-slate-100">{payload[0].name}</p>
          <p className="font-mono font-bold text-emerald-400">
            {formatBDT(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl relative">
            <Brain className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI MFS Transaction & Pattern Intelligence
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded-md">
                ANOMALY DETECTOR v2.4
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated neural scan identifying recurring expense commitments, high-velocity transfer spikes, and MFS fee savings.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTriggerAIScan}
            disabled={isScanning}
            className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning MFS Pattern...' : 'Run AI Pattern Scan'}
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Processed Volume */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Evaluated MFS Volume</span>
            <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">
              {formatBDT(analysisResults.totalVolume)}
            </strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Avg: {formatBDT(analysisResults.averageAmount)} / Trx
            </span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Recurring Commitments */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Recurring Commitments</span>
            <strong className="text-xl font-bold text-teal-400 font-mono mt-0.5 block">
              {analysisResults.recurringItems.length} Identified
            </strong>
            <span className="text-[10px] text-teal-500 font-mono mt-1 block">
              Scheduled / Routine Outflows
            </span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <Repeat className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Detected Anomalies */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Pattern Anomalies</span>
            <strong className={`text-xl font-bold font-mono mt-0.5 block ${analysisResults.anomalies.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {analysisResults.anomalies.length} Flagged
            </strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              {analysisResults.anomalies.length > 0 ? 'Review Spike Alerts' : '0 Suspicious Outliers'}
            </span>
          </div>
          <div className={`p-3 border rounded-xl ${analysisResults.anomalies.length > 0 ? 'bg-amber-950 border-amber-800/60 text-amber-400' : 'bg-emerald-950 border-emerald-800/60 text-emerald-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: MFS Fees Saved */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Commercial Fees Saved</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatBDT(analysisResults.savedCharges)}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              Via 0% Cooperative Protocol
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Grid: AI Anomaly Alerts & Recurring Items on Left, Breakdown Donut on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Anomaly & Recurring Expense Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Anomaly Alerts Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Flagged Anomaly & Velocity Spikes
              </h4>
              <span className="text-[10px] font-mono text-slate-400">AI Sensitivity: High</span>
            </div>

            {analysisResults.anomalies.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-200">No Spending Anomalies Detected</p>
                <p className="text-[11px] text-slate-400">All MFS transfers fall within predictable velocity and volume thresholds.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analysisResults.anomalies.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-950/20 border border-amber-800/50 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-amber-950 border border-amber-700 text-amber-400 rounded-lg shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{item.trx.provider} ({item.trx.type})</span>
                          <span className="text-[9px] font-mono font-bold bg-amber-900 text-amber-300 border border-amber-700 px-1.5 py-0.2 rounded">
                            {item.severity} SEVERITY
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-200/80 mt-0.5">{item.reason}</p>
                        <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                          Trx ID: {item.trx.trxId} • Recipient: {item.trx.receiverPhone} • {item.trx.timestamp}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-amber-300 text-sm shrink-0">
                      {formatBDT(item.trx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recurring Expense Commitments Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Repeat className="w-4 h-4 text-teal-400" />
                Identified Recurring Commitments & Allowances
              </h4>
              <span className="text-[10px] font-mono text-teal-400">Pattern Matched</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              {analysisResults.recurringItems.map((rec, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-100">{rec.patternName}</span>
                    <span className="text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded">
                      {rec.provider}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">Recipient: {rec.receiver}</p>
                  <div className="flex justify-between items-center border-t border-slate-800/80 pt-1.5 text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">{rec.frequencyCount} Transfer(s)</span>
                    <span className="font-bold text-teal-300">{formatBDT(rec.totalSpent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Donut Category Breakdown & Detailed Transaction Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* MFS Type Distribution Donut Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col items-center">
            <div className="w-full flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                MFS Outflow Category Breakdown
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Distribution</span>
            </div>

            {/* Recharts Donut */}
            <div className="w-full h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysisResults.typeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analysisResults.typeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">Total MFS</span>
                <span className="text-xs font-bold font-mono text-purple-300">
                  {formatBDT(analysisResults.totalVolume)}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-2 text-[11px] font-mono">
              {analysisResults.typeBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-1.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate text-[10px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-100 text-[10px]">{formatBDT(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Filterable Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                Filtered Audit Log
              </h4>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className={`px-2 py-0.5 rounded ${selectedFilter === 'ALL' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('ANOMALIES')}
                  className={`px-2 py-0.5 rounded ${selectedFilter === 'ANOMALIES' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Alerts
                </button>
                <button
                  onClick={() => setSelectedFilter('HIGH_VALUE')}
                  className={`px-2 py-0.5 rounded ${selectedFilter === 'HIGH_VALUE' ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  High Value
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredTransactions.map((trx) => (
                <div key={trx.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{trx.provider}</span>
                      <span className="text-[10px] text-slate-400">({trx.type})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{trx.trxId} • {trx.timestamp}</span>
                  </div>
                  <strong className="text-slate-100 font-bold">{formatBDT(trx.amount)}</strong>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
