import React, { useState } from 'react';
import { ShowroomCatalog } from './ShowroomCatalog';
import { FactoriesWing } from './FactoriesWing';
import { PackagingGenerator } from './PackagingGenerator';
import { VehicleItem, FactoryProduct } from '../../types';
import { Car, Factory, Sparkles } from 'lucide-react';

interface CommerceHubProps {
  vehicles: VehicleItem[];
  factoryProducts: FactoryProduct[];
}

export const CommerceHub: React.FC<CommerceHubProps> = ({ vehicles, factoryProducts }) => {
  const [subTab, setSubTab] = useState<'showrooms' | 'factories' | 'packaging'>('showrooms');

  return (
    <div className="space-y-6">
      
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('showrooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'showrooms'
              ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Car className="w-4 h-4 text-amber-400" />
          Car & Bike Showroom Catalog
        </button>

        <button
          onClick={() => setSubTab('factories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'factories'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Factory className="w-4 h-4 text-emerald-400" />
          Factories Wing (Unani, Food, Light)
        </button>

        <button
          onClick={() => setSubTab('packaging')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            subTab === 'packaging'
              ? 'bg-teal-950 border-teal-500 text-teal-300 shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          Instant Product Card & Packaging Generator
        </button>
      </div>

      {subTab === 'showrooms' && <ShowroomCatalog vehicles={vehicles} />}
      {subTab === 'factories' && <FactoriesWing products={factoryProducts} />}
      {subTab === 'packaging' && <PackagingGenerator />}

    </div>
  );
};
