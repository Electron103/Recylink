import React, { useState } from 'react';
import { voiceService } from '../services/voiceService';
import { LanguageCode } from '../types';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  X,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Delete,
  MapPin,
  ExternalLink,
  Users,
  ShieldCheck,
  Globe2
} from 'lucide-react';

interface FeaturePhoneIVRModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: LanguageCode;
}

interface HelplinePreset {
  area: string;
  number: string;
  label: string;
  region: string;
}

export const FeaturePhoneIVRModal: React.FC<FeaturePhoneIVRModalProps> = ({
  isOpen,
  onClose,
  language = 'hi',
}) => {
  const [dialedNumber, setDialedNumber] = useState<string>('1800-11-3927');
  const [callActive, setCallActive] = useState(false);
  const [ivrStep, setIvrStep] = useState(0);
  const [ivrLanguage, setIvrLanguage] = useState<LanguageCode>(language);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [smsSent, setSmsSent] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  // Area-specific authentic Toll-Free Helplines across India
  const areaHelplines: HelplinePreset[] = [
    { area: 'National All-India (CPCB E-Waste Desk)', number: '1800-11-3927', label: 'Toll-Free National Grid', region: 'All India' },
    { area: 'Mumbai & MMR / Maharashtra West', number: '1800-22-7565', label: 'MPCB & RecyLink Mumbai', region: 'Mumbai' },
    { area: 'Delhi-NCR & Northern Scrap Belt', number: '1800-180-2026', label: 'DPCC & Mayapuri Cell', region: 'Delhi NCR' },
    { area: 'Pune & MIDC Industrial Corridor', number: '1800-233-2026', label: 'Bhosari & Chakan Desk', region: 'Pune' },
    { area: 'Bengaluru & Karnataka South', number: '1800-425-3978', label: 'KSPCB E-Waste Cell', region: 'Bengaluru' },
    { area: 'Hyderabad & Telangana Corridor', number: '1800-599-1100', label: 'TSPCB Formalization Desk', region: 'Hyderabad' },
    { area: 'Ahmedabad & Gujarat GIDC', number: '1800-233-5500', label: 'GPCB HazMat Portal', region: 'Gujarat' },
    { area: 'Kolkata & Eastern Scrap Markets', number: '1800-345-0033', label: 'WBPCB Traceability Desk', region: 'Kolkata' },
  ];

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    setPressedKey(digit);
    voiceService.playDtmfTone(digit);
    setTimeout(() => setPressedKey(null), 250);

    if (!callActive) {
      // Append digit to dialed number
      if (dialedNumber.length < 16) {
        setDialedNumber((prev) => prev + digit);
      }
      return;
    }

    // Call is active: Process IVR tree menu options
    if (ivrStep === 1) {
      if (digit === '1') {
        // Price query
        setIvrStep(2);
        const text =
          ivrLanguage === 'hi'
            ? 'आज का भाव: तांबे के तार 530 रुपये प्रति किलो, सर्किट बोर्ड मदरबोर्ड 385 रुपये प्रति किलो, और बैटरी 145 रुपये प्रति किलो। रेट एसएमएस भेज दिया गया है।'
            : ivrLanguage === 'mr'
            ? 'आजचा बाजार भाव: तांब्याची वायर 530 रुपये प्रति किलो, सर्किट बोर्ड 385 रुपये प्रति किलो, बॅटरी 145 रुपये प्रति किलो. एसएमएस पाठवला आहे.'
            : 'Today scrap rates: Copper cables at 530 rupees per kg, PCB motherboards at 385 per kg, Batteries at 145 per kg. Rate details sent via SMS.';
        voiceService.speak(text, ivrLanguage);
        setSmsSent(true);
        setSmsText('RecyLink Rates: Copper: ₹530/kg | PCB: ₹385/kg | Battery: ₹145/kg. Valid for next 24 hours with certified digital scale.');
      } else if (digit === '2') {
        // Pickup booking
        setIvrStep(3);
        const text =
          ivrLanguage === 'hi'
            ? 'पिकअप बुकिंग के लिए: तांबे के तार के लिए 1 दबाएं, कंप्यूटर मदरबोर्ड के लिए 2 दबाएं, बैटरी के लिए 3 दबाएं।'
            : ivrLanguage === 'mr'
            ? 'पिकअप बुकिंगसाठी: तांब्याच्या तारेसाठी 1 दाबा, सर्किट बोर्डसाठी 2 दाबा, बॅटरीसाठी 3 दाबा.'
            : 'For pickup booking: Press 1 for Copper wire, Press 2 for PCB boards, Press 3 for Batteries.';
        voiceService.speak(text, ivrLanguage);
      } else if (digit === '3') {
        // Digital Saathi support
        setIvrStep(5);
        const text =
          ivrLanguage === 'hi'
            ? 'आपकी कॉल निकटतम डिजिटल साथी विकास पाटिल से जोड़ी जा रही है। फोन नंबर 98231 44556 पर संपर्क हो रहा है।'
            : ivrLanguage === 'mr'
            ? 'तुमचा फोन जवळचे डिजिटल साथी विकास पाटील यांच्याशी जोडला जात आहे.'
            : 'Connecting you with your nearby Digital Saathi field coordinator Vikas Patil.';
        voiceService.speak(text, ivrLanguage);
        setSmsSent(true);
        setSmsText('Digital Saathi Connected: Vikas Patil (+91 98231 44556) will arrive at your scrap center with calibrated scale.');
      }
    } else if (ivrStep === 3) {
      // Confirmed pickup
      setIvrStep(4);
      const chosen = digit === '1' ? 'तांबे के तार' : digit === '2' ? 'सर्किट बोर्ड' : 'बैटरी';
      const text =
        ivrLanguage === 'hi'
          ? `आपका ${chosen} पिकअप अनुरोध दर्ज हो गया है। इकोश्रेड रीसाइक्लिंग वैन 2 घंटे में पहुंचेगी। आपका ओटीपी 582914 है।`
          : ivrLanguage === 'mr'
          ? `आपली पिकअप नोंदणी झाली आहे. व्हॅन 2 तासात येईल. आपला ओटीपी 582914 आहे.`
          : `Pickup request registered successfully. EcoShred verified van will arrive in 2 hours. Your handover OTP is 582914.`;
      voiceService.speak(text, ivrLanguage);
      setSmsSent(true);
      setSmsText('RecyLink Pickup Confirmed: EcoShred Van MH-04-AZ-2026 dispatched. Handover OTP: 582914. Digital weighing scale onboard.');
    }
  };

  const handleBackspace = () => {
    if (!callActive) {
      setDialedNumber((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!callActive) {
      setDialedNumber('');
    }
  };

  const handleSelectPreset = (preset: HelplinePreset) => {
    if (!callActive) {
      setDialedNumber(preset.number);
    }
  };

  const handleStartCall = () => {
    if (!dialedNumber.trim()) {
      alert('Please enter or select a toll-free number to dial.');
      return;
    }
    setCallActive(true);
    setIvrStep(1);
    setSmsSent(false);
    setSmsText('');
    setCallDuration(0);

    const welcome =
      ivrLanguage === 'hi'
        ? 'नमस्ते, रेसीलिंक ई-कचरा हेल्पलाइन में आपका स्वागत है। आज का लाइव भाव जानने के लिए 1 दबाएं। रीसाइक्लिंग वैन पिकअप बुक करने के लिए 2 दबाएं। डिजिटल साथी से बात करने के लिए 3 दबाएं।'
        : ivrLanguage === 'mr'
        ? 'नमस्कार, रेसीलिंक ई-कचरा हेल्पलाईनमध्ये स्वागत आहे. आजचा भाव जाणून घेण्यासाठी 1 दाबा. पिकअप वॅन बुक करण्यासाठी 2 दाबा. डिजिटल साथींशी बोलण्यासाठी 3 दाबा.'
        : 'Welcome to RecyLink National E-Waste Helpline. Press 1 for today scrap market rates, Press 2 to book verified van pickup, Press 3 to speak with local Digital Saathi coordinator.';

    voiceService.speak(welcome, ivrLanguage);
  };

  const handleEndCall = () => {
    voiceService.stop();
    setCallActive(false);
    setIvrStep(0);
  };

  // Real-time cellular device dial
  const handleRealCellularCall = () => {
    const cleanNum = dialedNumber.replace(/[^0-9+]/g, '');
    if (cleanNum) {
      window.location.href = `tel:${cleanNum}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-[#2d2d2a] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            handleEndCall();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-stone-200 text-stone-600 hover:text-[#2d2d2a] transition cursor-pointer border border-[#e2e0d4]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#e8f5ec] border border-[#badfca] flex items-center justify-center">
            <PhoneCall className="w-5 h-5 text-[#2d5a3f]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#2d2d2a] flex items-center gap-1.5">
              Toll-Free Helpline & Dialpad
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#e8f5ec] text-[#234e36] border border-[#badfca] font-bold">
                Real-Time
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Interactive IVR for ₹1,000 feature keypad phones & direct phone dialer
            </p>
          </div>
        </div>

        {/* IVR Language Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f5f5f0] rounded-xl border border-[#e2e0d4] mb-3">
          <span className="text-[10px] font-bold text-stone-500 pl-2">IVR Voice:</span>
          {(['hi', 'mr', 'en'] as LanguageCode[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setIvrLanguage(l);
                if (callActive) {
                  voiceService.speak(
                    l === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है।' : l === 'mr' ? 'भाषा मराठी निवडली गेली आहे.' : 'Language switched to English.',
                    l
                  );
                }
              }}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                ivrLanguage === l ? 'bg-[#2d5a3f] text-white shadow-sm' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              {l === 'hi' ? 'हिन्दी' : l === 'mr' ? 'मराठी' : 'English'}
            </button>
          ))}
        </div>

        {/* Regional Toll-Free Directory Dropdown */}
        <div className="mb-3">
          <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#2d5a3f]" />
            Select Area Toll-Free Helpline:
          </label>
          <select
            disabled={callActive}
            value={dialedNumber}
            onChange={(e) => setDialedNumber(e.target.value)}
            className="w-full p-2 rounded-xl bg-[#f5f5f0] border border-[#e2e0d4] text-xs font-bold text-[#2d2d2a] focus:border-[#2d5a3f] outline-none cursor-pointer disabled:opacity-60"
          >
            {areaHelplines.map((h) => (
              <option key={h.number} value={h.number}>
                {h.area} — {h.number}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Display Screen */}
        <div className="bg-[#1c2e24] text-white p-4 rounded-2xl border border-[#2d5a3f] text-center mb-3 shadow-inner">
          <div className="text-[10px] text-emerald-300/80 font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{callActive ? '🟢 Live Call Connected' : 'Ready to Dial'}</span>
            <span>{ivrLanguage.toUpperCase()} IVR</span>
          </div>

          <div className="text-2xl font-bold font-mono tracking-wider text-emerald-400 py-1 min-h-[36px] flex items-center justify-center gap-1">
            {dialedNumber || <span className="text-stone-500 text-sm font-sans">Type or tap keypad...</span>}
            {!callActive && <span className="w-2 h-5 bg-emerald-400 animate-pulse inline-block"></span>}
          </div>

          {callActive && (
            <div className="mt-2 pt-2 border-t border-emerald-800/60 text-xs text-emerald-200 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {ivrStep === 1 && 'Menu: Press 1 (Rates), 2 (Van Pickup), 3 (Saathi)'}
              {ivrStep === 2 && 'Rates Announced & Dispatched via SMS'}
              {ivrStep === 3 && 'Choose Material: 1 (Copper), 2 (PCB), 3 (Battery)'}
              {ivrStep === 4 && 'Pickup Scheduled with OTP 582914'}
              {ivrStep === 5 && 'Connected to Digital Saathi'}
            </div>
          )}
        </div>

        {/* Interactive Phone Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
            <button
              key={key}
              onClick={() => handleDigitPress(key)}
              className={`p-3 rounded-xl font-mono text-base font-black transition cursor-pointer border border-[#e2e0d4] active:scale-90 ${
                pressedKey === key
                  ? 'bg-[#2d5a3f] text-white scale-95'
                  : 'bg-[#f5f5f0] hover:bg-stone-200 text-stone-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Backspace / Clear for dialer */}
        {!callActive && (
          <div className="flex items-center justify-between gap-2 mb-3 text-xs">
            <button
              onClick={handleClear}
              className="py-1.5 px-3 rounded-lg bg-[#f5f5f0] hover:bg-stone-200 border border-[#e2e0d4] text-stone-600 font-bold transition cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={handleBackspace}
              className="py-1.5 px-3 rounded-lg bg-[#f5f5f0] hover:bg-stone-200 border border-[#e2e0d4] text-stone-700 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Delete className="w-3.5 h-3.5" /> Backspace
            </button>
          </div>
        )}

        {/* Dual Calling Controls */}
        <div className="space-y-2">
          {!callActive ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleStartCall}
                className="py-3 px-3 rounded-xl bg-[#2d5a3f] hover:bg-[#234832] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Interactive IVR</span>
              </button>

              <button
                onClick={handleRealCellularCall}
                className="py-3 px-3 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Call on Device (tel:)</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-full py-3 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Hang Up Call</span>
            </button>
          )}
        </div>

        {/* Simulated SMS Notification Received */}
        {smsSent && (
          <div className="mt-3 p-3 bg-[#fef3c7] border border-[#fde68a] rounded-2xl text-xs text-[#92400e] flex items-start gap-2.5 animate-fade-in">
            <MessageSquare className="w-4 h-4 text-[#b45309] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px] uppercase text-[#b45309]">
                Simulated SMS Dispatched to Collector Phone:
              </span>
              <p className="text-xs text-stone-800 mt-1 font-mono bg-white p-2 rounded-lg border border-[#fde68a]">
                "{smsText}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

