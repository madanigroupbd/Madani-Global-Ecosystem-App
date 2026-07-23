import React from 'react';
import { ShieldCheck, Lock, UserCheck, ShieldAlert, Globe, Bell, MapPin, Sparkles } from 'lucide-react';
import { UserRole, AuthorityDivision } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  authorityDivision?: AuthorityDivision;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onOpenAuthModal: () => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  districts: string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  authorityDivision,
  selectedDistrict,
  onDistrictChange,
  onOpenAuthModal,
  notificationCount,
  onOpenNotifications,
  districts
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-amber-200 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                MADANI GLOBAL
              </h1>
              <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                ECOSYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Fintech • Zero-Profit Welfare • Commerce • Medical • Law Enforcement Cell
            </p>
          </div>
        </div>

        {/* Global Controls & Access Level */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* District Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">All 64 Districts</option>
              {districts.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">
                  {d} District
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Notifications & System Alerts"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {/* Role Status Badge / Auth Modal Trigger */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shadow-md ${
              currentRole === 'LAW_ENFORCEMENT_OFFICER'
                ? 'bg-rose-950/80 text-rose-300 border-rose-700/80 hover:bg-rose-900/90 shadow-rose-950/50'
                : currentRole === 'COOP_ADMIN'
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 hover:bg-amber-900/90 shadow-amber-950/50'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/90 shadow-emerald-950/50'
            }`}
          >
            {currentRole === 'LAW_ENFORCEMENT_OFFICER' ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Authority: {authorityDivision || 'CID/Police'}</span>
                <span className="sm:hidden">Authority</span>
              </>
            ) : currentRole === 'COOP_ADMIN' ? (
              <>
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Admin Mode</span>
                <span className="sm:hidden">Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Public User Mode</span>
                <span className="sm:hidden">User</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
