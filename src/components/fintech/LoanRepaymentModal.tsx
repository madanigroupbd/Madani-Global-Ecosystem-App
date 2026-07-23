import React, { useState, useEffect } from 'react';
import { EmergencyLoan } from '../../types';
import {
  Coins,
  ShieldCheck,
  X,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoanRepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: EmergencyLoan | null;
  onConfirmRepayment: (loanId: string, amount: number, paymentMethod: string, notes?: string) => void;
}

export const LoanRepaymentModal: React.FC<LoanRepaymentModalProps> = ({
  isOpen,
  onClose,
  loan,
  onConfirmRepayment
}) => {
  const [repayAmount, setRepayAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash');
  const [trxReference, setTrxReference] = useState<string>('');
  const [repayNotes, setRepayNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Format currency in BDT
  const formatBDT = (amount: number) => `৳${amount.toLocaleString('en-IN')} BDT`;

  useEffect(() => {
    if (loan) {
      const outstanding = Math.max(0, loan.amountRequested - (loan.repaidAmount || 0));
      setRepayAmount(Math.min(5000, outstanding > 0 ? outstanding : 1000));
      setTrxReference(`REPAY-${Date.now().toString().slice(-6)}`);
      setRepayNotes(`Zero-profit emergency loan repayment (${loan.purpose})`);
      setPaymentMethod('bKash');
      setValidationError(null);
    }
  }, [loan]);

  if (!isOpen || !loan) return null;

  const outstandingBalance = Math.max(0, loan.amountRequested - (loan.repaidAmount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (repayAmount <= 0) {
      setValidationError('Repayment amount must be greater than ৳0 BDT.');
      return;
    }

    if (repayAmount > outstandingBalance) {
      setValidationError(
        `Repayment amount (${formatBDT(repayAmount)}) cannot exceed current outstanding balance (${formatBDT(outstandingBalance)}).`
      );
      return;
    }

    const fullNotes = `${repayNotes ? repayNotes.trim() + ' ' : ''}[Ref: ${trxReference || 'N/A'}]`;
    onConfirmRepayment(loan.id, repayAmount, paymentMethod, fullNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="p-3 bg-amber-950 border border-amber-800 text-amber-400 rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Zero-Profit Emergency Loan Repayment</h3>
            <p className="text-xs text-slate-400">Instalment processing & Cooperative Ledger credit memo</p>
          </div>
        </div>

        {/* Selected Loan Target Card Summary */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 mb-4 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Borrower:</span>
            <span className="font-bold text-amber-300">{loan.applicantName} ({loan.district})</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Loan ID / NID:</span>
            <span>{loan.id} / {loan.nid}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-2">
            <span className="text-slate-400">Sanctioned Principal:</span>
            <span className="text-slate-100">{formatBDT(loan.amountRequested)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Total Repaid:</span>
            <span className="text-emerald-400">{formatBDT(loan.repaidAmount || 0)}</span>
          </div>
          <div className="flex justify-between items-center text-rose-300 font-bold border-t border-slate-800/80 pt-2 text-sm">
            <span>Outstanding Balance:</span>
            <span>{formatBDT(outstandingBalance)}</span>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Quick Instalment Amount:</label>
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[2000, 5000, 10000].map((amt) => {
                const isAvailable = amt <= outstandingBalance;
                return (
                  <button
                    key={amt}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setRepayAmount(amt);
                      setValidationError(null);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] transition-all ${
                      repayAmount === amt
                        ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    ৳{amt.toLocaleString()}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setRepayAmount(outstandingBalance);
                  setValidationError(null);
                }}
                className={`py-1.5 px-2 rounded-lg font-bold border text-[11px] transition-all ${
                  repayAmount === outstandingBalance
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Full Balance
              </button>
            </div>
          </div>

          {/* Repayment Amount Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Repayment Amount (BDT):</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold font-mono">৳</span>
              <input
                type="number"
                min="1"
                max={outstandingBalance}
                value={repayAmount}
                onChange={(e) => {
                  setRepayAmount(Number(e.target.value));
                  setValidationError(null);
                }}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Payment Method Select */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Payment Method / Source Gateway:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="bKash">bKash Merchant Gateway (0% Welfare Fee)</option>
              <option value="Nagad">Nagad Digital Wallet (0% Welfare Fee)</option>
              <option value="Rocket">Rocket Mobile Banking</option>
              <option value="Bank Transfer">Bank Transfer (Sonali / Islami / City Bank)</option>
              <option value="Cooperative Wallet">Madani Cooperative Passbook Balance</option>
              <option value="Cash at Hub">Cash Payment at District Welfare Hub</option>
            </select>
          </div>

          {/* Transaction Ref & Optional Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">TRX Reference Code:</label>
              <input
                type="text"
                value={trxReference}
                onChange={(e) => setTrxReference(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Optional Audit Notes:</label>
              <input
                type="text"
                value={repayNotes}
                onChange={(e) => setRepayNotes(e.target.value)}
                placeholder="e.g. Month 3 instalment"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Confirm Repayment (৳{repayAmount.toLocaleString()})
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
