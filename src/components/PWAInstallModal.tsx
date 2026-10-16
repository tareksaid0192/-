import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  Share2,
  ExternalLink,
  Copy,
  Check,
  X,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PWAInstallModal({ isOpen, onClose }: PWAInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'direct' | 'apk' | 'eas'>('direct');

  if (!isOpen) return null;

  const currentUrl = window.location.origin;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D253D]/70 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-[#F8F6FA] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#EAE4F2] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B3D91] to-[#7B5BAF] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">تثبيت التطبيق على الهاتف</h3>
              <p className="text-xs text-white/80">احصلي على التطبيق بصيغة APK أو تثبيت مباشر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="flex border-b border-[#EAE4F2] bg-white px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'direct'
                ? 'text-[#5B3D91] border-b-2 border-[#5B3D91]'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            تثبيت فوري على الشاشة
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'apk'
                ? 'text-[#5B3D91] border-b-2 border-[#5B3D91]'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            تصدير ملف APK (مجاناً)
          </button>
          <button
            onClick={() => setActiveTab('eas')}
            className={`pb-3 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'eas'
                ? 'text-[#5B3D91] border-b-2 border-[#5B3D91]'
                : 'text-[#7A708A] hover:text-[#5B3D91]'
            }`}
          >
            بناء عبر EAS Build
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#4DB6AC]" />
                  <h4 className="font-extrabold text-sm text-[#2D253D]">
                    أسرع طريقة: تثبيت التطبيق مباشرة (PWA)
                  </h4>
                </div>
                <p className="text-xs text-[#7A708A] leading-relaxed">
                  يمكنك تثبيت التطبيق كأنه تطبيق أصلي تماماً يفتح من الشاشة الرئيسية بدون شريط المتصفح ويعمل دون الحاجة لمتجر Google Play!
                </p>

                {isInstallable ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full mt-4 bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#5B3D91]/20 cursor-pointer transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>تثبيت التطبيق الآن على جهازك</span>
                  </button>
                ) : isIOS ? (
                  <div className="mt-3 bg-[#F8F6FA] p-3 rounded-xl border border-[#EAE4F2] space-y-2">
                    <p className="text-xs font-bold text-[#5B3D91]">
                      خطوات التثبيت على الآيفون (iOS):
                    </p>
                    <ol className="text-xs text-[#2D253D] space-y-1.5 pr-4 list-decimal">
                      <li>اضغطي على زر <strong>المشاركة (Share)</strong> في أسفل متصفح Safari.</li>
                      <li>انزلي للأسفل واختاري <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</li>
                      <li>اضغطي <strong>إضافة (Add)</strong> وسيظهر التطبيق بأيقونته كأي تطبيق آخر.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="mt-3 bg-[#F8F6FA] p-3 rounded-xl border border-[#EAE4F2] space-y-2">
                    <p className="text-xs font-bold text-[#5B3D91]">
                      خطوات التثبيت على الأندرويد (Chrome):
                    </p>
                    <ol className="text-xs text-[#2D253D] space-y-1.5 pr-4 list-decimal">
                      <li>افتحي رابط التطبيق في متصفح Chrome على هاتفك.</li>
                      <li>اضغطي على <strong>النقاط الثلاث (⋮)</strong> في أعلى الزاوية.</li>
                      <li>اختاري <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Copy URL Box */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE4F2]">
                <span className="text-[11px] font-bold text-[#7A708A] block mb-1">
                  رابط التطبيق لفتحه على الهاتف:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 px-3 py-2 bg-[#F8F6FA] rounded-xl text-xs font-poppins text-[#2D253D] border border-[#EAE4F2] outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3.5 py-2 bg-[#5B3D91] hover:bg-[#4a2e7c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#5B3D91]" />
                  <h4 className="font-extrabold text-sm text-[#2D253D]">
                    توليد ملف APK جاهز بضغطة زر (PWABuilder)
                  </h4>
                </div>
                <p className="text-xs text-[#7A708A] leading-relaxed">
                  موقع <strong>PWABuilder</strong> (المدعوم من Microsoft) يأخذ رابط التطبيق المباشر ويقوم بتوليد ملف <strong>APK أو AAB</strong> قابل للتثبيت فوراً على أي هاتف أندرويد ورفعه إلى Google Play!
                </p>

                <div className="bg-[#F8F6FA] p-3.5 rounded-xl border border-[#EAE4F2] space-y-2">
                  <p className="text-xs font-bold text-[#5B3D91]">الخطوات البسيطة:</p>
                  <ol className="text-xs text-[#2D253D] space-y-1.5 pr-4 list-decimal">
                    <li>
                      انسخي رابط التطبيق:
                      <div className="my-1.5 flex items-center gap-1">
                        <code className="text-[11px] bg-white px-2 py-1 rounded border border-[#EAE4F2] font-poppins text-[#5B3D91] select-all">
                          {currentUrl}
                        </code>
                        <button
                          onClick={handleCopyUrl}
                          className="text-[10px] bg-[#5B3D91]/10 text-[#5B3D91] px-2 py-1 rounded font-bold hover:bg-[#5B3D91]/20 cursor-pointer"
                        >
                          {copied ? 'تم النسخ' : 'نسخ'}
                        </button>
                      </div>
                    </li>
                    <li>
                      ادخلي إلى موقع <strong>PWABuilder</strong>.
                    </li>
                    <li>الصقي الرابط واضغطي <strong>Start</strong>.</li>
                    <li>اضغطي على <strong>Package for Stores</strong> ثم اختاري <strong>Android</strong>.</li>
                    <li>اضغطي <strong>Generate APK</strong> وسيقوم بتحميل ملف APK جاهز للتثبيت فوراً على هاتفك!</li>
                  </ol>
                </div>

                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#4DB6AC] hover:bg-[#3ea096] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#4DB6AC]/20 cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح PWABuilder لتوليد ملف APK الآن</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'eas' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#5B3D91]" />
                  <h4 className="font-extrabold text-sm text-[#2D253D]">
                    بناء APK محلياً عبر Expo EAS Build
                  </h4>
                </div>
                <p className="text-xs text-[#7A708A] leading-relaxed">
                  إذا أردتِ توليد ملف APK مباشرة من مستودع GitHub عبر نظام Expo EAS:
                </p>

                <div className="bg-[#2D253D] text-white p-3.5 rounded-xl text-left font-poppins text-xs space-y-2 overflow-x-auto">
                  <p className="text-[#B4A9C4] font-cairo text-right">أوامر البناء في سطر الأوامر (Terminal):</p>
                  <pre className="text-green-400"># 1. تثبيت أداة EAS CLI
npm install -g eas-cli

# 2. تسجيل الدخول بحساب Expo
eas login

# 3. إعداد البناء
eas build:configure

# 4. بناء ملف APK للتجربة المباشرة
eas build -p android --profile preview</pre>
                </div>
                <p className="text-[11px] text-[#7A708A]">
                  سيعطيكِ الرابط رابطاً مباشراً لتحميل ملف APK على هاتفك فور اكتمال البناء على سحابة Expo!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EAE4F2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#EAE4F2] hover:bg-[#ded6e8] text-[#2D253D] font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
