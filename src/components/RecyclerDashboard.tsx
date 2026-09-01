import React, { useState } from 'react';
import {
  LanguageCode,
  LotItem,
  RecyclerProfile
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { apiService } from '../services/apiService';
import confetti from 'canvas-confetti';
import {
  Factory,
  Truck,
  CheckCircle2,
  QrCode,
  Scale,
  CreditCard,
  FileText,
  ShieldCheck,
  MapPin,
  Clock,
  KeyRound,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';

interface RecyclerDashboardProps {
  language: LanguageCode;
  lots: LotItem[];
  onLotUpdated: (updatedLot: LotItem) => void;
}

export const RecyclerDashboard: React.FC<RecyclerDashboardProps> = ({
  language,
  lots,
  onLotUpdated,
}) => {
  const [selectedLot, setSelectedLot] = useState<LotItem | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [calibratedWeight, setCalibratedWeight] = useState<number>(40);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessingSettlement, setIsProcessingSettlement] = useState(false);

  const recyclerLots = lots;
  const pendingPickups = recyclerLots.filter(
    (l) => l.status === 'MATCHING' || l.status === 'PICKUP_REQUESTED' || l.status === 'PICKUP_SCHEDULED'
  );
  const inVerification = recyclerLots.filter(
    (l) => l.status === 'PICKED_UP' || l.status === 'HANDOVER_VERIFIED'
  );
  const completedLots = recyclerLots.filter(
    (l) => l.status === 'PAID' || l.status === 'RECYCLED'
  );

  const handleSchedulePickup = async (lot: LotItem) => {
    try {
      const updated = await apiService.updateLot(
        lot.id,
        { status: 'PICKUP_SCHEDULED' },
        {
          stage: 'PICKUP_SCHEDULED',
          actorRole: 'RECYCLER',
          actorName: 'EcoShred Dispatch Desk',
          location: 'EcoShred MIDC Logistics Hub',
          notes: 'Driver Ramesh Yadav dispatched with GPS-tracked vehicle MH-04-AB-2940',
          verificationMethod: 'SYSTEM',
        }
      );
      onLotUpdated(updated);
      alert(`🚚 Driver dispatched for lot ${lot.id}!`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleVerifyHandover = async (lot: LotItem) => {
    if (enteredOtp && enteredOtp !== lot.otpCode) {
      alert(`Invalid OTP! The collector's OTP is ${lot.otpCode}`);
      return;
    }

    setIsVerifying(true);
    try {
      const finalVal = Math.round(calibratedWeight * (lot.estimatedRatePerKg || 385));
      const updated = await apiService.updateLot(
        lot.id,
        {
          status: 'HANDOVER_VERIFIED',
          actualWeightKg: calibratedWeight,
          finalTotalValue: finalVal,
        },
        {
          stage: 'HANDOVER_VERIFIED',
          actorRole: 'RECYCLER',
          actorName: 'Driver Ramesh Yadav',
          location: lot.location,
          notes: `Certified Scale Handover Verified: ${calibratedWeight} kg (Expected: ${lot.approximateWeightKg} kg). OTP: ${lot.otpCode} authenticated.`,
          verificationMethod: 'OTP',
        }
      );
      onLotUpdated(updated);
      setSelectedLot(updated);
      alert(`✅ Handover verified! Calibrated weight: ${calibratedWeight} kg. Final value: ₹${finalVal}`);
    } catch (e: any) {
      alert('Verification error: ' + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSettlePayment = async (lot: LotItem) => {
    setIsProcessingSettlement(true);
    try {
      const updated = await apiService.updateLot(
        lot.id,
        {
          status: 'PAID',
          paymentStatus: 'PAID',
        },
        {
          stage: 'PAID',
          actorRole: 'RECYCLER',
          actorName: 'EcoShred Automated Escrow',
          location: 'EcoShred Treasury',
          notes: `Instant UPI payout of ₹${lot.finalTotalValue || lot.estimatedTotalValue} credited to collector account.`,
          verificationMethod: 'SYSTEM',
        }
      );
      onLotUpdated(updated);
      setSelectedLot(updated);
      confetti();
      alert(`💳 Instant UPI payout of ₹${lot.finalTotalValue || lot.estimatedTotalValue} sent to ${lot.collectorName}!`);
    } catch (e: any) {
      alert('Payment error: ' + e.message);
    } finally {
      setIsProcessingSettlement(false);
    }
  };

  const handleMarkRecycled = async (lot: LotItem) => {
    try {
      const updated = await apiService.updateLot(
        lot.id,
        {
          status: 'RECYCLED',
        },
        {
          stage: 'RECYCLED',
          actorRole: 'RECYCLER',
          actorName: 'EcoShred Circular Facility',
          location: 'EcoShred Navi Mumbai Smelter Plant',
          notes: 'Lot processed via CPCB-compliant automated shredding & hydrometallurgical extraction. Certificate EPR-MH-2026-9942 generated.',
          verificationMethod: 'SYSTEM',
        }
      );
      onLotUpdated(updated);
      setSelectedLot(updated);
      confetti();
      alert(`♻️ Lot ${lot.id} successfully processed! EPR Recycling certificate issued to CPCB portal.`);
    } catch (e: any) {
      alert('Recycling update error: ' + e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Recycler Header */}
      <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <Factory className="w-3.5 h-3.5 text-emerald-700" />
                Authorized Recycler Operations Desk
              </span>
              <span className="text-xs text-slate-500 font-semibold">License: CPCB/EPR/2026/MH-0924</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">EcoShred Circular Solutions Ltd.</h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Navi Mumbai Industrial Cluster • Mechanical granulator shredding & hydrometallurgical copper/gold extraction
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left sm:text-right shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Monthly Processed Scrap</span>
            <span className="text-2xl font-black text-emerald-800">42.8 Tons</span>
            <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">100% CPCB Traceable</span>
          </div>
        </div>

        {/* Pipeline Counter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-200/80">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Pending Pickup / Dispatch</span>
            <span className="text-xl font-black text-amber-800">{pendingPickups.length} Lots</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Under Verification</span>
            <span className="text-xl font-black text-sky-800">{inVerification.length} Lots</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-black uppercase block">Completed & Recycled</span>
            <span className="text-xl font-black text-emerald-800">{completedLots.length} Lots</span>
          </div>
        </div>
      </div>

      {/* Main Recycler Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Incoming Lot Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            Active Collection Batches
          </h3>

          {lots.map((lot) => {
            const isSelected = selectedLot?.id === lot.id;

            return (
              <div
                key={lot.id}
                onClick={() => {
                  setSelectedLot(lot);
                  setCalibratedWeight(lot.actualWeightKg || lot.approximateWeightKg);
                  setEnteredOtp(lot.otpCode);
                }}
                className={`p-5 rounded-3xl border transition cursor-pointer bento-card ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={lot.photoUrl}
                      alt="Lot"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-emerald-800">{lot.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                          {lot.status}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5 capitalize">
                        {lot.collectorName} • {lot.approximateWeightKg} kg {lot.materialCategory}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{lot.location}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-emerald-800 block">
                      ₹{(lot.finalTotalValue || lot.estimatedTotalValue).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Rate: ₹{lot.estimatedRatePerKg}/kg
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons per stage */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                  {lot.status === 'MATCHING' || lot.status === 'PICKUP_REQUESTED' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchedulePickup(lot);
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Schedule Driver Van
                    </button>
                  ) : lot.status === 'PICKUP_SCHEDULED' ? (
                    <span className="text-xs text-amber-800 font-black flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 animate-bounce text-amber-600" /> Driver En Route (OTP: {lot.otpCode})
                    </span>
                  ) : lot.status === 'HANDOVER_VERIFIED' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSettlePayment(lot);
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Settle Instant UPI Payout
                    </button>
                  ) : lot.status === 'PAID' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRecycled(lot);
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      Issue EPR Recycling Certificate
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-800 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Formally Recycled & Certified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Physical Handover & Digital Scale Verification Station */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            Handover & Scale Station
          </h3>

          {selectedLot ? (
            <div className="bento-card rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-200/80">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Selected Lot</span>
                <span className="font-mono font-black text-emerald-800 text-base">{selectedLot.id}</span>
                <span className="text-xs text-slate-800 font-bold block mt-0.5">{selectedLot.collectorName} ({selectedLot.collectorPhone})</span>
              </div>

              {/* 1. Enter / Scan OTP */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Collector Handover OTP:
                </label>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 582914"
                    className="flex-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-black text-amber-800 outline-none focus:border-emerald-600 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Calibrated Scale Final Weight */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Certified Scale Weight (kg):
                </label>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <input
                    type="number"
                    value={calibratedWeight}
                    onChange={(e) => setCalibratedWeight(parseFloat(e.target.value) || 1)}
                    className="flex-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-emerald-800 outline-none focus:border-emerald-600 shadow-2xs"
                  />
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Expected: {selectedLot.approximateWeightKg} kg • Rate: ₹{selectedLot.estimatedRatePerKg}/kg
                </span>
              </div>

              {/* Calculated Payable */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-black block">Calculated Net Payable</span>
                <span className="text-2xl font-black text-emerald-800">
                  ₹{Math.round(calibratedWeight * (selectedLot.estimatedRatePerKg || 385)).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleVerifyHandover(selectedLot)}
                  disabled={isVerifying}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Authenticate OTP & Lock Final Weight'}
                </button>

                <button
                  onClick={() => handleSettlePayment(selectedLot)}
                  disabled={isProcessingSettlement || selectedLot.status !== 'HANDOVER_VERIFIED'}
                  className="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200 transition active:scale-95 cursor-pointer disabled:opacity-40 shadow-2xs"
                >
                  {isProcessingSettlement ? 'Initiating UPI...' : 'Release Instant UPI Payment'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bento-card rounded-3xl p-8 text-center text-slate-400 text-xs shadow-xs border border-slate-200/80">
              Select any collection batch on the left to verify weight and authorize payment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
