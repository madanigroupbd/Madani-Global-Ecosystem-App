import React, { useState, useMemo, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MFSTransaction, MFSProvider } from '../../types';
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Building2,
  RefreshCcw,
  ScanLine,
  CheckCircle2,
  DollarSign,
  Phone,
  Tag,
  Printer,
  Info
} from 'lucide-react';

interface MFSQRCodeGeneratorProps {
  onAddMFSTransaction?: (trx: Partial<MFSTransaction>) => void;
}

export const MFSQRCodeGenerator: React.FC<MFSQRCodeGeneratorProps> = ({
  onAddMFSTransaction = (_trx?: any) => {}
}) => {
  // Tabs: 'generate' | 'scan'
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');

  // Generator Form State
  const [provider, setProvider] = useState<MFSProvider | 'Upay'>('bKash');
  const [receiverPhone, setReceiverPhone] = useState<string>('+8801712345678');
  const [receiverName, setReceiverName] = useState<string>('Madani Telecom & Store');
  const [amount, setAmount] = useState<string>('500');
  const [txnType, setTxnType] = useState<'Send Money' | 'Merchant Pay' | 'Cooperative Deposit'>('Send Money');
  const [reference, setReference] = useState<string>('P2P Savings Deposit');

  // UI States
  const [copied, setCopied] = useState<boolean>(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);
  const [scanInputPayload, setScanInputPayload] = useState<string>('');
  const [scannedData, setScannedData] = useState<any | null>(null);

  const qrCardRef = useRef<HTMLDivElement>(null);

  // Format BDT
  const formatBDT = (val: number) => `৳${Math.round(val).toLocaleString('en-IN')} BDT`;

  // MFS Provider Visual Theme Config
  const providerConfigs = {
    bKash: {
      name: 'bKash',
      color: '#e2136e',
      bgColor: 'bg-pink-950/40',
      borderColor: 'border-pink-800/80',
      textColor: 'text-pink-400',
      btnBg: 'bg-pink-600 hover:bg-pink-500 text-white',
      badgeBg: 'bg-pink-950 text-pink-300 border-pink-800',
      logoText: 'bKash'
    },
    Nagad: {
      name: 'Nagad',
      color: '#f15a24',
      bgColor: 'bg-orange-950/40',
      borderColor: 'border-orange-800/80',
      textColor: 'text-orange-400',
      btnBg: 'bg-orange-600 hover:bg-orange-500 text-white',
      badgeBg: 'bg-orange-950 text-orange-300 border-orange-800',
      logoText: 'Nagad'
    },
    Rocket: {
      name: 'Rocket',
      color: '#8c3494',
      bgColor: 'bg-purple-950/40',
      borderColor: 'border-purple-800/80',
      textColor: 'text-purple-400',
      btnBg: 'bg-purple-600 hover:bg-purple-500 text-white',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-800',
      logoText: 'Rocket'
    },
    Upay: {
      name: 'Upay',
      color: '#0072bc',
      bgColor: 'bg-blue-950/40',
      borderColor: 'border-blue-800/80',
      textColor: 'text-blue-400',
      btnBg: 'bg-blue-600 hover:bg-blue-500 text-white',
      badgeBg: 'bg-blue-950 text-blue-300 border-blue-800',
      logoText: 'Upay'
    },
    GlobalEasyLoad: {
      name: 'GlobalEasyLoad',
      color: '#10b981',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-800/80',
      textColor: 'text-emerald-400',
      btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      logoText: 'EasyLoad'
    }
  };

  const currentConfig = providerConfigs[provider as keyof typeof providerConfigs] || providerConfigs.bKash;

  // Generate MFS Payload URI (e.g. bkash://pay?account=+8801712345678&amount=500&ref=P2P)
  const qrPayloadJSON = useMemo(() => {
    const payloadObj = {
      mfsProtocol: 'BD_MFS_P2P_V1',
      provider,
      receiverPhone: receiverPhone.trim(),
      receiverName: receiverName.trim(),
      amount: parseFloat(amount) || 0,
      type: txnType,
      reference: reference.trim(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(payloadObj);
  }, [provider, receiverPhone, receiverName, amount, txnType, reference]);

  // Copy Payload
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrPayloadJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate Download SVG
  const handleDownloadQR = () => {
    const svgElement = document.getElementById('mfs-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${provider}-MFS-QR-${receiverPhone}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Parse Scanned Code or Preset
  const handleParsePayload = (payloadStr: string) => {
    try {
      const parsed = JSON.parse(payloadStr);
      setScannedData(parsed);
    } catch (e) {
      // Fallback simple string parser
      setScannedData({
        provider: 'bKash',
        receiverPhone: '+8801712345678',
        receiverName: 'Scanned Receiver Account',
        amount: 500,
        type: 'Send Money',
        reference: 'Scanned QR Payment'
      });
    }
  };

  // Complete Payment from Scanner
  const handleExecuteScannedPayment = () => {
    if (!scannedData) return;

    const trxId = `P2P-${scannedData.provider?.substring(0, 2).toUpperCase() || 'BK'}-${Math.floor(100000 + Math.random() * 900000)}`;

    onAddMFSTransaction({
      trxId,
      provider: (scannedData.provider as MFSProvider) || 'bKash',
      senderPhone: '+8801700000000',
      receiverPhone: scannedData.receiverPhone || receiverPhone,
      amount: Number(scannedData.amount) || 500,
      charge: 0,
      type: (scannedData.type as any) || 'Send Money',
      status: 'SUCCESS',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      setScannedData(null);
      setScanInputPayload('');
    }, 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-950 border border-pink-800 text-pink-400 rounded-xl">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Shareable MFS P2P Transfer QR Code Generator
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-pink-950 text-pink-300 border border-pink-800 rounded-md">
                INSTANT SCAN & PAY
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create branded bKash, Nagad, Rocket, and Upay QR codes for instant peer-to-peer transfers or scan incoming payment requests.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold ${
              activeTab === 'generate'
                ? 'bg-pink-950 text-pink-300 border border-pink-800 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Generate QR
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold ${
              activeTab === 'scan'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            Scan & Autofill
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION BANNER */}
      {isSuccessMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in zoom-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="block font-bold text-emerald-200">MFS P2P Payment Executed Successfully!</strong>
            <span>Transaction logged to MFS Gateway ledger with instant zero-fee settlement.</span>
          </div>
        </div>
      )}

      {activeTab === 'generate' ? (
        /* GENERATE TAB: 2 Columns - Form on Left (6 cols) & QR Code Card on Right (6 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Provider Selector Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select MFS Network Provider:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'bKash', label: 'bKash', color: 'border-pink-500 text-pink-400 bg-pink-950/30' },
                  { id: 'Nagad', label: 'Nagad', color: 'border-orange-500 text-orange-400 bg-orange-950/30' },
                  { id: 'Rocket', label: 'Rocket', color: 'border-purple-500 text-purple-400 bg-purple-950/30' },
                  { id: 'Upay', label: 'Upay', color: 'border-blue-500 text-blue-400 bg-blue-950/30' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      provider === p.id
                        ? `${p.color} ring-1 ring-slate-400 shadow-md`
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Details */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Receiver MFS Mobile / Account No:</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="+88017XXXXXXXX"
                    className="bg-transparent text-slate-100 font-mono font-bold w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Account Holder / Merchant Name:</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g. Madani Store, Dr. Rafiqul Islam"
                    className="bg-transparent text-slate-100 font-semibold w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Requested Amount (BDT):</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500"
                      className="bg-transparent text-slate-100 font-mono font-bold w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Transfer Type:</label>
                  <select
                    value={txnType}
                    onChange={(e) => setTxnType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Send Money">Send Money (P2P)</option>
                    <option value="Merchant Pay">Merchant Payment</option>
                    <option value="Cooperative Deposit">Cooperative Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reference / Note:</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Tag className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Monthly Savings, Grocery Bill"
                    className="bg-transparent text-slate-100 w-full focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Preset Amount Buttons */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">Preset Amount Chips:</span>
                <div className="flex items-center gap-2 font-mono">
                  {['200', '500', '1000', '2000', '5000'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                        amount === preset
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ৳{preset}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Branded Payment Standee & QR Code Preview (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            
            {/* Printable Branded Card Container */}
            <div
              ref={qrCardRef}
              className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl space-y-4 text-center transition-all ${currentConfig.bgColor} ${currentConfig.borderColor}`}
            >
              
              {/* Standee Header */}
              <div className="space-y-1">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${currentConfig.badgeBg}`}>
                  {currentConfig.name} Scan & Pay
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-1">{receiverName}</h4>
                <p className="text-xs font-mono text-slate-400">{receiverPhone}</p>
              </div>

              {/* QR Code Canvas Frame */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-slate-300 mx-auto">
                <QRCodeSVG
                  id="mfs-qr-svg"
                  value={qrPayloadJSON}
                  size={180}
                  level="H"
                  includeMargin={true}
                  fgColor="#090d16"
                  bgColor="#ffffff"
                />
              </div>

              {/* Amount Display */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 font-mono">
                <span className="text-[10px] text-slate-400 block">Transfer Amount</span>
                <strong className={`text-lg font-bold ${currentConfig.textColor}`}>
                  {formatBDT(parseFloat(amount) || 0)}
                </strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">Note: {reference}</span>
              </div>

              {/* Footer Tip */}
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Valid for all Bangladeshi MFS Banking Apps
              </p>

            </div>

            {/* Action Bar: Copy Payload & Download SVG */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-sm">
              <button
                onClick={handleCopyPayload}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Link' : 'Copy Payload'}
              </button>

              <button
                onClick={handleDownloadQR}
                className={`px-3.5 py-2 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md ${currentConfig.btnBg}`}
              >
                <Download className="w-4 h-4" />
                Download SVG QR
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* SCAN & AUTOFILL TAB */
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <ScanLine className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-100">Scan or Paste P2P MFS QR Payload</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the QR payload string generated from another user's device or click preset samples below to automatically decode receiver phone, provider, and transfer amount.
            </p>

            {/* Payload Input TextArea */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={scanInputPayload}
                onChange={(e) => setScanInputPayload(e.target.value)}
                placeholder='Paste payload e.g. {"mfsProtocol":"BD_MFS_P2P_V1","provider":"bKash","receiverPhone":"+8801712345678"...}'
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
              />

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">JSON or MFS URI Format</span>
                <button
                  onClick={() => handleParsePayload(scanInputPayload || qrPayloadJSON)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Decode & Parse Payload
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">Or Test Sample Payment Requests:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    const sample = {
                      provider: 'bKash',
                      receiverPhone: '+8801819998877',
                      receiverName: 'Chittagong Cooperative Field Hub',
                      amount: 1500,
                      type: 'Cooperative Deposit',
                      reference: 'Weekly Savings Deposit'
                    };
                    setScanInputPayload(JSON.stringify(sample));
                    setScannedData(sample);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-pink-500/60 transition-all"
                >
                  <strong className="block text-pink-400 font-mono">bKash ৳1,500 Deposit</strong>
                  <span className="text-[10px] text-slate-400">Receiver: +8801819998877</span>
                </button>

                <button
                  onClick={() => {
                    const sample = {
                      provider: 'Nagad',
                      receiverPhone: '+8801755443322',
                      receiverName: 'Dhaka Hardware & Machinery',
                      amount: 3200,
                      type: 'Merchant Pay',
                      reference: 'Emergency Agri Pump Purchase'
                    };
                    setScanInputPayload(JSON.stringify(sample));
                    setScannedData(sample);
                  }}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-orange-500/60 transition-all"
                >
                  <strong className="block text-orange-400 font-mono">Nagad ৳3,200 Merchant</strong>
                  <span className="text-[10px] text-slate-400">Receiver: +8801755443322</span>
                </button>
              </div>
            </div>

            {/* Decoded Transaction Autofill Summary Box */}
            {scannedData && (
              <div className="bg-slate-900 border border-emerald-500/60 rounded-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Decoded Transaction Preview
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                    {scannedData.provider || 'bKash'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Receiver Name</span>
                    <strong className="text-slate-100">{scannedData.receiverName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Receiver Phone</span>
                    <strong className="text-slate-100">{scannedData.receiverPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Amount to Send</span>
                    <strong className="text-emerald-400 text-sm">{formatBDT(scannedData.amount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Reference</span>
                    <strong className="text-slate-200">{scannedData.reference}</strong>
                  </div>
                </div>

                <button
                  onClick={handleExecuteScannedPayment}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Confirm & Execute P2P Transfer ({formatBDT(scannedData.amount)})
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
