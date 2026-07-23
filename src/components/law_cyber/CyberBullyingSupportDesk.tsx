import React, { useState } from 'react';
import { CyberReport } from '../../types';
import { ShieldCheck, Lock, Sparkles, AlertTriangle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

interface CyberBullyingSupportDeskProps {
  reports: CyberReport[];
  onFileReport: (r: CyberReport) => void;
}

export const CyberBullyingSupportDesk: React.FC<CyberBullyingSupportDeskProps> = ({
  reports,
  onFileReport
}) => {
  const [victimAlias, setVictimAlias] = useState('');
  const [crimeType, setCrimeType] = useState<'Cyber Bullying' | 'Blackmail & Extortion' | 'Account Hacking' | 'Deepfake Harassment'>('Blackmail & Extortion');
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiLegalBrief, setAiLegalBrief] = useState<string | null>(null);

  const handleAnalyzeAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!victimAlias || !evidenceSummary) return;

    setIsAiAnalyzing(true);
    setAiLegalBrief(null);

    try {
      const response = await fetch('/api/cyber/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crimeType,
          evidenceSummary,
          victimAlias
        })
      });

      const data = await response.json();
      setAiLegalBrief(data.legalBrief);

      const newReport: CyberReport = {
        id: `cyb-${Date.now()}`,
        victimAlias,
        crimeType,
        evidenceSummary,
        riskLevel: data.riskLevel || 'CRITICAL',
        recoveryStatus: 'EVIDENCE_LOCKED',
        reportCode: `CYBER-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleString()
      };

      onFileReport(newReport);
    } catch (err) {
      console.error('Cyber report error:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-400" />
            Encrypted Cyber Bullying, Blackmail & Extortion Recovery Desk
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immediate evidence hashing, perpetrator IP lockdown, platform takedown notices, and direct filing with Cyber Crime CID.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-teal-300">
          SHA-256 Evidence Vault Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incident Filing Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              File Anonymous Cyber Incident & Lock Evidence
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identity remains strictly confidential and encrypted
            </p>
          </div>

          <form onSubmit={handleAnalyzeAndSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Victim Anonymous Code / Alias:</label>
              <input
                type="text"
                placeholder="e.g. Shield_User_99"
                value={victimAlias}
                onChange={(e) => setVictimAlias(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Cyber Offense Type:</label>
              <select
                value={crimeType}
                onChange={(e: any) => setCrimeType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Blackmail & Extortion">Blackmail & Financial Extortion</option>
                <option value="Cyber Bullying">Cyber Bullying & Defamation</option>
                <option value="Account Hacking">Social Media Account Hacking</option>
                <option value="Deepfake Harassment">Deepfake Harassment & Manipulated Media</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Evidence Summary (Links, Phone Numbers, Messenger Handles):
              </label>
              <textarea
                rows={3}
                placeholder="Provide URLs, attacker phone numbers, or extortion message timestamps..."
                value={evidenceSummary}
                onChange={(e) => setEvidenceSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAiAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isAiAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Encrypting Vault & Generating Legal AI Brief...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Incident & Lock Evidence
                </>
              )}
            </button>
          </form>

          {/* AI Generated Legal Brief Preview */}
          {aiLegalBrief && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                AI Generated Cyber Crime Brief for Police Submission:
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                {aiLegalBrief}
              </pre>
            </div>
          )}
        </div>

        {/* Existing Cyber Reports */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100">Active Encrypted Cyber Incidents</h4>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              {reports.length} Incidents
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-400">{r.reportCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {r.riskLevel} RISK
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-semibold">{r.crimeType}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2">"{r.evidenceSummary}"</p>

                <div className="pt-2 border-t border-slate-800 text-[10px] flex items-center justify-between text-slate-400">
                  <span>Victim Alias: {r.victimAlias}</span>
                  <span className="font-mono text-emerald-400 font-bold">{r.recoveryStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
