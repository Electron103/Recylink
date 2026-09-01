import React, { useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  LotItem,
  CollectorProfile,
  NotificationItem,
  MaterialCategory
} from './types';
import { MOCK_COLLECTORS, MOCK_NOTIFICATIONS } from './data/mockData';
import { apiService } from './services/apiService';
import { voiceService } from './services/voiceService';
import { TRANSLATIONS } from './services/i18n';

// Components
import { Navbar } from './components/Navbar';
import { CollectorHome } from './components/CollectorHome';
import { SellMaterialWorkflow } from './components/SellMaterialWorkflow';
import { PriceBoard } from './components/PriceBoard';
import { MyLotsView } from './components/MyLotsView';
import { EarningsLedger } from './components/EarningsLedger';
import { SafetyCenter } from './components/SafetyCenter';
import { DigitalSaathiDashboard } from './components/DigitalSaathiDashboard';
import { RecyclerDashboard } from './components/RecyclerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { FeaturePhoneIVRModal } from './components/FeaturePhoneIVRModal';
import { JudgeTourModal } from './components/JudgeTourModal';
import { NotificationsModal } from './components/NotificationsModal';

// Icons
import {
  Home,
  Camera,
  TrendingUp,
  PackageCheck,
  Wallet,
  ShieldCheck,
  Mic,
  WifiOff
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('COLLECTOR');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('hi'); // Starts in Hindi for accessibility
  const [activeView, setActiveView] = useState<string>('home');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modals state
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [ivrModalOpen, setIvrModalOpen] = useState(false);
  const [judgeTourOpen, setJudgeTourOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Data state
  const [collector, setCollector] = useState<CollectorProfile>(MOCK_COLLECTORS[0]);
  const [lots, setLots] = useState<LotItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Pre-filled state for selling workflow from voice
  const [sellInitialCategory, setSellInitialCategory] = useState<MaterialCategory>('pcb');
  const [sellInitialWeight, setSellInitialWeight] = useState<number>(40);

  // Load lots on mount
  useEffect(() => {
    const loadInitialLots = async () => {
      try {
        const fetched = await apiService.getLots();
        setLots(fetched);
      } catch (e) {
        console.error('Failed to load lots', e);
      }
    };
    loadInitialLots();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'COLLECTOR') setActiveView('home');
    else if (role === 'SAATHI') setActiveView('saathi');
    else if (role === 'RECYCLER') setActiveView('recycler');
    else if (role === 'ADMIN') setActiveView('admin');
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
  };

  const handleStartSellWithVoiceData = (data: { category: string; weightKg: number }) => {
    setSellInitialCategory(data.category as MaterialCategory);
    setSellInitialWeight(data.weightKg);
    setActiveView('sell');
  };

  const handleLotCreated = (newLot: LotItem) => {
    setLots((prev) => [newLot, ...prev.filter((l) => l.id !== newLot.id)]);
    setActiveView('lots');
  };

  const handleLotUpdated = (updatedLot: LotItem) => {
    setLots((prev) => prev.map((l) => (l.id === updatedLot.id ? updatedLot : l)));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleJumpFromTour = (view: string, role?: UserRole) => {
    if (role) setCurrentRole(role);
    setActiveView(view);
  };

  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="min-h-screen tricolor-page-bg text-[#2d2d2a] flex flex-col font-sans selection:bg-[#2d5a3f] selection:text-white pb-20 sm:pb-8 relative overflow-x-hidden">
      {/* Top Indian Tricolor Ribbon (Saffron, White, Green) */}
      <div className="tricolor-ribbon sticky top-0 z-50 shadow-xs" />

      {/* Ambient Tricolor Background Layers & Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Saffron Aura (Top) */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-[#ff9933]/15 via-[#ff9933]/5 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-12 -right-24 w-96 h-96 bg-[#ff9933]/10 rounded-full blur-3xl" />
        
        {/* Navy Blue Ashoka Chakra subtle central pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#000080]/2 rounded-full blur-3xl" />

        {/* India Green Aura (Bottom) */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-t from-[#138808]/15 via-[#138808]/5 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-12 -left-24 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl" />
      </div>

      {/* Top Main Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenVoice={() => setVoiceAssistantOpen(true)}
        onOpenIVR={() => setIvrModalOpen(true)}
        onOpenTour={() => setJudgeTourOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        notifications={notifications}
      />

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-[#fef3c7] border-b border-[#fde68a] text-[#92400e] text-xs px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-[#b45309]" />
          <span>
            {currentLanguage === 'hi'
              ? 'ऑफलाइन मोड सक्रिय: सभी लॉट और लेनदेन डिवाइस में सुरक्षित हैं। इंटरनेट आने पर सिंक होंगे।'
              : currentLanguage === 'mr'
              ? 'ऑफलाइन मोड सुरू: सर्व डेटा सुरक्षित आहे. इंटरनेट आल्यावर आपोआप सिंक होईल.'
              : 'Offline Mode Active: Local queued transactions will sync automatically when reconnected.'}
          </span>
        </div>
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full">
        {/* COLLECTOR PERSONA VIEWS */}
        {currentRole === 'COLLECTOR' && (
          <>
            {activeView === 'home' && (
              <CollectorHome
                collector={collector}
                lots={lots}
                language={currentLanguage}
                onNavigate={setActiveView}
                onOpenVoice={() => setVoiceAssistantOpen(true)}
              />
            )}

            {activeView === 'sell' && (
              <SellMaterialWorkflow
                collector={collector}
                language={currentLanguage}
                initialCategory={sellInitialCategory}
                initialWeightKg={sellInitialWeight}
                onLotCreated={handleLotCreated}
                onCancel={() => setActiveView('home')}
              />
            )}

            {activeView === 'prices' && <PriceBoard language={currentLanguage} />}

            {(activeView === 'lots' || activeView === 'pickup') && (
              <MyLotsView
                collector={collector}
                lots={lots}
                language={currentLanguage}
              />
            )}

            {activeView === 'earnings' && (
              <EarningsLedger
                collector={collector}
                lots={lots}
                language={currentLanguage}
              />
            )}

            {activeView === 'safety' && <SafetyCenter language={currentLanguage} />}
          </>
        )}

        {/* DIGITAL SAATHI PERSONA VIEW */}
        {currentRole === 'SAATHI' && (
          <DigitalSaathiDashboard
            language={currentLanguage}
            lots={lots}
            onLotCreated={handleLotCreated}
          />
        )}

        {/* RECYCLER PERSONA VIEW */}
        {currentRole === 'RECYCLER' && (
          <RecyclerDashboard
            language={currentLanguage}
            lots={lots}
            onLotUpdated={handleLotUpdated}
          />
        )}

        {/* CPCB & SIH ADMIN PERSONA VIEW */}
        {currentRole === 'ADMIN' && (
          <AdminDashboard language={currentLanguage} lots={lots} />
        )}
      </main>

      {/* National Clean India Mission / Tricolor Footer */}
      <footer className="mt-auto border-t border-[#e2e0d4] bg-[#ffffff]/80 backdrop-blur-sm py-4 px-4 text-center z-10 relative">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f5f5f0] border border-[#e2e0d4] text-sm">
              🇮🇳
            </span>
            <span className="font-bold text-[#234e36]">
              {currentLanguage === 'hi'
                ? 'रेसीलिंक: राष्ट्रीय ई-कचरा औपचारिकीकरण मंच'
                : currentLanguage === 'mr'
                ? 'रेसीलिंक: राष्ट्रीय ई-कचरा औपचारिकीकरण व्यासपीठ'
                : 'RecyLink: National E-Waste Formalization Network'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff9933]"></span>
              <span>स्वच्छ भारत</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#000080]"></span>
              <span>CPCB EPR Compliant</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
              <span>Digital India Mission</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Accessible Bottom Navigation (Visible on Collector Role) */}
      {currentRole === 'COLLECTOR' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#ffffff]/95 backdrop-blur-lg border-t border-[#e2e0d4] px-2 py-2 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
              activeView === 'home' ? 'text-[#2d5a3f] font-bold' : 'text-stone-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{t.nav.home}</span>
          </button>

          <button
            onClick={() => setActiveView('sell')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
              activeView === 'sell' ? 'text-[#2d5a3f] font-bold' : 'text-stone-500'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px]">{t.nav.sell}</span>
          </button>

          {/* Big Voice Button Floating in Bottom Bar */}
          <button
            onClick={() => setVoiceAssistantOpen(true)}
            className="w-12 h-12 -mt-5 rounded-full bg-[#2d5a3f] hover:bg-[#234832] text-white flex items-center justify-center shadow-lg shadow-[#2d5a3f]/30 active:scale-95 transition"
          >
            <Mic className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setActiveView('prices')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
              activeView === 'prices' ? 'text-[#2d5a3f] font-bold' : 'text-stone-500'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px]">{t.nav.prices}</span>
          </button>

          <button
            onClick={() => setActiveView('lots')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
              activeView === 'lots' ? 'text-[#2d5a3f] font-bold' : 'text-stone-500'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span className="text-[10px]">{t.nav.lots}</span>
          </button>
        </div>
      )}

      {/* Interactive Modals */}
      <VoiceAssistantModal
        isOpen={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
        language={currentLanguage}
        onStartSellWithData={handleStartSellWithVoiceData}
      />

      <FeaturePhoneIVRModal
        isOpen={ivrModalOpen}
        onClose={() => setIvrModalOpen(false)}
      />

      <JudgeTourModal
        isOpen={judgeTourOpen}
        onClose={() => setJudgeTourOpen(false)}
        onJumpToView={handleJumpFromTour}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />
    </div>
  );
}
