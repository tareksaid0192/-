import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { BehaviorProvider } from './contexts/BehaviorContext';
import { Navbar, TabType } from './components/Navbar';
import { WhatsAppFAB } from './components/WhatsAppFAB';
import { HomeView } from './views/HomeView';
import { ContentView } from './views/ContentView';
import { TrackerView } from './views/TrackerView';
import { SettingsView } from './views/SettingsView';
import { BehaviorDetailModal } from './views/BehaviorDetailModal';
import { AdminModal } from './views/AdminModal';
import { Behavior } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { toast, hideToast, motherName } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F6FA] text-[#2D253D] flex flex-col selection:bg-[#5B3D91] selection:text-white">
      {/* Top Navbar & Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeView
            onSelectBehavior={(b) => setSelectedBehavior(b)}
            onNavigateToContent={() => setActiveTab('content')}
          />
        )}

        {activeTab === 'content' && (
          <ContentView onSelectBehavior={(b) => setSelectedBehavior(b)} />
        )}

        {activeTab === 'tracker' && <TrackerView />}

        {activeTab === 'settings' && (
          <SettingsView
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}
      </main>

      {/* WhatsApp Specialist Floating Action Button */}
      <WhatsAppFAB />

      {/* Behavior Detail Modal */}
      <BehaviorDetailModal
        behavior={selectedBehavior}
        onClose={() => setSelectedBehavior(null)}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Notifications Drawer */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D253D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-[#EAE4F2] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE4F2]">
              <h3 className="font-extrabold text-base text-[#2D253D]">التنبيهات اليومية</h3>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="p-1 rounded-full hover:bg-[#F8F6FA] text-[#7A708A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-[#5B3D91]/10 rounded-2xl border-r-4 border-[#5B3D91]">
                <p className="text-xs font-bold text-[#5B3D91]">تذكير اليوم</p>
                <p className="text-xs text-[#2D253D] mt-1">
                  يا {motherName || 'ماما'}، لا تنسي تعزيز السلوك الإيجابي فور حدوثه!
                </p>
              </div>
              <div className="p-3 bg-[#4DB6AC]/10 rounded-2xl border-r-4 border-[#4DB6AC]">
                <p className="text-xs font-bold text-[#4DB6AC]">استشارة الأخصائي</p>
                <p className="text-xs text-[#2D253D] mt-1">
                  يمكنك التواصل المباشر عبر واتساب في أي وقت لطرح أي استفسار عاجل.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNotifOpen(false)}
              className="w-full bg-[#5B3D91] text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && toast.show && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 ${
              toast.type === 'error'
                ? 'bg-[#FF6B6B] text-white border-red-400'
                : toast.type === 'info'
                ? 'bg-[#4DB6AC] text-white border-teal-400'
                : 'bg-[#5B3D91] text-white border-purple-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              )}
              <div>
                <p className="font-bold text-xs">{toast.title}</p>
                <p className="text-xs opacity-90">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={hideToast}
              className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <BehaviorProvider>
        <AppContent />
      </BehaviorProvider>
    </AppProvider>
  );
}

export default App;
