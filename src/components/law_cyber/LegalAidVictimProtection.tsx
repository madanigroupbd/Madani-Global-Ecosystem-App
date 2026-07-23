import React, { useState } from 'react';
import { LegalAidCase } from '../../types';
import { Scale, ShieldAlert, FileText, CheckCircle2, User, Send } from 'lucide-react';

interface LegalAidVictimProtectionProps {
  cases: LegalAidCase[];
  onFileNewCase: (c: LegalAidCase) => void;
  selectedDistrict: string;
}

export const LegalAidVictimProtection: React.FC<LegalAidVictimProtectionProps> = ({
  cases,
  onFileNewCase,
  selectedDistrict
}) => {
  const [victimName, setVictimName] = useState('');
  const [district, setDistrict] = useState(selectedDistrict !== 'ALL' ? selectedDistrict : 'Narayanganj');
  const [incidentType, setIncidentType] = useState<'Human Rights Violation' | 'Land Dispute' | 'Domestic Violence' | 'Unlawful Detention'>('Human Rights Violation');
  const [incidentDetails, setIncidentDetails] = useState('');

  const filteredCases = cases.filter((c) =>
    selectedDistrict === 'ALL' ? true : c.district === selectedDistrict
  );

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!victimName || !incidentDetails) return;

    const newCase: LegalAidCase = {
      id: `leg-${Date.now()}`,
      victimName,
      district,
      incidentType,
      incidentDetails,
      assignedLawyer: 'Advocate Barrister R. Ahmed (High Court Legal Aid Cell)',
      status: 'URGENT',
      filedDate: new Date().toISOString().split('T')[0]
    };

    onFileNewCase(newCase);
    setVictimName('');
    setIncidentDetails('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            Free Legal Aid & Human Rights Victim Emergency Protection Cell
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            100% free legal representation at Supreme Court & District Courts for victims of unlawful land grabbing, human rights violations, and illegal detention.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-amber-300 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Pro-Bono Advocate Panel Connected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Case filing form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              File Emergency Legal Aid Report
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Encrypted human rights victim report
            </p>
          </div>

          <form onSubmit={handleSubmitCase} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Victim / Complainant Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={victimName}
                onChange={(e) => setVictimName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">District Wing:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Violation Category:</label>
              <select
                value={incidentType}
                onChange={(e: any) => setIncidentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Human Rights Violation">Human Rights Violation</option>
                <option value="Land Dispute">Land Dispute & Unlawful Seizure</option>
                <option value="Domestic Violence">Domestic Violence & Exploitation</option>
                <option value="Unlawful Detention">Unlawful Detention or Harassment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Details & Oppressor Summary:</label>
              <textarea
                rows={3}
                placeholder="Describe the violation, location, date, and perpetrators..."
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit to Legal Protection Cell
            </button>
          </form>
        </div>

        {/* Filed Cases List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Active Human Rights Protection & Legal Cases
              </h4>
              <p className="text-xs text-slate-400">Assigned advocates and court status</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              {filteredCases.length} Cases Filed
            </span>
          </div>

          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div key={c.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{c.victimName}</h5>
                    <p className="text-xs text-slate-400">
                      Category: <strong className="text-amber-400">{c.incidentType}</strong> • District: <strong className="text-slate-200">{c.district}</strong>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    c.status === 'URGENT'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  "{c.incidentDetails}"
                </p>

                <div className="pt-2 border-t border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Assigned Pro-Bono Lawyer:</span>
                  <span className="font-bold text-emerald-400">{c.assignedLawyer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
