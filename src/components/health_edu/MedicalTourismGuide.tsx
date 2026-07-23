import React, { useState } from 'react';
import { HealthTourismDestination } from '../../types';
import { Globe, Plane, ShieldCheck, FileCheck, PhoneCall, DollarSign, CheckCircle2 } from 'lucide-react';

interface MedicalTourismGuideProps {
  destinations: HealthTourismDestination[];
}

export const MedicalTourismGuide: React.FC<MedicalTourismGuideProps> = ({ destinations }) => {
  const [selectedCountry, setSelectedCountry] = useState<'India' | 'China'>('India');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [medicalSummary, setMedicalSummary] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activeDestinations = destinations.filter((d) => d.country === selectedCountry);

  const handleApplyTourism = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPatientName('');
      setPatientPhone('');
      setMedicalSummary('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            India & China Medical Treatment Tourism & Visa Fast-Track Portal
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Official Madani Global MOU partner hospitals in Chennai, New Delhi, Beijing, and Guangzhou for organ transplants, cancer therapy, and complex surgeries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCountry('India')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              selectedCountry === 'India'
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🇮🇳 India Medical Tourism
          </button>
          <button
            onClick={() => setSelectedCountry('China')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              selectedCountry === 'China'
                ? 'bg-rose-950 border-rose-500 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🇨🇳 China Medical Tourism
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Destination Information */}
        <div className="lg:col-span-2 space-y-4">
          {activeDestinations.map((dest) => (
            <div key={dest.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-100">{dest.hospitalName}</h4>
                  <p className="text-xs text-slate-400">
                    City Location: <strong className="text-amber-400">{dest.locationCity}</strong>
                  </p>
                </div>
                <span className="bg-emerald-950 text-emerald-300 font-bold text-xs px-3 py-1 rounded-xl border border-emerald-800">
                  {dest.mouPartnerStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Specialty Wings:</span>
                  <p className="font-bold text-slate-200">{dest.specialty}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Estimated Treatment Cost:</span>
                  <p className="font-mono text-emerald-400 font-extrabold text-sm">
                    ${dest.estimatedCostUSD.toLocaleString()} USD (~৳{ (dest.estimatedCostUSD * 120).toLocaleString() } BDT)
                  </p>
                </div>
              </div>

              {/* Visa Checklist */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Required Medical Visa Guidance & Document Checklist:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dest.visaRequirements.map((req, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  Medical Tourism Desk Helpline:
                </span>
                <span className="font-mono font-bold text-amber-300">{dest.helplinePhone}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form for Visa & Treatment Assistance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plane className="w-4 h-4 text-emerald-400" />
              Apply for Fast-Track Medical Visa & Hospital Invitation
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit patient diagnostic reports for hospital invitation letter
            </p>
          </div>

          <form onSubmit={handleApplyTourism} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Patient Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone:</label>
              <input
                type="text"
                placeholder="+88017XXXXXXXX"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Diagnostic Summary / Condition:</label>
              <textarea
                rows={3}
                placeholder="Brief summary of illness and required surgery..."
                value={medicalSummary}
                onChange={(e) => setMedicalSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {submitted ? 'Fast-Track Invitation File Generated!' : 'Request Hospital Invitation & Visa Support'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
