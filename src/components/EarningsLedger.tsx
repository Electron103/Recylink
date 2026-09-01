import React, { useState } from 'react';
import {
  LanguageCode,
  CollectorProfile,
  LotItem
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import confetti from 'canvas-confetti';
import {
  Wallet,
  CheckCircle2,
  Clock,
  Leaf,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Download,
  Gift,
  AlertCircle
} from 'lucide-react';

interface EarningsLedgerProps {
  collector: CollectorProfile;
  lots: LotItem[];
  language: LanguageCode;
}

export const EarningsLedger: React.FC<EarningsLedgerProps> = ({
  collector,
  lots,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const completedLots = lots.filter(
    (l) => l.collectorId === collector.id && (l.status === 'PAID' || l.status === 'RECYCLED')
  );
  const pendingLots = lots.filter(
    (l) => l.collectorId === collector.id && l.status !== 'PAID' && l.status !== 'RECYCLED'
  );

  const totalPaid = completedLots.reduce((acc, curr) => acc + (curr.finalTotalValue || curr.estimatedTotalValue), 0);
  const totalPending = pendingLots.reduce((acc, curr) => acc + (curr.estimatedTotalValue || 0), 0);

  const rewardCatalog = [
    { id: 'R1', title: 'Heavy Puncture-Resistant Work Gloves', points: 150, icon: '🧤', desc: 'Protects from sharp copper wires and broken circuit board edges.' },
    { id: 'R2', title: 'Digital Pocket Luggage Scale (50 kg)', points: 250, icon: '⚖', desc: 'Pre-weigh collections on spot to verify fair transaction quantities.' },
    { id: 'R3', title: 'Steel-Toe Protective Safety Boots', points: 400, icon: '🥾', desc: 'Mandatory PPE for scrap handling yards.' },
    { id: 'R4', title: 'Priority Doorstep Van Pickup Pass', points: 100, icon: '🚚', desc: 'Guaranteed 2-hour pickup dispatch for bulky lots.' }
  ];

  const handleRedeem = (reward: typeof rewardCatalog[0]) => {
    if (collector.greenPoints >= reward.points) {
      confetti();
      alert(`🎉 Successfully redeemed "${reward.title}"! A voucher code has been sent via SMS to ${collector.phone}.`);
    } else {
      alert(`You need ${reward.points - collector.greenPoints} more Green Points to redeem this item.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Total Earnings Overview Card */}
      <div className="bento-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 shadow-xs">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
                Transparent Digital Ledger
              </span>
              <span className="text-xs text-slate-500 font-bold">Formal Payout Guarantee</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.collectorHome.actions.earningsTitle}</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Verified payouts directly credited via Instant UPI or spot cash receipts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 text-right shadow-2xs">
              <span className="text-[10px] uppercase font-black text-slate-500 block">Total Lifetime Earnings</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                ₹{(collector.totalEarnings || totalPaid).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payout Breakdown Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Completed Payouts</span>
            <span className="text-lg font-black text-emerald-800">₹{totalPaid.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Pending Settlement</span>
            <span className="text-lg font-black text-amber-700">₹{totalPending.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Green Points Earned</span>
            <span className="text-lg font-black text-emerald-800">{collector.greenPoints} Pts</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 font-black uppercase block">Trust Rating</span>
            <span className="text-lg font-black text-emerald-800">{collector.trustScore}/100</span>
          </div>
        </div>
      </div>

      {/* Green Points & Incentive Rewards Section */}
      <div className="bento-card rounded-3xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Gift className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Green Points & Formalization Rewards
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Earned for safe e-waste handover and zero open burning
              </span>
            </div>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black">
            Balance: {collector.greenPoints} Pts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rewardCatalog.map((reward) => (
            <div
              key={reward.id}
              className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div>
                <span className="text-2xl mb-2 block">{reward.icon}</span>
                <h4 className="font-black text-slate-900 text-xs leading-snug">{reward.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">{reward.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800">{reward.points} Pts</span>
                <button
                  onClick={() => handleRedeem(reward)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black transition active:scale-95 cursor-pointer shadow-xs"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 text-center font-medium">
          Note: Green Points reward catalog reflects prototype assumptions for SIH field demonstration.
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bento-card rounded-3xl p-6 shadow-xs border border-slate-200/80">
        <h3 className="text-sm font-black text-slate-900 mb-4">
          Detailed Transaction Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 border-b border-slate-200">
              <tr>
                <th className="pb-3 font-bold">Lot ID</th>
                <th className="pb-3 font-bold">Material</th>
                <th className="pb-3 font-bold">Weight</th>
                <th className="pb-3 font-bold">Recycler Partner</th>
                <th className="pb-3 font-bold">Amount</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {lots
                .filter((l) => l.collectorId === collector.id)
                .map((lot) => (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition font-medium">
                    <td className="py-3 font-mono font-black text-emerald-800">{lot.id}</td>
                    <td className="py-3 capitalize font-bold text-slate-900">{lot.materialCategory}</td>
                    <td className="py-3">{lot.actualWeightKg || lot.approximateWeightKg} kg</td>
                    <td className="py-3 text-slate-600">{lot.matchedRecyclerName}</td>
                    <td className="py-3 font-black text-slate-900">
                      ₹{(lot.finalTotalValue || lot.estimatedTotalValue).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          lot.status === 'PAID' || lot.status === 'RECYCLED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {lot.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
