import React, { useState } from 'react';
import { Building2, HardHat, Hammer, CheckCircle2, PlusCircle, Layers } from 'lucide-react';
import { ConstructionProject } from '../../types';

interface HousingConstructionTrackerProps {
  projects: ConstructionProject[];
  onNewProject: (project: ConstructionProject) => void;
  selectedDistrict: string;
}

export const HousingConstructionTracker: React.FC<HousingConstructionTrackerProps> = ({
  projects,
  onNewProject,
  selectedDistrict
}) => {
  const [title, setTitle] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [district, setDistrict] = useState(selectedDistrict !== 'ALL' ? selectedDistrict : 'Sylhet');
  const [rodKg, setRodKg] = useState('3500');
  const [cementBags, setCementBags] = useState('450');
  const [laborCount, setLaborCount] = useState('8');

  const filteredProjects = projects.filter((p) =>
    selectedDistrict === 'ALL' ? true : p.district === selectedDistrict
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !beneficiaryName) return;

    const newProject: ConstructionProject = {
      id: `const-${Date.now()}`,
      title,
      beneficiaryName,
      district,
      rodAllocatedKg: Number(rodKg),
      cementAllocatedBags: Number(cementBags),
      laborSupportCount: Number(laborCount),
      completionPercentage: 15,
      status: 'Foundation',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onNewProject(newProject);
    setTitle('');
    setBeneficiaryName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Free Housing & Construction Support Wing
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Free high-grade steel rods, cement bags, and skilled labor allocation for underprivileged housing projects across Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Steel Rod Allocated: <strong className="text-amber-400 font-mono">20,300 kg</strong>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Cement Bags: <strong className="text-emerald-400 font-mono">2,880 Bags</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Register Housing / Building Support Project
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Rod, cement, and skilled labor grant allocation
            </p>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Project Name / Site Code:</label>
              <input
                type="text"
                placeholder="e.g. Flood Shelter Complex #12"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Beneficiary Family / Community:</label>
              <input
                type="text"
                placeholder="Beneficiary Name"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">District Wing:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Rod (Kg):</label>
                <input
                  type="number"
                  value={rodKg}
                  onChange={(e) => setRodKg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Cement (Bags):</label>
                <input
                  type="number"
                  value={cementBags}
                  onChange={(e) => setCementBags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Laborers:</label>
                <input
                  type="number"
                  value={laborCount}
                  onChange={(e) => setLaborCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Allocate Materials & Launch Project
            </button>
          </form>
        </div>

        {/* Project Tracker List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100">
              Active Housing Construction Projects Progress
            </h4>
            <p className="text-xs text-slate-400">
              Material allocation and site completion stats for {selectedDistrict === 'ALL' ? 'All Districts' : selectedDistrict}
            </p>
          </div>

          <div className="space-y-4">
            {filteredProjects.map((p) => (
              <div key={p.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{p.title}</h5>
                    <p className="text-xs text-slate-400">
                      Beneficiary: <strong className="text-slate-200">{p.beneficiaryName}</strong> • District: <strong className="text-amber-400">{p.district}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {p.status} ({p.completionPercentage}%)
                  </span>
                </div>

                {/* Completion Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Completion Progress</span>
                    <span>{p.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all"
                      style={{ width: `${p.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Allocated Resources */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Steel Rod:</span>
                      <strong className="text-slate-200">{p.rodAllocatedKg.toLocaleString()} kg</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Cement:</span>
                      <strong className="text-slate-200">{p.cementAllocatedBags.toLocaleString()} Bags</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-teal-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Labor Support:</span>
                      <strong className="text-slate-200">{p.laborSupportCount} Masons/Workers</strong>
                    </div>
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
