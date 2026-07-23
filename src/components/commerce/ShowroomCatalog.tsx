import React, { useState } from 'react';
import { Car, Bike, Truck, CheckCircle2, Search, Calendar, ShieldCheck, DollarSign, Eye } from 'lucide-react';
import { VehicleItem } from '../../types';

interface ShowroomCatalogProps {
  vehicles: VehicleItem[];
}

export const ShowroomCatalog: React.FC<ShowroomCatalogProps> = ({ vehicles }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CAR' | 'BIKE' | 'COMMERCIAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [testDriveBooked, setTestDriveBooked] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesType = filterType === 'ALL' || v.type === filterType;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.showroomLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleBookTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookPhone) return;
    setTestDriveBooked(true);
    setTimeout(() => {
      setTestDriveBooked(false);
      setSelectedVehicle(null);
      setBookName('');
      setBookPhone('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            Madani Global Showrooms & Vehicle Inventory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Electric cars, executive sedans, motorcycles, and heavy commercial vehicles with zero-markup installment options.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'CAR', 'BIKE', 'COMMERCIAL'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                filterType === t
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-800/60 uppercase">
                  {v.type}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{v.name}</h4>
                <p className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{v.brand}</span>
                  <span className="font-mono text-slate-300">{v.fuelType}</span>
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Price (BDT):</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-400">
                    ৳{v.priceBDT.toLocaleString()}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 line-clamp-1">
                  📍 {v.showroomLocation}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedVehicle(v)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                View Specs & Test Drive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Detail & Test Drive Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-base text-slate-100">{selectedVehicle.name}</h4>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-slate-100 text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full h-48 object-cover rounded-xl" />

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Brand:</span>
                <span className="font-semibold text-slate-200">{selectedVehicle.brand}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fuel / Power:</span>
                <span className="font-semibold text-slate-200">{selectedVehicle.fuelType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Engine Capacity:</span>
                <span className="font-semibold text-slate-200">{selectedVehicle.engineCc ? `${selectedVehicle.engineCc} cc` : 'Electric Motor'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Showroom:</span>
                <span className="font-semibold text-amber-400">{selectedVehicle.showroomLocation}</span>
              </div>
            </div>

            {/* Test Drive Form */}
            <form onSubmit={handleBookTestDrive} className="space-y-3 pt-2">
              <h5 className="text-xs font-bold text-slate-300">Book Free Test Drive / Reservation:</h5>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                {testDriveBooked ? 'Test Drive Reservation Confirmed!' : 'Confirm Free Test Drive Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
