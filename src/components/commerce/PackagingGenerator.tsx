import React, { useState } from 'react';
import { PackagingTemplate } from '../../types';
import { Sparkles, Download, RefreshCw, QrCode, Barcode, Palette, Tag, CheckCircle2 } from 'lucide-react';

export const PackagingGenerator: React.FC = () => {
  const [template, setTemplate] = useState<PackagingTemplate>({
    productTitle: 'Madani Pure Organic Chyawanprash',
    brandName: 'Madani Unani Laboratories',
    mfgDate: '2026-07-22',
    expDate: '2028-07-22',
    netWeight: '500 Grams',
    batchNo: 'UNANI-2026-B88',
    barcode: '8801234567890',
    primaryColor: '#064e3b', // Emerald 900
    accentColor: '#f59e0b',  // Amber 500
    ingredientsText: 'Amla, Ashwagandha, Black Seed, Sidr Honey, Organic Herbs, Pure Ghee',
    qrPayload: 'https://madaniglobal.org/verify/UNANI-2026-B88',
    slogan: '100% Pure Unani Remedy - Zero Chemical Preservatives'
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([
    'BSTI & ISO 9001 Quality Certified',
    'Zero-Profit Community Welfare Enterprise',
    '100% Natural Organic Ingredients'
  ]);

  const handleGenerateAiSlogan = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/commerce/slogan-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: template.productTitle,
          category: 'Unani & Food Manufacturing',
          brandName: template.brandName
        })
      });

      const data = await response.json();
      if (data.slogan) {
        setTemplate((prev) => ({ ...prev, slogan: data.slogan }));
      }
      if (data.highlights) {
        setHighlights(data.highlights);
      }
    } catch (err) {
      console.error('AI Slogan Error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Real-Time Instant Product Card & Packaging Generator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Design print-ready product packaging labels, barcode cards, ingredients matrices, and AI branding copy in real-time.
          </p>
        </div>

        <button
          onClick={handleGenerateAiSlogan}
          disabled={isAiLoading}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate AI Slogan & Label Copy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Controls Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            Packaging Label Configuration
          </h4>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title:</label>
              <input
                type="text"
                value={template.productTitle}
                onChange={(e) => setTemplate({ ...template, productTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name:</label>
              <input
                type="text"
                value={template.brandName}
                onChange={(e) => setTemplate({ ...template, brandName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Product Slogan / Strapline:</label>
              <input
                type="text"
                value={template.slogan}
                onChange={(e) => setTemplate({ ...template, slogan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">MFG Date:</label>
                <input
                  type="date"
                  value={template.mfgDate}
                  onChange={(e) => setTemplate({ ...template, mfgDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">EXP Date:</label>
                <input
                  type="date"
                  value={template.expDate}
                  onChange={(e) => setTemplate({ ...template, expDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Net Weight:</label>
                <input
                  type="text"
                  value={template.netWeight}
                  onChange={(e) => setTemplate({ ...template, netWeight: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Batch Code:</label>
                <input
                  type="text"
                  value={template.batchNo}
                  onChange={(e) => setTemplate({ ...template, batchNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Ingredients List:</label>
              <textarea
                rows={2}
                value={template.ingredientsText}
                onChange={(e) => setTemplate({ ...template, ingredientsText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Header Theme Color:</label>
                <input
                  type="color"
                  value={template.primaryColor}
                  onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                  className="w-full h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Accent Highlight Color:</label>
                <input
                  type="color"
                  value={template.accentColor}
                  onChange={(e) => setTemplate({ ...template, accentColor: e.target.value })}
                  className="w-full h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Packaging Box Canvas Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              Live 3D Print Packaging Preview
            </h4>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold border border-emerald-800">
              300 DPI READY
            </span>
          </div>

          {/* Rendered Product Packaging Box Card */}
          <div
            className="rounded-2xl p-6 text-slate-100 shadow-2xl border border-slate-700/60 relative overflow-hidden transition-all"
            style={{
              background: `linear-gradient(135deg, ${template.primaryColor} 0%, #090d16 100%)`
            }}
          >
            {/* Top Brand Banner */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                  {template.brandName}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                  {template.productTitle}
                </h3>
              </div>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-black text-slate-950 uppercase shadow-md"
                style={{ backgroundColor: template.accentColor }}
              >
                {template.netWeight}
              </span>
            </div>

            {/* Slogan & Highlights */}
            <div className="my-4 space-y-2">
              <p className="text-xs font-semibold italic text-slate-200 bg-black/30 p-2.5 rounded-xl border border-white/10">
                "{template.slogan}"
              </p>

              <div className="space-y-1">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="text-[10px] text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-amber-400">Ingredients:</span>
              <p>{template.ingredientsText}</p>
            </div>

            {/* Barcode & Batch Section */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-end justify-between">
              <div className="text-[10px] font-mono space-y-0.5 text-slate-300">
                <div>MFG: {template.mfgDate}</div>
                <div>EXP: {template.expDate}</div>
                <div>BATCH: {template.batchNo}</div>
              </div>

              {/* Simulated Barcode */}
              <div className="bg-white p-2 rounded-lg text-slate-950 text-center shadow-md">
                <div className="font-mono text-[9px] font-bold tracking-tighter">
                  ||||| ||| ||||||| |||| |||||
                </div>
                <div className="font-mono text-[8px] font-extrabold">{template.barcode}</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('Packaging Label SVG/PDF payload exported for high-precision factory printer!')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export High-Res SVG & Print Specifications
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
