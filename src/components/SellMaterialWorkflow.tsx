import React, { useState, useEffect } from 'react';
import {
  LanguageCode,
  MaterialCategory,
  MaterialCondition,
  SourceType,
  CollectorProfile,
  LotItem
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { MATERIALS_CATALOG } from '../data/mockData';
import { apiService } from '../services/apiService';
import { voiceService } from '../services/voiceService';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Cable,
  BatteryCharging,
  Tv,
  Monitor,
  Cog,
  Disc,
  Boxes,
  Package,
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

interface SellMaterialWorkflowProps {
  collector: CollectorProfile;
  language: LanguageCode;
  initialCategory?: MaterialCategory;
  initialWeightKg?: number;
  onLotCreated: (lot: LotItem) => void;
  onCancel: () => void;
}

export const SellMaterialWorkflow: React.FC<SellMaterialWorkflowProps> = ({
  collector,
  language,
  initialCategory = 'pcb',
  initialWeightKg = 40,
  onLotCreated,
  onCancel,
}) => {
  const t = TRANSLATIONS[language];
  const [currentStep, setCurrentStep] = useState(1);

  // Workflow Form State
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  );
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>({
    category: initialCategory,
    confidence: 89,
    safetyWarning: 'Never burn or use chemical acid baths. Hand over intact for mechanical shredding.',
    extractedFeatures: ['Green substrate', 'Gold edge fingers', 'SMD capacitors', 'Integrated chips'],
    explanation: 'Detected printed circuit motherboard with surface mount ICs.'
  });

  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>(initialCategory);
  const [weightKg, setWeightKg] = useState<number>(initialWeightKg);
  const [condition, setCondition] = useState<MaterialCondition>('non_working');
  const [sourceType, setSourceType] = useState<SourceType>('scrap_collection');
  const [locationStr, setLocationStr] = useState<string>(collector.operatingArea || 'Dharavi Sector 3, Mumbai');

  // Calculated estimates
  const [priceEstimate, setPriceEstimate] = useState<any>(null);
  const [matchedRecyclers, setMatchedRecyclers] = useState<any[]>([]);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState<string>('REC-001');

  const [createdLot, setCreatedLot] = useState<LotItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample quick presets for demonstration
  const samplePhotoPresets = [
    {
      category: 'pcb' as MaterialCategory,
      title: 'Motherboard / PCB',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      weight: 40,
    },
    {
      category: 'cables' as MaterialCategory,
      title: 'Copper Wires',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      weight: 65,
    },
    {
      category: 'batteries' as MaterialCategory,
      title: 'Laptop Batteries',
      url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      weight: 30,
    },
    {
      category: 'crt' as MaterialCategory,
      title: 'Old CRT TV',
      url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
      weight: 25,
    },
  ];

  // Synchronize dynamic initial category when starting workflow
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      const matchedPreset = samplePhotoPresets.find((p) => p.category === initialCategory);
      if (matchedPreset) {
        setPhotoUrl(matchedPreset.url);
      }
      if (initialWeightKg) {
        setWeightKg(initialWeightKg);
      }
      runAIClassification(matchedPreset?.url || photoUrl, initialCategory as MaterialCategory);
    }
  }, [initialCategory, initialWeightKg]);

  // Re-calculate price estimate whenever category or weight changes
  useEffect(() => {
    const est = apiService.calculatePriceEstimate(selectedCategory, weightKg, locationStr);
    setPriceEstimate(est);

    const matches = apiService.findMatchingRecyclers(selectedCategory, weightKg, 'Mumbai');
    setMatchedRecyclers(matches);
    if (matches.length > 0) {
      setSelectedRecyclerId(matches[0].recycler.id);
    }
  }, [selectedCategory, weightKg, locationStr]);

  const handlePresetSelect = (preset: typeof samplePhotoPresets[0]) => {
    setPhotoUrl(preset.url);
    setSelectedCategory(preset.category);
    setWeightKg(preset.weight);
    runAIClassification(preset.url, preset.category);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPhotoUrl(base64);
        runAIClassification(base64, selectedCategory);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIClassification = async (imgData: string, forceCat?: MaterialCategory) => {
    setIsClassifying(true);
    const catToUse = forceCat || selectedCategory;
    try {
      const res = await apiService.classifyWithAI(imgData, undefined, catToUse);
      setAiAnalysis(res);
      if (res.category && !forceCat) {
        setSelectedCategory(res.category as MaterialCategory);
      }
    } catch (err) {
      console.warn('Classification error:', err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSpeakStep = () => {
    let script = '';
    if (currentStep === 1 || currentStep === 2) {
      script =
        language === 'hi'
          ? `एआई ने ${selectedCategory === 'pcb' ? 'सर्किट बोर्ड (PCB)' : selectedCategory === 'cables' ? 'तांबे के तार' : selectedCategory} की 92% सटीकता से पहचान की है।`
          : language === 'mr'
          ? `AI ने ${selectedCategory === 'cables' ? 'तांब्याची वायर' : selectedCategory} साहित्याची 92% अचूकतेने ओळख पटवली आहे.`
          : `AI identified material as ${selectedCategory.toUpperCase()} with high confidence.`;
    } else if (currentStep === 3) {
      script =
        language === 'hi'
          ? `कृपया अनुमानित वजन दर्ज करें। वर्तमान में ${weightKg} किलोग्राम सेट है।`
          : language === 'mr'
          ? `कृपया अंदाजे वजन टाका. सध्या ${weightKg} किलोग्राम आहे.`
          : `Please enter approximate weight in kilograms. Currently set to ${weightKg} kg.`;
    } else if (currentStep === 6 || currentStep === 7) {
      script =
        language === 'hi'
          ? `${weightKg} किलो ${selectedCategory === 'cables' ? 'तांबे के तार' : selectedCategory} का आज का अनुमानित मूल्य ₹${priceEstimate?.estimatedTotal} है।`
          : language === 'mr'
          ? `${weightKg} किलो ${selectedCategory === 'cables' ? 'तांब्याची वायर' : selectedCategory} चे आजचे अंदाजे मूल्य ₹${priceEstimate?.estimatedTotal} आहे.`
          : `Estimated payable value for ${weightKg} kg of ${selectedCategory.toUpperCase()} is ₹${priceEstimate?.estimatedTotal}.`;
    } else if (currentStep === 8) {
      script =
        language === 'hi'
          ? `धन्यवाद! आपका पिकअप अनुरोध सफलतापूर्वक दर्ज हो गया है। आपका ओटीपी ${createdLot?.otpCode} है।`
          : language === 'mr'
          ? `धन्यवाद! आपली पिकअप विनंती यशस्वीरीत्या नोंदवली गेली आहे. आपला ओटीपी ${createdLot?.otpCode} आहे.`
          : `Thank you! Your pickup request is confirmed. Your OTP code is ${createdLot?.otpCode}.`;
    }
    voiceService.speak(script, language);
  };

  const handleCreateLot = async () => {
    setIsSubmitting(true);
    try {
      const chosenRecycler = matchedRecyclers.find((m) => m.recycler.id === selectedRecyclerId)?.recycler;

      const newLot = await apiService.createLot({
        collectorId: collector.id,
        collectorName: collector.name,
        collectorPhone: collector.phone,
        materialCategory: selectedCategory,
        subcategory: aiAnalysis?.subcategory || `${selectedCategory.toUpperCase()} Scrap`,
        description: `${weightKg} kg of ${selectedCategory.toUpperCase()} from ${collector.operatingArea}`,
        photoUrl,
        approximateWeightKg: weightKg,
        condition,
        sourceType,
        location: locationStr,
        estimatedRatePerKg: priceEstimate?.unitPrice || 385,
        estimatedTotalValue: priceEstimate?.estimatedTotal || 15400,
        matchedRecyclerId: chosenRecycler?.id || 'REC-001',
        matchedRecyclerName: chosenRecycler?.name || 'EcoShred Circular Solutions Ltd.',
        status: 'MATCHING',
      });

      setCreatedLot(newLot);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const audioConfirm =
        language === 'hi'
          ? `बधाई! आपका लॉट ${newLot.id} बन गया है। अब पिकअप मंगवाएं।`
          : language === 'mr'
          ? `अभिनंदन! आपला लॉट ${newLot.id} तयार झाला आहे. आता पिकअप मागवा.`
          : `Congratulations! Lot ${newLot.id} has been created. You can now request pickup.`;
      voiceService.speak(audioConfirm, language);

      setCurrentStep(7);
    } catch (e: any) {
      alert('Could not create lot: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestPickup = async () => {
    if (!createdLot) return;
    setIsSubmitting(true);
    try {
      const updated = await apiService.updateLot(
        createdLot.id,
        { status: 'PICKUP_REQUESTED' },
        {
          stage: 'PICKUP_REQUESTED',
          actorRole: 'COLLECTOR',
          actorName: collector.name,
          location: locationStr,
          notes: `Doorstep pickup requested for ${createdLot.matchedRecyclerName}`,
          verificationMethod: 'SYSTEM',
        }
      );
      setCreatedLot(updated);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      const audioThankYou =
        language === 'hi'
          ? `धन्यवाद! आपका पिकअप अनुरोध दर्ज हो गया है। वाहन आगमन पर ओटीपी बताएं।`
          : language === 'mr'
          ? `धन्यवाद! आपली पिकअप विनंती नोंदवली गेली आहे.`
          : `Thank you! Your pickup request has been scheduled with the authorized recycler.`;
      voiceService.speak(audioThankYou, language);

      // Transition to dedicated Thank You view (Step 8)
      setCurrentStep(8);
    } catch (e: any) {
      alert('Pickup request error: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewSale = () => {
    setCurrentStep(1);
    setCreatedLot(null);
    setWeightKg(40);
    setSelectedCategory('pcb');
    setPhotoUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Workflow Stepper Header */}
      <div className="bento-card rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {t.collectorHome.actions.sellTitle}
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">
                CPCB-Compliant Direct Recycling Dispatch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              Step {currentStep} of 7
            </span>
            <button
              onClick={handleSpeakStep}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer shadow-2xs"
              title="Listen to instructions in your language"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* STEP 1 & 2: PHOTO & AI CLASSIFICATION */}
      {currentStep <= 2 && (
        <div className="space-y-6">
          <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              {t.sellFlow.step1}
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">{t.sellFlow.photoSubtitle}</p>

            {/* Photo Preview & Camera Input */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4">
              <div className="relative w-full">
                <img
                  src={photoUrl}
                  alt="Uploaded E-Waste"
                  className="w-full max-h-64 object-cover rounded-2xl shadow-xs mb-4 border border-slate-200/80"
                />
                {isClassifying && (
                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-300 mb-2" />
                    <span className="text-xs font-black tracking-wider uppercase">Scanning Circuit Substrates...</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 w-full justify-center">
                <label className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs cursor-pointer shadow-xs transition active:scale-95">
                  <Camera className="w-4 h-4" />
                  <span>{t.sellFlow.cameraBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <label className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer border border-slate-200 transition active:scale-95 shadow-2xs">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{t.sellFlow.galleryBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {/* Clickable Quick Sample Presets (For immediate frictionless demo) */}
            <div className="mt-5">
              <span className="text-xs text-slate-500 font-bold block mb-2.5">
                {t.sellFlow.orPickSample}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {samplePhotoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition cursor-pointer flex flex-col items-center text-center shadow-2xs ${
                      selectedCategory === preset.category
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/90 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-black">{preset.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">({preset.weight} kg)</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Multimodal Recognition Card */}
          <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t.sellFlow.step2} • Gemini AI Classification
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-extrabold">
                    {t.sellFlow.aiConfidence}: {aiAnalysis?.confidence || 89}%
                  </span>
                </div>
              </div>

              {isClassifying && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-black animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              )}
            </div>

            {/* Extracted cues */}
            {aiAnalysis?.extractedFeatures && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {aiAnalysis.extractedFeatures.map((feat: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200/80"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            )}

            {/* Safety Warning */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black">Safety Guideline: </span>
                <span className="font-medium">{aiAnalysis?.safetyWarning || 'Never burn or acid wash. Hand over intact for mechanized recovery.'}</span>
              </div>
            </div>

            {/* Manual Category Override */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                Verify or Manually Select Material Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MaterialCategory)}
                className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-black focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer shadow-2xs"
              >
                {MATERIALS_CATALOG.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name[language]} (Benchmark: ₹{mat.basePricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="w-full mt-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Next: Enter Weight ({weightKg} kg)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3, 4, 5: WEIGHT, CONDITION, SOURCE */}
      {currentStep >= 3 && currentStep <= 5 && (
        <div className="space-y-6">
          <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            {/* Step 3: Approximate Weight */}
            <div className="mb-6">
              <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600" />
                {t.sellFlow.step3}
              </h2>
              <p className="text-xs text-slate-500 mb-4 font-medium">{t.sellFlow.approxWeightHint}</p>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={() => setWeightKg(Math.max(1, weightKg - 5))}
                    className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-black text-lg transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    -5
                  </button>
                  <div className="flex items-baseline justify-center gap-1.5 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                      className="w-24 text-center text-3xl sm:text-4xl font-black text-emerald-800 bg-transparent outline-none"
                    />
                    <span className="text-base font-black text-slate-400">kg</span>
                  </div>
                  <button
                    onClick={() => setWeightKg(weightKg + 5)}
                    className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-black text-lg transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    +5
                  </button>
                </div>

                {/* Quick weight chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[10, 20, 40, 50, 75, 100].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeightKg(w)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                        weightKg === w
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Material Condition */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-700 mb-2">
                {t.sellFlow.step4}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['working', 'non_working', 'damaged', 'mixed', 'unknown'] as MaterialCondition[]).map(
                  (cond) => (
                    <button
                      key={cond}
                      onClick={() => setCondition(cond)}
                      className={`p-3 rounded-2xl text-xs font-bold border text-left transition cursor-pointer shadow-2xs ${
                        condition === cond
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      {t.sellFlow.conditions[cond]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Step 5: Source Type */}
            <div className="mb-6">
              <label className="block text-xs font-black text-slate-700 mb-2">
                {t.sellFlow.step5}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  ['household', 'shop', 'office', 'institution', 'scrap_collection', 'other'] as SourceType[]
                ).map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceType(src)}
                    className={`p-3 rounded-2xl text-xs font-bold border text-left transition cursor-pointer shadow-2xs ${
                      sourceType === src
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {t.sellFlow.sources[src]}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Location */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                Collection Location / Depot Area:
              </label>
              <input
                type="text"
                value={locationStr}
                onChange={(e) => setLocationStr(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:border-emerald-600 outline-none shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 font-bold text-xs transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Calculate Fair Price Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: ESTIMATED VALUE & RECYCLER MATCHING */}
      {currentStep === 6 && (
        <div className="space-y-6">
          {/* Estimated Value Card */}
          <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                {t.sellFlow.step6}
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {weightKg} kg × ₹{priceEstimate?.unitPrice}/kg
              </span>
            </div>

            <div className="text-center py-6 bg-slate-50 rounded-3xl border border-slate-200/80 mb-4">
              <span className="text-xs text-slate-500 uppercase font-black block mb-1">
                {t.sellFlow.estimatedVal}
              </span>
              <span className="text-4xl sm:text-5xl font-black text-emerald-800">
                ₹{priceEstimate?.estimatedTotal.toLocaleString('en-IN')}
              </span>
              <div className="text-xs text-slate-500 font-bold mt-2">
                {t.sellFlow.priceRange}: ₹{priceEstimate?.minPricePerKg} - ₹{priceEstimate?.maxPricePerKg} per kg
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5 font-medium">
              <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <p>
                Calculated from verified authorized recycler bids in Mumbai/Thane zone. Formal route offers 20-30% higher net earnings compared to informal middlemen.
              </p>
            </div>
          </div>

          {/* Recycler Matching Engine Results */}
          <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {t.sellFlow.findRecyclerBtn} ({matchedRecyclers.length} Recommended)
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Ranked by CPCB authorization status, offered rate, pickup feasibility, and distance.
            </p>

            <div className="space-y-3 mb-6">
              {matchedRecyclers.map((match) => {
                const r = match.recycler;
                const isSelected = selectedRecyclerId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecyclerId(r.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/90 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">{r.name}</span>
                          {r.authorizationStatus === 'VERIFIED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-700" />
                              Verified ✓
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {r.distanceKm} km away • {r.facilityLocation}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-800 block">
                          ₹{match.offeredRate}/kg
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Match: {match.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Recommendation Reasons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {match.reasons.map((reason: string, rIdx: number) => (
                        <span
                          key={rIdx}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-white text-slate-700 border border-slate-200 font-medium"
                        >
                          • {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 font-bold text-xs transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleCreateLot}
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Lot...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t.sellFlow.createLotBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: LOT CONFIRMATION & PICKUP REQUEST */}
      {currentStep === 7 && createdLot && (
        <div className="space-y-6">
          <div className="bento-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {t.sellFlow.successCreated}
            </h2>
            <div className="font-mono text-emerald-900 font-black text-lg bg-emerald-50 inline-block px-4 py-1.5 rounded-2xl border border-emerald-200 my-2">
              {createdLot.id}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Your digital lot is immutably registered in the RecyLink formal chain of custody.
            </p>

            {/* Lot Details Summary Table */}
            <div className="grid grid-cols-2 gap-3 text-left my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Material Category:</span>
                <span className="font-black text-slate-900 capitalize">{createdLot.materialCategory.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Approximate Weight:</span>
                <span className="font-black text-slate-900">{createdLot.approximateWeightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Estimated Rate:</span>
                <span className="font-black text-emerald-800">₹{createdLot.estimatedRatePerKg}/kg</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Estimated Total:</span>
                <span className="font-black text-emerald-800">₹{createdLot.estimatedTotalValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500 block font-medium">Matched Recycler:</span>
                <span className="font-black text-sky-800">{createdLot.matchedRecyclerName}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block font-medium">Physical Handover 6-Digit OTP:</span>
                <span className="font-mono font-black text-amber-700 text-base tracking-widest">{createdLot.otpCode}</span>
              </div>
            </div>

            {/* Step 7 Navigation & Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRequestPickup}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Booking Doorstep Pickup...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5" />
                    <span>CONFIRM DOORSTEP PICKUP REQUEST</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Review</span>
                </button>

                <button
                  onClick={onCancel}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: FORMALIZATION SUCCESS & THANK YOU SCREEN */}
      {currentStep === 8 && createdLot && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bento-card rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg text-center relative overflow-hidden">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black uppercase mb-4 shadow-2xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Formal E-Waste Handover Scheduled
            </div>

            {/* Big Green Success Check Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-700/25">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            {/* Thank you heading in multiple languages */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'hi'
                ? 'धन्यवाद! आपका ई-कचरा सुरक्षित रूप से बुक हो गया है'
                : language === 'mr'
                ? 'धन्यवाद! आपला ई-कचरा यशस्वीरीत्या बुक झाला आहे'
                : 'Thank You for Formalizing E-Waste with RecyLink!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed font-medium">
              {language === 'hi'
                ? 'आपका लॉट अधिकृत रीसाइक्लर को सौंपने के लिए तैयार है। पर्यावरण को विषाक्त धुएं से बचाने के लिए धन्यवाद!'
                : language === 'mr'
                ? 'आपला लॉट अधिकृत रिसायकलरकडे सुपूर्द करण्यासाठी तयार आहे. पर्यावरणाचे रक्षण केल्याबद्दल धन्यवाद!'
                : 'Your lot has been successfully registered with CPCB authorized recycler. Thank you for eliminating open burning and protecting our environment!'}
            </p>

            {/* Key Handover Confirmation Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 my-6 max-w-md mx-auto text-left shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block">Registered Lot ID</span>
                  <span className="font-mono font-black text-emerald-800 text-sm sm:text-base">{createdLot.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-slate-400 block">Material</span>
                  <span className="font-black text-slate-900 capitalize text-xs sm:text-sm">{createdLot.materialCategory} ({createdLot.approximateWeightKg} kg)</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-400 block">Recycler Partner</span>
                  <span className="font-black text-sky-800 text-xs">{createdLot.matchedRecyclerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-slate-400 block">Est. Payout</span>
                  <span className="font-black text-emerald-800 text-sm">₹{createdLot.estimatedTotalValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Handover OTP Highlight */}
              <div className="bg-white border border-emerald-200 p-3 rounded-2xl flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-900 block">Physical Handover OTP</span>
                  <span className="text-[10px] text-slate-500 font-medium">Show to driver upon weighing</span>
                </div>
                <span className="font-mono font-black text-xl text-emerald-800 tracking-widest bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {createdLot.otpCode}
                </span>
              </div>

              {/* Green Points Bonus */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>+45 Green Points Earned • 18.2 kg CO₂ Saved</span>
              </div>
            </div>

            {/* 3 Explicit Navigation Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {/* Button 1: Back to Home Page */}
              <button
                onClick={onCancel}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-xs border border-slate-200 transition active:scale-95 shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🏠 Back to Home</span>
              </button>

              {/* Button 2: View in My Lots Ledger */}
              <button
                onClick={() => onLotCreated(createdLot)}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs transition active:scale-95 shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📦 View in My Lots</span>
              </button>

              {/* Button 3: Sell Another Item */}
              <button
                onClick={handleResetForNewSale}
                className="py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-emerald-900 font-black text-xs border border-emerald-200 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>➕ Sell Another</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
