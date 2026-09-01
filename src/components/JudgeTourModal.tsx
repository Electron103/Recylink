import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Play,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Factory,
  Building2,
  Mic,
  QrCode,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToView: (view: string, role?: any) => void;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToView,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: '1. The Problem: India’s Informal E-Waste Ecosystem',
      category: 'Context & Vision',
      view: 'home',
      role: 'COLLECTOR',
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      description:
        'Over 90% of India’s 3.2+ million tons of annual e-waste is processed informally through hazardous acid baths and open-air cable burning. RecyLink bridges informal waste pickers (kabadiwalas) directly into the formal CPCB-authorized recycling chain.',
      keyFeature: 'Formalization without displacement: Empowers existing workers with 30-40% higher income.',
    },
    {
      title: '2. High-Contrast Accessible Collector Home',
      category: 'Inclusion & UI Craft',
      view: 'home',
      role: 'COLLECTOR',
      icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
      description:
        'Designed specifically for low-literacy informal workers. Features large tactile buttons, clear pictorial iconography, read-aloud spoken audio summaries, and zero confusing nested menus.',
      keyFeature: 'One-touch voice triggers, trust score indicators, and daily rate speech in native dialects.',
    },
    {
      title: '3. Multilingual Support: Hindi, Marathi & English',
      category: 'Accessibility',
      view: 'home',
      role: 'COLLECTOR',
      icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
      description:
        'Language is the biggest barrier in tech adoption. RecyLink provides instant native interface translations and audio speech synthesis in Hindi, Marathi, and English.',
      keyFeature: 'Cultural alignment for Tier 1 to Tier 3 scrap worker communities across Maharashtra and North India.',
    },
    {
      title: '4. Gemini AI Multimodal Voice Assistant',
      category: 'AI Capabilities',
      view: 'home',
      role: 'COLLECTOR',
      icon: <Mic className="w-6 h-6 text-emerald-400" />,
      description:
        'Informal collectors can simply speak in conversational Hindi or Marathi: "Mere paas 40 kilo PCB hai". Gemini AI parses the voice, extracts structured intent, category, and weight, and pre-populates the selling flow.',
      keyFeature: 'Server-side Gemini AI parsing with natural audio spoken confirmations.',
    },
    {
      title: '5. AI Computer Vision Material Classifier',
      category: 'AI Capabilities',
      view: 'sell',
      role: 'COLLECTOR',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      description:
        'Collectors upload a photo or snap a picture of scrap. Gemini classifies the circuit boards, insulated cables, or battery packs with confidence scores and immediate safety hazard warnings.',
      keyFeature: 'Zero manual categorization required; prevents misclassification and dangerous processing.',
    },
    {
      title: '6. Calibrated Weight & Condition Check',
      category: 'Accuracy & Fair Trade',
      view: 'sell',
      role: 'COLLECTOR',
      icon: <Layers className="w-6 h-6 text-teal-400" />,
      description:
        'Rapid stepper allows collectors to declare quantity (e.g. 40 kg), component condition (working, damaged, mixed), and source (households, scrap yards).',
      keyFeature: 'Eliminates predatory weight tampering traditionally committed by informal middle aggregators.',
    },
    {
      title: '7. Dynamic Live Benchmark Price Board',
      category: 'Market Transparency',
      view: 'prices',
      role: 'COLLECTOR',
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      description:
        'Displays real-time transparent buying rates across cities (Mumbai, Pune, Delhi NCR). Includes historical 30-day price trend charts and verbal speech readouts.',
      keyFeature: 'Guarantees transparent daily market indices so informal workers know their scrap value.',
    },
    {
      title: '8. Automated Recycler Matching Engine',
      category: 'Smart Logistics',
      view: 'sell',
      role: 'COLLECTOR',
      icon: <Factory className="w-6 h-6 text-teal-400" />,
      description:
        'Calculates fair price estimates and matches the lot with certified recyclers (e.g. EcoShred Circular Ltd.) ranked by authorization, bid price, logistics capacity, and distance.',
      keyFeature: 'Algorithmic multi-factor weighted routing maximizes net return for the collector.',
    },
    {
      title: '9. Immutable Digital Lot ID & QR Code',
      category: 'Traceability',
      view: 'lots',
      role: 'COLLECTOR',
      icon: <QrCode className="w-6 h-6 text-emerald-400" />,
      description:
        'Every created batch generates a unique cryptographic ID (e.g., LOT-IND-2026-000124) with a scannable QR code and tamper-proof metadata.',
      keyFeature: 'Serves as the immutable root of custody for CPCB Extended Producer Responsibility (EPR) credits.',
    },
    {
      title: '10. Dual-Auth Handover: 6-Digit OTP Code',
      category: 'Security & Inclusion',
      view: 'lots',
      role: 'COLLECTOR',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      description:
        'For collectors without active cameras, a high-contrast 6-digit OTP code (e.g. 582914) provides seamless dual-authentication during physical vehicle handover.',
      keyFeature: 'Guarantees zero material diversion or fraudulent pickup claims.',
    },
    {
      title: '11. Feature Phone IVR & Missed Call Simulator',
      category: 'Zero Internet Access',
      view: 'home',
      role: 'COLLECTOR',
      icon: <Mic className="w-6 h-6 text-purple-400" />,
      description:
        '1800-RECYLINK interactive telephone simulation. Collectors with basic ₹1,000 keypad phones can dial in, listen to Hindi voice menus, check rates, and book pickups via SMS.',
      keyFeature: 'Ensures absolute 100% reach even in deep rural and un-digitized urban slum clusters.',
    },
    {
      title: '12. Digital Saathi Community Model',
      category: 'Social Empowerment',
      view: 'saathi',
      role: 'SAATHI',
      icon: <UserCheck className="w-6 h-6 text-cyan-400" />,
      description:
        'Empowers community leads (Sunita Sharma) with smartphones to act as local hubs. Saathis create assisted lots for non-smartphone collectors and earn ₹200 incentive commission per verified lot.',
      keyFeature: 'Grassroots employment generation and trusted community adoption bridge.',
    },
    {
      title: '13. Recycler Portal: Dispatch & Van Scheduling',
      category: 'Enterprise Recycling',
      view: 'recycler',
      role: 'RECYCLER',
      icon: <Factory className="w-6 h-6 text-amber-400" />,
      description:
        'EcoShred Operations Desk monitors incoming batch requests, schedules GPS-tracked pickup vans, and optimizes scrap routing.',
      keyFeature: 'Consolidated commercial logistics with verified municipal route manifests.',
    },
    {
      title: '14. On-Spot Certified Scale Handover Station',
      category: 'Recycler Handover',
      view: 'recycler',
      role: 'RECYCLER',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      description:
        'Recycler driver authenticates OTP/QR, weighs the lot on certified digital scales (adjusting e.g. 40 kg -> 39.5 kg), and locks the verified payable value.',
      keyFeature: 'Fair, transparent calibration with real-time recalculation of net proceeds.',
    },
    {
      title: '15. Instant Digital UPI Payout Settlement',
      category: 'Fintech & Escrow',
      view: 'earnings',
      role: 'COLLECTOR',
      icon: <Award className="w-6 h-6 text-teal-300" />,
      description:
        'Immediate payout release via UPI or instant cash receipt directly into the collector’s verified account upon scale confirmation.',
      keyFeature: 'Solves the predatory credit delay problem where informal buyers delay payments by weeks.',
    },
    {
      title: '16. Green Points Formalization Incentives',
      category: 'Behavioral Economics',
      view: 'earnings',
      role: 'COLLECTOR',
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      description:
        'Collectors earn Green Points (480 pts) for every safe transaction. Redeemable for heavy puncture-proof PPE gloves, digital scales, and priority logistics passes.',
      keyFeature: 'Incentivizes positive habit formation away from dangerous open burning.',
    },
    {
      title: '17. Hazard Awareness & Safety Learning Center',
      category: 'Environmental Health',
      view: 'safety',
      role: 'COLLECTOR',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      description:
        'Visual and spoken native audio guides warning against cable burning, battery crushing, and CRT implosion. Explains that unburned whole cables yield 25% higher payouts.',
      keyFeature: 'Economic incentives directly aligned with environmental and worker safety.',
    },
    {
      title: '18. End-to-End Chain of Custody Timeline',
      category: 'EPR Traceability',
      view: 'lots',
      role: 'COLLECTOR',
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      description:
        'Interactive audit timeline tracking every second: Created -> Driver Pickup -> Scale Verification -> Payment -> Mechanical Hydrometallurgical Recycling.',
      keyFeature: 'Meets 100% of CPCB E-Waste Management Rules 2022 regulatory compliance guidelines.',
    },
    {
      title: '19. CPCB & SIH Central Governance Dashboard',
      category: 'National Oversight',
      view: 'admin',
      role: 'ADMIN',
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      description:
        'National monitoring dashboard displaying formalized tonnage, active worker counts, regional scrap heatmaps, and formal vs informal price realization charts.',
      keyFeature: 'Actionable policy analytics for state pollution control boards and EPR auditors.',
    },
    {
      title: '20. AI Anomaly & Fraud Detection Engine',
      category: 'Security & Governance',
      view: 'admin',
      role: 'ADMIN',
      icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
      description:
        'AI algorithms detect suspicious weight deviations, route anomalies, and counterfeit lot registrations with one-click compliance review workflows.',
      keyFeature: 'Prevents EPR credit double-counting and illicit leakage.',
    },
    {
      title: '21. Proven Unit Economics & National Scale',
      category: 'Scalability & Impact',
      view: 'admin',
      role: 'ADMIN',
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      description:
        'By disintermediating 3 tiers of predatory informal middlemen, RecyLink increases informal worker income by +34.8% while providing authorized recyclers with clean, unburned e-waste feedstocks.',
      keyFeature: 'A self-sustaining, scalable circular economy blueprint for Smart India Hackathon.',
    },
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextData = tourSteps[nextStep];
      onJumpToView(nextData.view, nextData.role);
    } else {
      confetti();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevData = tourSteps[prevStep];
      onJumpToView(prevData.view, prevData.role);
    }
  };

  const handleStepJump = (idx: number) => {
    setCurrentStep(idx);
    const data = tourSteps[idx];
    onJumpToView(data.view, data.role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-[#2d2d2a] max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-stone-200 text-stone-600 hover:text-[#2d2d2a] transition cursor-pointer border border-[#e2e0d4]"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header Banner */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e2e0d4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2d5a3f] animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-[#234e36]">
                SIH Evaluator Guided Scenario Tour
              </span>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>

          {/* Current Step Content */}
          <div className="my-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">
              <span>{currentStepData.category}</span>
              <span>•</span>
              <span className="text-[#2d5a3f] font-mono">Role: {currentStepData.role}</span>
            </div>

            <div className="flex items-start gap-4 my-3">
              <div className="p-3 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] flex-shrink-0">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#2d2d2a] leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Key Feature Highlight Pill */}
            <div className="p-3.5 rounded-2xl bg-[#e8f5ec] border border-[#badfca] text-xs text-[#234e36] mt-4 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2d5a3f] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">SIH Evaluator Takeaway: </span>
                {currentStepData.keyFeature}
              </div>
            </div>
          </div>

          {/* Mini Interactive Step Dots Navigation */}
          <div className="flex flex-wrap gap-1.5 my-6 justify-center">
            {tourSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleStepJump(idx)}
                className={`w-5 h-5 rounded-full text-[9px] font-bold transition flex items-center justify-center cursor-pointer ${
                  currentStep === idx
                    ? 'bg-[#2d5a3f] text-white scale-110 font-extrabold ring-2 ring-[#badfca]'
                    : idx < currentStep
                    ? 'bg-[#e8f5ec] text-[#234e36] border border-[#badfca]'
                    : 'bg-[#f5f5f0] text-stone-400 border border-[#e2e0d4]'
                }`}
                title={step.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#e2e0d4]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#f5f5f0] hover:bg-stone-200 border border-[#e2e0d4] text-stone-700 font-bold text-xs transition disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2d5a3f] hover:bg-[#234832] text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Finish Guided Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
