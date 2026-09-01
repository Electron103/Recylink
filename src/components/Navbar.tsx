import React, { useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  NotificationItem
} from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { apiService } from '../services/apiService';
import { voiceService } from '../services/voiceService';
import {
  Recycle,
  Mic,
  Globe,
  UserCheck,
  Bell,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Layers,
  ChevronDown,
  Sun,
  Moon,
  Zap
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenVoice: () => void;
  onOpenIVR: () => void;
  onOpenTour: () => void;
  onOpenNotifications: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  notifications: NotificationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentLanguage,
  onLanguageChange,
  onOpenVoice,
  onOpenIVR,
  onOpenTour,
  onOpenNotifications,
  activeView,
  onViewChange,
  isOnline,
  onToggleOnline,
  notifications,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSunlightMode = () => {
    const next = !isSunlightMode;
    setIsSunlightMode(next);
    if (next) {
      document.documentElement.classList.add('sunlight-mode');
    } else {
      document.documentElement.classList.remove('sunlight-mode');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo lots and transaction data to initial state?')) {
      await apiService.resetDemoData();
      window.location.reload();
    }
  };

  const getRoleBadgeColor = () => {
    switch (currentRole) {
      case 'COLLECTOR':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 font-black';
      case 'SAATHI':
        return 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100 font-black';
      case 'RECYCLER':
        return 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 font-black';
      case 'ADMIN':
        return 'bg-purple-50 text-purple-950 border-purple-300 hover:bg-purple-100 font-black';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      {/* Real-time National Scrap Exchange & Evaluation Ticker Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs overflow-hidden py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
          {/* Live Marquee Quotes */}
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex-shrink-0 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Rates
            </span>
            <div className="overflow-hidden whitespace-nowrap text-[11px] text-slate-300 font-medium flex items-center gap-4">
              <span className="hover:text-white cursor-default">
                ⚡ <strong className="text-white">PCB High-Grade:</strong> ₹385/kg <span className="text-emerald-400 font-bold">▲ +4.2%</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="hover:text-white cursor-default">
                🔌 <strong className="text-white">Copper Cables:</strong> ₹530/kg <span className="text-emerald-400 font-bold">▲ +2.8%</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="hover:text-white cursor-default">
                🔋 <strong className="text-white">Li-ion Batteries:</strong> ₹195/kg <span className="text-emerald-400 font-bold">▲ +1.5%</span>
              </span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="hidden md:inline text-amber-300">
                🛡️ 100% CPCB EPR Escrow Guaranteed
              </span>
            </div>
          </div>

          {/* Quick Demo Tour & Network Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 1-Click Guided Scenario Tour */}
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm transition active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
              <span>Judge Tour (21 Steps)</span>
            </button>

            {/* Sunlight / Outdoor High Contrast Toggle */}
            <button
              onClick={toggleSunlightMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                isSunlightMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title="Toggle Outdoor High-Contrast Sunlight Mode for field readability"
            >
              <Sun className={`w-3 h-3 ${isSunlightMode ? 'text-slate-950 animate-spin' : 'text-amber-400'}`} />
              <span className="hidden md:inline">{isSunlightMode ? 'Sunlight Mode ON' : 'Sunlight Mode'}</span>
            </button>

            {/* Feature Phone / IVR Simulator */}
            <button
              onClick={onOpenIVR}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
              title="Feature Phone IVR Simulation"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>IVR Basic Phone</span>
            </button>

            {/* Online / Offline Simulator */}
            <button
              onClick={onToggleOnline}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition ${
                isOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
              }`}
              title="Toggle Network Offline Simulator"
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={handleResetData}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => onViewChange('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 group-hover:shadow-emerald-700/30 transition transform">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  RECY<span className="text-emerald-700">LINK</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider shadow-2xs">
                  India E-Waste
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5 hidden sm:block font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Role-specific Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            {currentRole === 'COLLECTOR' && (
              <>
                <button
                  onClick={() => onViewChange('home')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'home'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.home}
                </button>
                <button
                  onClick={() => onViewChange('sell')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'sell'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.sell}
                </button>
                <button
                  onClick={() => onViewChange('prices')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'prices'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.prices}
                </button>
                <button
                  onClick={() => onViewChange('lots')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'lots'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.lots}
                </button>
                <button
                  onClick={() => onViewChange('earnings')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'earnings'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.earnings}
                </button>
                <button
                  onClick={() => onViewChange('safety')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeView === 'safety'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {t.nav.safety}
                </button>
              </>
            )}

            {currentRole === 'SAATHI' && (
              <>
                <button
                  onClick={() => onViewChange('saathi')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] font-bold"
                >
                  Digital Saathi Dashboard
                </button>
                <button
                  onClick={() => onViewChange('prices')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-[#edece4]"
                >
                  Price Board
                </button>
                <button
                  onClick={() => onViewChange('safety')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-[#edece4]"
                >
                  Safety Guides
                </button>
              </>
            )}

            {currentRole === 'RECYCLER' && (
              <>
                <button
                  onClick={() => onViewChange('recycler')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-bold"
                >
                  Recycler Operations Portal
                </button>
                <button
                  onClick={() => onViewChange('prices')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-[#edece4]"
                >
                  Market Bids
                </button>
              </>
            )}

            {currentRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => onViewChange('admin')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#f3e8ff] text-[#6b21a8] border border-[#e9d5ff] font-bold"
                >
                  CPCB & SIH Governance Monitor
                </button>
              </>
            )}
          </div>

          {/* Right Controls: Role Switcher + Language Selector + Voice Help + Notifications */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Global Voice Assistant Button (High Visibility Modern Emerald Pill) */}
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-700/25 transition transform active:scale-95 cursor-pointer border border-emerald-500/30"
              title="Speak in Hindi, Marathi, or English"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <Mic className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">बोलें / Voice AI</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangMenuOpen(!langMenuOpen);
                  setRoleMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100/90 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200/80 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {currentLanguage === 'hi' ? '🇮🇳 हिन्दी' : currentLanguage === 'mr' ? '🇮🇳 मराठी' : '🇬🇧 English'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      onLanguageChange('hi');
                      setLangMenuOpen(false);
                      voiceService.playChime(true);
                      voiceService.speak('हिन्दी भाषा सक्रिय की गई है।', 'hi');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between cursor-pointer ${
                      currentLanguage === 'hi' ? 'text-emerald-800 bg-emerald-50/80' : 'text-slate-700'
                    }`}
                  >
                    <span>🇮🇳 हिन्दी (Hindi)</span>
                    {currentLanguage === 'hi' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('mr');
                      setLangMenuOpen(false);
                      voiceService.playChime(true);
                      voiceService.speak('मराठी भाषा सक्रिय करण्यात आली आहे.', 'mr');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between cursor-pointer ${
                      currentLanguage === 'mr' ? 'text-emerald-800 bg-emerald-50/80' : 'text-slate-700'
                    }`}
                  >
                    <span>🇮🇳 मराठी (Marathi)</span>
                    {currentLanguage === 'mr' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('en');
                      setLangMenuOpen(false);
                      voiceService.playChime(true);
                      voiceService.speak('English language activated.', 'en');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between cursor-pointer ${
                      currentLanguage === 'en' ? 'text-emerald-800 bg-emerald-50/80' : 'text-slate-700'
                    }`}
                  >
                    <span>🇬🇧 English</span>
                    {currentLanguage === 'en' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown (Crucial for Demonstration) */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setLangMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer shadow-2xs ${getRoleBadgeColor()}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.roles[currentRole.toLowerCase() as keyof typeof t.roles]}</span>
                <span className="sm:hidden">{currentRole}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-2.5 z-50 animate-fade-in">
                  <div className="text-[10px] font-black text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    Switch Active Persona (Demo)
                  </div>

                  <button
                    onClick={() => {
                      onRoleChange('COLLECTOR');
                      onViewChange('home');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl text-xs font-medium transition flex items-center gap-3 mb-1 cursor-pointer ${
                      currentRole === 'COLLECTOR' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      RK
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Collection Partner</div>
                      <div className="text-[11px] text-slate-500">Ramesh Kumar (Dharavi)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('SAATHI');
                      onViewChange('saathi');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl text-xs font-medium transition flex items-center gap-3 mb-1 cursor-pointer ${
                      currentRole === 'SAATHI' ? 'bg-sky-50 text-sky-900 border border-sky-200/80 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      SS
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Digital Saathi Lead</div>
                      <div className="text-[11px] text-slate-500">Sunita Sharma (Community Lead)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('RECYCLER');
                      onViewChange('recycler');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl text-xs font-medium transition flex items-center gap-3 mb-1 cursor-pointer ${
                      currentRole === 'RECYCLER' ? 'bg-amber-50 text-amber-900 border border-amber-200/80 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      ES
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Authorized Recycler</div>
                      <div className="text-[11px] text-slate-500">EcoShred Solutions Pvt Ltd</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('ADMIN');
                      onViewChange('admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl text-xs font-medium transition flex items-center gap-3 cursor-pointer ${
                      currentRole === 'ADMIN' ? 'bg-purple-50 text-purple-900 border border-purple-200/80 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      CP
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">CPCB & SIH Admin</div>
                      <div className="text-[11px] text-slate-500">National Traceability Monitor</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
