import React, { useState } from 'react';
import { MedicalServicesPortal } from './MedicalServicesPortal';
import { MedicalTourismGuide } from './MedicalTourismGuide';
import { EducationHub } from './EducationHub';
import { HealthTourismDestination, EducationalResource } from '../../types';
import { BriefcaseMedical, Globe, GraduationCap } from 'lucide-react';

interface HealthEduHubProps {
  destinations: HealthTourismDestination[];
  resources: EducationalResource[];
  selectedDistrict: string;
}

export const HealthEduHub: React.FC<HealthEduHubProps> = ({
  destinations,
  resources,
  selectedDistrict
}) => {
  const [subTab, setSubTab] = useState<'medical' | 'tourism' | 'education'>('medical');

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('medical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'medical'
              ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BriefcaseMedical className="w-4 h-4 text-rose-400" />
          Free Medical & Surgery Portal
        </button>

        <button
          onClick={() => setSubTab('tourism')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'tourism'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          India & China Medical Tourism
        </button>

        <button
          onClick={() => setSubTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'education'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          Free Educational Library & Courses
        </button>
      </div>

      {subTab === 'medical' && <MedicalServicesPortal selectedDistrict={selectedDistrict} />}
      {subTab === 'tourism' && <MedicalTourismGuide destinations={destinations} />}
      {subTab === 'education' && <EducationHub resources={resources} />}

    </div>
  );
};
