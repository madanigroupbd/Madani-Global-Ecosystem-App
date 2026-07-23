import React from 'react';
import {
  Wallet,
  HeartHandshake,
  ShoppingBag,
  GraduationCap,
  ShieldCheck,
  Building2,
  PhoneCall,
  Sparkles,
  FileSpreadsheet,
  Car,
  BriefcaseMedical,
  Smartphone
} from 'lucide-react';

export type ActiveTab = 'fintech' | 'welfare' | 'commerce' | 'health_edu' | 'law_cyber' | 'srs_app';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isAuthorityUnlocked: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isAuthorityUnlocked }) => {
  const tabs = [
    {
      id: 'fintech' as ActiveTab,
      label: '1. Fintech & Telecom Hub',
      shortLabel: 'Fintech Hub',
      description: 'bKash/Nagad/Rocket API, Coop Ledger, Commission Payouts',
      icon: Wallet,
      badge: 'Zero Charge'
    },
    {
      id: 'welfare' as ActiveTab,
      label: '2. Zero-Profit Welfare & Construction',
      shortLabel: 'Welfare & Housing',
      description: 'Emergency Loans, Free Rod/Cement Projects, 64 Districts',
      icon: HeartHandshake,
      badge: 'Zero Profit'
    },
    {
      id: 'commerce' as ActiveTab,
      label: '3. Commerce, Factories & Showroom',
      shortLabel: 'Commerce & Factories',
      description: 'Car/Bike Showrooms, Unani/Food Factories, Packaging Generator',
      icon: ShoppingBag,
      badge: '3D/SVG Generator'
    },
    {
      id: 'health_edu' as ActiveTab,
      label: '4. Global Medical & Free Education',
      shortLabel: 'Medical & Education',
      description: 'Unani/Surgery Medical, India/China Tourism, Tafsir & Coding',
      icon: GraduationCap,
      badge: 'Free Hub'
    },
    {
      id: 'law_cyber' as ActiveTab,
      label: '5. Human Rights, Cyber & Encrypted Law Cell',
      shortLabel: 'Cyber & Law Cell',
      description: 'Legal Aid, Cyber Recovery, IMEI & CDR Triangulation, Mouja Map',
      icon: ShieldCheck,
      badge: isAuthorityUnlocked ? 'CELL UNLOCKED' : 'PIN PROTECTED',
      isSecured: true
    },
    {
      id: 'srs_app' as ActiveTab,
      label: '6. SRS Mobile App & Web Admin Studio',
      shortLabel: 'Mobile & Web Admin',
      description: 'Android & iOS Frame, OTP Auth, Payment Gateways, Recharts DAU',
      icon: Smartphone,
      badge: 'Full-Stack SRS'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-800 p-3 sm:p-4 shrink-0">
      <div className="mb-4 hidden lg:block px-2">
        <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
          SYSTEM NAVIGATION MODULES
        </p>
      </div>

      <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/80 text-emerald-200 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active glow indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-amber-400" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs sm:text-sm block leading-snug">
                      {tab.shortLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden lg:block line-clamp-1 mt-0.5">
                      {tab.description}
                    </span>
                  </div>
                </div>

                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    tab.isSecured
                      ? isAuthorityUnlocked
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Security Status Box */}
      <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800/80 hidden lg:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Zero-Profit & Encrypted Standard
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Madani Global Ecosystem strictly enforces zero-charge MFS, zero-interest loans, and encrypted law enforcement authentication.
        </p>
      </div>
    </aside>
  );
};
