import React, { useState } from 'react';
import { FactoryProduct } from '../../types';
import { Factory, ShieldCheck, CheckCircle2, Package, Tag, ShoppingCart } from 'lucide-react';

interface FactoriesWingProps {
  products: FactoryProduct[];
}

export const FactoriesWing: React.FC<FactoriesWingProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [orderModalProduct, setOrderModalProduct] = useState<FactoryProduct | null>(null);
  const [orderQty, setOrderQty] = useState('100');
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ['ALL', 'Unani Laboratories', 'Candles', 'Pens & Stationeries', 'Energy Lights', 'Halal Food Products'];

  const filteredProducts = products.filter((p) =>
    selectedCategory === 'ALL' ? true : p.category === selectedCategory
  );

  const handlePlaceFactoryOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderPhone) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setOrderModalProduct(null);
      setOrderName('');
      setOrderPhone('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-400" />
            Madani Industrial & Factory Manufacturing Wing
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Unani laboratories, candle works, stationary pens, LED energy lights, and certified 100% Halal food processing units.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedCategory === c
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 bg-slate-950">
                <img src={p.image} alt={p.productName} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-emerald-950/90 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                  {p.batchNumber}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  {p.category}
                </span>
                <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{p.productName}</h4>

                <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span>BSTI / ISO Certification:</span>
                    <span className="text-emerald-400 font-semibold">{p.certification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Capacity:</span>
                    <span className="text-slate-200 font-mono">{p.productionCapacityPerDay.toLocaleString()} units/day</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Unit Wholesale Price:</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    ৳{p.unitPriceBDT} BDT
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => setOrderModalProduct(p)}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Place Wholesale / Factory Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Factory Order Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-slate-100">Factory Wholesale Order Intake</h4>
              <button
                onClick={() => setOrderModalProduct(null)}
                className="text-slate-400 hover:text-slate-100 text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-amber-300">{orderModalProduct.productName}</div>
              <div className="text-slate-400">Batch Code: {orderModalProduct.batchNumber}</div>
              <div className="text-emerald-400 font-mono font-bold">Unit Price: ৳{orderModalProduct.unitPriceBDT} BDT</div>
            </div>

            <form onSubmit={handlePlaceFactoryOrder} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Distributor / Buyer Name:</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number:</label>
                <input
                  type="text"
                  placeholder="+88017XXXXXXXX"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Order Quantity (Units):</label>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between font-bold">
                <span className="text-slate-400">Total Order Value:</span>
                <span className="text-emerald-400 font-mono">
                  ৳{(Number(orderQty || 0) * orderModalProduct.unitPriceBDT).toLocaleString()} BDT
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                {orderPlaced ? 'Factory Order Submitted Successfully!' : 'Confirm Factory Order'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
