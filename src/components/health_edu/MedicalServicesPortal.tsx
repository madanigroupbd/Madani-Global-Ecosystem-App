import React, { useState } from 'react';
import { BriefcaseMedical, HeartPulse, Stethoscope, Calendar, CheckCircle2, User, Send } from 'lucide-react';
import { MedicalAppointment, MedicalCareType } from '../../types';

interface MedicalServicesPortalProps {
  selectedDistrict: string;
}

export const MedicalServicesPortal: React.FC<MedicalServicesPortalProps> = ({ selectedDistrict }) => {
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([
    { id: 'med-01', patientName: 'Shahidul Islam', phone: '+8801711223344', district: 'Dhaka', careType: 'Unani Herbal Care', symptoms: 'Chronic joint pain and digestive distress', doctorAssigned: 'Hakim Dr. M. A. Jabbar (Unani Master)', appointmentDate: '2026-07-23', status: 'CONFIRMED' },
    { id: 'med-02', patientName: 'Rokeya Begum', phone: '+8801822334455', district: 'Sylhet', careType: 'Emergency Surgery', symptoms: 'Appendicitis acute pain', doctorAssigned: 'Dr. Shahabuddin Ahmed (Surgeon)', appointmentDate: '2026-07-22', status: 'IN_CONSULTATION' }
  ]);

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState(selectedDistrict !== 'ALL' ? selectedDistrict : 'Dhaka');
  const [careType, setCareType] = useState<MedicalCareType>('Unani Herbal Care');
  const [symptoms, setSymptoms] = useState('');

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone || !symptoms) return;

    const newAppt: MedicalAppointment = {
      id: `med-${Date.now()}`,
      patientName,
      phone,
      district,
      careType,
      symptoms,
      doctorAssigned: careType === 'Unani Herbal Care' ? 'Hakim Prof. Ruhul Amin' : 'Dr. M. K. Alam (Consultant Physician)',
      appointmentDate: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED'
    };

    setAppointments([newAppt, ...appointments]);
    setPatientName('');
    setPhone('');
    setSymptoms('');
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BriefcaseMedical className="w-5 h-5 text-rose-400" />
            Free Medical Care, Emergency Surgery & Unani Telemedicine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Free consultations for authentic Unani herbal therapy, emergency surgery allocations, and allopathic medical care.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-400 font-bold">
          <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
          Zero Consultation Fee Certified
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointment Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              Book Free Doctor / Surgery Appointment
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant appointment scheduling with specialist Hakims & Surgeons
            </p>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Patient Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Phone:</label>
                <input
                  type="text"
                  placeholder="+88017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">District:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Care Category:</label>
              <select
                value={careType}
                onChange={(e: any) => setCareType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Unani Herbal Care">Unani Herbal & Holistic Care</option>
                <option value="Emergency Surgery">Emergency Free Surgery Booking</option>
                <option value="Allopathic Consultation">Allopathic Specialist Doctor</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Symptoms / Medical Details:</label>
              <textarea
                rows={2}
                placeholder="Describe your illness or surgery requirement..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Confirm Free Doctor Booking
            </button>
          </form>
        </div>

        {/* Confirmed Appointments List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                Scheduled Medical Appointments Queue
              </h4>
              <p className="text-xs text-slate-400">Verified doctor consultations and surgery schedules</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              {appointments.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{a.patientName}</h5>
                    <p className="text-xs text-slate-400">
                      Phone: {a.phone} • District: <strong className="text-amber-400">{a.district}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                    {a.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Medical Doctor:</span>
                    <span className="font-bold text-emerald-400">{a.doctorAssigned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Care Type:</span>
                    <span className="font-semibold text-slate-300">{a.careType}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Symptoms: "{a.symptoms}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
