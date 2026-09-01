import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { voiceService } from '../services/voiceService';
import { apiService } from '../services/apiService';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe2,
  RefreshCw,
  Send,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onStartSellWithData: (data: { category: string; weightKg: number }) => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language: initialLanguage,
  onStartSellWithData,
  onLanguageChange,
}) => {
  const [activeLang, setActiveLang] = useState<LanguageCode>(initialLanguage || 'hi');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);

  useEffect(() => {
    setActiveLang(initialLanguage);
  }, [initialLanguage]);

  const samplePromptsByLang: Record<LanguageCode, { text: string; label: string; cat: string; weight: number }[]> = {
    hi: [
      { text: 'मेरे पास 40 किलो तांबे के तार हैं', label: 'तांबे के तार (Copper Cable)', cat: 'cables', weight: 40 },
      { text: '25 किलो कंप्यूटर मदरबोर्ड (PCB) बेचना है', label: 'मदरबोर्ड (PCB Scrap)', cat: 'pcb', weight: 25 },
      { text: '15 किलो पुरानी मोबाइल और लैपटॉप बैटरी', label: 'बैटरी (Li-ion Batteries)', cat: 'batteries', weight: 15 },
      { text: 'आज मुंबई और दिल्ली में पीसीबी का क्या भाव है?', label: 'भाव जांच (Price Query)', cat: 'pcb', weight: 10 },
    ],
    mr: [
      { text: 'माझ्याकडे 30 किलो तांब्याची वायरिंग आहे', label: 'तांब्याची वायर (Copper Wires)', cat: 'cables', weight: 30 },
      { text: '45 किलो संगणक सर्किट बोर्ड विकायचे आहे', label: 'सर्किट बोर्ड (PCB Scrap)', cat: 'pcb', weight: 45 },
      { text: '20 किलो लॅपटॉप बॅटरी पिकअप पाठवा', label: 'लॅपटॉप बॅटऱ्या (Batteries)', cat: 'batteries', weight: 20 },
      { text: 'पुणे व मुंबईत आजचा ई-कचरा भाव काय आहे?', label: 'बाजार भाव (Market Rates)', cat: 'pcb', weight: 10 },
    ],
    en: [
      { text: 'I have 50 kg of insulated copper cables', label: '50 kg Copper Cables', cat: 'cables', weight: 50 },
      { text: 'I want to sell 35 kg of motherboard circuit boards', label: '35 kg PCB Motherboards', cat: 'pcb', weight: 35 },
      { text: 'Schedule doorstep pickup for 20 kg lithium batteries', label: '20 kg Li-ion Batteries', cat: 'batteries', weight: 20 },
      { text: 'What is today scrap rate for copper wire in Mumbai?', label: 'Check Live Scrap Rates', cat: 'cables', weight: 10 },
    ]
  };

  const getWelcomeText = (lang: LanguageCode) => {
    if (lang === 'hi') {
      return 'नमस्ते! रेसीलिंक वॉइस असिस्टेंट में आपका स्वागत है। बोलकर सामग्री बेचें, जैसे: मेरे पास 40 किलो तांबे के तार हैं।';
    }
    if (lang === 'mr') {
      return 'नमस्कार! रेसीलिंक व्हॉइस असिस्टंटमध्ये आपले स्वागत आहे. बोलून ई-कचरा विका, जसे: माझ्याकडे 30 किलो तांब्याची वायर आहे.';
    }
    return 'Hello! Welcome to RecyLink voice assistant. Speak naturally to sell scrap, for example: I have 40 kg of copper cables.';
  };

  const getTestPhrase = (lang: LanguageCode) => {
    if (lang === 'hi') {
      return 'रेसीलिंक में आपका स्वागत है। हिन्दी आवाज़ सक्रिय है।';
    }
    if (lang === 'mr') {
      return 'रेसीलिंकमध्ये आपले स्वागत आहे. मराठी आवाज चालू आहे.';
    }
    return 'Welcome to RecyLink. English voice synthesizer is active.';
  };

  useEffect(() => {
    if (isOpen) {
      voiceService.playChime(true);
      // Small timeout to allow synth voices to initialize properly
      const timer = setTimeout(() => {
        voiceService.speak(getWelcomeText(activeLang), activeLang);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      voiceService.stop();
      setIsListening(false);
      setIsSimulatingSpeech(false);
      setTranscript('');
      setParseResult(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLanguageSwitch = (newLang: LanguageCode) => {
    setActiveLang(newLang);
    onLanguageChange?.(newLang);
    setTranscript('');
    setParseResult(null);
    setErrorMessage('');
    voiceService.playChime(true);
    setTimeout(() => {
      voiceService.speak(getWelcomeText(newLang), newLang);
    }, 100);
  };

  const handleTestVoice = () => {
    voiceService.playChime(true);
    voiceService.speak(getTestPhrase(activeLang), activeLang);
  };

  const handleStartListening = () => {
    setErrorMessage('');
    setTranscript('');
    setParseResult(null);
    voiceService.playChime(true);

    voiceService.listen(
      activeLang,
      async (capturedText) => {
        setTranscript(capturedText);
        await processTranscript(capturedText);
      },
      (friendlyErr, rawCode) => {
        setIsListening(false);
        setErrorMessage(friendlyErr);

        // If cloud recognition is blocked by browser frame policy/network,
        // automatically offer quick fallback prompts so user is never stuck
        if (rawCode === 'network' || rawCode === 'not-allowed') {
          console.info('Speech recognition fallback activated.');
        }
      },
      (listening) => {
        setIsListening(listening);
      }
    );
  };

  const processTranscript = async (text: string) => {
    setIsParsing(true);
    setErrorMessage('');
    try {
      const result = await apiService.parseVoiceWithAI(text, activeLang);
      setParseResult(result);
      if (result.spokenConfirmation) {
        voiceService.speak(result.spokenConfirmation, activeLang);
      }
    } catch (e: any) {
      setErrorMessage(
        activeLang === 'hi'
          ? 'आवाज़ को प्रोसेस नहीं किया जा सका। कृपया नीचे दिए गए उदाहरणों पर क्लिक करें।'
          : activeLang === 'mr'
          ? 'प्रक्रिया पूर्ण होऊ शकली नाही. कृपया खालील पर्याय निवडा.'
          : 'Could not process speech. Please tap a sample prompt or type below.'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleSelectSample = (sample: { text: string; cat: string; weight: number }) => {
    setTranscript(sample.text);
    setErrorMessage('');
    voiceService.playChime(true);
    processTranscript(sample.text);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const text = manualInput.trim();
    setTranscript(text);
    setManualInput('');
    processTranscript(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#2d2d2a] overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            voiceService.stop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-stone-200 text-stone-600 hover:text-[#2d2d2a] transition cursor-pointer border border-[#e2e0d4]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Language Switcher */}
        <div className="flex items-start justify-between gap-3 mb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e8f5ec] border border-[#badfca] flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5 text-[#2d5a3f]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-1.5">
                RecyLink Voice AI
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#e8f5ec] text-[#234e36] border border-[#badfca] font-bold">
                  Multilingual
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {activeLang === 'hi'
                  ? 'अपनी भाषा में बोलें • आवाज से सीधे लॉट बनाएं'
                  : activeLang === 'mr'
                  ? 'आपल्या भाषेत बोला • आवाजाने थेट लॉट बनवा'
                  : 'Speak naturally in your preferred language'}
              </p>
            </div>
          </div>
        </div>

        {/* Language Tabs & Voice Test Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#f5f5f0] rounded-2xl border border-[#e2e0d4] mb-4">
          <div className="flex-1 flex items-center gap-1">
            {(['hi', 'mr', 'en'] as LanguageCode[]).map((code) => {
              const labels: Record<LanguageCode, string> = {
                hi: '🇮🇳 हिन्दी',
                mr: '🇮🇳 मराठी',
                en: '🇬🇧 English'
              };
              const isSelected = activeLang === code;
              return (
                <button
                  key={code}
                  onClick={() => handleLanguageSwitch(code)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#2d5a3f] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <span>{labels[code]}</span>
                </button>
              );
            })}
          </div>

          {/* Test Voice Synthesizer Button */}
          <button
            onClick={handleTestVoice}
            className="px-2.5 py-1.5 rounded-xl bg-[#ffffff] hover:bg-[#edece4] text-[#2d5a3f] border border-[#badfca] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            title="Hear synthesizer voice sample"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>
              {activeLang === 'hi' ? 'आवाज़ सुनें' : activeLang === 'mr' ? 'आवाज ऐका' : 'Test Voice'}
            </span>
          </button>
        </div>

        {/* Big Interactive Mic Button */}
        <div className="my-4 flex flex-col items-center justify-center">
          <button
            onClick={isListening ? () => voiceService.stop() : handleStartListening}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-md cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-200'
                : 'bg-[#2d5a3f] hover:bg-[#234832] text-white hover:scale-105 ring-4 ring-[#badfca]/50'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-center px-2">
                  {activeLang === 'hi' ? 'बोलने के लिए दबाएं' : activeLang === 'mr' ? 'बोलण्यासाठी दाबा' : 'Tap to Speak'}
                </span>
              </>
            )}
          </button>

          {/* Audio Waveform Indicator */}
          {isListening && (
            <div className="flex items-center gap-1 mt-3">
              <span className="w-1 h-5 bg-[#2d5a3f] rounded-full animate-bounce"></span>
              <span className="w-1 h-8 bg-[#234e36] rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1 h-6 bg-[#2d5a3f] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-10 bg-[#234e36] rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1 h-5 bg-[#2d5a3f] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>

        {/* Informative Guidance Banner if Speech Recognition has network restriction */}
        {errorMessage && (
          <div className="text-xs text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] p-3 rounded-2xl mb-3 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[11px] leading-tight">{errorMessage}</p>
              <p className="text-[10px] text-stone-600">
                👉 {activeLang === 'hi'
                  ? 'आप सीधे नीचे दिए गए विकल्पों में से किसी एक पर टैप करके तुरंत लॉट बना सकते हैं:'
                  : activeLang === 'mr'
                  ? 'तुम्ही खालील पर्यायांवर थेट टॅप करून त्वरित लॉट तयार करू शकता:'
                  : 'You can tap any sample voice command below or type your query:'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Sample Clickable Prompts */}
        <div className="mb-4">
          <div className="text-xs text-stone-500 mb-2 font-bold flex items-center justify-between">
            <span>
              {activeLang === 'hi' ? 'या इन त्वरित उदाहरणों पर क्लिक करें:' : activeLang === 'mr' ? 'किंवा या उदाहरणांवर टॅप करा:' : 'Or tap a sample voice command:'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePromptsByLang[activeLang].map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="text-left p-2.5 rounded-xl bg-[#f5f5f0] hover:bg-[#e8f5ec] hover:border-[#badfca] border border-[#e2e0d4] text-xs text-stone-800 transition flex items-center justify-between group cursor-pointer shadow-2xs"
              >
                <div>
                  <span className="font-bold text-[#2d5a3f] block text-[11px]">{sample.label}</span>
                  <span className="text-[11px] text-stone-600 line-clamp-1">"{sample.text}"</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#2d5a3f] flex-shrink-0 transition ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Multilingual Text Input Bar (Universal Accessibility) */}
        <form onSubmit={handleManualSubmit} className="mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#f5f5f0] rounded-xl border border-[#e2e0d4] focus-within:border-[#2d5a3f]">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder={
                activeLang === 'hi'
                  ? 'या लिखकर सामग्री बताएं (e.g. 50 किलो तांबे के तार)'
                  : activeLang === 'mr'
                  ? 'किंवा लिहून सांगा (e.g. 30 किलो तांब्याची वायर)'
                  : 'Or type description (e.g. 50 kg copper cables)'
              }
              className="flex-1 px-3 py-1.5 text-xs bg-transparent text-stone-900 outline-none placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-[#2d5a3f] hover:bg-[#234832] disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>{activeLang === 'hi' ? 'भेजें' : activeLang === 'mr' ? 'पाठवा' : 'Send'}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Captured Transcript Box */}
        {transcript && (
          <div className="p-3 rounded-2xl bg-[#f5f5f0] border border-[#e2e0d4] mb-3">
            <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#2d5a3f]" />
                {activeLang === 'hi' ? 'पहचाना गया संदेश:' : activeLang === 'mr' ? 'ओळखलेला मजकूर:' : 'Captured Transcript:'}
              </span>
              <button
                onClick={() => voiceService.speak(transcript, activeLang)}
                className="text-[#2d5a3f] hover:underline font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" /> {activeLang === 'hi' ? 'आवाज़ सुनें' : activeLang === 'mr' ? 'आवाज ऐका' : 'Replay Voice'}
              </button>
            </div>
            <p className="text-xs font-semibold text-[#2d2d2a] italic">"{transcript}"</p>
          </div>
        )}

        {/* Parsing state */}
        {isParsing && (
          <div className="p-3.5 rounded-2xl bg-[#f5f5f0] border border-[#badfca] text-center text-xs text-stone-700 flex items-center justify-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-[#2d5a3f] animate-spin" />
            <span>
              {activeLang === 'hi'
                ? 'Gemini AI द्वारा सामग्री और वजन की पहचान की जा रही है...'
                : activeLang === 'mr'
                ? 'Gemini AI द्वारे ई-कचरा वर्गीकरण केले जात आहे...'
                : `Analyzing speech with Gemini in ${activeLang.toUpperCase()}...`}
            </span>
          </div>
        )}

        {/* AI Parsed Result Confirmation Card */}
        {parseResult && !isParsing && (
          <div className="p-4 rounded-2xl bg-[#e8f5ec] border border-[#badfca] mb-3 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[#234e36] font-extrabold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#2d5a3f]" />
                {activeLang === 'hi' ? 'सामग्री पहचानी गई' : activeLang === 'mr' ? 'साहित्य ओळखले गेले' : 'Understood & Structured'}
              </div>
              <button
                onClick={() => parseResult.spokenConfirmation && voiceService.speak(parseResult.spokenConfirmation, activeLang)}
                className="text-[#234e36] hover:text-[#183825] font-bold text-[10px] flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-[#badfca]"
              >
                <Volume2 className="w-3 h-3" /> {activeLang === 'hi' ? 'पुनः सुनें' : activeLang === 'mr' ? 'पुन्हा ऐका' : 'Speak Again'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-[#ffffff] p-2.5 rounded-xl border border-[#badfca]">
                <span className="text-stone-500 block text-[10px] font-bold uppercase">
                  {activeLang === 'hi' ? 'पहचानी गई श्रेणी:' : activeLang === 'mr' ? 'ओळखलेली श्रेणी:' : 'Identified Material:'}
                </span>
                <span className="font-bold text-[#234e36] capitalize text-xs">
                  {parseResult.category === 'cables'
                    ? (activeLang === 'hi' ? 'तांबे के तार और केबल' : activeLang === 'mr' ? 'तांब्याची वायर' : 'Copper Cables')
                    : parseResult.category === 'batteries'
                    ? (activeLang === 'hi' ? 'लिथियम-आयन बैटरी' : activeLang === 'mr' ? 'लिथियम बॅटरी' : 'Li-ion Batteries')
                    : (activeLang === 'hi' ? 'सर्किट मदरबोर्ड (PCB)' : activeLang === 'mr' ? 'सर्किट बोर्ड (PCB)' : 'Circuit Board (PCB)')}
                </span>
              </div>
              <div className="bg-[#ffffff] p-2.5 rounded-xl border border-[#badfca]">
                <span className="text-stone-500 block text-[10px] font-bold uppercase">
                  {activeLang === 'hi' ? 'अनुमानित वजन:' : activeLang === 'mr' ? 'अंदाजे वजन:' : 'Estimated Weight:'}
                </span>
                <span className="font-bold text-[#234e36] text-xs">{parseResult.weightKg || 40} kg</span>
              </div>
            </div>

            <p className="text-xs text-stone-800 mb-3 bg-[#ffffff] p-2.5 rounded-xl border border-[#badfca] font-medium leading-relaxed">
              {parseResult.spokenConfirmation}
            </p>

            <button
              onClick={() => {
                voiceService.stop();
                onStartSellWithData({
                  category: parseResult.category || 'pcb',
                  weightKg: parseResult.weightKg || 40,
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#2d5a3f] hover:bg-[#234832] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>
                {activeLang === 'hi'
                  ? 'इस सामग्री के साथ लॉट बनाएं'
                  : activeLang === 'mr'
                  ? 'या साहित्यासह लॉट तयार करा'
                  : 'Proceed with This Material'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


