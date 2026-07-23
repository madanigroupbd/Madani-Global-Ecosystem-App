import React, { useState } from 'react';
import { EmergencyLoanSystem } from './EmergencyLoanSystem';
import { HousingConstructionTracker } from './HousingConstructionTracker';
import { DistrictDirectory } from './DistrictDirectory';
import { EmergencyLoan, ConstructionProject, DistrictService } from '../../types';
import { HeartHandshake, Building2, MapPin } from 'lucide-react';

interface WelfareHubProps {
  loans: EmergencyLoan[];
  onApplyLoan: (loan: EmergencyLoan) => void;
  projects: ConstructionProject[];
  onNewProject: (project: ConstructionProject) => void;
  districtServices: DistrictService[];
  selectedDistrict: string;
  onDistrictSelect: (district: string) => void;
  districtsList: string[];
}

export const WelfareHub: React.FC<WelfareHubProps> = ({
  loans,
  onApplyLoan,
  projects,
  onNewProject,
  districtServices,
  selectedDistrict,
  onDistrictSelect,
  districtsList
}) => {
  const [subTab, setSubTab] = useState<'loans' | 'housing' | 'directory'>('loans');

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('loans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'loans'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          Zero-Interest Emergency Loans
        </button>

        <button
          onClick={() => setSubTab('housing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'housing'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          Free Rod, Cement & Housing Tracker
        </button>

        <button
          onClick={() => setSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'directory'
              ? 'bg-teal-950 border-teal-500 text-teal-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-teal-400" />
          64 Districts Free Service Directory
        </button>
      </div>

      {subTab === 'loans' && (
        <EmergencyLoanSystem
          loans={loans}
          onApplyLoan={onApplyLoan}
          selectedDistrict={selectedDistrict}
        />
      )}

      {subTab === 'housing' && (
        <HousingConstructionTracker
          projects={projects}
          onNewProject={onNewProject}
          selectedDistrict={selectedDistrict}
        />
      )}

      {subTab === 'directory' && (
        <DistrictDirectory
          districtServices={districtServices}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={onDistrictSelect}
          districtsList={districtsList}
        />
      )}

    </div>
  );
};
