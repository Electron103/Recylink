import React, { useState, useEffect } from 'react';
import {
  LanguageCode,
  LotItem,
  CollectorProfile,
  LotStatus
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import QRCode from 'qrcode';
import {
  Package,
  QrCode,
  KeyRound,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

interface MyLotsViewProps {
  collector: CollectorProfile;
  lots: LotItem[];
  language: LanguageCode;
  onSelectLotForPickup?: (lot: LotItem) => void;
}

export const MyLotsView: React.FC<MyLotsViewProps> = ({
  collector,
  lots,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(null);
  const [showQrModal, setShowQrModal] = useState<LotItem | null>(null);
  const [showTraceModal, setShowTraceModal] = useState<LotItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const myLots = lots.filter(
    (l) => l.collectorId === collector.id || l.collectorPhone === collector.phone
  );

  const filteredLots = myLots.filter((lot) => {
    if (filterStatus === 'active') return lot.status !== 'RECYCLED';
    if (filterStatus === 'completed') return lot.status === 'RECYCLED' || lot.status === 'PAID';
    return true;
  });

  useEffect(() => {
    if (showQrModal) {
      const qrPayload = JSON.stringify({
        lotId: showQrModal.id,
        collector: showQrModal.collectorName,
        material: showQrModal.materialCategory,
        weight: showQrModal.approximateWeightKg,
        otp: showQrModal.otpCode,
        recycler: showQrModal.matchedRecyclerName,
      });

      QRCode.toDataURL(qrPayload, {
        width: 250,
        margin: 2,
        color: {
          dark: '#022c22',
          light: '#ffffff',
        },
      }).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [showQrModal]);

  const getStatusBadge = (status: LotStatus) => {
    switch (status) {
      case 'CREATED':
        return { label: 'Lot Created', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'MATCHING':
        return { label: 'Recycler Matching', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
      case 'PICKUP_REQUESTED':
        return { label: 'Pickup Requested', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'PICKUP_SCHEDULED':
        return { label: 'Pickup Scheduled', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'PICKED_UP':
        return { label: 'Material Picked Up', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'HANDOVER_VERIFIED':
        return { label: 'Handover Verified ✓', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'PAID':
        return { label: 'Paid & Settled ₹', color: 'bg-[#e8f5ec] text-[#234e36] border-[#badfca]' };
      case 'RECYCLED':
        return { label: 'Formally Recycled ♻', color: 'bg-[#2d5a3f] text-white font-extrabold' };
    }
  };

  const stepsList: { key: LotStatus; label: string }[] = [
    { key: 'CREATED', label: 'Created' },
    { key: 'PICKUP_REQUESTED', label: 'Pickup Requested' },
    { key: 'PICKUP_SCHEDULED', label: 'Scheduled' },
    { key: 'HANDOVER_VERIFIED', label: 'Handover' },
    { key: 'PAID', label: 'Paid' },
    { key: 'RECYCLED', label: 'Recycled' },
  ];

  const getStepIndex = (status: LotStatus) => {
    switch (status) {
      case 'CREATED':
      case 'MATCHING':
        return 0;
      case 'PICKUP_REQUESTED':
        return 1;
      case 'PICKUP_SCHEDULED':
      case 'PICKED_UP':
        return 2;
      case 'HANDOVER_VERIFIED':
        return 3;
      case 'PAID':
        return 4;
      case 'RECYCLED':
        return 5;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Filter */}
      <div className="bento-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
                CPCB Batch Ledger
              </span>
              <span className="text-xs text-slate-500 font-bold">
                100% Escrow Traceable
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.collectorHome.actions.lotsTitle}</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Complete end-to-end digital traceability of all physical scrap collections
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              All Lots ({myLots.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                filterStatus === 'active'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Active Lots
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Recycled / Paid
            </button>
          </div>
        </div>
      </div>

      {/* Lots List */}
      {filteredLots.length === 0 ? (
        <div className="bento-card rounded-3xl p-12 text-center text-slate-500 shadow-xs border border-slate-200/80">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-700" />
          <h3 className="text-base font-black text-slate-900 mb-1">No lots found</h3>
          <p className="text-xs font-medium">You can create a new lot by clicking "Sell Material".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLots.map((lot) => {
            const badge = getStatusBadge(lot.status);
            const currentStepIdx = getStepIndex(lot.status);

            return (
              <div
                key={lot.id}
                className="bento-card rounded-3xl p-5 shadow-xs transition hover:border-emerald-300 group border border-slate-200/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={lot.photoUrl}
                      alt={lot.materialCategory}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition transform"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-emerald-800">
                          {lot.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5 capitalize">
                        {lot.approximateWeightKg} kg • {lot.materialCategory.toUpperCase()}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                        {lot.location} • Matched: {lot.matchedRecyclerName}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500 block font-medium">
                        {lot.finalTotalValue ? 'Final Paid Amount' : 'Estimated Value'}
                      </span>
                      <span className="text-xl font-black text-emerald-800">
                        ₹{(lot.finalTotalValue || lot.estimatedTotalValue).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Show QR Button */}
                      <button
                        onClick={() => setShowQrModal(lot)}
                        className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-2xs cursor-pointer"
                        title="Show Handover QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* View Traceability Modal */}
                      <button
                        onClick={() => setShowTraceModal(lot)}
                        className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black transition cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Traceability</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Handover OTP Pill (For low-tech validation) */}
                <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 my-3 bg-[#f5f5f0] rounded-2xl border border-[#e2e0d4] text-xs">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#b45309]" />
                    <span className="text-stone-600">Physical Handover Verification Code:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-[#b45309] text-sm tracking-widest bg-[#fef3c7] px-2 py-0.5 rounded border border-[#fde68a]">
                      {lot.otpCode}
                    </span>
                    <span className="text-[10px] text-stone-500">(Share with driver during pickup)</span>
                  </div>
                </div>

                {/* Status Progression Stepper */}
                <div className="pt-2">
                  <div className="grid grid-cols-6 gap-1">
                    {stepsList.map((step, idx) => {
                      const isPast = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="text-center">
                          <div
                            className={`h-1.5 rounded-full mb-1.5 transition ${
                              isPast ? 'bg-[#2d5a3f]' : 'bg-[#e2e0d4]'
                            } ${isCurrent ? 'animate-pulse ring-2 ring-[#2d5a3f]/40' : ''}`}
                          ></div>
                          <span
                            className={`text-[9px] font-bold block truncate ${
                              isPast ? 'text-[#234e36]' : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR CODE HANDOVER MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center relative text-[#2d2d2a]">
            <button
              onClick={() => setShowQrModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-[#edece4] text-stone-600 border border-[#e2e0d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-extrabold text-[#2d2d2a] mb-1">Handover QR Code</h3>
            <p className="text-xs text-stone-500 mb-4">
              Recycler pickup driver will scan this QR at your location
            </p>

            {/* QR Code Canvas Output */}
            <div className="p-4 bg-[#f5f5f0] rounded-2xl inline-block shadow-sm mb-4 border border-[#e2e0d4]">
              {qrDataUrl && <img src={qrDataUrl} alt="Lot QR" className="w-48 h-48 mx-auto" />}
            </div>

            <div className="bg-[#f5f5f0] p-3 rounded-2xl border border-[#e2e0d4] text-xs text-left mb-4">
              <div className="font-mono text-[#2d5a3f] font-bold mb-1">{showQrModal.id}</div>
              <div className="text-stone-800 font-medium">
                {showQrModal.approximateWeightKg} kg {showQrModal.materialCategory.toUpperCase()}
              </div>
              <div className="text-stone-500 text-[11px]">
                Assigned Recycler: {showQrModal.matchedRecyclerName}
              </div>
            </div>

            <div className="p-3 bg-[#fef3c7] border border-[#fde68a] rounded-xl text-[#92400e] text-xs font-bold">
              Backup OTP: {showQrModal.otpCode}
            </div>
          </div>
        </div>
      )}

      {/* TRACEABILITY IMMUTABLE LIFECYCLE MODAL */}
      {showTraceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto text-[#2d2d2a]">
            <button
              onClick={() => setShowTraceModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-[#edece4] text-stone-600 border border-[#e2e0d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#e8f5ec] text-[#234e36] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2d2d2a]">
                  Formal Chain of Custody & Traceability
                </h3>
                <span className="font-mono text-xs text-[#2d5a3f]">{showTraceModal.id}</span>
              </div>
            </div>

            <div className="space-y-4 my-6">
              {showTraceModal.traceability.map((event, idx) => (
                <div key={event.id || idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#e8f5ec] border border-[#badfca] flex items-center justify-center text-[#234e36] text-xs font-bold">
                      {idx + 1}
                    </div>
                    {idx < showTraceModal.traceability.length - 1 && (
                      <div className="w-0.5 h-12 bg-[#e2e0d4] my-1"></div>
                    )}
                  </div>

                  <div className="flex-1 bg-[#f5f5f0] p-4 rounded-2xl border border-[#e2e0d4]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#2d2d2a] uppercase tracking-wider">
                        {event.stage.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 font-medium mb-1">
                      Actor: <span className="text-[#2d5a3f] font-bold">{event.actorName}</span> ({event.actorRole})
                    </div>

                    <p className="text-xs text-stone-600">{event.notes}</p>

                    {event.location && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-2">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-[#f5f5f0] border border-[#e2e0d4] text-[11px] text-stone-600 text-center">
              All events are cryptographically recorded to meet CPCB EPR E-Waste compliance guidelines.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
