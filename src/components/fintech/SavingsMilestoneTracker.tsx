import React, { useState, useMemo } from 'react';
import { MemberAccount, SavingsGoal } from '../../types';
import {
  Target,
  PiggyBank,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Calendar,
  Compass,
  AlertCircle,
  Building2,
  DollarSign,
  Layers,
  HeartHandshake,
  Wrench,
  GraduationCap,
  Briefcase,
  Tractor,
  X,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Clock,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface SavingsMilestoneTrackerProps {
  coopAccounts?: MemberAccount[];
}

export const SavingsMilestoneTracker: React.FC<SavingsMilestoneTrackerProps> = ({
  coopAccounts = []
}) => {
  // Account Selector
  const [selectedAccountNo, setSelectedAccountNo] = useState<string>(
    coopAccounts[0]?.accountNo || 'MDN-COOP-8801'
  );

  const selectedAccount = useMemo(() => {
    return coopAccounts.find((acc) => acc.accountNo === selectedAccountNo) || coopAccounts[0] || {
      id: 'acc-1',
      accountNo: 'MDN-COOP-8801',
      memberName: 'Dr. Rafiqul Islam',
      district: 'Dhaka Central',
      totalSavings: 795000,
      totalDeposits: 820000,
      totalWithdrawals: 25000,
      lastTransactionDate: '2026-07-20',
      status: 'ACTIVE'
    };
  }, [coopAccounts, selectedAccountNo]);

  // Initial Mock Goals State
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: 'goal-1',
      title: 'Holy Hajj & Pilgrimage Fund',
      category: 'Hajj & Umrah',
      targetAmount: 600000,
      currentAllocated: 380000,
      targetDate: '2027-06-15',
      priority: 'HIGH',
      createdAt: '2025-01-10',
      accountNo: 'MDN-COOP-8801'
    },
    {
      id: 'goal-2',
      title: 'Emergency Storm & Roof Repair',
      category: 'Emergency Repair',
      targetAmount: 150000,
      currentAllocated: 125000,
      targetDate: '2026-11-30',
      priority: 'HIGH',
      createdAt: '2025-03-01',
      accountNo: 'MDN-COOP-8801'
    },
    {
      id: 'goal-3',
      title: 'Children Higher Education Fund',
      category: 'Education',
      targetAmount: 300000,
      currentAllocated: 110000,
      targetDate: '2028-12-31',
      priority: 'MEDIUM',
      createdAt: '2025-05-12',
      accountNo: 'MDN-COOP-8801'
    },
    {
      id: 'goal-4',
      title: 'Cooperative Power Tiller & Agri Fund',
      category: 'Agri Machinery',
      targetAmount: 200000,
      currentAllocated: 180000,
      targetDate: '2026-09-15',
      priority: 'MEDIUM',
      createdAt: '2025-08-20',
      accountNo: 'MDN-COOP-8801'
    }
  ]);

  // Filters State
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [quickDepositGoalId, setQuickDepositGoalId] = useState<string | null>(null);
  const [depositAmountInput, setDepositAmountInput] = useState<string>('10000');

  // New Goal Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SavingsGoal['category']>('Hajj & Umrah');
  const [newTargetAmount, setNewTargetAmount] = useState<string>('250000');
  const [newInitialAlloc, setNewInitialAlloc] = useState<string>('20000');
  const [newTargetDate, setNewTargetDate] = useState<string>('2027-12-31');
  const [newPriority, setNewPriority] = useState<SavingsGoal['priority']>('MEDIUM');

  // Format BDT Helper
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // Calculated Metrics
  const metrics = useMemo(() => {
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalAllocated = goals.reduce((acc, g) => acc + g.currentAllocated, 0);
    const remainingNeeded = Math.max(0, totalTarget - totalAllocated);
    const overallProgressPercent = totalTarget > 0 ? Math.min(100, (totalAllocated / totalTarget) * 100) : 0;
    const completedGoalsCount = goals.filter((g) => g.currentAllocated >= g.targetAmount).length;

    // Available unallocated savings from selected account
    const memberTotalSavings = selectedAccount.totalSavings || 0;
    const unallocatedSavings = Math.max(0, memberTotalSavings - totalAllocated);

    return {
      totalTarget,
      totalAllocated,
      remainingNeeded,
      overallProgressPercent,
      completedGoalsCount,
      memberTotalSavings,
      unallocatedSavings
    };
  }, [goals, selectedAccount]);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    if (categoryFilter === 'ALL') return goals;
    if (categoryFilter === 'COMPLETED') return goals.filter((g) => g.currentAllocated >= g.targetAmount);
    if (categoryFilter === 'IN_PROGRESS') return goals.filter((g) => g.currentAllocated < g.targetAmount);
    return goals.filter((g) => g.category === categoryFilter);
  }, [goals, categoryFilter]);

  // Recharts Chart Data
  const chartData = useMemo(() => {
    return goals.map((g) => ({
      name: g.title.length > 18 ? `${g.title.slice(0, 18)}...` : g.title,
      Allocated: g.currentAllocated,
      Target: g.targetAmount,
      pct: Math.min(100, Math.round((g.currentAllocated / g.targetAmount) * 100))
    }));
  }, [goals]);

  // Category Icon Resolver
  const getCategoryIcon = (category: SavingsGoal['category']) => {
    switch (category) {
      case 'Hajj & Umrah':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'Emergency Repair':
        return <Wrench className="w-4 h-4 text-rose-400" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'Business Investment':
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'Agri Machinery':
        return <Tractor className="w-4 h-4 text-emerald-400" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-teal-400" />;
    }
  };

  // Add Goal Handler
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetVal = parseFloat(newTargetAmount) || 100000;
    const initialAllocVal = parseFloat(newInitialAlloc) || 0;

    const created: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: targetVal,
      currentAllocated: Math.min(targetVal, initialAllocVal),
      targetDate: newTargetDate || '2027-12-31',
      priority: newPriority,
      createdAt: new Date().toISOString().split('T')[0],
      accountNo: selectedAccountNo
    };

    setGoals((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
  };

  // Quick Deposit Handler
  const handleQuickDeposit = (goalId: string) => {
    const depositAmt = parseFloat(depositAmountInput) || 0;
    if (depositAmt <= 0) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = Math.min(g.targetAmount, g.currentAllocated + depositAmt);
          return { ...g, currentAllocated: updated };
        }
        return g;
      })
    );

    setQuickDepositGoalId(null);
    setDepositAmountInput('10000');
  };

  // Custom Recharts Tooltip
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-sans z-50">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{data.name}</p>
          <div className="flex justify-between gap-4 text-emerald-400">
            <span>Saved:</span>
            <span className="font-mono font-bold">{formatBDT(data.Allocated)}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400">
            <span>Target Goal:</span>
            <span className="font-mono font-bold">{formatBDT(data.Target)}</span>
          </div>
          <div className="flex justify-between gap-4 text-teal-300 font-bold border-t border-slate-800 pt-1">
            <span>Completion:</span>
            <span>{data.pct}%</span>
          </div>
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
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Cooperative Savings Milestone & Goal Tracker
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                HAJJ & WELFARE TARGETS
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set specific financial milestones (Hajj, Emergency Repairs, Education) and monitor progress against your cooperative passbook reserves.
            </p>
          </div>
        </div>

        {/* Member Account Selector & Add Goal Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Set New Savings Goal
          </button>

          {coopAccounts.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
              <Building2 className="w-4 h-4 text-emerald-400 ml-1.5" />
              <select
                value={selectedAccountNo}
                onChange={(e) => setSelectedAccountNo(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none pr-2 cursor-pointer"
              >
                {coopAccounts.map((acc) => (
                  <option key={acc.accountNo} value={acc.accountNo} className="bg-slate-900 text-slate-100">
                    {acc.memberName} ({acc.accountNo})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Allocated Savings */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Allocated Goal Capital</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatBDT(metrics.totalAllocated)}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              From Total Savings: {formatBDT(metrics.memberTotalSavings)}
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Total Target Goals Needed */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Target Milestones</span>
            <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">
              {formatBDT(metrics.totalTarget)}
            </strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Across {goals.length} Active Goals</span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Overall Completion % */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Overall Progress</span>
            <strong className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">
              {metrics.overallProgressPercent.toFixed(1)}%
            </strong>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">
              {metrics.completedGoalsCount} Goals Completed
            </span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Remaining Deficit Needed */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Remaining Gap Needed</span>
            <strong className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              {formatBDT(metrics.remainingNeeded)}
            </strong>
            <span className="text-[10px] text-amber-500 font-mono mt-1 block">Unallocated: {formatBDT(metrics.unallocatedSavings)}</span>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800/60 text-amber-400 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Container: Goal Cards List on Left (8 cols) & Recharts Bar Chart on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filter Bar & Goal Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {[
                { id: 'ALL', label: 'All Goals' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'COMPLETED', label: 'Completed' },
                { id: 'Hajj & Umrah', label: 'Hajj' },
                { id: 'Emergency Repair', label: 'Repair' },
                { id: 'Education', label: 'Education' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCategoryFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    categoryFilter === filter.id
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-500 font-mono pr-1">
              Showing {filteredGoals.length} item(s)
            </span>
          </div>

          {/* Goal Cards Grid */}
          <div className="space-y-4">
            {filteredGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAllocated / goal.targetAmount) * 100));
              const remainingAmt = Math.max(0, goal.targetAmount - goal.currentAllocated);
              const isDone = pct >= 100;

              return (
                <div
                  key={goal.id}
                  className={`bg-slate-950 border rounded-2xl p-4 shadow-xl space-y-3 transition-all ${
                    isDone ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100">{goal.title}</h4>
                          {isDone ? (
                            <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ACHIEVED
                            </span>
                          ) : (
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                              goal.priority === 'HIGH' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {goal.priority} PRIORITY
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                          Category: {goal.category} • Target Date: {goal.targetDate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="text-xs text-slate-400 block">Target Needed</span>
                      <strong className="text-sm font-bold text-slate-100">{formatBDT(goal.targetAmount)}</strong>
                    </div>
                  </div>

                  {/* Progress Bar Component */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-300 flex items-center gap-1">
                        Saved: <strong className="text-emerald-400">{formatBDT(goal.currentAllocated)}</strong>
                      </span>
                      <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-teal-300'}`}>
                        {pct}% Complete
                      </span>
                    </div>

                    {/* Outer Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isDone
                            ? 'bg-emerald-400 shadow-lg shadow-emerald-500/30'
                            : pct > 60
                            ? 'bg-teal-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{isDone ? 'Goal Fully Capitalized' : `Gap Remaining: ${formatBDT(remainingAmt)}`}</span>
                      <span>Target: {formatBDT(goal.targetAmount)}</span>
                    </div>
                  </div>

                  {/* Actions & Quick Deposit Button */}
                  {!isDone && (
                    <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>Target Horizon: {goal.targetDate}</span>
                      </div>

                      {quickDepositGoalId === goal.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={depositAmountInput}
                            onChange={(e) => setDepositAmountInput(e.target.value)}
                            className="w-24 bg-slate-900 border border-emerald-500 text-emerald-300 text-xs px-2 py-1 rounded-lg font-mono focus:outline-none"
                          />
                          <button
                            onClick={() => handleQuickDeposit(goal.id)}
                            className="px-2.5 py-1 bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setQuickDepositGoalId(null)}
                            className="p-1 text-slate-400 hover:text-slate-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setQuickDepositGoalId(goal.id);
                            setDepositAmountInput('10000');
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 font-mono text-xs rounded-lg font-semibold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Deposit Funds
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Recharts Goal Progress Visualizer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BarChart className="w-4 h-4 text-emerald-400" />
                Target vs. Allocated Comparison
              </h4>
              <span className="text-[10px] font-mono text-slate-400">BDT</span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} interval={0} angle={-20} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="Target" name="Target Goal" fill="#334155" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Allocated" name="Saved Capital" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Shariah Welfare Tip Box */}
          <div className="bg-slate-950 border border-emerald-800/60 rounded-2xl p-4 space-y-2 text-xs">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Mudarabah Dividend Reinvestment:
            </span>
            <p className="text-slate-400 leading-relaxed">
              Cooperative annual profit share dividends can be automatically diverted to accelerate your <strong>Holy Hajj Pilgrimage Fund</strong> milestone.
            </p>
          </div>

        </div>

      </div>

      {/* Modal: Set New Savings Goal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Set New Financial Savings Milestone
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Goal Name / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Children School Admission, Hajj Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Hajj & Umrah">Hajj & Umrah</option>
                    <option value="Emergency Repair">Emergency Repair</option>
                    <option value="Education">Education</option>
                    <option value="Business Investment">Business Investment</option>
                    <option value="Agri Machinery">Agri Machinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority Level:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Goal Amount (BDT):</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="5000"
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Allocated Deposit (BDT):</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newInitialAlloc}
                    onChange={(e) => setNewInitialAlloc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Completion Date:</label>
                <input
                  type="date"
                  required
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-slate-950 font-bold rounded-xl hover:bg-emerald-500"
                >
                  Create Goal Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
