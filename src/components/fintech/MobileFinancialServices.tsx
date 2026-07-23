import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, PhoneCall, CheckCircle2, Zap, RefreshCw, ShieldCheck } from 'lucide-react';
import { MFSProvider, MFSTransaction } from '../../types';
import { MFSInsightsCard } from './MFSInsightsCard';
import { MFS30DayVolumeChart } from './MFS30DayVolumeChart';

interface MobileFinancialServicesProps {
  transactions: MFSTransaction[];
  onNewTransaction: (trx: MFSTransaction) => void;
}

export const MobileFinancialServices: React.FC<MobileFinancialServicesProps> = ({
  transactions,
  onNewTransaction
}) => {
  const [provider, setProvider] = useState<MFSProvider>('bKash');
  const [trxType, setTrxType] = useState<'Send Money' | 'Cash Out' | 'Merchant Pay' | 'Mobile Recharge'>('Send Money');
  const [senderPhone, setSenderPhone] = useState('+8801711002233');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTrx, setLastTrx] = useState<MFSTransaction | null>(null);
  const [selectedLedgerProvider, setSelectedLedgerProvider] = useState<'ALL' | MFSProvider>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    if (selectedLedgerProvider === 'ALL') return true;
    return t.provider === selectedLedgerProvider;
  });

  const handleExecuteTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverPhone || !amount || Number(amount) <= 0) return;

    setIsProcessing(true);
    setLastTrx(null);

    try {
      const response = await fetch('/api/fintech/mfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          senderPhone,
          receiverPhone,
          amount: Number(amount),
          type: trxType
        })
      });

      const data = await response.json();
      if (data.success) {
        const newTrx: MFSTransaction = {
          id: `trx-${Date.now()}`,
          trxId: data.trxId,
          provider,
          senderPhone,
          receiverPhone,
          amount: Number(amount),
          charge: 0,
          type: trxType,
          status: 'SUCCESS',
          timestamp: data.timestamp
        };

        onNewTransaction(newTrx);
        setLastTrx(newTrx);
        setReceiverPhone('');
        setAmount('');
      }
    } catch (err) {
      console.error('MFS Transaction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getProviderColor = (p: MFSProvider) => {
    switch (p) {
      case 'bKash': return 'bg-pink-950 border-pink-700 text-pink-300';
      case 'Nagad': return 'bg-orange-950 border-orange-700 text-orange-300';
      case 'Rocket': return 'bg-purple-950 border-purple-700 text-purple-300';
      case 'GlobalEasyLoad': return 'bg-teal-950 border-teal-700 text-teal-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Zero Charge Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              0% Service Charge Protocol
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase">
                Zero Profit Model
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated API transactions for bKash, Nagad, Rocket, and Global EasyLoad with instant confirmation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-800/60">
          <Zap className="w-4 h-4 text-amber-400" />
          Sub-second API Execution
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaction Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Automated MFS Hub
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">API CONNECTED</span>
          </div>

          <form onSubmit={handleExecuteTransaction} className="space-y-4">
            
            {/* Provider Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Select Provider API:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'GlobalEasyLoad'] as MFSProvider[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      provider === p
                        ? getProviderColor(p)
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Action Type:</label>
              <select
                value={trxType}
                onChange={(e: any) => setTrxType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Send Money">Send Money (0% Fee)</option>
                <option value="Cash Out">Cash Out (0% Fee)</option>
                <option value="Merchant Pay">Merchant Payment (0% Fee)</option>
                <option value="Mobile Recharge">Global EasyLoad Mobile Recharge</option>
              </select>
            </div>

            {/* Phone Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Receiver Phone Number:</label>
              <input
                type="text"
                placeholder="+88017XXXXXXXX"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (BDT):</label>
              <input
                type="number"
                placeholder="Amount in BDT (e.g., 5000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executing API Payload...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Execute Zero-Charge Transaction
                </>
              )}
            </button>
          </form>

          {/* Last Transaction Alert */}
          {lastTrx && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-emerald-300 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Transaction Successful!
                </span>
                <span className="font-mono text-[10px]">{lastTrx.trxId}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Transferred <strong>{lastTrx.amount.toLocaleString()} BDT</strong> via {lastTrx.provider} to {lastTrx.receiverPhone}. Fee: 0 BDT.
              </p>
            </div>
          )}

        </div>

        {/* Live Transaction Ledger Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Real-Time MFS & EasyLoad API Ledger
              </h4>
              <p className="text-xs text-slate-400">
                Audited zero-profit transaction history logs
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Provider Dropdown Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-xl text-xs font-mono">
                <span className="text-[11px] text-slate-400 font-semibold">Provider:</span>
                <select
                  value={selectedLedgerProvider}
                  onChange={(e) => setSelectedLedgerProvider(e.target.value as any)}
                  className="bg-slate-900 text-slate-200 text-xs font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="ALL">All Providers</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="GlobalEasyLoad">Global EasyLoad</option>
                </select>
              </div>

              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                {filteredTransactions.length} Logs
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-mono tracking-wider bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">TRX ID</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3 text-right">Amount (BDT)</th>
                  <th className="p-3 text-center">Fee</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500 text-xs italic">
                      No MFS transactions logged for provider "{selectedLedgerProvider}".
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-emerald-400 font-bold">{t.trxId}</td>
                      <td className="p-3 font-semibold text-slate-200">{t.provider}</td>
                      <td className="p-3">{t.type}</td>
                      <td className="p-3 font-mono">{t.receiverPhone}</td>
                      <td className="p-3 text-right font-bold text-slate-100">
                        ৳{t.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-center text-emerald-400 font-bold">৳0</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 30-Day MFS Transaction Frequency & Volume Recharts Chart */}
      <MFS30DayVolumeChart mfsTransactions={transactions} />

      {/* AI MFS Transaction & Pattern Intelligence Insight Card */}
      <MFSInsightsCard transactions={transactions} />

    </div>
  );
};
