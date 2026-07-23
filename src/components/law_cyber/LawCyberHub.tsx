import React, { useState } from 'react';
import { LegalAidVictimProtection } from './LegalAidVictimProtection';
import { CyberBullyingSupportDesk } from './CyberBullyingSupportDesk';
import { EncryptedLawCell } from './EncryptedLawCell';
import { MoujaVoterGovPortal } from './MoujaVoterGovPortal';
import {
  LegalAidCase,
  CyberReport,
  DeviceIMEIRecord,
  CallDetailRecord,
  MissingPersonMobile,
  MoujaPlotRecord,
  VoterRecord,
  GovPortalLink,
  AuthorityDivision,
  BiometricAuthLog
} from '../../types';
import { Scale, Lock, ShieldAlert, Map } from 'lucide-react';

interface LawCyberHubProps {
  cases: LegalAidCase[];
  onFileNewCase: (c: LegalAidCase) => void;
  cyberReports: CyberReport[];
  onFileCyberReport: (r: CyberReport) => void;
  isLawUnlocked: boolean;
  authorityDivision?: AuthorityDivision;
  onUnlockLawCellRequest: () => void;
  imeiDatabase: DeviceIMEIRecord[];
  cdrLogs: CallDetailRecord[];
  missingItems: MissingPersonMobile[];
  moujaPlots: MoujaPlotRecord[];
  voterRecords: VoterRecord[];
  govLinks: GovPortalLink[];
  selectedDistrict: string;
  authLogs?: BiometricAuthLog[];
  onAddAuthLog?: (log: BiometricAuthLog) => void;
}

export const LawCyberHub: React.FC<LawCyberHubProps> = ({
  cases,
  onFileNewCase,
  cyberReports,
  onFileCyberReport,
  isLawUnlocked,
  authorityDivision,
  onUnlockLawCellRequest,
  imeiDatabase,
  cdrLogs,
  missingItems,
  moujaPlots,
  voterRecords,
  govLinks,
  selectedDistrict,
  authLogs,
  onAddAuthLog
}) => {
  const [subTab, setSubTab] = useState<'legal' | 'cyber' | 'lawCell' | 'mouja'>('legal');

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('legal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'legal'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-400" />
          Free Legal Aid & Victim Protection
        </button>

        <button
          onClick={() => setSubTab('cyber')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'cyber'
              ? 'bg-teal-950 border-teal-500 text-teal-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-teal-400" />
          Cyber Bullying & Blackmail Recovery
        </button>

        <button
          onClick={() => setSubTab('lawCell')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'lawCell'
              ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Encrypted Law Enforcement Support Cell {isLawUnlocked ? '(Unlocked)' : '(Secured)'}
        </button>

        <button
          onClick={() => setSubTab('mouja')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'mouja'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-400" />
          Mouja Maps, Voter Info & Gov Portals
        </button>
      </div>

      {subTab === 'legal' && (
        <LegalAidVictimProtection
          cases={cases}
          onFileNewCase={onFileNewCase}
          selectedDistrict={selectedDistrict}
        />
      )}

      {subTab === 'cyber' && (
        <CyberBullyingSupportDesk
          reports={cyberReports}
          onFileReport={onFileCyberReport}
        />
      )}

      {subTab === 'lawCell' && (
        <EncryptedLawCell
          isUnlocked={isLawUnlocked}
          authorityDivision={authorityDivision}
          onUnlockRequest={onUnlockLawCellRequest}
          imeiDatabase={imeiDatabase}
          cdrLogs={cdrLogs}
          missingItems={missingItems}
          authLogs={authLogs}
          onAddAuthLog={onAddAuthLog}
        />
      )}

      {subTab === 'mouja' && (
        <MoujaVoterGovPortal
          moujaPlots={moujaPlots}
          voterRecords={voterRecords}
          govLinks={govLinks}
        />
      )}

    </div>
  );
};
