import React, { useState, useMemo } from 'react';
import { EmergencyLoan, MFSTransaction, AutoPayRule } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Building2,
  PhoneCall,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  CreditCard,
  Plus,
  Repeat,
  Wallet,
  CalendarDays,
  Activity,
  Sliders,
  Info
} from 'lucide-react';

interface AutoPayConfigProps {
  loans?: EmergencyLoan[];
  mfsTransactions?: MFSTransaction[];
  onRepayLoan?: (loanId: string, amount: number, paymentMethod?: string, notes?: string) => void;
}

export const AutoPayConfig: React.FC<AutoPayConfigProps> = ({
  loans = [],
  mfsTransactions = [],
  onRepayLoan = (_id?: string, _amt?: number, _method?: string, _notes?: string) => {}
}) => {
  // Mock Default Active Loans if empty
  const activeLoansList = useMemo(() => {
    if (loans && loans.length > 0) return loans;
    return [
      {
        id: 'LOAN-8801',
        applicantName: 'Dr. Rafiqul Islam',
        nid: '1984269102938',
        phone: '+8801712345678',
        district: 'Dhaka Central',
        amountRequested: 50000,
        purpose: 'Medical Emergency',
        tenureMonths: 12,
        status: 'DISBURSED',
        repaidAmount: 20000,
        appliedDate: '2025-11-15'
      },
      {
        id: 'LOAN-8802',
        applicantName: 'Begum Sufia Kamal',
        nid: '1989269102949',
        phone: '+8801812345679',
        district: 'Chittagong Port',
        amountRequested: 75000,
        purpose: 'Small Business Survival',
        tenureMonths: 18,
        status: 'DISBURSED',
        repaidAmount: 15000,
        appliedDate: '2026-01-10'
      }
    ] as EmergencyLoan[];
  }, [loans]);

  // Default Auto-Pay Rules State
  const [rules, setRules] = useState<AutoPayRule[]>([
    {
      id: 'rule-1',
      loanId: activeLoansList[0]?.id || 'LOAN-8801',
      applicantName: activeLoansList[0]?.applicantName || 'Dr. Rafiqul Islam',
      mfsProvider: 'bKash',
      triggerType: 'FIXED_MONTHLY',
      minInflowThreshold: 10000,
      deductionAmount: 2500,
      deductionDayOfMonth: 5,
      status: 'ACTIVE',
      nextDeductionDate: '2026-08-05',
      autoPayHistory: [
        { id: 'h1', date: '2026-07-05', amount: 2500, status: 'SUCCESS', mfsTrxId: 'TRX-BK-9921', provider: 'bKash' },
        { id: 'h2', date: '2026-06-05', amount: 2500, status: 'SUCCESS', mfsTrxId: 'TRX-BK-8812', provider: 'bKash' }
      ]
    },
    {
      id: 'rule-2',
      loanId: activeLoansList[1]?.id || 'LOAN-8802',
      applicantName: activeLoansList[1]?.applicantName || 'Begum Sufia Kamal',
      mfsProvider: 'Nagad',
      triggerType: 'UPON_MFS_INFLOW',
      minInflowThreshold: 8000,
      deductionAmount: 3000,
      deductionDayOfMonth: 15,
      status: 'ACTIVE',
      nextDeductionDate: '2026-08-15',
      autoPayHistory: [
        { id: 'h3', date: '2026-07-15', amount: 3000, status: 'SUCCESS', mfsTrxId: 'TRX-NG-3301', provider: 'Nagad' }
      ]
    }
  ]);

  // Calendar View State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-08-05');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Rule Form State
  const [formLoanId, setFormLoanId] = useState<string>(activeLoansList[0]?.id || 'LOAN-8801');
  const [formProvider, setFormProvider] = useState<AutoPayRule['mfsProvider']>('bKash');
  const [formTriggerType, setFormTriggerType] = useState<AutoPayRule['triggerType']>('FIXED_MONTHLY');
  const [formMinThreshold, setFormMinThreshold] = useState<string>('5000');
  const [formDeductionAmount, setFormDeductionAmount] = useState<string>('2500');
  const [formDeductionDay, setFormDeductionDay] = useState<string>('10');

  // Format BDT
  const formatBDT = (amount: number) => `৳${Math.round(amount).toLocaleString('en-IN')} BDT`;

  // Toggle Rule Status
  const handleToggleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const newStatus = r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  // Add New AutoPay Rule
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const loanObj = activeLoansList.find((l) => l.id === formLoanId);
    const day = parseInt(formDeductionDay, 10) || 5;

    const newRule: AutoPayRule = {
      id: `rule-${Date.now()}`,
      loanId: formLoanId,
      applicantName: loanObj?.applicantName || 'Cooperative Member',
      mfsProvider: formProvider,
      triggerType: formTriggerType,
      minInflowThreshold: parseFloat(formMinThreshold) || 5000,
      deductionAmount: parseFloat(formDeductionAmount) || 2000,
      deductionDayOfMonth: day,
      status: 'ACTIVE',
      nextDeductionDate: `2026-08-${day < 10 ? '0' + day : day}`,
      autoPayHistory: []
    };

    setRules((prev) => [newRule, ...prev]);
    setShowCreateModal(false);
  };

  // Calendar Days Calculation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth(); // 0-indexed

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArr = [];
    // Leading empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      daysArr.push({ dayNumber: null, dateStr: '' });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayFormatted = d < 10 ? `0${d}` : `${d}`;
      const monthFormatted = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

      // Check scheduled auto-pay rules on this date
      const scheduledRules = rules.filter((r) => {
        if (r.status !== 'ACTIVE') return false;
        return r.deductionDayOfMonth === d;
      });

      // Check executed history on this date
      const executedHistory: Array<{ rule: AutoPayRule; amount: number; provider: string }> = [];
      rules.forEach((r) => {
        r.autoPayHistory?.forEach((h) => {
          if (h.date === dateStr) {
            executedHistory.push({ rule: r, amount: h.amount, provider: h.provider });
          }
        });
      });

      daysArr.push({
        dayNumber: d,
        dateStr,
        scheduledRules,
        executedHistory
      });
    }

    return daysArr;
  }, [currentMonthDate, rules]);

  // Selected Date Details
  const selectedDateEvents = useMemo(() => {
    const dateObj = calendarDays.find((d) => d.dateStr === selectedCalendarDate);
    return dateObj || { dayNumber: null, dateStr: selectedCalendarDate, scheduledRules: [], executedHistory: [] };
  }, [calendarDays, selectedCalendarDate]);

  // Execute Immediate Test Payment
  const handleTriggerManualPayment = (rule: AutoPayRule) => {
    const amount = rule.deductionAmount;
    onRepayLoan(rule.loanId, amount, rule.mfsProvider, 'Scheduled MFS Cycle Auto-Deduction');

    const nowStr = new Date().toISOString().split('T')[0];
    const newTrxId = `AUTOPAY-${rule.mfsProvider.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setRules((prev) =>
      prev.map((r) => {
        if (r.id === rule.id) {
          const updatedHistory = [
            { id: `h-${Date.now()}`, date: nowStr, amount, status: 'SUCCESS' as const, mfsTrxId: newTrxId, provider: rule.mfsProvider },
            ...(r.autoPayHistory || [])
          ];
          return { ...r, autoPayHistory: updatedHistory };
        }
        return r;
      })
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950 border border-blue-800 text-blue-400 rounded-xl">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              MFS Auto-Pay Loan Repayment Scheduler
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-md">
                CYCLE INFLOW PROTOCOL
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automate recurring loan deductions timed with incoming MFS cash-in cycles (bKash, Nagad, Rocket) with calendar schedule visualization.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Configure Auto-Pay Rule
        </button>
      </div>

      {/* Overview Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Auto-Pay Rules</span>
            <strong className="text-xl font-bold text-blue-400 font-mono mt-0.5 block">
              {rules.filter((r) => r.status === 'ACTIVE').length} Configured
            </strong>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">Timed with Salary & MFS Inflow</span>
          </div>
          <div className="p-3 bg-blue-950 border border-blue-800/60 text-blue-400 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Next Scheduled Auto-Pay</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {formatBDT(rules[0]?.deductionAmount || 2500)}
            </strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              Due: {rules[0]?.nextDeductionDate || 'Aug 05, 2026'}
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">MFS Cycle Inflow Match</span>
            <strong className="text-xl font-bold text-purple-300 font-mono mt-0.5 block">
              bKash / Nagad
            </strong>
            <span className="text-[10px] text-purple-400 font-mono mt-1 block">
              Auto-Sync On Payroll Entry
            </span>
          </div>
          <div className="p-3 bg-purple-950 border border-purple-800/60 text-purple-400 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Execution Success Rate</span>
            <strong className="text-xl font-bold text-teal-300 font-mono mt-0.5 block">
              100% Verified
            </strong>
            <span className="text-[10px] text-teal-400 font-mono mt-1 block">0 Failed Auto-Deductions</span>
          </div>
          <div className="p-3 bg-teal-950 border border-teal-800/60 text-teal-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Calendar on Left (7 cols) & Configured Rules List on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar View Container (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          
          {/* Calendar Month Navigation Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-slate-100">
                {currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Deduction Calendar
              </h4>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const prev = new Date(currentMonthDate);
                  prev.setMonth(prev.getMonth() - 1);
                  setCurrentMonthDate(prev);
                }}
                className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonthDate(new Date(2026, 7, 1))}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs rounded-lg hover:bg-slate-800"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const next = new Date(currentMonthDate);
                  next.setMonth(next.getMonth() + 1);
                  setCurrentMonthDate(next);
                }}
                className="p-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 font-mono">
            {calendarDays.map((d, index) => {
              if (!d.dayNumber) {
                return <div key={`empty-${index}`} className="h-16 bg-slate-900/30 rounded-xl" />;
              }

              const isSelected = selectedCalendarDate === d.dateStr;
              const hasScheduled = d.scheduledRules && d.scheduledRules.length > 0;
              const hasExecuted = d.executedHistory && d.executedHistory.length > 0;

              return (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedCalendarDate(d.dateStr)}
                  className={`h-16 p-1 rounded-xl border flex flex-col justify-between text-left transition-all relative ${
                    isSelected
                      ? 'bg-blue-950 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : hasScheduled
                      ? 'bg-emerald-950/20 border-emerald-800/80 hover:border-emerald-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                    {d.dayNumber}
                  </span>

                  {/* Badges for scheduled / executed payments */}
                  <div className="space-y-0.5 overflow-hidden w-full">
                    {hasScheduled && (
                      <span className="text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 py-0.2 rounded block truncate">
                        Auto: {formatBDT(d.scheduledRules![0].deductionAmount)}
                      </span>
                    )}
                    {hasExecuted && (
                      <span className="text-[8px] bg-blue-950 text-blue-300 border border-blue-800 px-1 py-0.2 rounded block truncate">
                        Paid: {formatBDT(d.executedHistory![0].amount)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Calendar Date Event Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 font-mono">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Schedule Details for {selectedCalendarDate}
              </span>
              <span className="text-[10px] text-slate-400">
                {selectedDateEvents.scheduledRules?.length || 0} Event(s)
              </span>
            </div>

            {selectedDateEvents.scheduledRules && selectedDateEvents.scheduledRules.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.scheduledRules.map((rule) => (
                  <div key={rule.id} className="bg-slate-950 border border-emerald-800/60 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-100">
                        <span>{rule.applicantName}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                          {rule.mfsProvider}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                        Trigger: {rule.triggerType.replace(/_/g, ' ')} • Min Inflow: {formatBDT(rule.minInflowThreshold)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-400 font-mono text-sm">{formatBDT(rule.deductionAmount)}</strong>
                      <button
                        onClick={() => handleTriggerManualPayment(rule)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] font-mono"
                      >
                        Execute Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 font-mono py-1">
                No scheduled auto-pay deductions queued for {selectedCalendarDate}.
              </p>
            )}
          </div>

        </div>

        {/* Configured Auto-Pay Rules Management List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Active Auto-Pay Rules Manager
            </h4>

            <div className="space-y-3 font-sans">
              {rules.map((rule) => {
                const isActive = rule.status === 'ACTIVE';

                return (
                  <div
                    key={rule.id}
                    className={`bg-slate-900 border rounded-xl p-3.5 space-y-2.5 transition-all ${
                      isActive ? 'border-slate-800 hover:border-blue-500/50' : 'border-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        <span className="font-bold text-slate-100 text-xs">{rule.applicantName}</span>
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                        {rule.mfsProvider}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Deduction Amount</span>
                        <span className="font-bold text-emerald-400">{formatBDT(rule.deductionAmount)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Cycle Day / Date</span>
                        <span className="font-bold text-slate-200">Day {rule.deductionDayOfMonth} of Month</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-800/80 pt-2">
                      <span className="text-slate-400">Trigger: {rule.triggerType.replace(/_/g, ' ')}</span>
                      <button
                        onClick={() => handleToggleStatus(rule.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          isActive
                            ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-3 h-3" />
                            Pause Rule
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3 h-3" />
                            Resume Rule
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* MFS Auto-Deduction Explanation Banner */}
          <div className="bg-slate-950 border border-blue-800/60 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              MFS Webhook Inflow Triggering:
            </span>
            <p className="text-slate-400 leading-relaxed">
              When cash-in transfers or salary deposits land in your registered bKash/Nagad account exceeding <strong>{formatBDT(5000)}</strong>, our cooperative API automatically executes the scheduled zero-interest loan repayment item.
            </p>
          </div>

        </div>

      </div>

      {/* Modal: Create Auto-Pay Rule */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Repeat className="w-5 h-5 text-blue-400" />
                Configure MFS Auto-Pay Rule
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Active Loan Account:</label>
                <select
                  value={formLoanId}
                  onChange={(e) => setFormLoanId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none font-mono"
                >
                  {activeLoansList.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.applicantName} ({loan.id}) - Requested: {formatBDT(loan.amountRequested)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">MFS Provider:</label>
                  <select
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="bKash">bKash (bkash.com)</option>
                    <option value="Nagad">Nagad (nagad.com.bd)</option>
                    <option value="Rocket">DBBL Rocket</option>
                    <option value="Upay">UCB Upay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trigger Condition:</label>
                  <select
                    value={formTriggerType}
                    onChange={(e) => setFormTriggerType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="FIXED_MONTHLY">Fixed Day of Month</option>
                    <option value="UPON_MFS_INFLOW">Upon MFS Inflow Match</option>
                    <option value="WEEKLY_CYCLE">Weekly Small Installment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deduction Amount (BDT):</label>
                  <input
                    type="number"
                    required
                    min="500"
                    step="500"
                    value={formDeductionAmount}
                    onChange={(e) => setFormDeductionAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Day of Month (1 - 31):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="31"
                    value={formDeductionDay}
                    onChange={(e) => setFormDeductionDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Minimum MFS Inflow Threshold (BDT):</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={formMinThreshold}
                  onChange={(e) => setFormMinThreshold(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-slate-950 font-bold rounded-xl hover:bg-blue-500"
                >
                  Save Auto-Pay Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
