import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Layout Components
import { PersistentBanner } from './components/layout/PersistentBanner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { Background3D } from './components/layout/Background3D';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Modals & HUDs
import { VehicleDetailModal } from './components/modals/VehicleDetailModal';
import { ViolationEvidenceModal } from './components/modals/ViolationEvidenceModal';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';

// Views
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { CommandCenter } from './views/CommandCenter';
import { LiveMap } from './views/LiveMap';
import { SpeedIntelligence } from './views/SpeedIntelligence';
import { RepeatViolations } from './views/RepeatViolations';
import { StolenVehicles } from './views/StolenVehicles';
import { EmergencyResponse } from './views/EmergencyResponse';
import { IncidentCommand } from './views/IncidentCommand';
import { RiskIntelligence } from './views/RiskIntelligence';
import { AISafetyIntelligence } from './views/AISafetyIntelligence';
import { GovernmentReports } from './views/GovernmentReports';
import { ExecutiveDashboard } from './views/ExecutiveDashboard';
import { IntegrationArchitecture } from './views/IntegrationArchitecture';
import { SecurityAudit } from './views/SecurityAudit';
import { FutureVision } from './views/FutureVision';
import { TeamPage } from './views/TeamPage';
import { VehicleRegistration } from './views/VehicleRegistration';
import { ChallanDisputePortal } from './views/ChallanDisputePortal';
import { OfficerChallanDesk } from './views/OfficerChallanDesk';
import { VehicleRCLookup } from './views/VehicleRCLookup';
import { VehicleSurveillanceRadar } from './views/VehicleSurveillanceRadar';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useSimulation();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global key bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Landing & Login standalones
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login') {
    return <LoginPage />;
  }

  // Fallback to login if unauthenticated and not on landing
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'overview':
        return <CommandCenter />;
      case 'map':
        return <LiveMap />;
      case 'surveillance':
        return <VehicleSurveillanceRadar />;
      case 'challans':
        return <OfficerChallanDesk />;
      case 'rc_lookup':
        return <VehicleRCLookup />;
      case 'register_vehicle':
        return <VehicleRegistration />;
      case 'disputes':
        return <ChallanDisputePortal />;
      case 'speed':
        return <SpeedIntelligence />;
      case 'repeat':
        return <RepeatViolations />;
      case 'stolen':
        return <StolenVehicles />;
      case 'emergency':
        return <EmergencyResponse />;
      case 'incidents':
        return <IncidentCommand />;
      case 'risk':
        return <RiskIntelligence />;
      case 'ai':
        return <AISafetyIntelligence />;
      case 'reports':
        return <GovernmentReports />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'architecture':
        return <IntegrationArchitecture />;
      case 'security':
        return <SecurityAudit />;
      case 'future':
        return <FutureVision />;
      case 'team':
        return <TeamPage />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] flex flex-col text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 relative">
      {/* Dynamic 3D Geometric Perspective Background */}
      <Background3D />

      {/* Persistent Disclaimer Banner */}
      <PersistentBanner />

      {/* Top Header with Mobile Drawer Toggle */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Body Layout: Sidebar + Main Viewport */}
      <div className="flex-1 flex w-full relative z-10">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-7 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating Modals and Drawers */}
      <VehicleDetailModal />
      <ViolationEvidenceModal />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <GuidedDemoModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SimulationProvider>
            <AppContent />
          </SimulationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
