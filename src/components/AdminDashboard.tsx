import React, { useState } from 'react';
import {
  LanguageCode,
  LotItem,
  RecyclerProfile
} from '../types';
import { MOCK_RECYCLERS, MOCK_COLLECTORS, MOCK_ANOMALIES, MOCK_PRICE_HISTORY } from '../data/mockData';
import { apiService } from '../services/apiService';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  MapPin,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  Calculator,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  language: LanguageCode;
  lots: LotItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  lots,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'map' | 'registry' | 'anomalies' | 'economics' | 'field_research'>('analytics');
  const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
  const [recyclers, setRecyclers] = useState<RecyclerProfile[]>(MOCK_RECYCLERS);

  // Dynamic & Editable National Governance Metrics State
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [baselineTons, setBaselineTons] = useState<number>(198.4);
  const [activeCollectorsCount, setActiveCollectorsCount] = useState<number>(384);
  const [formalConversionPercent, setFormalConversionPercent] = useState<number>(92.4);
  const [avgIncomeLiftPercent, setAvgIncomeLiftPercent] = useState<number>(34.8);
  const [annualEprTargetTons, setAnnualEprTargetTons] = useState<number>(250.0);

  // Economic Model interactive state
  const [calculatorWeight, setCalculatorWeight] = useState<number>(100);
  const [calculatorMaterial, setCalculatorMaterial] = useState<'pcb' | 'cables' | 'batteries'>('pcb');

  // Compute live lot metrics to add to baseline
  const dynamicLotWeightTons = +(lots.reduce((acc, l) => acc + (l.actualWeightKg || l.approximateWeightKg || 0), 0) / 1000).toFixed(2);
  const dynamicTotalValue = lots.reduce((acc, l) => acc + (l.finalPayoutValue || l.estimatedTotalValue || 0), 0);
  const totalFormalizedTons = +(baselineTons + dynamicLotWeightTons).toFixed(1);
  const completedLotsCount = lots.filter(l => l.status === 'COMPLETED').length;

  // Dynamic Material Mix calculated from lots + baseline
  const pcbCount = lots.filter(l => l.materialCategory === 'pcb').length;
  const cablesCount = lots.filter(l => l.materialCategory === 'cables').length;
  const batteriesCount = lots.filter(l => l.materialCategory === 'batteries').length;
  const otherCount = lots.filter(l => !['pcb', 'cables', 'batteries'].includes(l.materialCategory)).length;

  const totalLotItems = lots.length || 1;
  const materialPieData = [
    { name: 'PCBs & Boards', value: Math.round(40 + (pcbCount / totalLotItems) * 10), color: '#2d5a3f' },
    { name: 'Copper Cables', value: Math.round(28 + (cablesCount / totalLotItems) * 10), color: '#0d9488' },
    { name: 'Lithium Batteries', value: Math.round(16 + (batteriesCount / totalLotItems) * 5), color: '#b45309' },
    { name: 'CRT & Displays', value: 9, color: '#7c3aed' },
    { name: 'Mixed Plastics', value: Math.max(4, Math.round(7 + (otherCount / totalLotItems) * 5)), color: '#64748b' },
  ];

  const priceComparisonData = [
    { material: 'PCB (₹/kg)', informalMiddleman: 260, recylinkFormal: 385, gainPercent: '+48%' },
    { material: 'Copper Cable', informalMiddleman: 380, recylinkFormal: 530, gainPercent: '+39%' },
    { material: 'Batteries', informalMiddleman: 85, recylinkFormal: 145, gainPercent: '+70%' },
    { material: 'CRT Units', informalMiddleman: 30, recylinkFormal: 55, gainPercent: '+83%' },
  ];

  const monthlyCollectionData = [
    { month: 'Jan', tons: 14.2 },
    { month: 'Feb', tons: 19.5 },
    { month: 'Mar', tons: 24.8 },
    { month: 'Apr', tons: 32.1 },
    { month: 'May', tons: 45.4 },
    { month: 'Current (Live)', tons: totalFormalizedTons },
  ];

  const handleResolveAnomaly = async (anomalyId: string) => {
    try {
      const res = await apiService.reviewAnomaly(anomalyId, 'REVISED_OK');
      setAnomalies(anomalies.map((a) => (a.id === anomalyId ? { ...a, status: 'RESOLVED' } : a)));
      alert(`Anomaly ${anomalyId} marked as RESOLVED by compliance officer.`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleToggleRecyclerStatus = (recyclerId: string) => {
    setRecyclers(
      recyclers.map((r) => {
        if (r.id === recyclerId) {
          const nextStatus = r.authorizationStatus === 'VERIFIED' ? 'SUSPENDED' : 'VERIFIED';
          return { ...r, authorizationStatus: nextStatus };
        }
        return r;
      })
    );
  };

  // Unit Economics Formula
  const baseRates = { pcb: 385, cables: 530, batteries: 145 };
  const middlemanRates = { pcb: 260, cables: 380, batteries: 85 };
  const formalPayout = calculatorWeight * baseRates[calculatorMaterial];
  const informalPayout = calculatorWeight * middlemanRates[calculatorMaterial];
  const collectorExtraIncome = formalPayout - informalPayout;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bento-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 shadow-xs">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                CPCB & SIH Governance Monitor
              </span>
              <span className="text-xs text-slate-500 font-bold">National E-Waste Traceability & Formalization Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Central Oversight Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
              Real-time monitoring of informal sector integration, CPCB EPR quota allocation, and end-to-end custody audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingMetrics(!isEditingMetrics)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>⚙️ Calibrate Metrics</span>
            </button>

            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 text-right shadow-2xs">
              <span className="text-[10px] text-slate-500 font-black uppercase block">Formal Chain Conversion</span>
              <span className="text-2xl font-black text-emerald-800">{formalConversionPercent}%</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Zero Open Burning</span>
            </div>
          </div>
        </div>

        {/* Metric Calibration Modal / Panel */}
        {isEditingMetrics && (
          <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-emerald-300/80 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                ✏️ Customize Live Governance & Target Baselines
              </h4>
              <button
                onClick={() => setIsEditingMetrics(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Adjust regional baseline data to dynamically simulate national scaling, EPR quotas, and worker registration targets:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Baseline Tons</label>
                <input
                  type="number"
                  value={baselineTons}
                  onChange={(e) => setBaselineTons(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Registered Collectors</label>
                <input
                  type="number"
                  value={activeCollectorsCount}
                  onChange={(e) => setActiveCollectorsCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Formal Conversion %</label>
                <input
                  type="number"
                  value={formalConversionPercent}
                  onChange={(e) => setFormalConversionPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Worker Income Lift %</label>
                <input
                  type="number"
                  value={avgIncomeLiftPercent}
                  onChange={(e) => setAvgIncomeLiftPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Annual EPR Target (T)</label>
                <input
                  type="number"
                  value={annualEprTargetTons}
                  onChange={(e) => setAnnualEprTargetTons(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* National Metrics Strip (Fully Dynamic & Responsive to Live Lots) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Formalized E-Waste</span>
            <span className="text-xl font-black text-emerald-800">{totalFormalizedTons} MT</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              +{dynamicLotWeightTons} MT live collections
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Active Digital Saathis</span>
            <span className="text-xl font-black text-slate-900">{activeCollectorsCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Across 8 industrial clusters
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Avg Worker Income Lift</span>
            <span className="text-xl font-black text-emerald-800">+{avgIncomeLiftPercent}%</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              vs middleman commissions
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">EPR Annual Target</span>
            <span className="text-xl font-black text-teal-800">
              {((totalFormalizedTons / annualEprTargetTons) * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {totalFormalizedTons} / {annualEprTargetTons} MT target
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: 'analytics', label: 'EPR & Material Analytics', icon: TrendingUp },
          { id: 'map', label: 'Geospatial Cluster Map', icon: MapPin },
          { id: 'registry', label: 'Recycler Registry', icon: ShieldCheck },
          { id: 'anomalies', label: `Anomalies (${anomalies.filter(a => a.status === 'FLAGGED').length})`, icon: AlertTriangle },
          { id: 'economics', label: 'Unit Economics Model', icon: Calculator },
          { id: 'field_research', label: 'Field Research Database', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer active:scale-95 shadow-2xs ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Realization: Informal Middleman vs RecyLink Formal */}
            <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 mb-1">
                Informal Middleman vs RecyLink Formal Payout (₹/kg)
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                Demonstrating direct value restoration to grassroot collectors by eliminating predatory layers.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="material" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="informalMiddleman" name="Informal Middleman Rate" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="recylinkFormal" name="RecyLink Formal Rate" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Material Mix Pie Chart */}
            <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 mb-1">
                E-Waste Material Category Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">
                Distribution of formalized recovery lots across high-value fractions.
              </p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {materialPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e0d4', borderRadius: '12px', fontSize: '12px', color: '#2d2d2a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Diversion Growth */}
          <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#2d2d2a] mb-1">
              Monthly E-Waste Volume Formally Channeled (Tons)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Rapid escalation as Digital Saathi hubs expand across informal scrap clusters.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e0d4" />
                  <XAxis dataKey="month" stroke="#78716c" fontSize={11} />
                  <YAxis stroke="#78716c" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e0d4', borderRadius: '12px', fontSize: '12px', color: '#2d2d2a' }}
                  />
                  <Line type="monotone" dataKey="tons" stroke="#2d5a3f" strokeWidth={3} dot={{ r: 4, fill: '#2d5a3f' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GEOSPATIAL CLUSTER MAP */}
      {activeTab === 'map' && (
        <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2d5a3f]" />
                National Informal-to-Formal Geospatial Network
              </h3>
              <p className="text-xs text-stone-500">
                Interactive mapping of informal scrap collection zones, Digital Saathi facilitation nodes, and CPCB-licensed recycling facilities.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#e8f5ec] text-[#234e36] text-xs font-bold border border-[#badfca]">
              Active Hubs: Mumbai, Pune, Delhi NCR
            </span>
          </div>

          {/* Stylized Visual Geospatial Canvas */}
          <div className="relative w-full h-96 bg-[#f5f5f0] rounded-2xl border border-[#e2e0d4] p-6 overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>

            {/* Hub Nodes */}
            <div className="relative w-full max-w-2xl h-full flex items-center justify-around">
              {/* Node 1: Dharavi Scrap Zone */}
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#e8f5ec] border-2 border-[#2d5a3f] flex items-center justify-center text-[#234e36] font-bold text-xs shadow-md">
                  Zone A
                </div>
                <span className="text-xs font-bold text-[#2d2d2a] mt-2">Dharavi Sector 3</span>
                <span className="text-[10px] text-[#2d5a3f] font-semibold">142 Informal Collectors</span>
                <span className="text-[9px] text-stone-500">Saathi: Sunita Sharma</span>
              </div>

              {/* Transit Line */}
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#2d5a3f] via-[#b45309] to-[#2d5a3f] relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#234e36] bg-[#ffffff] px-1 rounded border border-[#badfca]">
                  Van Route #12
                </span>
              </div>

              {/* Node 2: Seelampur Aggregation Hub */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#fef3c7] border-2 border-[#b45309] flex items-center justify-center text-[#92400e] font-bold text-xs shadow-md">
                  Zone B
                </div>
                <span className="text-xs font-bold text-[#2d2d2a] mt-2">Seelampur Scrap Mkt</span>
                <span className="text-[10px] text-[#b45309] font-semibold">89 Informal Collectors</span>
                <span className="text-[9px] text-stone-500">Saathi: Amit Verma</span>
              </div>

              {/* Transit Line */}
              <div className="h-0.5 w-24 bg-gradient-to-r from-[#b45309] to-[#2d5a3f] relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-[#92400e] bg-[#ffffff] px-1 rounded border border-[#fde68a]">
                  EPR Logistics
                </span>
              </div>

              {/* Node 3: EcoShred Recycler Facility */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#e8f5ec] border-2 border-[#2d5a3f] flex items-center justify-center text-[#234e36] font-bold text-xs shadow-md">
                  Facility
                </div>
                <span className="text-xs font-bold text-[#2d2d2a] mt-2">EcoShred Circular Ltd.</span>
                <span className="text-[10px] text-[#2d5a3f] font-semibold">CPCB Lic: #MH-0924</span>
                <span className="text-[9px] text-stone-500">Cap: 15,000 MT/yr</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECYCLER REGISTRY */}
      {activeTab === 'registry' && (
        <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#2d2d2a]">
            CPCB Authorized Recycling Facilities Registry
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-stone-500 border-b border-[#e2e0d4]">
                <tr>
                  <th className="pb-3 font-semibold">Facility Name</th>
                  <th className="pb-3 font-semibold">CPCB License</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Annual Cap (MT)</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e0d4] text-stone-800">
                {recyclers.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f5f5f0] transition">
                    <td className="py-3 font-bold text-[#2d2d2a]">{r.name}</td>
                    <td className="py-3 font-mono text-[#2d5a3f] font-bold">{r.cpcbRegistrationNo}</td>
                    <td className="py-3">{r.facilityLocation}</td>
                    <td className="py-3 font-semibold">{r.annualCapacityTons.toLocaleString()} MT</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          r.authorizationStatus === 'VERIFIED'
                            ? 'bg-[#e8f5ec] text-[#234e36] border border-[#badfca]'
                            : 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]'
                        }`}
                      >
                        {r.authorizationStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleRecyclerStatus(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#f5f5f0] hover:bg-stone-200 border border-[#e2e0d4] text-stone-700 text-xs font-semibold cursor-pointer"
                      >
                        {r.authorizationStatus === 'VERIFIED' ? 'Suspend' : 'Reinstate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ANOMALIES & AUDIT */}
      {activeTab === 'anomalies' && (
        <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#b45309]" />
            AI Anomaly & Fraud Audit Center
          </h3>
          <p className="text-xs text-stone-500">
            Automatically detects suspicious weight variances, repeated price deviations, and route anomalies.
          </p>

          <div className="space-y-3">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-4 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#b45309]">{anom.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                      Lot: {anom.lotId}
                    </span>
                    <span className="text-xs text-stone-500">Confidence: {anom.aiConfidence}%</span>
                  </div>
                  <h4 className="font-bold text-[#2d2d2a] text-sm mt-1">{anom.reason}</h4>
                  <p className="text-xs text-stone-600 mt-0.5">{anom.description}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {anom.status === 'FLAGGED' ? (
                    <button
                      onClick={() => handleResolveAnomaly(anom.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#2d5a3f] hover:bg-[#234832] text-white font-bold text-xs shadow-sm cursor-pointer transition active:scale-95"
                    >
                      Resolve & Verify
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#2d5a3f] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: UNIT ECONOMICS CALCULATOR */}
      {activeTab === 'economics' && (
        <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#2d5a3f]" />
              Interactive Formalization Unit Economics Simulator
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Demonstrates how bypassing 3-tier informal middlemen redirects capital directly into the hands of grassroot kabadiwalas.
            </p>
          </div>

          {/* Interactive Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f5f5f0] p-5 rounded-2xl border border-[#e2e0d4]">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Scrap Batch Weight (kg):</label>
              <input
                type="number"
                value={calculatorWeight}
                onChange={(e) => setCalculatorWeight(parseFloat(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl bg-[#ffffff] border border-[#e2e0d4] text-sm font-bold text-[#2d2d2a] focus:border-[#2d5a3f] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Select Material:</label>
              <select
                value={calculatorMaterial}
                onChange={(e) => setCalculatorMaterial(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#ffffff] border border-[#e2e0d4] text-xs font-bold text-[#2d2d2a] focus:border-[#2d5a3f] outline-none"
              >
                <option value="pcb">Printed Circuit Boards (PCB)</option>
                <option value="cables">Insulated Copper Wires</option>
                <option value="batteries">Lithium Laptop/Phone Batteries</option>
              </select>
            </div>
          </div>

          {/* Economics Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#fecaca]">
              <span className="text-[10px] text-[#b91c1c] font-bold uppercase block">Informal Middleman Payout</span>
              <span className="text-2xl font-black text-[#b91c1c]">₹{informalPayout.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-stone-500 block mt-1">
                Middleman keeps ~35-45% margin and burns cable PVC.
              </span>
            </div>

            <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#badfca]">
              <span className="text-[10px] text-[#234e36] font-bold uppercase block">RecyLink Formal Payout</span>
              <span className="text-2xl font-black text-[#2d5a3f]">₹{formalPayout.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-stone-500 block mt-1">
                Direct verified bank / UPI transfer with calibrated scale.
              </span>
            </div>

            <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#badfca]">
              <span className="text-[10px] text-[#234e36] font-bold uppercase block">Direct Extra Income to Collector</span>
              <span className="text-2xl font-black text-[#2d5a3f]">+₹{collectorExtraIncome.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-[#234e36] font-bold block mt-1">
                +{( (collectorExtraIncome / informalPayout) * 100 ).toFixed(1)}% Income Surge
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FIELD RESEARCH DATABASE */}
      {activeTab === 'field_research' && (
        <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2d5a3f]" />
            Field Research & Ethnographic Interview Database
          </h3>
          <p className="text-xs text-stone-500">
            Insights gathered from 120+ informal collectors across Mumbai (Dharavi), Delhi (Seelampur), and Pune.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] text-xs">
              <div className="font-bold text-[#234e36] mb-1">Key Barrier #1: Weighing Scale Fraud</div>
              <p className="text-stone-700">
                Informal scrap buyers traditionally use tampered spring balances cutting 15-20% of the actual scrap weight. RecyLink certified digital scales provide irrefutable trust.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] text-xs">
              <div className="font-bold text-[#92400e] mb-1">Key Barrier #2: Illiteracy & Complex Apps</div>
              <p className="text-stone-700">
                Informal workers cannot navigate dense English forms. The voice-first assistant in Hindi/Marathi and Digital Saathi aggregation bridge enables 100% adoption without digital barriers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] text-xs">
              <div className="font-bold text-[#234e36] mb-1">Key Barrier #3: Open Burning of Cables</div>
              <p className="text-stone-700">
                Informal burning of wires to extract copper creates severe respiratory illness. RecyLink pays 25% higher for unburned whole cables to economically incentivize mechanical stripping.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] text-xs">
              <div className="font-bold text-stone-700 mb-1">Key Barrier #4: Delayed Middleman Credit</div>
              <p className="text-stone-700">
                Informal aggregators delay payments by weeks. RecyLink instant UPI and spot cash escrow settlements guarantee immediate liquidity on physical handover.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
