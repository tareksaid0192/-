import React from 'react';
import { Home, FolderOpen, Star, Settings, Bell, Smartphone } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export type TabType = 'home' | 'content' | 'tracker' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenNotifications?: () => void;
  onOpenInstallModal?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenInstallModal,
}: NavbarProps) {
  const { motherName } = useApp();

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE4F2] px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/app-logo.png"
              alt="شعار معاً نقدر"
              className="w-10 h-10 rounded-xl object-contain shadow-xs bg-[#5B3D91]/5"
              onError={(e) => {
                // Fallback if image not rendered
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-[#5B3D91] leading-tight">
                معاً نقدر
              </h1>
              <p className="text-xs text-[#7A708A]">خطوات بسيطة.. لسلوك أفضل</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#5B3D91] hover:bg-[#4a2e7c] px-3 py-1.5 rounded-full shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="تثبيت التطبيق أو تحميل APK"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تثبيت / APK</span>
            </button>
            <button
              onClick={onOpenNotifications}
              className="w-9 h-9 rounded-full bg-[#F8F6FA] hover:bg-[#EAE4F2] text-[#5B3D91] flex items-center justify-center transition-colors cursor-pointer"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-xs font-semibold text-[#5B3D91] bg-[#5B3D91]/10 px-3 py-1.5 rounded-full">
              {motherName || 'ماما'} 💜
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile / Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#EAE4F2] py-2 px-4 shadow-lg sm:max-w-2xl sm:mx-auto sm:rounded-t-2xl">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#5B3D91] font-bold'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px]">الرئيسية</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'text-[#5B3D91] font-bold'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-[11px]">المحتوى</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tracker'
                ? 'text-[#5B3D91] font-bold'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="text-[11px]">المتابعة</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'text-[#5B3D91] font-bold'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[11px]">الإعدادات</span>
          </button>
        </div>
      </nav>
    </>
  );
}
