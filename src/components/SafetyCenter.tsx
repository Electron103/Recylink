import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { voiceService } from '../services/voiceService';
import {
  ShieldAlert,
  Flame,
  BatteryWarning,
  Eye,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Sparkles,
  HeartPulse
} from 'lucide-react';

interface SafetyCenterProps {
  language: LanguageCode;
}

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const safetyItems = [
    {
      id: 'cable_burn',
      title: language === 'hi' ? 'तारों को कभी न जलाएं' : language === 'mr' ? 'तारा कधीही जाळू नका' : 'Never Burn PVC Wires',
      icon: <Flame className="w-7 h-7 text-rose-500" />,
      do: language === 'hi' ? 'तारों को पूरा रीसाइक्लर को दें (मैकेनिकल स्ट्रिपिंग से 25% ज्यादा रेट मिलेगा)' : language === 'mr' ? 'तारा तशाच रिसायकलरला द्या (२५% जास्त भाव मिळेल)' : 'Hand over cables intact for mechanized granulator recovery',
      dont: language === 'hi' ? 'खुले में आग लगाकर प्लास्टिक न जलाएं (जहरीला डाइऑक्सिन धुआं फेफड़ों को नुकसान पहुंचाता है)' : language === 'mr' ? 'उघड्यावर जाळू नका (विषारी धूर)' : 'Open-air burning releases toxic dioxin & furans and reduces copper recovery rate',
      audioText: language === 'hi'
        ? 'तारों को कभी न जलाएं। रीसाइक्लर को सीधे देने पर 25% अधिक दाम मिलता है और फेफड़े सुरक्षित रहते हैं।'
        : language === 'mr'
        ? 'तारा कधीही जाळू नका. थेट रिसायकलरला दिल्यास २५% जास्त दर मिळतो.'
        : 'Never burn wires in open air. Direct mechanical processing gives 25% higher payouts and protects lungs.'
    },
    {
      id: 'battery_crush',
      title: language === 'hi' ? 'बैटरी को न तोड़ें / न दबाएं' : language === 'mr' ? 'बॅटरी फोडू नका' : 'Do Not Puncture Lithium Batteries',
      icon: <BatteryWarning className="w-7 h-7 text-amber-500" />,
      do: language === 'hi' ? 'सूखे और ठंडे स्थान पर रखें, सीधे रीसाइक्लर वाहन को सौंपें' : language === 'mr' ? 'कोरड्या जागी ठेवा आणि वाहनाला द्या' : 'Store in dry shaded bins with taped terminals',
      dont: language === 'hi' ? 'हथौड़े से न तोड़ें (आग और विस्फोट का गंभीर खतरा)' : language === 'mr' ? 'हातोड्याने फोडू नका' : 'Hammering or crushing induces thermal runaway fires and toxic acid leaks',
      audioText: language === 'hi'
        ? 'लिथियम बैटरी को हथौड़े से न तोड़ें। यह फट सकती है। इसे हमेशा अलग बॉक्स में रखें।'
        : language === 'mr'
        ? 'लिथियम बॅटरी फोडू नका. स्फोट होऊ शकतो.'
        : 'Do not crush lithium batteries as they can explode. Store them separately.'
    },
    {
      id: 'crt_implosion',
      title: language === 'hi' ? 'सीआरटी टीवी ग्लास न फोड़ें' : language === 'mr' ? 'टीव्हीची काच फोडू नका' : 'Avoid CRT Glass Implosion',
      icon: <Eye className="w-7 h-7 text-sky-500" />,
      do: language === 'hi' ? 'टीवी पिक्चर ट्यूब को बिना तोड़े पूरा रखें' : language === 'mr' ? 'पिक्चर ट्यूब अखंड ठेवा' : 'Handle CRT funnel glass intact to contain toxic lead',
      dont: language === 'hi' ? 'कांच फोड़कर तांबे का योक न निकालें (लेड और कांच की धार खतरनाक है)' : language === 'mr' ? 'काच फोडू नका' : 'Breaking glass releases hazardous lead dust into informal settlements',
      audioText: language === 'hi'
        ? 'सीआरटी टीवी की पिक्चर ट्यूब न फोड़ें। इसमें खतरनाक लेड होता है।'
        : language === 'mr'
        ? 'टीव्हीची काच फोडू नका, यात विषारी शिसे असते.'
        : 'Do not break CRT TV picture tubes. They contain hazardous heavy metals.'
    },
    {
      id: 'ppe_gear',
      title: language === 'hi' ? 'सुरक्षा दस्ताने और जूते पहनें' : language === 'mr' ? 'हातमोजे आणि बूट वापरा' : 'Wear Protective Safety Gloves',
      icon: <ShieldAlert className="w-7 h-7 text-emerald-500" />,
      do: language === 'hi' ? 'पॉइंट्स भुनाकर मुफ्त में मजबूत रबर दस्ताने पाएं' : language === 'mr' ? 'पॉइंट्स वापरून मोफत हातमोजे मिळवा' : 'Redeem Green Points for puncture-resistant gloves and footwear',
      dont: language === 'hi' ? 'नंगे हाथों से नुकीले सर्किट बोर्ड और तार न उठाएं' : language === 'mr' ? 'उघड्या हातांनी काम करू नका' : 'Handling raw sharp electronic scrap bare-handed causes infections and cuts',
      audioText: language === 'hi'
        ? 'हमेशा दस्ताने पहनकर काम करें। आप ग्रीन पॉइंट्स से मुफ्त दस्ताने ले सकते हैं।'
        : language === 'mr'
        ? 'हातमोजे वापरा आणि सुरक्षित राहा.'
        : 'Always wear protective gloves when handling sharp electronic scrap.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bento-card rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shadow-2xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.safety.title}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{t.safety.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black shadow-2xs">
          <HeartPulse className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Zero-Hazard Informal Protection</span>
        </div>
      </div>

      {/* Grid of Pictorial Safety Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safetyItems.map((item) => (
          <div
            key={item.id}
            className="bento-card rounded-3xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                    {item.icon}
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => voiceService.speak(item.audioText, language)}
                  className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer shadow-2xs active:scale-95"
                  title="Listen in your language"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Do vs Don't */}
              <div className="space-y-2.5 mb-2">
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-emerald-900">DO: </span>
                    <span className="text-slate-700 font-medium">{item.do}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-rose-900">AVOID: </span>
                    <span className="text-slate-700 font-medium">{item.dont}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bento-card rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">National E-Waste Safety Helpline (Toll-Free)</h4>
            <p className="text-xs text-slate-400">Available 24/7 in Hindi, Marathi, Bengali, Tamil, Telugu, and English</p>
          </div>
        </div>
        <a
          href="tel:1800112233"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          📞 Call 1800-11-2233
        </a>
      </div>
    </div>
  );
};
