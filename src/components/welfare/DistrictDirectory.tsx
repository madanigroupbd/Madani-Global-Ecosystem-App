import React, { useState } from 'react';
import { MapPin, Phone, Ambulance, Search, ShieldAlert, Bus, UserCheck } from 'lucide-react';
import { DistrictService } from '../../types';

interface DistrictDirectoryProps {
  districtServices: DistrictService[];
  selectedDistrict: string;
  onDistrictSelect: (district: string) => void;
  districtsList: string[];
}

export const DistrictDirectory: React.FC<DistrictDirectoryProps> = ({
  districtServices,
  selectedDistrict,
  onDistrictSelect,
  districtsList
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = districtsList.filter((d) =>
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentService = districtServices.find(
    (s) => s.districtName.toLowerCase() === selectedDistrict.toLowerCase()
  ) || districtServices[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            64 Districts Free Transportation & Social Service Directory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            24/7 free emergency ambulance, relief distribution points, and social welfare helpline directory across all 64 districts of Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-amber-300">
          <Phone className="w-4 h-4 text-amber-400" />
          National Hotline: 16100 / 999
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District Selector & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100">64 Districts Filter</h4>
            <span className="text-xs font-mono text-emerald-400">{districtsList.length} Total</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {filteredDistricts.map((d) => (
              <button
                key={d}
                onClick={() => onDistrictSelect(d)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedDistrict.toLowerCase() === d.toLowerCase()
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{d} District</span>
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected District Details */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                {currentService.districtName} District Social Service Hub
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Division: <strong className="text-slate-200">{currentService.divisionName}</strong>
              </p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-extrabold text-xs px-3 py-1 rounded-xl">
              24/7 ACTIVE HUB
            </span>
          </div>

          {/* Emergency Helplines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <Ambulance className="w-4 h-4 text-rose-400" />
                Free Emergency Ambulance
              </div>
              <p className="text-sm font-mono font-bold text-slate-100">
                {currentService.freeAmbulancePhone}
              </p>
              <p className="text-[10px] text-slate-500">Zero cost transport for critical patients</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                District Relief & Emergency Line
              </div>
              <p className="text-sm font-mono font-bold text-slate-100">
                {currentService.emergencyHelpline}
              </p>
              <p className="text-[10px] text-slate-500">Flood, fire, and humanitarian emergency response</p>
            </div>
          </div>

          {/* Relief Center Address */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-teal-400 block">Madani Relief & Free Distribution Center:</span>
            <p className="text-xs text-slate-200">{currentService.reliefCenterAddress}</p>
          </div>

          {/* Transport Hubs */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Bus className="w-4 h-4 text-amber-400" />
              Free Transportation & Relief Bus Terminals:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentService.transportHubs.map((hub, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold">
                  • {hub}
                </div>
              ))}
            </div>
          </div>

          {/* Social Service Officers */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Assigned District Social Welfare Officers:
            </h5>
            <div className="space-y-1.5">
              {currentService.socialServiceOfficers.map((officer, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium flex items-center justify-between">
                  <span>{officer}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">ON DUTY</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
