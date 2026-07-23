import React, { useState } from 'react';
import { Award, TrendingUp, DollarSign, CheckCircle2, Clock, Send, Users } from 'lucide-react';
import { CommissionPayout } from '../../types';

interface CommissionPayoutPortalProps {
  commissions: CommissionPayout[];
  onNewPayoutRequest: (payout: CommissionPayout) => void;
}

export const CommissionPayoutPortal: React.FC<CommissionPayoutPortalProps> = ({
  commissions,
  onNewPayoutRequest
}) => {
  const [entrepreneurName, setEntrepreneurName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [referredService, setReferredService] = useState('Unani Factory Distributorship');
  const [commissionAmount, setCommissionAmount] = useState('');

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entrepreneurName || !applicantPhone || !commissionAmount) return;

    const newPayout: CommissionPayout = {
      id: `com-${Date.now()}`,
      entrepreneurName,
      applicantPhone,
      referredService,
      commissionAmount: Number(commissionAmount),
      payoutStatus: 'PENDING_APPROVAL',
      payoutDate: new Date().toISOString().split('T')[0]
    };

    onNewPayoutRequest(newPayout);
    setEntrepreneurName('');
    setApplicantPhone('');
    setCommissionAmount('');
  };

  const totalPaid = commissions
    .filter((c) => c.payoutStatus === 'PAID')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalPending = commissions
    .filter((c) => c.payoutStatus !== 'PAID')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Commission Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Paid Commissions</span>
            <span className="text-base font-bold font-mono text-emerald-400">৳{totalPaid.toLocaleString()} BDT</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Pending Payout Approvals</span>
            <span className="text-base font-bold font-mono text-amber-400">৳{totalPending.toLocaleString()} BDT</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Active Entrepreneurs</span>
            <span className="text-base font-bold font-mono text-teal-300">1,420 Partners</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payout Submission Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Claim Entrepreneur Commission
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit referral or job applicant payout verification
            </p>
          </div>

          <form onSubmit={handleSubmitPayout} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Entrepreneur / Partner Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={entrepreneurName}
                onChange={(e) => setEntrepreneurName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Applicant / Referral Phone:</label>
              <input
                type="text"
                placeholder="+88017XXXXXXXX"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Referred Ecosystem Wing:</label>
              <select
                value={referredService}
                onChange={(e) => setReferredService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Unani Factory Distributorship">Unani Factory Distributorship</option>
                <option value="Global EasyLoad Agent Point">Global EasyLoad Agent Point</option>
                <option value="Car & Bike Showroom Referral">Car & Bike Showroom Referral</option>
                <option value="Halal Food Factory Distribution">Halal Food Factory Distribution</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Commission Claim (BDT):</label>
              <input
                type="number"
                placeholder="Amount in BDT"
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Payout Request
            </button>
          </form>
        </div>

        {/* Commission History Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100">
              Commission Payout Verification Ledger
            </h4>
            <p className="text-xs text-slate-400">
              Entrepreneur performance tracking and automated disbursement status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-mono tracking-wider bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Entrepreneur</th>
                  <th className="p-3">Applicant Phone</th>
                  <th className="p-3">Ecosystem Service</th>
                  <th className="p-3 text-right">Commission (BDT)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">{c.entrepreneurName}</td>
                    <td className="p-3 font-mono">{c.applicantPhone}</td>
                    <td className="p-3 text-slate-300">{c.referredService}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      ৳{c.commissionAmount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.payoutStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {c.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
