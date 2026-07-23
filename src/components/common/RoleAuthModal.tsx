import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Fingerprint, KeyRound, AlertTriangle, X, CheckCircle2, Scan, ScanLine, Camera, RefreshCw, UserCheck, Zap } from 'lucide-react';
import { UserRole, AuthorityDivision, BiometricAuthLog } from '../../types';

interface RoleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onAuthenticate: (role: UserRole, division?: AuthorityDivision) => void;
  onLogAuthAttempt?: (log: BiometricAuthLog) => void;
}

type BiometricType = 'FINGERPRINT' | 'FACE_ID';

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onAuthenticate,
  onLogAuthAttempt
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [selectedDivision, setSelectedDivision] = useState<AuthorityDivision>('CID');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Biometric Scanner Overlay State
  const [showBiometricOverlay, setShowBiometricOverlay] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('FINGERPRINT');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [scanStepText, setScanStepText] = useState('Touch sensor to begin scan');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (selectedRole === 'GENERAL_USER') {
      onAuthenticate('GENERAL_USER');
      onClose();
      return;
    }

    if (selectedRole === 'COOP_ADMIN') {
      if (pin === '1234' || pin === '7788') {
        onAuthenticate('COOP_ADMIN');
        setSuccessMessage('Cooperative Admin Access Granted.');
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMessage('Invalid Admin PIN. (Use 1234 or 7788 for demo)');
      }
      return;
    }

    if (selectedRole === 'LAW_ENFORCEMENT_OFFICER') {
      const now = new Date();
      const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;

      if (pin === '7788' || pin === '9999' || pin === '0000') {
        onAuthenticate('LAW_ENFORCEMENT_OFFICER', selectedDivision);
        setSuccessMessage(`Encrypted Access Authorized for ${selectedDivision} Cell.`);
        if (onLogAuthAttempt) {
          onLogAuthAttempt({
            id: `auth-log-${Date.now()}`,
            officerBadge: `${selectedDivision}-OFFICER-${Math.floor(1000 + Math.random() * 9000)}`,
            officerName: 'Authenticated Command Officer',
            division: selectedDivision,
            method: 'SECURITY_PIN',
            status: 'SUCCESS',
            ipAddress: '103.24.182.55 (Local Secure Session)',
            location: 'Dhaka - Live Console Session',
            deviceInfo: 'Browser Terminal (PIN Authentication)',
            timestamp: timeStr,
            notes: 'Authority passcode verified. Encrypted Cell Clearance Granted.'
          });
        }
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMessage('Invalid Law Enforcement Authority PIN. (Use 7788 or 9999 for demo)');
        if (onLogAuthAttempt) {
          onLogAuthAttempt({
            id: `auth-log-${Date.now()}`,
            officerBadge: `${selectedDivision}-OFFICER-UNKNOWN`,
            officerName: 'Unknown Attempt',
            division: selectedDivision,
            method: 'SECURITY_PIN',
            status: 'FAILED',
            ipAddress: '103.24.182.55 (Local Session)',
            location: 'Unverified Console Session',
            deviceInfo: 'Browser Terminal',
            timestamp: timeStr,
            notes: 'Incorrect authority PIN entered during login challenge.'
          });
        }
      }
    }
  };

  const openBiometricOverlay = (type: BiometricType = 'FINGERPRINT') => {
    setBiometricType(type);
    setShowBiometricOverlay(true);
    setScanProgress(0);
    setScanStatus('IDLE');
    setScanStepText(type === 'FINGERPRINT' ? 'Touch sensor or click "Start Scan"' : 'Align face in camera frame');
  };

  const startBiometricSimulation = () => {
    if (scanStatus === 'SCANNING') return;
    setScanStatus('SCANNING');
    setScanProgress(0);

    const steps = biometricType === 'FINGERPRINT' ? [
      'Initializing Optical Sensor...',
      'Reading Fingerprint Ridges & Minutiae...',
      'Encrypting Biometric Template...',
      'Cross-referencing National Registry Database...',
      'Match Confirmed: Identity Verified!'
    ] : [
      'Activating IR Depth Sensor...',
      'Mapping 3D Facial Mesh Landmarks...',
      'Comparing Infrared Neural Pattern...',
      'Verifying Anti-Spoofing Liveness...',
      'Biometric Match Confirmed: Identity Verified!'
    ];

    let currentStep = 0;
    setScanStepText(steps[0]);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 10;
        const stepIdx = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
        if (steps[stepIdx] !== steps[currentStep]) {
          currentStep = stepIdx;
          setScanStepText(steps[stepIdx]);
        }

        if (next >= 100) {
          clearInterval(interval);
          setScanStatus('SUCCESS');
          setScanStepText('Identity Verified! Granting Clearance...');
          
          if (onLogAuthAttempt) {
            const now = new Date();
            const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
            onLogAuthAttempt({
              id: `auth-log-${Date.now()}`,
              officerBadge: `${selectedDivision}-BIO-${Math.floor(1000 + Math.random() * 9000)}`,
              officerName: 'Biometric Authenticated Officer',
              division: selectedDivision,
              method: biometricType,
              status: 'SUCCESS',
              ipAddress: '103.24.182.45 (Encrypted Optical Link)',
              location: 'Dhaka - Biometric Sensor Station',
              deviceInfo: biometricType === 'FINGERPRINT' ? 'Optical Minutiae Reader v4' : '3D IR Facial Mesh Sensor',
              timestamp: timeStr,
              notes: `Live ${biometricType} scan verified against National Biometric Registry.`
            });
          }

          setTimeout(() => {
            setShowBiometricOverlay(false);
            onAuthenticate(selectedRole, selectedRole === 'LAW_ENFORCEMENT_OFFICER' ? selectedDivision : undefined);
            setSuccessMessage(`Biometric Identity Verified (${biometricType}): Clearance Granted.`);
            setTimeout(() => onClose(), 1000);
          }, 1200);
          return 100;
        }
        return next;
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Role & Access Control Authentication
            </h3>
            <p className="text-xs text-slate-400">
              Madani Global Ecosystem Biometric & PIN Security Gate
            </p>
          </div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Role Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Operating Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('GENERAL_USER')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedRole === 'GENERAL_USER'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Public User
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('COOP_ADMIN')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedRole === 'COOP_ADMIN'
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Coop Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('LAW_ENFORCEMENT_OFFICER')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedRole === 'LAW_ENFORCEMENT_OFFICER'
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Law Authority
              </button>
            </div>
          </div>

          {/* Division Selector if Law Enforcement */}
          {selectedRole === 'LAW_ENFORCEMENT_OFFICER' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Authority Division:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['CID', 'POLICE', 'RAB', 'ARMY', 'CYBER_CRIME'] as AuthorityDivision[]).map((div) => (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setSelectedDivision(div)}
                    className={`py-1.5 rounded text-[11px] font-bold border transition-all ${
                      selectedDivision === div
                        ? 'bg-rose-900 border-rose-400 text-rose-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {div}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PIN or Biometric Input if Admin / Law Enforcement */}
          {selectedRole !== 'GENERAL_USER' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Security Passcode / PIN:
                </label>
                <input
                  type="password"
                  placeholder="Enter Passcode (e.g., 7788)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Demo Credentials: Use <span className="text-amber-400 font-mono">7788</span> or <span className="text-amber-400 font-mono">9999</span>
                </p>
              </div>

              {/* Biometric Scan Trigger Options */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openBiometricOverlay('FINGERPRINT')}
                  className="bg-slate-800 hover:bg-slate-700 border border-teal-500/30 hover:border-teal-400/60 rounded-xl py-2.5 px-3 text-xs font-semibold text-teal-300 flex items-center justify-center gap-2 transition-all shadow-sm group"
                >
                  <Fingerprint className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                  Fingerprint Scan
                </button>
                <button
                  type="button"
                  onClick={() => openBiometricOverlay('FACE_ID')}
                  className="bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl py-2.5 px-3 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 transition-all shadow-sm group"
                >
                  <Scan className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  FaceID Sensor
                </button>
              </div>
            </div>
          )}

          {/* Error and Success Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 rounded-xl shadow-lg transition-all"
            >
              Confirm Access
            </button>
          </div>

        </form>

        {/* Biometric Full-Scanner Simulation Overlay */}
        {showBiometricOverlay && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
            {/* Overlay Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Zap className="w-4 h-4 animate-pulse text-amber-400" />
                SECURE BIOMETRIC SENSOR
              </div>
              <button
                onClick={() => setShowBiometricOverlay(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher inside Overlay */}
            <div className="flex justify-center my-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => openBiometricOverlay('FINGERPRINT')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
                    biometricType === 'FINGERPRINT'
                      ? 'bg-teal-950 text-teal-300 border border-teal-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
                  Fingerprint
                </button>
                <button
                  type="button"
                  onClick={() => openBiometricOverlay('FACE_ID')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
                    biometricType === 'FACE_ID'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  FaceID 3D
                </button>
              </div>
            </div>

            {/* Central Visual Scanner Display */}
            <div className="flex flex-col items-center justify-center my-auto py-4">
              <div
                onClick={startBiometricSimulation}
                className={`relative cursor-pointer group flex items-center justify-center w-36 h-36 rounded-3xl border-2 transition-all duration-300 ${
                  scanStatus === 'SUCCESS'
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : scanStatus === 'SCANNING'
                    ? biometricType === 'FINGERPRINT'
                      ? 'border-teal-400 bg-teal-950/40 shadow-[0_0_30px_rgba(20,184,166,0.3)]'
                      : 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                }`}
              >
                {/* Laser Scanning Bar */}
                {scanStatus === 'SCANNING' && (
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce my-auto z-10" />
                )}

                {/* Fingerprint / Face Target Graphics */}
                {biometricType === 'FINGERPRINT' ? (
                  <div className="relative flex items-center justify-center">
                    <Fingerprint className={`w-20 h-20 transition-all ${
                      scanStatus === 'SUCCESS'
                        ? 'text-emerald-400 scale-105'
                        : scanStatus === 'SCANNING'
                        ? 'text-teal-400 animate-pulse'
                        : 'text-slate-500 group-hover:text-teal-400'
                    }`} />
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center">
                    {/* Face Mesh Viewport */}
                    <div className="absolute inset-0 border border-dashed border-cyan-500/40 rounded-2xl animate-spin-slow" />
                    <Camera className={`w-16 h-16 transition-all ${
                      scanStatus === 'SUCCESS'
                        ? 'text-emerald-400 scale-105'
                        : scanStatus === 'SCANNING'
                        ? 'text-cyan-400 animate-pulse'
                        : 'text-slate-500 group-hover:text-cyan-400'
                    }`} />
                    <Scan className="absolute w-24 h-24 text-cyan-400/30" />
                  </div>
                )}

                {/* Success Indicator Badge */}
                {scanStatus === 'SUCCESS' && (
                  <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 text-slate-950 rounded-full shadow-lg animate-bounce">
                    <UserCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Progress Bar & Percentage */}
              <div className="w-full max-w-xs mt-5 space-y-2 text-center">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Match Accuracy:</span>
                  <span className={`font-bold ${scanStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {scanProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-150 ${
                      scanStatus === 'SUCCESS'
                        ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_10px_#22d3ee]'
                    }`}
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 font-mono min-h-[20px] pt-1">
                  {scanStepText}
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-2">
              {scanStatus === 'IDLE' && (
                <button
                  type="button"
                  onClick={startBiometricSimulation}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ScanLine className="w-4 h-4" />
                  Start {biometricType === 'FINGERPRINT' ? 'Fingerprint' : 'FaceID'} Verification
                </button>
              )}

              {scanStatus === 'SCANNING' && (
                <div className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs rounded-xl flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  Processing Biometric Vectors...
                </div>
              )}

              {scanStatus === 'SUCCESS' && (
                <div className="w-full py-3 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Identity Authenticated Successfully
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

