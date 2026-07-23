import React, { useState } from 'react';
import { DeviceIMEIRecord, CallDetailRecord, MissingPersonMobile, AuthorityDivision, BiometricAuthLog } from '../../types';
import {
  ShieldAlert,
  Radio,
  PhoneCall,
  Smartphone,
  Search,
  MapPin,
  Lock,
  Unlock,
  AlertTriangle,
  Activity,
  UserX,
  Fingerprint,
  Scan,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Download,
  Plus,
  Filter,
  Clock,
  Laptop,
  Zap,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';

interface EncryptedLawCellProps {
  isUnlocked: boolean;
  authorityDivision?: AuthorityDivision;
  onUnlockRequest: () => void;
  imeiDatabase: DeviceIMEIRecord[];
  cdrLogs: CallDetailRecord[];
  missingItems: MissingPersonMobile[];
  authLogs?: BiometricAuthLog[];
  onAddAuthLog?: (log: BiometricAuthLog) => void;
}

export const EncryptedLawCell: React.FC<EncryptedLawCellProps> = ({
  isUnlocked,
  authorityDivision = 'CID',
  onUnlockRequest,
  imeiDatabase,
  cdrLogs,
  missingItems,
  authLogs = [],
  onAddAuthLog
}) => {
  const [subTool, setSubTool] = useState<'imei' | 'cdr' | 'gis' | 'missing' | 'authHistory'>('imei');
  
  // IMEI Search
  const [imeiQuery, setImeiQuery] = useState('864201049981234');
  const [selectedImeiResult, setSelectedImeiResult] = useState<DeviceIMEIRecord | null>(imeiDatabase[0] || null);

  // CDR Search
  const [cdrTargetPhone, setCdrTargetPhone] = useState('+8801899887766');
  const [cdrAnalysisResult, setCdrAnalysisResult] = useState<any | null>(null);
  const [isAnalyzingCdr, setIsAnalyzingCdr] = useState(false);

  // GIS Map Simulator
  const [activeTower, setActiveTower] = useState('TOWER-DHK-442 (Gulshan 1)');

  // Auth History State
  const [authSearchQuery, setAuthSearchQuery] = useState('');
  const [authStatusFilter, setAuthStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'SUSPICIOUS_DENIED'>('ALL');
  const [authDivisionFilter, setAuthDivisionFilter] = useState<string>('ALL');
  const [authMethodFilter, setAuthMethodFilter] = useState<string>('ALL');

  // Modal State for Simulated Auth Log Creation
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simBadge, setSimBadge] = useState('CID-OFFICER-7741');
  const [simName, setSimName] = useState('Inspector Kamrul Hassan');
  const [simDivision, setSimDivision] = useState<AuthorityDivision>('CID');
  const [simMethod, setSimMethod] = useState<'FINGERPRINT' | 'FACE_ID' | 'SECURITY_PIN'>('FINGERPRINT');
  const [simStatus, setSimStatus] = useState<'SUCCESS' | 'FAILED' | 'SUSPICIOUS_DENIED'>('SUCCESS');
  const [simLocation, setSimLocation] = useState('Dhaka - Motijheel Cyber Command');
  const [simNotes, setSimNotes] = useState('Routine biometric surveillance access check');

  if (!isUnlocked) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">
            Encrypted Law Enforcement Support Cell Locked
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Restricted access for CID, Bangladesh Police, RAB, Army, and Cyber Crime Units. Requires biometric fingerprint scan or authority PIN passcode.
          </p>
        </div>

        <button
          onClick={onUnlockRequest}
          className="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xl transition-all"
        >
          Authenticate Biometric / PIN Passcode
        </button>
      </div>
    );
  }

  const handleSearchImei = () => {
    const found = imeiDatabase.find(
      (item) => item.imei === imeiQuery || item.simNumber.includes(imeiQuery)
    );
    setSelectedImeiResult(found || null);
  };

  const handleAnalyzeCdr = async () => {
    setIsAnalyzingCdr(true);
    try {
      const response = await fetch('/api/law/cdr-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPhone: cdrTargetPhone })
      });
      const data = await response.json();
      setCdrAnalysisResult(data);
    } catch (err) {
      console.error('CDR Error:', err);
    } finally {
      setIsAnalyzingCdr(false);
    }
  };

  // Auth History Filtering
  const filteredAuthLogs = authLogs.filter((log) => {
    const q = authSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      log.officerBadge.toLowerCase().includes(q) ||
      log.officerName.toLowerCase().includes(q) ||
      log.location.toLowerCase().includes(q) ||
      log.ipAddress.toLowerCase().includes(q) ||
      (log.notes && log.notes.toLowerCase().includes(q));

    const matchesStatus = authStatusFilter === 'ALL' || log.status === authStatusFilter;
    const matchesDivision = authDivisionFilter === 'ALL' || log.division === authDivisionFilter;
    const matchesMethod = authMethodFilter === 'ALL' || log.method === authMethodFilter;

    return matchesSearch && matchesStatus && matchesDivision && matchesMethod;
  });

  // Calculate Metrics
  const totalAttempts = authLogs.length;
  const successAttempts = authLogs.filter((l) => l.status === 'SUCCESS').length;
  const failedAttempts = authLogs.filter((l) => l.status === 'FAILED').length;
  const suspiciousDenied = authLogs.filter((l) => l.status === 'SUSPICIOUS_DENIED').length;

  const handleSimulateLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddAuthLog) return;

    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;

    const newLog: BiometricAuthLog = {
      id: `auth-log-${Date.now()}`,
      officerBadge: simBadge || `${simDivision}-OFFICER-${Math.floor(1000 + Math.random() * 9000)}`,
      officerName: simName || 'Authority Officer',
      division: simDivision,
      method: simMethod,
      status: simStatus,
      ipAddress: '103.24.182.88 (Command Link)',
      location: simLocation || 'Dhaka HQ Terminal',
      deviceInfo: simMethod === 'FINGERPRINT' ? 'Optical Minutiae Reader' : simMethod === 'FACE_ID' ? 'IR 3D Mesh Cam' : 'Encrypted PIN Console',
      timestamp: timeStr,
      notes: simNotes || 'Manual test log submitted by command officer'
    };

    onAddAuthLog(newLog);
    setIsSimModalOpen(false);
  };

  const handleExportCsv = () => {
    const csvHeader = "ID,Badge,Officer,Division,Method,Status,IP,Location,Timestamp,Notes\n";
    const csvRows = authLogs.map(l => 
      `"${l.id}","${l.officerBadge}","${l.officerName}","${l.division}","${l.method}","${l.status}","${l.ipAddress}","${l.location}","${l.timestamp}","${l.notes || ''}"`
    ).join("\n");
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LawEnforcement_AuthHistory_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Authority Banner */}
      <div className="bg-rose-950/80 border border-rose-800 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-900 text-rose-200 rounded-xl border border-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Encrypted Law Enforcement Cell: [{authorityDivision} AUTHORIZED]
              <span className="text-[10px] bg-rose-500 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                RESTRICTED ACCESS
              </span>
            </h3>
            <p className="text-xs text-rose-200 mt-0.5">
              Live device location triangulation, Call Detail Record (CDR) logs, IMEI lookup, missing person database, and biometric auth audit history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-rose-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-rose-900">
            CID-SECURE-KEY: #880-ENCRYPTED
          </span>
        </div>
      </div>

      {/* Sub-tool Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTool('imei')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTool === 'imei'
              ? 'bg-rose-950 border-rose-500 text-rose-200'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-rose-400" />
          IMEI & Mobile Data Tracking
        </button>

        <button
          onClick={() => setSubTool('cdr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTool === 'cdr'
              ? 'bg-amber-950 border-amber-500 text-amber-200'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-amber-400" />
          Call Detail Record (CDR) Visualizer
        </button>

        <button
          onClick={() => setSubTool('gis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTool === 'gis'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          Live GIS Triangulation Map
        </button>

        <button
          onClick={() => setSubTool('missing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTool === 'missing'
              ? 'bg-teal-950 border-teal-500 text-teal-200'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserX className="w-4 h-4 text-teal-400" />
          Missing Persons & Stolen Phones
        </button>

        {/* New Auth History Dashboard Tab */}
        <button
          onClick={() => setSubTool('authHistory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTool === 'authHistory'
              ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950/50'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
          Auth History & Biometric Audit
          <span className="ml-1 px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 text-[10px] font-mono">
            {authLogs.length}
          </span>
        </button>
      </div>

      {/* Tool Content 1: IMEI Lookup */}
      {subTool === 'imei' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              IMEI / SIM Search Engine
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Enter 15-Digit IMEI or SIM Number:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imeiQuery}
                    onChange={(e) => setImeiQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                  />
                  <button
                    onClick={handleSearchImei}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    Lookup
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <span className="font-bold block text-slate-300">Quick Test IMEIs:</span>
                <div className="space-y-1 font-mono">
                  {imeiDatabase.map((item) => (
                    <button
                      key={item.imei}
                      onClick={() => {
                        setImeiQuery(item.imei);
                        setSelectedImeiResult(item);
                      }}
                      className="block text-left text-xs text-rose-300 hover:underline"
                    >
                      • {item.imei} ({item.deviceModel})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Triangulated Device Telemetry Record
            </h4>

            {selectedImeiResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Device Model:</span>
                    <strong className="text-slate-100">{selectedImeiResult.deviceModel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Registered Owner:</span>
                    <strong className="text-slate-100">{selectedImeiResult.registeredOwner}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Active SIM Number:</span>
                    <strong className="text-rose-400 font-mono">{selectedImeiResult.simNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Operator Network:</span>
                    <strong className="text-slate-200">{selectedImeiResult.lastSimOperator}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Coordinates:</span>
                    <strong className="text-emerald-400 font-mono">
                      {selectedImeiResult.coordinates.lat}, {selectedImeiResult.coordinates.lng}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Surveillance Status:</span>
                    <strong className="text-amber-400">{selectedImeiResult.status}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <span className="text-rose-400 font-bold block">Current Cell Tower Location Ping:</span>
                  <p className="text-slate-200 font-medium">{selectedImeiResult.currentTowerLocation}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Last Signal Ping: {selectedImeiResult.lastSeenTimestamp}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">
                No matching IMEI record found in law enforcement database.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tool Content 2: CDR Analysis */}
      {subTool === 'cdr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Target CDR Phone Query
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Phone Number:</label>
                <input
                  type="text"
                  value={cdrTargetPhone}
                  onChange={(e) => setCdrTargetPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                />
              </div>

              <button
                onClick={handleAnalyzeCdr}
                disabled={isAnalyzingCdr}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                {isAnalyzingCdr ? 'Analyzing Call Matrix...' : 'Run CDR Call Frequency Analysis'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Call Detail Records (CDR) Matrix & Top Contacts
            </h4>

            <div className="space-y-3">
              {cdrLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-amber-300">
                      {log.callerPhone} ➔ {log.receiverPhone}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Type: <strong className="text-slate-200">{log.callType}</strong> • Duration: {log.durationSeconds}s • Tower: {log.cellTowerId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.suspicionScore > 70 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      Suspicion: {log.suspicionScore}%
                    </span>
                    <span className="block text-[9px] text-slate-500 mt-1">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tool Content 3: GIS Map Simulator */}
      {subTool === 'gis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Live Cellular Tower Triangulation Map Canvas
            </h4>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ACCURACY: ± 15 METERS
            </span>
          </div>

          <div className="w-full h-72 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
            {/* Grid Map Simulation Canvas Graphics */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            {/* Triangulation Pulses */}
            <div className="relative z-10 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 animate-ping mx-auto flex items-center justify-center">
                <MapPin className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-200 font-mono shadow-xl">
                Active Triangulation Target: <strong className="text-emerald-400">Lat 23.7925, Lng 90.4078</strong> (Gulshan Tower #442)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Content 4: Missing Persons */}
      {subTool === 'missing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100">Missing Persons & Stolen Mobile Database</h4>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-800">
              {missingItems.length} Urgent Records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missingItems.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-100">{item.nameOrItem}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-400">{item.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                  <div>Location: <strong className="text-amber-400">{item.lastSeenLocation} ({item.district})</strong></div>
                  <div>FIR / GD: <strong className="text-slate-200">{item.firNumber}</strong></div>
                  {item.rewardBDT && (
                    <div className="text-emerald-400 font-bold">Reward: ৳{item.rewardBDT.toLocaleString()} BDT</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Content 5: AUTH HISTORY DASHBOARD TAB */}
      {subTool === 'authHistory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
            <div>
              <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-cyan-400" />
                Law Enforcement Biometric & Passcode Authentication Audit Trail
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Real-time security logs capturing fingerprint minutiae scans, FaceID depth meshes, and PIN entries across CID, RAB, Police, Army & Cyber Crime Units.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsSimModalOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Simulate Auth Event
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
                title="Export audit log to CSV file"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Metrics Summary Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Widget 1: Total Attempts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Total Access Attempts</span>
                <strong className="text-xl font-bold text-slate-100 font-mono mt-0.5 block">{totalAttempts}</strong>
                <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Logged Security Queries</span>
              </div>
              <div className="p-3 bg-cyan-950 border border-cyan-800/60 text-cyan-400 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Widget 2: Successes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Verified Clearances</span>
                <strong className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">{successAttempts}</strong>
                <span className="text-[10px] text-emerald-500 font-mono mt-1 block">
                  {totalAttempts ? Math.round((successAttempts / totalAttempts) * 100) : 0}% Grant Rate
                </span>
              </div>
              <div className="p-3 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Widget 3: Failed Retries */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Failed PIN/Scan Retries</span>
                <strong className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{failedAttempts}</strong>
                <span className="text-[10px] text-amber-500 font-mono mt-1 block">Incorrect Credentials</span>
              </div>
              <div className="p-3 bg-amber-950 border border-amber-800/60 text-amber-400 rounded-xl">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Widget 4: Suspicious Denied */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Blocked Threats</span>
                <strong className="text-xl font-bold text-rose-400 font-mono mt-0.5 block">{suspiciousDenied}</strong>
                <span className="text-[10px] text-rose-400 font-mono mt-1 block animate-pulse">Intrusions Intercepted</span>
              </div>
              <div className="p-3 bg-rose-950 border border-rose-800/60 text-rose-400 rounded-xl">
                <AlertOctagon className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Search & Filter Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by officer name, badge ID, location, or IP address..."
                  value={authSearchQuery}
                  onChange={(e) => setAuthSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                {authSearchQuery && (
                  <button
                    onClick={() => setAuthSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Division Dropdown */}
              <div className="w-full md:w-44 shrink-0">
                <select
                  value={authDivisionFilter}
                  onChange={(e) => setAuthDivisionFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Divisions</option>
                  <option value="CID">CID Unit</option>
                  <option value="RAB">RAB Forces</option>
                  <option value="POLICE">Bangladesh Police</option>
                  <option value="ARMY">Army Command</option>
                  <option value="CYBER_CRIME">Cyber Crime Wing</option>
                </select>
              </div>

              {/* Method Dropdown */}
              <div className="w-full md:w-44 shrink-0">
                <select
                  value={authMethodFilter}
                  onChange={(e) => setAuthMethodFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Methods</option>
                  <option value="FINGERPRINT">Fingerprint Scan</option>
                  <option value="FACE_ID">FaceID 3D Mesh</option>
                  <option value="SECURITY_PIN">Security PIN</option>
                </select>
              </div>

            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Status:
              </span>

              <button
                onClick={() => setAuthStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  authStatusFilter === 'ALL'
                    ? 'bg-slate-700 text-slate-100 border border-slate-600'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Attempts ({totalAttempts})
              </button>

              <button
                onClick={() => setAuthStatusFilter('SUCCESS')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  authStatusFilter === 'SUCCESS'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                    : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Authenticated ({successAttempts})
              </button>

              <button
                onClick={() => setAuthStatusFilter('FAILED')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  authStatusFilter === 'FAILED'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500'
                    : 'bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800'
                }`}
              >
                <XCircle className="w-3 h-3 text-amber-400" />
                Failed Retries ({failedAttempts})
              </button>

              <button
                onClick={() => setAuthStatusFilter('SUSPICIOUS_DENIED')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  authStatusFilter === 'SUSPICIOUS_DENIED'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500'
                    : 'bg-slate-950 text-slate-400 hover:text-rose-400 border border-slate-800'
                }`}
              >
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                Blocked Threats ({suspiciousDenied})
              </button>

              {(authSearchQuery || authStatusFilter !== 'ALL' || authDivisionFilter !== 'ALL' || authMethodFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setAuthSearchQuery('');
                    setAuthStatusFilter('ALL');
                    setAuthDivisionFilter('ALL');
                    setAuthMethodFilter('ALL');
                  }}
                  className="ml-auto text-[11px] text-cyan-400 hover:underline shrink-0"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Activity List / Audit Trail Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Authentication Activity Stream
              </h4>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredAuthLogs.length} of {totalAttempts} Logged Events
              </span>
            </div>

            {filteredAuthLogs.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Fingerprint className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">No authentication logs match the selected filters.</p>
                <p className="text-[11px] text-slate-500">Try adjusting your search query, status filters, or division selection.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAuthLogs.map((log) => {
                  const isSuccess = log.status === 'SUCCESS';
                  const isFailed = log.status === 'FAILED';
                  const isThreat = log.status === 'SUSPICIOUS_DENIED';

                  return (
                    <div
                      key={log.id}
                      className={`p-4 rounded-xl border transition-all space-y-2 text-xs relative overflow-hidden ${
                        isSuccess
                          ? 'bg-slate-950/80 border-emerald-900/50 hover:border-emerald-500/40'
                          : isFailed
                          ? 'bg-slate-950/80 border-amber-900/50 hover:border-amber-500/40'
                          : 'bg-rose-950/30 border-rose-900/70 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                      }`}
                    >
                      {/* Left Status Glow Strip */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isSuccess ? 'bg-emerald-500' : isFailed ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                        }`}
                      />

                      {/* Top Row: Officer Badge, Division, Method, Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
                        <div className="flex items-center gap-2">
                          {/* Method Icon */}
                          <div className={`p-2 rounded-lg border ${
                            isSuccess
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : isFailed
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-rose-950 text-rose-400 border-rose-800'
                          }`}>
                            {log.method === 'FINGERPRINT' && <Fingerprint className="w-4 h-4" />}
                            {log.method === 'FACE_ID' && <Scan className="w-4 h-4" />}
                            {log.method === 'SECURITY_PIN' && <KeyRound className="w-4 h-4" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-xs">{log.officerName}</span>
                              <span className="font-mono text-[11px] text-cyan-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {log.officerBadge}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                                {log.division}
                              </span>
                              <span>•</span>
                              <span className="text-slate-300 font-medium">Method: {log.method}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                              isSuccess
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                                : isFailed
                                ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                                : 'bg-rose-950 text-rose-300 border-rose-500/60 shadow-sm animate-pulse'
                            }`}
                          >
                            {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {isFailed && <XCircle className="w-3.5 h-3.5 text-amber-400" />}
                            {isThreat && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
                            {isSuccess ? 'AUTHENTICATED' : isFailed ? 'AUTH FAILED' : 'INTRUSION BLOCKED'}
                          </span>

                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Metadata & Audit Notes */}
                      <div className="pl-2 pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Location & Node:</span>
                          <span className="text-slate-300 font-medium">{log.location}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px]">Terminal / IP Address:</span>
                          <span className="text-slate-300 font-mono text-[10px]">{log.ipAddress}</span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[10px]">Device & Sensor Hardware:</span>
                          <span className="text-slate-300">{log.deviceInfo}</span>
                        </div>
                      </div>

                      {log.notes && (
                        <div className="pl-2 pt-1 text-[11px] text-slate-400 italic font-mono flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-cyan-400/70 shrink-0" />
                          <span>Audit Note: {log.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Simulate Auth Event Modal Overlay */}
          {isSimModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100">
                
                <button
                  onClick={() => setIsSimModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                  <div className="p-2.5 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Simulate Auth Event Entry</h3>
                    <p className="text-[11px] text-slate-400">Inject test biometric / passcode authentication log into audit stream.</p>
                  </div>
                </div>

                <form onSubmit={handleSimulateLogSubmit} className="space-y-3 text-xs">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Officer Badge ID:</label>
                      <input
                        type="text"
                        value={simBadge}
                        onChange={(e) => setSimBadge(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Division:</label>
                      <select
                        value={simDivision}
                        onChange={(e) => setSimDivision(e.target.value as AuthorityDivision)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="CID">CID</option>
                        <option value="RAB">RAB</option>
                        <option value="POLICE">POLICE</option>
                        <option value="ARMY">ARMY</option>
                        <option value="CYBER_CRIME">CYBER_CRIME</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Officer / User Name:</label>
                    <input
                      type="text"
                      value={simName}
                      onChange={(e) => setSimName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Auth Method:</label>
                      <select
                        value={simMethod}
                        onChange={(e) => setSimMethod(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="FINGERPRINT">Fingerprint Scan</option>
                        <option value="FACE_ID">FaceID 3D Mesh</option>
                        <option value="SECURITY_PIN">Security PIN</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Auth Outcome:</label>
                      <select
                        value={simStatus}
                        onChange={(e) => setSimStatus(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="SUCCESS">SUCCESS (Granted)</option>
                        <option value="FAILED">FAILED (Retry)</option>
                        <option value="SUSPICIOUS_DENIED">SUSPICIOUS_DENIED (Threat)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Location / Command Terminal:</label>
                    <input
                      type="text"
                      value={simLocation}
                      onChange={(e) => setSimLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Audit Notes / Reason:</label>
                    <input
                      type="text"
                      value={simNotes}
                      onChange={(e) => setSimNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSimModalOpen(false)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg"
                    >
                      Post Audit Log
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

