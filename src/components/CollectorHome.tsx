import React, { useState } from 'react';
import {
  LanguageCode,
  CollectorProfile,
  LotItem,
  MaterialCategory
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { voiceService } from '../services/voiceService';
import {
  Camera,
  TrendingUp,
  Truck,
  PackageCheck,
  Wallet,
  Mic,
  Volume2,
  ShieldCheck,
  Leaf,
  ChevronRight,
  Sparkles,
  Award,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Flame,
  Clock,
  QrCode,
  Calculator,
  Plus,
  Minus,
  Check
} from 'lucide-react';

interface CollectorHomeProps {
  collector: CollectorProfile;
  lots: LotItem[];
  language: LanguageCode;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
}

export const CollectorHome: React.FC<CollectorHomeProps> = ({
  collector,
  lots,
  language,
  onNavigate,
  onOpenVoice,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quick Calculator state
  const [calcCategory, setCalcCategory] = useState<MaterialCategory>('pcb');
  const [calcWeight, setCalcWeight] = useState<number>(25);

  const activeLots = lots.filter(
    (l) => l.collectorId === collector.id && l.status !== 'RECYCLED'
  );
  const pendingPickup = lots.filter(
    (l) => l.collectorId === collector.id && (l.status === 'MATCHING' || l.status === 'PICKUP_REQUESTED' || l.status === 'PICKUP_SCHEDULED')
  );

  const handleSpeakGreeting = () => {
    setIsPlayingAudio(true);
    voiceService.playChime(true);
    const greetingText =
      language === 'hi'
        ? `नमस्ते ${collector.name}! आज आपके इलाके में पीसीबी का भाव ₹385 और तांबे के तार का भाव ₹530 प्रति किलो है। अधिकृत रीसाइक्लर को बेचकर 25% अधिक कमाई करें।`
        : language === 'mr'
        ? `नमस्कार ${collector.name}! आज आपल्या भागात पीसीबीचा भाव ₹385 आणि तांब्याच्या वायरचा भाव ₹530 प्रति किलो आहे. अधिकृत रिसायकलरला विकून २५% जास्त नफा मिळवा.`
        : `Namaste ${collector.name}! Today's PCB price is ₹385 and copper cable rate is ₹530 per kg in your area. Sell formally to earn 25% higher returns.`;
    
    voiceService.speak(greetingText, language);
    setTimeout(() => setIsPlayingAudio(false), 5500);
  };

  const getPricePerKg = (cat: MaterialCategory) => {
    switch (cat) {
      case 'pcb': return 385;
      case 'cables': return 530;
      case 'batteries': return 195;
      case 'crt': return 65;
      case 'lcd': return 120;
      case 'motors': return 210;
      case 'magnets': return 140;
      case 'mixed_plastics': return 80;
      default: return 250;
    }
  };

  const currentRate = getPricePerKg(calcCategory);
  const totalValuation = calcWeight * currentRate;
  const middlemanLoss = Math.round(totalValuation * 0.20);
  const greenPointsEarned = Math.round(calcWeight * 8);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Modern Hero Bento Card */}
      <div className="bento-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-slate-200/80 shadow-xs">
        {/* Subtle Decorative Gradient Orbs */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs">
                🇮🇳 {t.roles.collector}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>12-Day Safe Handover Streak</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {collector.id}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t.collectorHome.greeting}, {collector.name}
              </h1>

              {/* Speaker / Read-aloud button with visualizer */}
              <button
                onClick={handleSpeakGreeting}
                className={`p-2.5 rounded-2xl transition active:scale-95 shadow-xs cursor-pointer border flex items-center gap-2 ${
                  isPlayingAudio
                    ? 'bg-emerald-700 text-white border-emerald-600'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80'
                }`}
                title="Listen to daily summary in your language"
              >
                {isPlayingAudio ? (
                  <div className="flex items-center gap-0.5 h-4 px-1">
                    <span className="w-1 bg-white rounded-full animate-wave-1"></span>
                    <span className="w-1 bg-white rounded-full animate-wave-2"></span>
                    <span className="w-1 bg-white rounded-full animate-wave-3"></span>
                    <span className="w-1 bg-white rounded-full animate-wave-4"></span>
                    <span className="w-1 bg-white rounded-full animate-wave-5"></span>
                  </div>
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span className="text-[11px] font-black hidden sm:inline">
                  {isPlayingAudio ? 'बोल रहा है...' : 'सुनें / Audio'}
                </span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{collector.operatingArea}</span>
              <span className="text-slate-300">•</span>
              <span>{t.collectorHome.subGreeting}</span>
            </p>
          </div>

          {/* Gamified Trust Score & Green Points Dial */}
          <div className="flex items-center gap-3 self-start sm:self-center bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-black text-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{collector.trustScore}</span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mt-0.5">
                {t.collectorHome.trustScore}
              </span>
            </div>

            <div className="w-[1px] h-9 bg-slate-200"></div>

            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-sky-600 font-black text-xl">
                <Leaf className="w-5 h-5 text-sky-500" />
                <span>{collector.greenPoints}</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mt-0.5">
                {t.collectorHome.greenPoints}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Goal & Level Progress Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="font-black text-white">Daily Safe Collection Quota: 65 / 100 kg</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] border border-amber-400/30">
                +₹350 Milestone Bonus
              </span>
            </div>
            <span className="text-emerald-300 font-bold">65% Achieved</span>
          </div>
          <div className="w-full bg-emerald-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-emerald-700/50">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000 w-[65%]" />
          </div>
        </div>

        {/* Quick KPI Summary Strip */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-5 pt-4 border-t border-slate-200/80">
          <div
            onClick={() => onNavigate('lots')}
            className="bg-gradient-to-b from-white to-emerald-50/40 hover:to-emerald-100/50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-300 text-center cursor-pointer transition shadow-2xs group"
          >
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block group-hover:scale-105 transition transform">
              {activeLots.length}
            </span>
            <span className="text-[11px] text-slate-600 font-bold block mt-0.5">
              {t.collectorHome.activeLots}
            </span>
          </div>

          <div
            onClick={() => onNavigate('lots')}
            className="bg-gradient-to-b from-white to-amber-50/40 hover:to-amber-100/50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-amber-300 text-center cursor-pointer transition shadow-2xs group"
          >
            <span className="text-2xl sm:text-3xl font-black text-amber-600 block group-hover:scale-105 transition transform">
              {pendingPickup.length}
            </span>
            <span className="text-[11px] text-slate-600 font-bold block mt-0.5">
              {t.collectorHome.pendingPickup}
            </span>
          </div>

          <div
            onClick={() => onNavigate('earnings')}
            className="bg-gradient-to-b from-white to-sky-50/40 hover:to-sky-100/50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-sky-300 text-center cursor-pointer transition shadow-2xs group"
          >
            <span className="text-2xl sm:text-3xl font-black text-sky-700 block group-hover:scale-105 transition transform">
              ₹{(collector.totalEarnings || 88400).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-600 font-bold block mt-0.5">
              {t.collectorHome.monthEarnings}
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S HIGH-VALUE E-WASTE FLASH RATES (Interactive 1-Tap Sell Trigger) */}
      <div className="bento-card rounded-3xl p-5 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>{language === 'hi' ? 'आज के ताजा भाव (अधिकृत रीसाइक्लर)' : language === 'mr' ? 'आजचे ताजे दर (अधिकृत रिसायकलर)' : "Today's Verified Recycler Rates"}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">+25% over local</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('prices')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'hi' ? 'सभी दरें देखें' : language === 'mr' ? 'सर्व दर पहा' : 'View Full Board'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: PCB */}
          <div
            onClick={() => onNavigate('sell')}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'सर्किट बोर्ड (PCB)' : language === 'mr' ? 'सर्किट बोर्ड (PCB)' : 'Circuit PCB High-Grade'}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                ▲ +₹15
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-black text-emerald-800">₹385<span className="text-xs text-slate-400 font-normal">/kg</span></span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                {language === 'hi' ? 'बेचें' : language === 'mr' ? 'विका' : 'Sell'} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 2: Copper Cables */}
          <div
            onClick={() => onNavigate('sell')}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'तांबे के तार (Copper)' : language === 'mr' ? 'तांब्याची वायर (Copper)' : 'Copper Cables (Clean)'}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                ▲ +₹25
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-black text-emerald-800">₹530<span className="text-xs text-slate-400 font-normal">/kg</span></span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                {language === 'hi' ? 'बेचें' : language === 'mr' ? 'विका' : 'Sell'} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 3: Li-ion Battery */}
          <div
            onClick={() => onNavigate('sell')}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'लिथियम बैटरी (Li-ion)' : language === 'mr' ? 'लिथियम बॅटरी (Li-ion)' : 'Li-ion Batteries'}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                ▲ +₹10
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-black text-emerald-800">₹195<span className="text-xs text-slate-400 font-normal">/kg</span></span>
              <span className="text-[11px] font-bold text-emerald-700 group-hover:underline flex items-center gap-0.5">
                {language === 'hi' ? 'बेचें' : language === 'mr' ? 'विका' : 'Sell'} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INSTANT SCRAP VALUATION & CALCULATOR HUD (New Interactive Feature) */}
      <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs bg-gradient-to-b from-white to-slate-50/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {language === 'hi' ? 'त्वरित ई-कचरा मूल्य कैलकुलेटर' : language === 'mr' ? 'झटपट ई-कचरा मूल्य कॅल्क्युलेटर' : 'Instant E-Waste Valuation Estimator'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {language === 'hi' ? 'सामग्री और वजन चुनें, तुरंत सरकारी अधिकृत भाव जानें' : 'Calculate instant payouts & compare with informal dealer rates'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black">
            ₹{currentRate}/kg
          </span>
        </div>

        {/* Material Selection Chips */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
          {[
            { id: 'pcb', label: 'Motherboard PCB', rate: 385 },
            { id: 'cables', label: 'Copper Wire', rate: 530 },
            { id: 'batteries', label: 'Li-ion Battery', rate: 195 },
            { id: 'displays', label: 'CRT & Panels', rate: 85 },
            { id: 'mixed', label: 'Mixed E-Waste', rate: 160 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCalcCategory(item.id as MaterialCategory)}
              className={`p-2.5 rounded-2xl text-xs font-black transition cursor-pointer border text-center ${
                calcCategory === item.id
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="block truncate">{item.label}</span>
              <span className={`text-[10px] font-normal block ${calcCategory === item.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                ₹{item.rate}/kg
              </span>
            </button>
          ))}
        </div>

        {/* Weight Adjuster Slider & Counter */}
        <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Scrap Weight (kg):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalcWeight(Math.max(1, calcWeight - 5))}
                className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-black text-lg text-slate-900 min-w-[50px] text-center">
                {calcWeight} kg
              </span>
              <button
                onClick={() => setCalcWeight(calcWeight + 5)}
                className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="250"
            value={calcWeight}
            onChange={(e) => setCalcWeight(parseInt(e.target.value) || 1)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
            <span>5 kg</span>
            <span>50 kg</span>
            <span>100 kg</span>
            <span>250 kg</span>
          </div>
        </div>

        {/* Valuation Result Breakdown */}
        <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 block">
              Estimated Total Cash Payout
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                ₹{totalValuation.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-300 font-bold">
                (+₹{middlemanLoss} vs Middleman)
              </span>
            </div>
            <span className="text-[11px] text-emerald-200/80 font-medium">
              +{greenPointsEarned} Green Points • Zero Open Burning Certificate
            </span>
          </div>

          <button
            onClick={() => onNavigate('sell')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Create Lot at This Rate</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PRIMARY TACTILE BENTO ACTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. SELL MATERIAL (Flagship Glowing Emerald Hero Button) */}
        <button
          onClick={() => onNavigate('sell')}
          className="group text-left p-6 rounded-3xl hero-gradient-emerald text-white transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px] relative overflow-hidden"
        >
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30 group-hover:scale-105 transition transform">
              <Camera className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight block text-white">
                  {t.collectorHome.actions.sellTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                  AI Scan
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-emerald-100 block mt-1">
                {t.collectorHome.actions.sellSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center relative z-10 group-hover:translate-x-1 transition">
            <ChevronRight className="w-6 h-6 stroke-[3] text-white" />
          </div>
        </button>

        {/* 2. CHECK TODAY'S PRICE */}
        <button
          onClick={() => onNavigate('prices')}
          className="group text-left p-6 rounded-3xl bento-card hover:border-amber-300 transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block text-slate-900">
                {t.collectorHome.actions.priceTitle}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block mt-1">
                {t.collectorHome.actions.priceSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-amber-700 transition" />
          </div>
        </button>

        {/* 3. REQUEST PICKUP */}
        <button
          onClick={() => onNavigate('pickup')}
          className="group text-left p-6 rounded-3xl bento-card hover:border-emerald-300 transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition transform">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block text-slate-900">
                {t.collectorHome.actions.pickupTitle}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block mt-1">
                {t.collectorHome.actions.pickupSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-700 transition" />
          </div>
        </button>

        {/* 4. MY LOTS */}
        <button
          onClick={() => onNavigate('lots')}
          className="group text-left p-6 rounded-3xl bento-card hover:border-indigo-300 transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition transform">
              <PackageCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block text-slate-900">
                {t.collectorHome.actions.lotsTitle}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block mt-1">
                {t.collectorHome.actions.lotsSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-700 transition" />
          </div>
        </button>

        {/* 5. MY EARNINGS */}
        <button
          onClick={() => onNavigate('earnings')}
          className="group text-left p-6 rounded-3xl bento-card hover:border-sky-300 transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition transform">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block text-slate-900">
                {t.collectorHome.actions.earningsTitle}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block mt-1">
                {t.collectorHome.actions.earningsSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center transition">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-sky-700 transition" />
          </div>
        </button>

        {/* 6. HELP / VOICE AI (Voice Assistant Tile) */}
        <button
          onClick={onOpenVoice}
          className="group text-left p-6 rounded-3xl bento-card hover:border-purple-300 transition transform active:scale-98 cursor-pointer flex items-center justify-between min-h-[120px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition transform">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight block text-slate-900">
                {t.collectorHome.actions.voiceHelpTitle}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium block mt-1">
                {t.collectorHome.actions.voiceHelpSub}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-purple-700 transition" />
          </div>
        </button>
      </div>

      {/* Safety & Formalization Awareness Banner */}
      <div
        onClick={() => onNavigate('safety')}
        className="bento-card rounded-3xl p-5 border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 hover:border-amber-400 flex items-center justify-between cursor-pointer transition group shadow-2xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-950 flex items-center gap-2">
              <span>{t.safety.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200 text-amber-900 font-extrabold uppercase tracking-wide">
                EPR Guide
              </span>
            </div>
            <p className="text-xs text-amber-900/80 mt-1 font-medium">
              {language === 'hi'
                ? 'तारों को कभी न जलाएं • अधिकृत रीसाइक्लर से 25% ज्यादा रेट पाएं'
                : language === 'mr'
                ? 'तारा कधीही जाळू नका • अधिकृत रिसायकलरकडून २५% जास्त दर मिळवा'
                : 'Never burn cables • Get 25% higher rates through formal mechanized recovery'}
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-6 h-6 text-amber-700 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
      </div>
    </div>
  );
};

