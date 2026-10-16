import React, { useState, useRef } from 'react';
import { useBehaviors } from '../contexts/BehaviorContext';
import { useApp } from '../contexts/AppContext';
import { Behavior, BehaviorStep } from '../types';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../constants/behaviors';
import { uploadAudioToSupabase } from '../services/behaviorService';
import {
  Lock,
  PlusCircle,
  Edit,
  Trash2,
  X,
  Check,
  Shield,
  Volume2,
  ArrowRight,
  ListOrdered,
  RotateCcw,
  Database,
  RefreshCw,
  Upload,
  Play,
  Square,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PIN = '0192T.said';

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const {
    behaviors,
    addBehavior,
    updateBehavior,
    deleteBehavior,
    resetToDefaults,
    supabaseHealth,
    isSyncing,
    refreshFromSupabase,
    seedToSupabase,
  } = useBehaviors();
  const { showToast } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Editing or Creating form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBehaviorId, setEditingBehaviorId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formColor, setFormColor] = useState('#5B3D91');
  const [formIcon, setFormIcon] = useState('headphones');
  const [formDuration, setFormDuration] = useState('03:30');
  const [formScript, setFormScript] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const [formSteps, setFormSteps] = useState<BehaviorStep[]>([
    { number: 1, title: 'الخطوة الأولى', description: 'اشرحي ما يجب فعله بهدوء' },
    { number: 2, title: 'الخطوة الثانية', description: 'التوجيه البديل والتعزيز الإيجابي' },
  ]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة');
      setPin('');
    }
  };

  const handleOpenAdd = () => {
    setEditingBehaviorId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormColor('#5B3D91');
    setFormIcon('headphones');
    setFormDuration('03:30');
    setFormScript('');
    setFormAudioUrl('');
    setFormSteps([
      { number: 1, title: 'الهدوء أولاً', description: 'أمّني المكان وحافظي على ملامح وجه هادئة تماماً' },
      { number: 2, title: 'التوجيه والبديل', description: 'قدمي أمراً واضحاً ومحدداً وساعدي الطفل في البداية' },
    ]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: Behavior) => {
    setEditingBehaviorId(b.id);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormColor(b.color);
    setFormIcon(b.iconName);
    setFormDuration(b.audioDuration);
    setFormScript(b.audioScript);
    setFormAudioUrl(b.audioUrl || '');
    setFormSteps(b.steps);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`هل أنتِ متأكدة من حذف "${title}"؟`)) {
      const res = await deleteBehavior(id);
      if (res.success) {
        showToast('تم الحذف', 'تم حذف السلوك بنجاح ومزامنته مع Supabase', 'info');
      } else {
        showToast('تنبيه', `تم الحذف محلياً (${res.error || 'فشل الاتصال بـ Supabase'})`, 'info');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    const targetId = editingBehaviorId || `beh_${Date.now()}`;
    const result = await uploadAudioToSupabase(targetId, file);
    setIsUploadingAudio(false);

    if (result.url) {
      setFormAudioUrl(result.url);
      showToast('تم رفع الصوت بنجاح ✅', 'تم رفع الملف الصوتي إلى مساحة تخزين Supabase', 'success');
    } else {
      showToast('خطأ في الرفع', result.error || 'فشل رفع الملف الصوتي، يمكنك لصق الرابط يدوياً', 'error');
    }
  };

  const handleToggleAudioPreview = () => {
    if (!formAudioUrl && !formScript) return;

    if (isPlayingPreview) {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingPreview(false);
    } else {
      if (formAudioUrl) {
        if (!audioPreviewRef.current) {
          audioPreviewRef.current = new Audio(formAudioUrl);
          audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
        } else {
          audioPreviewRef.current.src = formAudioUrl;
        }
        audioPreviewRef.current.play().catch(() => {});
        setIsPlayingPreview(true);
      } else if ('speechSynthesis' in window && formScript) {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(formScript);
        ut.lang = 'ar-SA';
        ut.onend = () => setIsPlayingPreview(false);
        window.speechSynthesis.speak(ut);
        setIsPlayingPreview(true);
      }
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('خطأ', 'يرجى كتابة عنوان السلوك', 'error');
      return;
    }

    const payload: Behavior = {
      id: editingBehaviorId || `beh_${Date.now()}`,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || 'تعديل السلوك خطوة بخطوة',
      color: formColor,
      iconName: formIcon,
      audioDuration: formDuration.trim() || '03:00',
      audioScript: formScript.trim() || 'حافظي على هدوئك ووجهي طفلك بلطف.',
      audioUrl: formAudioUrl.trim() || undefined,
      steps: formSteps,
    };

    if (editingBehaviorId) {
      const res = await updateBehavior(payload);
      if (res.success) {
        showToast('تم التحديث ✅', 'تم حفظ التعديلات ومزامنتها مع Supabase', 'success');
      } else {
        showToast('تم التحديث محلياً', `ملاحظة Supabase: ${res.error || 'الاتصال غير متاح'}`, 'info');
      }
    } else {
      const res = await addBehavior(payload);
      if (res.success) {
        showToast('تمت الإضافة ✅', 'تمت إضافة السلوك ومزامنته مع Supabase', 'success');
      } else {
        showToast('تمت الإضافة محلياً', `ملاحظة Supabase: ${res.error || 'الاتصال غير متاح'}`, 'info');
      }
    }
    setIsFormOpen(false);
  };

  const handleAddStep = () => {
    setFormSteps((prev) => [
      ...prev,
      {
        number: prev.length + 1,
        title: `الخطوة ${prev.length + 1}`,
        description: 'اكتبي تفاصيل الخطوة هنا',
      },
    ]);
  };

  const handleUpdateStep = (index: number, key: 'title' | 'description', val: string) => {
    setFormSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [key]: val } : step))
    );
  };

  const handleRemoveStep = (index: number) => {
    if (formSteps.length <= 1) return;
    setFormSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, number: i + 1 }))
    );
  };

  const handleSeedToSupabase = async () => {
    const res = await seedToSupabase();
    if (res.success) {
      showToast('تمت المزامنة بنجاح ✅', res.message, 'success');
    } else {
      showToast('تنبيه Supabase', res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D253D]/70 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-[#F8F6FA] w-full max-w-xl max-h-[92vh] rounded-3xl overflow-y-auto shadow-2xl border border-[#EAE4F2] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#EAE4F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#5B3D91]" />
            <h2 className="font-extrabold text-lg text-[#2D253D]">لوحة التحكم (المشرف)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F8F6FA] text-[#7A708A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {!isAuthenticated ? (
            /* PIN Screen */
            <form onSubmit={handleLogin} className="max-w-xs mx-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#5B3D91]/10 text-[#5B3D91] flex items-center justify-center mx-auto mb-2">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-[#2D253D]">كلمة مرور المشرف</h3>
              <p className="text-xs text-[#7A708A]">
                للوصول إلى إدارة محتوى السلوكيات والتسجيلات الصوتية وقاعدة بيانات Supabase
              </p>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="أدخلي كلمة المرور"
                  className="w-full text-center text-lg font-poppins py-3.5 pr-10 pl-10 bg-white rounded-2xl border-2 border-[#EAE4F2] focus:border-[#5B3D91] outline-none shadow-xs text-[#2D253D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#7A708A] hover:text-[#5B3D91] cursor-pointer"
                  title={showPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {pinError && <p className="text-xs text-[#FF6B6B] font-bold">{pinError}</p>}

              <button
                type="submit"
                className="w-full bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3.5 rounded-2xl shadow-md shadow-[#5B3D91]/20 cursor-pointer transition-all"
              >
                دخول
              </button>
            </form>
          ) : isFormOpen ? (
            /* Form view */
            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE4F2]">
                <h3 className="font-extrabold text-base text-[#2D253D]">
                  {editingBehaviorId ? 'تعديل السلوك' : 'إضافة سلوك جديد'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-[#7A708A] hover:text-[#5B3D91] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  رجوع للقائمة
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A708A] mb-1">
                  عنوان السلوك (مثال: عند صراخ الطفل)
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE4F2] text-sm text-[#2D253D] outline-none focus:border-[#5B3D91]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A708A] mb-1">
                  الوصف الفرعي (مثال: خطوات عملية للتعامل مع الصراخ)
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE4F2] text-sm text-[#2D253D] outline-none focus:border-[#5B3D91]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#7A708A] mb-1">اللون المميز</label>
                  <div className="flex items-center gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormColor(c.value)}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                          formColor === c.value ? 'scale-120 ring-2 ring-offset-2 ring-[#5B3D91]' : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A708A] mb-1">الأيقونة</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE4F2] text-xs text-[#2D253D] outline-none"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico.id} value={ico.id}>
                        {ico.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audio & Recording Configuration */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#EAE4F2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B3D91] flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    التسجيل والصوتيات (Supabase Storage)
                  </span>
                  {(formAudioUrl || formScript) && (
                    <button
                      type="button"
                      onClick={handleToggleAudioPreview}
                      className="text-xs flex items-center gap-1 text-[#5B3D91] hover:underline cursor-pointer"
                    >
                      {isPlayingPreview ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          إيقاف التجربة
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          تجربة الاستماع
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#7A708A] mb-1">
                      مدة التسجيل (د:ث)
                    </label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      placeholder="03:45"
                      className="w-full px-3.5 py-2 bg-[#F8F6FA] rounded-xl border border-[#EAE4F2] text-xs text-[#2D253D] outline-none font-poppins"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7A708A] mb-1">
                      رفع ملف صوتي (.mp3, .wav)
                    </label>
                    <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#5B3D91]/10 hover:bg-[#5B3D91]/20 text-[#5B3D91] rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingAudio ? 'جارِ الرفع...' : 'اختيار ملف صوتي'}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploadingAudio}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A708A] mb-1">
                    رابط ملف صوتي مباشر (اختياري)
                  </label>
                  <input
                    type="url"
                    value={formAudioUrl}
                    onChange={(e) => setFormAudioUrl(e.target.value)}
                    placeholder="https://.../audio.mp3"
                    className="w-full px-3.5 py-2 bg-[#F8F6FA] rounded-xl border border-[#EAE4F2] text-xs text-[#2D253D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A708A] mb-1">
                    نص الإرشاد الصوتي (يقرأه الصوت الذكي للأم إذا لم يتوفر ملف صوتي)
                  </label>
                  <textarea
                    rows={3}
                    value={formScript}
                    onChange={(e) => setFormScript(e.target.value)}
                    placeholder="اكتبي نصيحة الأخصائي التي سيتم قراءتها بصوت واضح للأم..."
                    className="w-full px-3.5 py-2 bg-[#F8F6FA] rounded-xl border border-[#EAE4F2] text-xs text-[#2D253D] outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Steps Builder */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#2D253D] flex items-center gap-1">
                    <ListOrdered className="w-4 h-4 text-[#5B3D91]" />
                    الخطوات العملية ({formSteps.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-xs text-[#5B3D91] font-bold hover:underline cursor-pointer"
                  >
                    + إضافة خطوة
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-[#EAE4F2] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#5B3D91]">
                          خطوة {step.number}
                        </span>
                        {formSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1 rounded-md cursor-pointer text-xs"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="عنوان الخطوة (مثال: الهدوء أولاً)"
                        value={step.title}
                        onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#F8F6FA] rounded-lg border border-[#EAE4F2] text-xs font-bold outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="شرح الخطوة للأم..."
                        value={step.description}
                        onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#F8F6FA] rounded-lg border border-[#EAE4F2] text-xs outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  حفظ ومزامنة
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 bg-[#EAE4F2] hover:bg-[#ded6e8] text-[#7A708A] font-bold py-3 rounded-xl text-sm cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            /* Dashboard view */
            <div className="space-y-4">
              {/* Supabase Connection Status Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#5B3D91]" />
                    <span className="font-extrabold text-xs text-[#2D253D]">
                      قاعدة بيانات Supabase
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      supabaseHealth?.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {supabaseHealth?.connected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        متصل وجاهز
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        وضع غير متصل / تخزين محلي
                      </>
                    )}
                  </span>
                </div>

                <p className="text-[11px] text-[#7A708A] font-poppins truncate">
                  URL: https://xhwisjtwavbuqgfubfig.supabase.co
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-[#EAE4F2]">
                  <button
                    onClick={refreshFromSupabase}
                    disabled={isSyncing}
                    className="flex-1 bg-[#F8F6FA] hover:bg-[#EAE4F2] text-[#5B3D91] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>مزامنة الآن</span>
                  </button>

                  <button
                    onClick={handleSeedToSupabase}
                    disabled={isSyncing}
                    className="flex-1 bg-[#5B3D91] hover:bg-[#4a2e7c] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع السلوكيات إلى Supabase</span>
                  </button>
                </div>
              </div>

              {/* Action & Stats */}
              <button
                onClick={handleOpenAdd}
                className="w-full bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <PlusCircle className="w-5 h-5" />
                <span>إضافة سلوك / مهارة جديدة</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] text-center">
                  <span className="block font-black text-2xl text-[#5B3D91] font-poppins">
                    {behaviors.length}
                  </span>
                  <span className="text-xs text-[#7A708A]">إجمالي السلوكيات</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EAE4F2] text-center">
                  <span className="block font-black text-2xl text-[#4DB6AC] font-poppins">
                    {behaviors.filter((b) => b.audioUrl).length}
                  </span>
                  <span className="text-xs text-[#7A708A]">صوتيات مرفوعة</span>
                </div>
              </div>

              {/* Behaviors List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#2D253D]">السلوكيات المسجلة</h4>
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريدين إعادة تعيين كل السلوكيات للافتراضية الأصلية؟')) {
                        resetToDefaults();
                        showToast('تمت الإعادة', 'تمت استعادة السلوكيات الافتراضية', 'info');
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#7A708A] hover:text-[#5B3D91] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    استعادة الافتراضي
                  </button>
                </div>

                <div className="grid gap-2">
                  {behaviors.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#EAE4F2] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: b.color }}
                        />
                        <div>
                          <h5 className="font-bold text-sm text-[#2D253D] leading-tight">
                            {b.title}
                          </h5>
                          <span className="text-xs text-[#7A708A]">
                            {b.steps.length} خطوات • {b.audioDuration}
                            {b.audioUrl && (
                              <span className="mr-1.5 text-[#4DB6AC] font-bold">
                                • صوت مخصص
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-2 rounded-xl text-[#5B3D91] hover:bg-[#5B3D91]/10 transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
                          className="p-2 rounded-xl text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
