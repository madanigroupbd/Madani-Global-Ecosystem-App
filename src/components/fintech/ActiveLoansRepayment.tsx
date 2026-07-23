import React, { useState } from 'react';
import { EmergencyLoan, MemberAccount } from '../../types';
import { LoanRepaymentModal } from './LoanRepaymentModal';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  FileText,
  X,
  Wallet,
  Coins,
  RefreshCw,
  TrendingDown,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ActiveLoansRepaymentProps {
  loans: EmergencyLoan[];
  onRepayLoan: (loanId: string, amount: number, paymentMethod: string, notes?: string) => void;
  coopAccounts?: MemberAccount[];
}

export const ActiveLoansRepayment: React.FC<ActiveLoansRepaymentProps> = ({
  loans = [],
  onRepayLoan,
  coopAccounts = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UNDER_REVIEW' | 'FULLY_REPAID'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Repayment Modal State
  const [activeRepayLoan, setActiveRepayLoan] = useState<EmergencyLoan | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null);

  // Helper formatting BDT
  const formatBDT = (amount: number) => `৳${amount.toLocaleString('en-IN')} BDT`;

  // Filtered Loans
  const filteredLoans = loans.filter((loan) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      loan.applicantName.toLowerCase().includes(q) ||
      loan.nid.includes(q) ||
      loan.phone.includes(q) ||
      loan.district.toLowerCase().includes(q) ||
      loan.purpose.toLowerCase().includes(q) ||
      loan.id.toLowerCase().includes(q);

    const outstanding = loan.amountRequested - (loan.repaidAmount || 0);
    const isFullyRepaid = outstanding <= 0;

    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') {
      matchesStatus = (loan.status === 'APPROVED' || loan.status === 'DISBURSED') && !isFullyRepaid;
    } else if (statusFilter === 'UNDER_REVIEW') {
      matchesStatus = loan.status === 'UNDER_REVIEW';
    } else if (statusFilter === 'FULLY_REPAID') {
      matchesStatus = isFullyRepaid;
    }

    const matchesDistrict = selectedDistrict === 'ALL' || loan.district === selectedDistrict;

    return matchesSearch && matchesStatus && matchesDistrict;
  });

  // Calculate Metrics
  const totalLoanVolume = loans.reduce((acc, l) => acc + (l.amountRequested || 0), 0);
  const totalRepaidToDate = loans.reduce((acc, l) => acc + (l.repaidAmount || 0), 0);
  const totalOutstandingBalance = Math.max(0, totalLoanVolume - totalRepaidToDate);
  const activeLoansCount = loans.filter((l) => (l.amountRequested - (l.repaidAmount || 0)) > 0 && (l.status === 'APPROVED' || l.status === 'DISBURSED')).length;

  // Open Repay Modal
  const handleOpenRepayModal = (loan: EmergencyLoan) => {
    setActiveRepayLoan(loan);
  };

  // Submit Repayment from Modal
  const handleConfirmRepayment = (loanId: string, amount: number, paymentMethod: string, notes?: string) => {
    onRepayLoan(loanId, amount, paymentMethod, notes);
    const targetLoan = loans.find(l => l.id === loanId);
    setIsSuccessToast(`Received ${formatBDT(amount)} repayment for ${targetLoan?.applicantName || 'borrower'}. Ledger updated!`);
    setActiveRepayLoan(null);
    setTimeout(() => setIsSuccessToast(null), 5000);
  };

  // Extract unique districts
  const uniqueDistricts = Array.from(new Set(loans.map((l) => l.district))).sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {isSuccessToast && (
        <div className="bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 font-semibold text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{isSuccessToast}</span>
          </div>
          <button onClick={() => setIsSuccessToast(null)} className="text-emerald-400 hover:text-emerald-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Overview Header */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-950 border border-amber-800 text-amber-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Active Emergency Loans & Zero-Profit Repayment
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded-md">
                  0% INTEREST WELFARE
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track active welfare loans, view repayment progress, and process direct instalments synced with the Cooperative Passbook Ledger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Loans Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Repaying Loans</span>
            <strong className="text-2xl font-bold text-slate-100 font-mono mt-0.5 block">{activeLoansCount}</strong>
            <span className="text-[10px] text-amber-400 font-mono mt-1 block">Zero-Profit Disbursed</span>
          </div>
          <div className="p-3 bg-amber-950 border border-amber-800/60 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Total Disbursed Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Disbursed Principal</span>
            <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{formatBDT(totalLoanVolume)}</strong>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">Welfare Fund Pool</span>
          </div>
          <div className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Total Repaid To Date */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Repaid To Date</span>
            <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{formatBDT(totalRepaidToDate)}</strong>
            <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
              {totalLoanVolume ? Math.round((totalRepaidToDate / totalLoanVolume) * 100) : 0}% Total Recovered
            </span>
          </div>
          <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Remaining Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Outstanding Balance</span>
            <strong className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{formatBDT(totalOutstandingBalance)}</strong>
            <span className="text-[10px] text-rose-400 font-mono mt-1 block">Pending Instalments</span>
          </div>
          <div className="p-3 bg-rose-950 border border-rose-800/60 text-rose-400 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by applicant name, NID, phone number, district, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 text-xs">
                Clear
              </button>
            )}
          </div>

          {/* District Dropdown */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Districts</option>
              {uniqueDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Status:
          </span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-700 text-slate-100 border border-slate-600'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Loans ({loans.length})
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'ACTIVE'
                ? 'bg-amber-950 text-amber-300 border border-amber-500'
                : 'bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            Active Repaying ({loans.filter((l) => (l.amountRequested - (l.repaidAmount || 0)) > 0 && (l.status === 'APPROVED' || l.status === 'DISBURSED')).length})
          </button>

          <button
            onClick={() => setStatusFilter('FULLY_REPAID')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'FULLY_REPAID'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Fully Repaid ({loans.filter((l) => (l.amountRequested - (l.repaidAmount || 0)) <= 0).length})
          </button>

          <button
            onClick={() => setStatusFilter('UNDER_REVIEW')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              statusFilter === 'UNDER_REVIEW'
                ? 'bg-blue-950 text-blue-300 border border-blue-500'
                : 'bg-slate-950 text-slate-400 hover:text-blue-400 border border-slate-800'
            }`}
          >
            Under Review ({loans.filter((l) => l.status === 'UNDER_REVIEW').length})
          </button>
        </div>
      </div>

      {/* Loans Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLoans.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-2">
            <CreditCard className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">No emergency loans found matching your search filter.</p>
            <p className="text-[11px] text-slate-500">Try resetting filters or adjusting search terms.</p>
          </div>
        ) : (
          filteredLoans.map((loan) => {
            const repaid = loan.repaidAmount || 0;
            const requested = loan.amountRequested || 0;
            const outstanding = Math.max(0, requested - repaid);
            const percentage = requested > 0 ? Math.min(100, Math.round((repaid / requested) * 100)) : 0;
            const isFullyRepaid = outstanding <= 0;

            return (
              <div
                key={loan.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all space-y-4 relative overflow-hidden flex flex-col justify-between ${
                  isFullyRepaid
                    ? 'border-emerald-900/60 bg-slate-900/90'
                    : loan.status === 'UNDER_REVIEW'
                    ? 'border-blue-900/60'
                    : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                {/* Status Glow Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isFullyRepaid
                      ? 'bg-emerald-500'
                      : loan.status === 'UNDER_REVIEW'
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                />

                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">{loan.applicantName}</h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {loan.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold">
                          {loan.district}
                        </span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">{loan.purpose}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shrink-0 ${
                        isFullyRepaid
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : loan.status === 'UNDER_REVIEW'
                          ? 'bg-blue-950 text-blue-300 border-blue-500/50'
                          : 'bg-amber-950 text-amber-300 border-amber-500/50'
                      }`}
                    >
                      {isFullyRepaid ? 'FULLY REPAID' : loan.status}
                    </span>
                  </div>

                  {/* Contact & NID Info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">NID Card Number:</span>
                      <span className="text-slate-200">{loan.nid}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phone Contact:</span>
                      <span className="text-slate-200">{loan.phone}</span>
                    </div>
                  </div>

                  {/* Financial Details Row */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Sanctioned Loan</span>
                      <strong className="text-slate-100 font-mono text-xs">{formatBDT(requested)}</strong>
                    </div>

                    <div className="bg-emerald-950/20 p-2 rounded-xl border border-emerald-900/40">
                      <span className="text-emerald-400 block text-[10px]">Total Repaid</span>
                      <strong className="text-emerald-300 font-mono text-xs">{formatBDT(repaid)}</strong>
                    </div>

                    <div className="bg-rose-950/20 p-2 rounded-xl border border-rose-900/40">
                      <span className="text-rose-400 block text-[10px]">Outstanding</span>
                      <strong className="text-rose-300 font-mono text-xs">{formatBDT(outstanding)}</strong>
                    </div>
                  </div>

                  {/* Repayment Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                      <span>Repayment Recovery</span>
                      <span className="font-bold text-slate-200">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFullyRepaid
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Tenure: {loan.tenureMonths} Months ({loan.appliedDate})
                  </span>

                  {!isFullyRepaid && loan.status !== 'UNDER_REVIEW' && (
                    <button
                      onClick={() => handleOpenRepayModal(loan)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <Coins className="w-4 h-4" />
                      Repay Instalment
                    </button>
                  )}

                  {isFullyRepaid && (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Cleared & Closed
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* REPAYMENT MODAL */}
      <LoanRepaymentModal
        isOpen={!!activeRepayLoan}
        onClose={() => setActiveRepayLoan(null)}
        loan={activeRepayLoan}
        onConfirmRepayment={handleConfirmRepayment}
      />

    </div>
  );
};
