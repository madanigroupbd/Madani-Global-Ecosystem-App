import React, { useState } from 'react';
import { FileSpreadsheet, PlusCircle, ArrowUpCircle, ArrowDownCircle, Search, UserCheck, Shield, FileText } from 'lucide-react';
import { MemberAccount, LedgerEntry } from '../../types';

interface CoopSocietyLedgerProps {
  accounts: MemberAccount[];
  ledger: LedgerEntry[];
  onAddLedgerEntry: (entry: LedgerEntry) => void;
  isAdminMode: boolean;
}

export const CoopSocietyLedger: React.FC<CoopSocietyLedgerProps> = ({
  accounts,
  ledger,
  onAddLedgerEntry,
  isAdminMode
}) => {
  const [selectedAccountNo, setSelectedAccountNo] = useState(accounts[0]?.accountNo || '');
  const [entryType, setEntryType] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePassbook, setActivePassbook] = useState<MemberAccount | null>(accounts[0] || null);

  const filteredAccounts = accounts.filter(
    (a) =>
      a.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.accountNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAccountLedger = ledger.filter((l) => l.accountNo === activePassbook?.accountNo);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !selectedAccountNo) return;

    const newEntry: LedgerEntry = {
      id: `led-${Date.now()}`,
      accountNo: selectedAccountNo,
      type: entryType,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      note: note || `${entryType} via Madani Cooperative Ledger`,
      approvedBy: isAdminMode ? 'Coop Admin Officer' : 'System Auditor'
    };

    onAddLedgerEntry(newEntry);
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            Madani Cooperative Society Savings & Passbook Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-interest, profit-sharing cooperative deposit and withdrawal audit ledger for member accounts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Total Members: <strong className="text-amber-400 font-mono">{accounts.length}</strong>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Audited Balance: <strong className="text-emerald-400 font-mono">৳1,870,000 BDT</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deposit/Withdrawal Entry Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              New Deposit / Withdrawal Entry
            </h4>
            {isAdminMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                ADMIN AUTHORIZED
              </span>
            )}
          </div>

          <form onSubmit={handleAddEntry} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Select Member Account:</label>
              <select
                value={selectedAccountNo}
                onChange={(e) => {
                  setSelectedAccountNo(e.target.value);
                  const found = accounts.find((a) => a.accountNo === e.target.value);
                  if (found) setActivePassbook(found);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.accountNo}>
                    {acc.accountNo} - {acc.memberName} ({acc.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEntryType('DEPOSIT')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  entryType === 'DEPOSIT'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                Deposit
              </button>
              <button
                type="button"
                onClick={() => setEntryType('WITHDRAWAL')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  entryType === 'WITHDRAWAL'
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <ArrowDownCircle className="w-4 h-4 text-rose-400" />
                Withdrawal
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (BDT):</label>
              <input
                type="number"
                placeholder="Amount in BDT"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Transaction Note:</label>
              <input
                type="text"
                placeholder="e.g. Monthly Cooperative Savings"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Post Ledger Entry
            </button>
          </form>
        </div>

        {/* Member Accounts List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100">Member Directory</h4>
            <div className="relative w-36">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1.5" />
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setActivePassbook(acc)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  activePassbook?.accountNo === acc.accountNo
                    ? 'bg-amber-950/60 border-amber-500 text-slate-100'
                    : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{acc.accountNo}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{acc.district}</span>
                </div>
                <div className="font-semibold text-xs mt-1">{acc.memberName}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">Total Balance:</span>
                  <span className="font-bold font-mono text-emerald-400">৳{acc.totalSavings.toLocaleString()} BDT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Member Digital Passbook Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Digital Passbook Statement
            </h4>
            {activePassbook && (
              <span className="text-[10px] text-slate-400 font-mono">
                {activePassbook.accountNo}
              </span>
            )}
          </div>

          {activePassbook ? (
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Holder:</span>
                  <span className="font-bold text-slate-200">{activePassbook.memberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">District Wing:</span>
                  <span className="text-slate-300">{activePassbook.district}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                  <span className="text-amber-300">Cooperative Savings:</span>
                  <span className="text-emerald-400 font-mono">৳{activePassbook.totalSavings.toLocaleString()} BDT</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recent Ledger Audits:
                </span>
                {activeAccountLedger.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No recorded transaction entries yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activeAccountLedger.map((l) => (
                      <div key={l.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold">
                            {l.type === 'DEPOSIT' ? (
                              <span className="text-emerald-400">+ DEPOSIT</span>
                            ) : l.type === 'WITHDRAWAL' ? (
                              <span className="text-rose-400">- WITHDRAWAL</span>
                            ) : (
                              <span className="text-amber-400">DIVIDEND</span>
                            )}
                            <span className="text-[10px] text-slate-500">({l.date})</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{l.note}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-slate-100 block">
                            ৳{l.amount.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-500">{l.approvedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              Select a member account to view passbook ledger statements.
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
