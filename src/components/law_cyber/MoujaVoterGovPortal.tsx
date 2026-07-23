import React, { useState } from 'react';
import { MoujaPlotRecord, VoterRecord, GovPortalLink } from '../../types';
import { Map, Users, ExternalLink, Search, CheckCircle2, Layers, Building } from 'lucide-react';

interface MoujaVoterGovPortalProps {
  moujaPlots: MoujaPlotRecord[];
  voterRecords: VoterRecord[];
  govLinks: GovPortalLink[];
}

export const MoujaVoterGovPortal: React.FC<MoujaVoterGovPortalProps> = ({
  moujaPlots,
  voterRecords,
  govLinks
}) => {
  const [subTab, setSubTab] = useState<'mouja' | 'voter' | 'gov'>('mouja');

  // Mouja Search
  const [moujaQuery, setMoujaQuery] = useState('');
  const [selectedPlot, setSelectedPlot] = useState<MoujaPlotRecord | null>(moujaPlots[0] || null);

  // Voter Search
  const [voterQuery, setVoterQuery] = useState('');
  const [voterResult, setVoterResult] = useState<VoterRecord | null>(voterRecords[0] || null);

  const filteredMouja = moujaPlots.filter(
    (m) =>
      m.moujaName.toLowerCase().includes(moujaQuery.toLowerCase()) ||
      m.plotNumber.includes(moujaQuery) ||
      m.district.toLowerCase().includes(moujaQuery.toLowerCase())
  );

  const handleSearchVoter = () => {
    const found = voterRecords.find(
      (v) => v.nid === voterQuery || v.voterId === voterQuery || v.name.toLowerCase().includes(voterQuery.toLowerCase())
    );
    setVoterResult(found || null);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('mouja')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'mouja'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4 h-4 text-amber-400" />
          64 Districts Mouja Land Plot Map Viewer
        </button>

        <button
          onClick={() => setSubTab('voter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'voter'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          Voter Information & NID Search
        </button>

        <button
          onClick={() => setSubTab('gov')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'gov'
              ? 'bg-teal-950 border-teal-500 text-teal-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-teal-400" />
          Government Online Service Links
        </button>
      </div>

      {/* Sub-tab 1: Mouja Map Viewer */}
      {subTab === 'mouja' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Mouja Land Search Filter
            </h4>

            <div className="relative">
              <input
                type="text"
                placeholder="Search Plot #, Mouja, or District..."
                value={moujaQuery}
                onChange={(e) => setMoujaQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredMouja.map((plot) => (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedPlot?.id === plot.id
                      ? 'bg-amber-950 border-amber-500 text-slate-100'
                      : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-amber-400">Plot #{plot.plotNumber}</span>
                    <span className="text-slate-400">{plot.district}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">{plot.moujaName} (JL #{plot.jlNumber})</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Interactive Mouja Cadastral Map Canvas
            </h4>

            {selectedPlot ? (
              <div className="space-y-4">
                {/* Cadastral Map Graphic Simulation */}
                <div className="w-full h-56 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
                  <div className="p-6 bg-amber-950/40 border-2 border-amber-500/80 rounded-2xl text-center space-y-1 relative z-10 shadow-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                      CADASTRAL PLOT #{selectedPlot.plotNumber}
                    </span>
                    <h5 className="font-bold text-base text-slate-100">{selectedPlot.moujaName}</h5>
                    <p className="text-xs text-slate-300">
                      Upazila: {selectedPlot.upazila} • JL #{selectedPlot.jlNumber} • Khatian: {selectedPlot.khatianNo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Land Owner:</span>
                    <strong className="text-slate-100">{selectedPlot.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Area (Decimal):</span>
                    <strong className="text-emerald-400 font-mono">{selectedPlot.landAreaDecimal} Decimal</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <strong className="text-amber-400">{selectedPlot.landCategory}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">Select a Mouja plot to view Cadastral map details.</p>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Voter Search */}
      {subTab === 'voter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Voter & NID Verification Lookup
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">NID, Voter ID, or Full Name:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voterQuery}
                    onChange={(e) => setVoterQuery(e.target.value)}
                    placeholder="Enter NID or Voter ID"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                  <button
                    onClick={handleSearchVoter}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Verified Voter Record
            </h4>

            {voterResult ? (
              <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs text-slate-200">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Voter ID:</span>
                  <span className="font-mono font-bold text-emerald-400">{voterResult.voterId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">National ID (NID):</span>
                  <span className="font-mono font-bold text-slate-100">{voterResult.nid}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Full Name:</span>
                  <span className="font-bold text-amber-300">{voterResult.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date of Birth:</span>
                  <span>{voterResult.dob}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Voting Center:</span>
                  <span className="font-semibold text-slate-100">{voterResult.votingCenter} ({voterResult.district})</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">No matching voter record found.</p>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Government Portal Links */}
      {subTab === 'gov' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            Direct Government Online Portal Quick Links
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {govLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/80 rounded-xl transition-all space-y-2 block group"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {link.title}
                  </h5>
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{link.description}</p>
                <span className="text-[10px] font-mono text-teal-400 block pt-1">{link.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
