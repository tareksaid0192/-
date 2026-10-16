import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ChatBubble } from '../components/ChatBubble';
import { getSpecialistAIResponse } from '../services/aiService';
import {
  User,
  Bot,
  Send,
  Edit2,
  Check,
  X,
  ShieldAlert,
  Info,
  Loader2,
  Sparkles,
  Smartphone,
  Download,
} from 'lucide-react';

interface SettingsViewProps {
  onOpenAdmin: () => void;
  onOpenInstallModal?: () => void;
}

const QUICK_QUESTIONS = [
  'طفلي بيصرخ كتير',
  'بيرفض يدخل ينام',
  'بيضرب لما يزعل',
  'إزاي استخدم المكافأة؟',
  'بيرفض ياكل أصناف جديدة',
];

export function SettingsView({ onOpenAdmin, onOpenInstallModal }: SettingsViewProps) {
  const {
    motherName,
    childName,
    setMotherName,
    setChildName,
    chatMessages,
    addChatMessage,
    showToast,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempMotherName, setTempMotherName] = useState(motherName);
  const [tempChildName, setTempChildName] = useState(childName);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMotherName(tempMotherName.trim() || 'ماما');
    setChildName(tempChildName.trim() || 'طفلي');
    setIsEditingProfile(false);
    showToast('تم الحفظ', 'تم تحديث بياناتك بنجاح 💜', 'success');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    addChatMessage(userMsg);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getSpecialistAIResponse(text);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      addChatMessage(assistantMsg);
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'آسفة يا ماما، حدث خطأ بسيط. يرجى المحاولة مرة أخرى 💜',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <h2 className="font-extrabold text-xl text-[#2D253D]">الإعدادات والمساعد الشخصي</h2>
        <p className="text-xs text-[#7A708A] mt-0.5">
          إدارة ملفك واستشارة أخصائي السلوك الذكي
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#5B3D91]" />
            <h3 className="font-extrabold text-base text-[#2D253D]">الملف الشخصي</h3>
          </div>
          {!isEditingProfile && (
            <button
              onClick={() => {
                setTempMotherName(motherName);
                setTempChildName(childName);
                setIsEditingProfile(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#5B3D91] bg-[#5B3D91]/10 hover:bg-[#5B3D91]/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              تعديل
            </button>
          )}
        </div>

        {!isEditingProfile ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#F8F6FA] p-3 rounded-xl border border-[#EAE4F2]">
              <span className="text-[11px] text-[#7A708A] block">اسم الأم / المربي</span>
              <span className="font-bold text-sm text-[#2D253D]">
                {motherName || 'غير محدد'}
              </span>
            </div>
            <div className="bg-[#F8F6FA] p-3 rounded-xl border border-[#EAE4F2]">
              <span className="text-[11px] text-[#7A708A] block">اسم الطفل</span>
              <span className="font-bold text-sm text-[#2D253D]">
                {childName || 'غير محدد'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#7A708A] mb-1">اسمكِ</label>
              <input
                type="text"
                value={tempMotherName}
                onChange={(e) => setTempMotherName(e.target.value)}
                placeholder="أدخلي اسمكِ"
                className="w-full px-3.5 py-2.5 bg-[#F8F6FA] rounded-xl border border-[#EAE4F2] text-sm text-[#2D253D] outline-none focus:border-[#5B3D91]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#7A708A] mb-1">اسم الطفل</label>
              <input
                type="text"
                value={tempChildName}
                onChange={(e) => setTempChildName(e.target.value)}
                placeholder="أدخلي اسم طفلكِ"
                className="w-full px-3.5 py-2.5 bg-[#F8F6FA] rounded-xl border border-[#EAE4F2] text-sm text-[#2D253D] outline-none focus:border-[#5B3D91]"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                حفظ
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 bg-[#EAE4F2] hover:bg-[#ded6e8] text-[#7A708A] font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>

      {/* AI Behavioral Coach Section */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-[#5B3D91]" />
          <h3 className="font-extrabold text-base text-[#2D253D]">
            المساعد الذكي - أخصائي تعديل السلوك
          </h3>
        </div>
        <p className="text-xs text-[#7A708A] mb-3">
          اسأليني عن أي سلوك وسأقدم لكِ خطة فورية مبنية على مبادئ ABA ولهجة مشجعة 💜
        </p>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap bg-[#F8F6FA] hover:bg-[#5B3D91]/10 text-[#5B3D91] font-semibold px-3 py-1.5 rounded-full border border-[#EAE4F2] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat box container */}
        <div className="bg-[#F8F6FA] rounded-2xl p-4 border border-[#EAE4F2] h-72 sm:h-80 overflow-y-auto space-y-1 mb-3">
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#7A708A] pt-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#5B3D91]" />
              <span>الأخصائي يكتب رداً علمياً لكِ...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتبي سؤالك هنا (مثال: طفلي يصرخ عند أخذ الهاتف)..."
            className="flex-1 px-4 py-3 bg-[#F8F6FA] rounded-2xl border border-[#EAE4F2] text-sm text-[#2D253D] outline-none focus:border-[#5B3D91] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[#5B3D91] hover:bg-[#4a2e7c] disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs"
            title="إرسال"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

      {/* Install / Export APK Button */}
      {onOpenInstallModal && (
        <button
          onClick={onOpenInstallModal}
          className="w-full bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#5B3D91]/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <Smartphone className="w-5 h-5 text-[#FFC567]" />
          <span>تثبيت التطبيق على الهاتف أو تحميل APK</span>
        </button>
      )}

      {/* Admin Panel Button */}
      <button
        onClick={onOpenAdmin}
        className="w-full bg-[#2D253D] hover:bg-[#1f192b] text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <ShieldAlert className="w-5 h-5 text-[#FFC567]" />
        <span>لوحة التحكم (للمشرف)</span>
      </button>

      {/* App Info Footer */}
      <div className="text-center py-3 text-[#7A708A] space-y-1">
        <p className="font-extrabold text-sm text-[#5B3D91] font-poppins">معاً نقدر v1.0</p>
        <p className="text-xs">خطوات بسيطة.. لسلوك أفضل 💜</p>
      </div>
    </div>
  );
}
