import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, CheckCircle2, Clock, FileText, Send, Calculator } from 'lucide-react';
import { EmergencyLoan } from '../../types';

interface EmergencyLoanSystemProps {
  loans: EmergencyLoan[];
  onApplyLoan: (loan: EmergencyLoan) => void;
  selectedDistrict: string;
}

export const EmergencyLoanSystem: React.FC<EmergencyLoanSystemProps> = ({
  loans,
  onApplyLoan,
  selectedDistrict
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [nid, setNid] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(selectedDistrict !== 'ALL' ? selectedDistrict : 'Dhaka');
  const [amountRequested, setAmountRequested] = useState('50000');
  const [purpose, setPurpose] = useState<'Medical Emergency' | 'Small Business Survival' | 'Disaster Relief' | 'Education Support'>('Medical Emergency');
  const [tenureMonths, setTenureMonths] = useState(12);

  const filteredLoans = loans.filter((l) =>
    selectedDistrict === 'ALL' ? true : l.district === selectedDistrict
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !nid || !phone || !amountRequested) return;

    const newLoan: EmergencyLoan = {
      id: `loan-${Date.now()}`,
      applicantName,
      nid,
      phone,
      district,
      amountRequested: Number(amountRequested),
      purpose,
      tenureMonths,
      status: 'UNDER_REVIEW',
      repaidAmount: 0,
      appliedDate: new Date().toISOString().split('T')[0]
    };

    onApplyLoan(newLoan);
    setApplicantName('');
    setNid('');
    setPhone('');
  };

  const monthlyInstallment = Math.round(Number(amountRequested || 0) / (tenureMonths || 1));

  return (
    <div className="space-y-6">
      
      {/* Zero Interest Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              0% Interest Emergency Micro-Fund
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase">
                Zero Interest Policy
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Zero-interest loans for medical emergencies, flood/disaster relief, education, and small business survival.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
          Repayment: Exact Principal Only
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Apply for Emergency Fund
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Fast-track verification with zero hidden interest or service fee
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Applicant Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">National ID (NID):</label>
                <input
                  type="text"
                  placeholder="NID Number"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number:</label>
                <input
                  type="text"
                  placeholder="+88017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">District Location:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Emergency Purpose:</label>
              <select
                value={purpose}
                onChange={(e: any) => setPurpose(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Disaster Relief">Disaster Relief & Flood Recovery</option>
                <option value="Small Business Survival">Small Business Survival</option>
                <option value="Education Support">Education Support</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Requested (BDT):</label>
                <input
                  type="number"
                  placeholder="Amount BDT"
                  value={amountRequested}
                  onChange={(e) => setAmountRequested(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tenure (Months):</label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={18}>18 Months</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>
            </div>

            {/* Zero Interest Repayment Preview */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Interest Rate:</span>
                <span className="font-bold text-emerald-400">0.00% (Zero Interest)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-200">
                <span>Monthly Installment:</span>
                <span className="font-mono text-amber-300">৳{monthlyInstallment.toLocaleString()} BDT/mo</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Emergency Application
            </button>
          </form>
        </div>

        {/* Loan Records List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Zero-Profit Loan Applications & Disbursement Tracker
              </h4>
              <p className="text-xs text-slate-400">
                Showing requests for {selectedDistrict === 'ALL' ? 'All Districts' : `${selectedDistrict} District`}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              {filteredLoans.length} Applications
            </span>
          </div>

          <div className="space-y-3">
            {filteredLoans.map((loan) => (
              <div key={loan.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{loan.applicantName}</h5>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>NID: {loan.nid}</span> • <span>{loan.phone}</span> • <span className="text-amber-400">{loan.district}</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    loan.status === 'APPROVED' || loan.status === 'DISBURSED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : loan.status === 'UNDER_REVIEW'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {loan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Purpose:</span>
                    <span className="font-semibold text-slate-300">{loan.purpose}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Requested:</span>
                    <span className="font-bold font-mono text-emerald-400">৳{loan.amountRequested.toLocaleString()} BDT</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tenure:</span>
                    <span className="font-semibold text-slate-300">{loan.tenureMonths} Months</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Repaid Principal:</span>
                    <span className="font-bold font-mono text-amber-300">৳{loan.repaidAmount.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
