import React, { useState } from 'react';
import {
  LanguageCode,
  CollectorProfile,
  LotItem,
  MaterialCategory
} from '../types';
import { MOCK_COLLECTORS, MATERIALS_CATALOG } from '../data/mockData';
import { apiService } from '../services/apiService';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  PlusCircle,
  Camera,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DigitalSaathiDashboardProps {
  language: LanguageCode;
  lots: LotItem[];
  onLotCreated: (lot: LotItem) => void;
}

export const DigitalSaathiDashboard: React.FC<DigitalSaathiDashboardProps> = ({
  language,
  lots,
  onLotCreated,
}) => {
  const [selectedCollector, setSelectedCollector] = useState<CollectorProfile>(MOCK_COLLECTORS[0]);
  const [isCreatingForCollector, setIsCreatingForCollector] = useState(false);
  const [category, setCategory] = useState<MaterialCategory>('pcb');
  const [weightKg, setWeightKg] = useState<number>(35);
  const [locationStr, setLocationStr] = useState('Dharavi Sector 3, Mumbai');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saathiIncentive = 8400; // ₹200 per lot aggregated
  const totalAssistedLots = lots.filter(l => l.saathiId === 'SAATHI-001' || l.collectorId === 'COL-001').length;

  const handleCreateAssistedLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const est = apiService.calculatePriceEstimate(category, weightKg, locationStr);
      const matches = apiService.findMatchingRecyclers(category, weightKg, 'Mumbai');
      const topRecycler = matches[0]?.recycler;

      const newLot = await apiService.createLot({
        collectorId: selectedCollector.id,
        collectorName: selectedCollector.name,
        collectorPhone: selectedCollector.phone,
        saathiId: 'SAATHI-001',
        materialCategory: category,
        subcategory: `${category.toUpperCase()} Assisted Scrap`,
        description: `Assisted lot created by Digital Saathi Sunita Sharma for ${selectedCollector.name}`,
        photoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        approximateWeightKg: weightKg,
        condition: 'non_working',
        sourceType: 'scrap_collection',
        location: locationStr,
        estimatedRatePerKg: est.unitPrice,
        estimatedTotalValue: est.estimatedTotal,
        matchedRecyclerId: topRecycler?.id || 'REC-001',
        matchedRecyclerName: topRecycler?.name || 'EcoShred Circular Solutions Ltd.',
        status: 'PICKUP_REQUESTED',
      });

      confetti();
      alert(`🎉 Assisted lot ${newLot.id} created for ${selectedCollector.name}! Recycler pickup dispatched.`);
      onLotCreated(newLot);
      setIsCreatingForCollector(false);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-sky-50 text-sky-900 border border-sky-200 flex items-center gap-1.5 shadow-2xs">
                <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                Digital Saathi Field Portal
              </span>
              <span className="text-xs text-slate-500 font-semibold">Community Bridge • Dharavi Hub</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sunita Sharma (Saathi #SS-104)</h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
              Empowering informal collectors without smartphones: real-time cataloging, fair optical weighing, and direct CPCB-authorized recycler bookings.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left sm:text-right shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Saathi Commission Earned</span>
            <span className="text-2xl font-black text-emerald-800">₹{saathiIncentive.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">₹200 per verified lot</span>
          </div>
        </div>

        {/* Quick Stats Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-200/80">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Active Beneficiaries</span>
            <span className="text-xl font-black text-slate-900">{MOCK_COLLECTORS.length} Collectors</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Assisted Lots Logged</span>
            <span className="text-xl font-black text-emerald-800">{totalAssistedLots} Lots</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Cluster Weight Handled</span>
            <span className="text-xl font-black text-emerald-800">1,840 kg</span>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Assigned Informal Collectors
        </h2>

        <button
          onClick={() => setIsCreatingForCollector(!isCreatingForCollector)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Lot on Behalf of Collector</span>
        </button>
      </div>

      {/* Assisted Lot Creation Form Modal / Card */}
      {isCreatingForCollector && (
        <form
          onSubmit={handleCreateAssistedLot}
          className="bento-card rounded-3xl p-6 border border-emerald-200 shadow-md space-y-4 animate-fadeIn"
        >
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Assisted Lot Registration for {selectedCollector.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">Select Collector:</label>
              <select
                value={selectedCollector.id}
                onChange={(e) => {
                  const col = MOCK_COLLECTORS.find((c) => c.id === e.target.value);
                  if (col) setSelectedCollector(col);
                }}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:border-emerald-600 outline-none shadow-2xs"
              >
                {MOCK_COLLECTORS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.operatingArea})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">Material Type:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:border-emerald-600 outline-none shadow-2xs"
              >
                {MATERIALS_CATALOG.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name.en} (₹{m.basePricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">Calibrated Weight (kg):</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-900 focus:border-emerald-600 outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">Depot / Handover Location:</label>
              <input
                type="text"
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-600 outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingForCollector(false)}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black shadow-md cursor-pointer transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Confirm Assisted Lot & Book Recycler'}
            </button>
          </div>
        </form>
      )}

      {/* Collector Profiles Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_COLLECTORS.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedCollector(c);
              setIsCreatingForCollector(true);
            }}
            className="bento-card rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-500 shadow-xs transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-emerald-800 font-black">{c.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-900 border border-emerald-200">
                  Trust: {c.trustScore}/100
                </span>
              </div>

              <h4 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition">{c.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{c.operatingArea}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Earnings</span>
                <span className="text-sm font-black text-emerald-800">₹{c.totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-200 transition shadow-2xs">
                + Create Lot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
