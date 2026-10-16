import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Chip } from '../components/Chip';
import { StarRating } from '../components/StarRating';
import {
  BEHAVIOR_CHIPS,
  TIME_CHIPS,
  CAUSE_CHIPS,
  DURATION_CHIPS,
  RESULT_CHIPS,
} from '../constants/behaviors';
import { Save, TrendingUp, History, Trash2, Calendar, Star } from 'lucide-react';

const SEVERITY_LABELS = ['', 'خفيف جداً', 'خفيف', 'متوسط', 'شديد', 'شديد جداً'];

export function TrackerView() {
  const { trackerRecords, addTrackerRecord, deleteTrackerRecord, showToast } = useApp();

  const [selectedBehavior, setSelectedBehavior] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCause, setSelectedCause] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [severity, setSeverity] = useState(0);
  const [selectedResult, setSelectedResult] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBehavior || !selectedTime || !selectedResult || severity === 0) {
      showToast(
        'تنبيه',
        'يرجى تعبئة الحقول الأساسية: السلوك، الوقت، الشدة، والنتيجة',
        'info'
      );
      return;
    }

    addTrackerRecord({
      behavior: selectedBehavior,
      time: selectedTime,
      cause: selectedCause || 'غير محدد',
      duration: selectedDuration || 'أقل من 5 د',
      severity,
      result: selectedResult,
    });

    // Reset form
    setSelectedBehavior('');
    setSelectedTime('');
    setSelectedCause('');
    setSelectedDuration('');
    setSeverity(0);
    setSelectedResult('');

    showToast('تم الحفظ بنجاح ✅', 'تم تسجيل السلوك. استمري هكذا يا ماما 💜', 'success');
  };

  // Recent 7 records for chart
  const recentRecords = trackerRecords.slice(-7);
  const maxSeverity = 5;

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <h2 className="font-extrabold text-xl text-[#2D253D]">متابعة السلوك اليومي</h2>
        <p className="text-xs text-[#7A708A] mt-0.5">
          سجّلي الملاحظات بانتظام لمتابعة تحسن طفلك واكتشاف المثيرات
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs space-y-4">
        {/* Behavior */}
        <div>
          <label className="block font-bold text-sm text-[#2D253D] mb-1.5">
            السلوك الملاحظ <span className="text-[#FF6B6B]">*</span>
          </label>
          <div className="flex flex-wrap -m-1">
            {BEHAVIOR_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={selectedBehavior === chip}
                onPress={() => setSelectedBehavior(chip)}
                color="#5B3D91"
              />
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block font-bold text-sm text-[#2D253D] mb-1.5">
            وقت الحدوث <span className="text-[#FF6B6B]">*</span>
          </label>
          <div className="flex flex-wrap -m-1">
            {TIME_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={selectedTime === chip}
                onPress={() => setSelectedTime(chip)}
                color="#4DB6AC"
              />
            ))}
          </div>
        </div>

        {/* Cause / Antecedent */}
        <div>
          <label className="block font-bold text-sm text-[#2D253D] mb-1.5">
            المثير السابق (السبب المحتمل)
          </label>
          <div className="flex flex-wrap -m-1">
            {CAUSE_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={selectedCause === chip}
                onPress={() => setSelectedCause(chip)}
                color="#F59E0B"
              />
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block font-bold text-sm text-[#2D253D] mb-1.5">
            مدة النوبة
          </label>
          <div className="flex flex-wrap -m-1">
            {DURATION_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={selectedDuration === chip}
                onPress={() => setSelectedDuration(chip)}
                color="#FF6B6B"
              />
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="bg-[#F8F6FA] rounded-2xl p-4 text-center">
          <label className="block font-bold text-sm text-[#2D253D] mb-2">
            شدة السلوك <span className="text-[#FF6B6B]">*</span>
          </label>
          <StarRating value={severity} onChange={setSeverity} size={32} />
          {severity > 0 ? (
            <p className="text-sm font-bold text-[#5B3D91] mt-2">
              {SEVERITY_LABELS[severity]} ({severity} من 5)
            </p>
          ) : (
            <p className="text-xs text-[#7A708A] mt-1">اضغطي على النجوم لتحديد الشدة</p>
          )}
        </div>

        {/* Result */}
        <div>
          <label className="block font-bold text-sm text-[#2D253D] mb-1.5">
            النتيجة بعد التدخل <span className="text-[#FF6B6B]">*</span>
          </label>
          <div className="flex flex-wrap -m-1">
            {RESULT_CHIPS.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={selectedResult === chip}
                onPress={() => setSelectedResult(chip)}
                color="#4DB6AC"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5B3D91] hover:bg-[#4a2e7c] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#5B3D91]/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer mt-2"
        >
          <Save className="w-5 h-5" />
          <span>حفظ السجل</span>
        </button>
      </form>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-[#5B3D91]" />
          <h3 className="font-extrabold text-base text-[#2D253D]">
            التحسن الأسبوعي (شدة السلوك 1 - 5)
          </h3>
        </div>
        <p className="text-xs text-[#7A708A] mb-4">
          كلما انخفضت الأعمدة دل ذلك على استجابة الطفل للتهدئة والروتين
        </p>

        {/* Chart Area */}
        <div className="flex items-end gap-2 h-44 pt-4 pb-2 px-2 bg-[#F8F6FA] rounded-2xl border border-[#EAE4F2]">
          {/* Y Axis labels */}
          <div className="flex flex-col justify-between h-full text-[10px] text-[#7A708A] font-poppins pl-2 border-l border-[#EAE4F2]">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end justify-around h-full gap-2 px-2">
            {recentRecords.map((record, index) => {
              const heightPercent = Math.max(10, (record.severity / maxSeverity) * 100);
              const barColor =
                record.severity <= 2
                  ? '#4DB6AC' // Green/Teal (mild)
                  : record.severity <= 3
                  ? '#F59E0B' // Yellow (moderate)
                  : '#FF6B6B'; // Red/Coral (severe)
              return (
                <div key={record.id} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2D253D] text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
                    {record.behavior} ({record.severity}/5)
                  </div>
                  <div
                    className="w-full max-w-[28px] rounded-t-lg transition-all duration-500 shadow-xs"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  <span className="text-[10px] text-[#7A708A] font-poppins mt-1">
                    #{index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#7A708A]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4DB6AC]" />
            خفيف (1-2)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            متوسط (3)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
            شديد (4-5)
          </span>
        </div>
      </div>

      {/* History Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#5B3D91]" />
            <h3 className="font-extrabold text-base text-[#2D253D]">آخر السجلات</h3>
          </div>
          <span className="text-xs text-[#7A708A] font-medium">
            {trackerRecords.length} تسجيلاً
          </span>
        </div>

        <div className="grid gap-2.5">
          {trackerRecords
            .slice()
            .reverse()
            .map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-4 border border-[#EAE4F2] shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2D253D]">{rec.behavior}</span>
                    <span className="flex items-center gap-0.5 text-xs text-[#7A708A] font-poppins">
                      <Calendar className="w-3 h-3 text-[#7A708A]" />
                      {rec.date}
                    </span>
                  </div>

                  <p className="text-xs text-[#7A708A]">
                    {rec.time} • {rec.cause} • {rec.duration}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rec.severity }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        rec.result === 'هدأ بسرعة'
                          ? 'bg-[#4DB6AC]/15 text-[#4DB6AC]'
                          : 'bg-[#FF6B6B]/15 text-[#FF6B6B]'
                      }`}
                    >
                      {rec.result}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTrackerRecord(rec.id)}
                  className="p-2 text-[#B4A9C4] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-colors cursor-pointer"
                  title="حذف هذا السجل"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
