import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { Behavior, BehaviorStep, COLOR_OPTIONS, ICON_OPTIONS } from '@/constants/behaviors';
import { upsertBehavior, uploadAudio } from '@/services/behaviorService';
import { useBehaviors } from '@/hooks/useBehaviors';
import { useAlert } from '@/template';

function generateId() {
  return 'behavior_' + Date.now().toString(36);
}

const EMPTY_BEHAVIOR: Behavior = {
  id: '',
  title: '',
  subtitle: '',
  iconName: 'headphones',
  color: '#5B3D91',
  audioDuration: '00:00',
  audioScript: '',
  audioUrl: undefined,
  steps: [{ number: 1, title: '', description: '' }],
};

export default function BehaviorForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { behaviors, refresh } = useBehaviors();
  const { showAlert } = useAlert();

  const isEdit = !!id;
  const existing = behaviors.find((b) => b.id === id);

  const [form, setForm] = useState<Behavior>(
    existing ? { ...existing } : { ...EMPTY_BEHAVIOR, id: generateId() }
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioFileName, setAudioFileName] = useState<string>('');

  useEffect(() => {
    if (existing) setForm({ ...existing });
  }, [id]);

  const updateField = <K extends keyof Behavior>(key: K, val: Behavior[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const updateStep = (index: number, key: keyof BehaviorStep, val: string | number) => {
    const steps = [...form.steps];
    steps[index] = { ...steps[index], [key]: val };
    setForm((prev) => ({ ...prev, steps }));
  };

  const addStep = () => {
    const steps = [
      ...form.steps,
      { number: form.steps.length + 1, title: '', description: '' },
    ];
    setForm((prev) => ({ ...prev, steps }));
  };

  const removeStep = (index: number) => {
    if (form.steps.length <= 1) return;
    const steps = form.steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, number: i + 1 }));
    setForm((prev) => ({ ...prev, steps }));
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const file = result.assets[0];
      setIsUploadingAudio(true);
      setAudioFileName(file.name);

      const { url, error } = await uploadAudio(form.id, file.uri, file.name);
      setIsUploadingAudio(false);

      if (error) {
        showAlert('خطأ في الرفع', error);
        setAudioFileName('');
      } else if (url) {
        updateField('audioUrl', url);
        showAlert('تم الرفع', 'تم رفع الملف الصوتي بنجاح ✅');
      }
    } catch {
      setIsUploadingAudio(false);
      showAlert('خطأ', 'حدث خطأ أثناء اختيار الملف');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showAlert('تنبيه', 'يرجى إدخال عنوان السلوك');
      return;
    }
    if (form.steps.some((s) => !s.title.trim())) {
      showAlert('تنبيه', 'يرجى إدخال عنوان لكل الخطوات');
      return;
    }

    setIsSaving(true);
    const orderIndex = isEdit
      ? behaviors.findIndex((b) => b.id === form.id)
      : behaviors.length;

    const { error } = await upsertBehavior(form, orderIndex);
    setIsSaving(false);

    if (error) {
      showAlert('خطأ', 'فشل الحفظ: ' + error);
    } else {
      await refresh();
      showAlert('تم الحفظ ✅', isEdit ? 'تم تحديث السلوك بنجاح' : 'تم إضافة السلوك الجديد بنجاح');
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.saveHeaderBtn}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.saveHeaderText}>حفظ</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'تعديل السلوك' : 'سلوك جديد'}</Text>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <MaterialIcons name="chevron-right" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>المعلومات الأساسية</Text>

            <Field label="عنوان السلوك *">
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => updateField('title', v)}
                placeholder="مثال: عند صراخ الطفل"
                placeholderTextColor={Colors.textLight}
                textAlign="right"
              />
            </Field>

            <Field label="الوصف المختصر">
              <TextInput
                style={styles.input}
                value={form.subtitle}
                onChangeText={(v) => updateField('subtitle', v)}
                placeholder="جملة قصيرة توضح المحتوى"
                placeholderTextColor={Colors.textLight}
                textAlign="right"
              />
            </Field>

            <Field label="مدة الصوت (مثال: 04:32)">
              <TextInput
                style={styles.input}
                value={form.audioDuration}
                onChangeText={(v) => updateField('audioDuration', v)}
                placeholder="00:00"
                placeholderTextColor={Colors.textLight}
                textAlign="center"
                keyboardType="numbers-and-punctuation"
              />
            </Field>
          </View>

          {/* Color Picker */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>اللون</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: opt.value },
                    form.color === opt.value && styles.colorSwatchSelected,
                  ]}
                  onPress={() => updateField('color', opt.value)}
                  activeOpacity={0.8}
                >
                  {form.color === opt.value && (
                    <MaterialIcons name="check" size={18} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon Picker */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>الأيقونة</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    form.iconName === icon && {
                      backgroundColor: form.color + '25',
                      borderColor: form.color,
                    },
                  ]}
                  onPress={() => updateField('iconName', icon)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={icon as any}
                    size={24}
                    color={form.iconName === icon ? form.color : Colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Audio Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎧 الملف الصوتي</Text>

            {/* Upload from phone */}
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={handlePickAudio}
              disabled={isUploadingAudio}
              activeOpacity={0.8}
            >
              {isUploadingAudio ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <MaterialIcons name="upload-file" size={22} color={Colors.white} />
              )}
              <Text style={styles.uploadBtnText}>
                {isUploadingAudio ? 'جاري الرفع...' : 'رفع ملف صوتي من الهاتف (MP3/M4A)'}
              </Text>
            </TouchableOpacity>

            {audioFileName ? (
              <Text style={styles.uploadedName}>📎 {audioFileName}</Text>
            ) : null}

            {/* Or enter URL */}
            <Text style={styles.orDivider}>— أو —</Text>
            <Field label="رابط صوتي مباشر (URL)">
              <TextInput
                style={styles.input}
                value={form.audioUrl || ''}
                onChangeText={(v) => updateField('audioUrl', v || undefined)}
                placeholder="https://example.com/audio.mp3"
                placeholderTextColor={Colors.textLight}
                textAlign="left"
                autoCapitalize="none"
                keyboardType="url"
              />
            </Field>
            {form.audioUrl ? (
              <View style={styles.audioLinked}>
                <MaterialIcons name="link" size={16} color={Colors.teal} />
                <Text style={styles.audioLinkedText}>صوت مرتبط</Text>
              </View>
            ) : null}

            {/* Script */}
            <Field label="نص الصوت (Script)">
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.audioScript}
                onChangeText={(v) => updateField('audioScript', v)}
                placeholder="اكتبي نص الرسالة الصوتية هنا..."
                placeholderTextColor={Colors.textLight}
                textAlign="right"
                multiline
                numberOfLines={4}
              />
            </Field>
          </View>

          {/* Steps */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>الخطوات</Text>

            {form.steps.map((step, i) => (
              <View key={i} style={styles.stepBlock}>
                <View style={styles.stepHeader}>
                  <TouchableOpacity
                    onPress={() => removeStep(i)}
                    disabled={form.steps.length <= 1}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="remove-circle"
                      size={22}
                      color={form.steps.length <= 1 ? Colors.border : Colors.coral}
                    />
                  </TouchableOpacity>
                  <View style={[styles.stepNum, { backgroundColor: form.color }]}>
                    <Text style={styles.stepNumText}>{step.number}</Text>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  value={step.title}
                  onChangeText={(v) => updateStep(i, 'title', v)}
                  placeholder="عنوان الخطوة"
                  placeholderTextColor={Colors.textLight}
                  textAlign="right"
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={step.description}
                  onChangeText={(v) => updateStep(i, 'description', v)}
                  placeholder="تفاصيل الخطوة..."
                  placeholderTextColor={Colors.textLight}
                  textAlign="right"
                  multiline
                  numberOfLines={3}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.addStepBtn} onPress={addStep} activeOpacity={0.8}>
              <MaterialIcons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addStepText}>إضافة خطوة</Text>
            </TouchableOpacity>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <MaterialIcons name="save" size={22} color={Colors.white} />
                <Text style={styles.saveBtnText}>
                  {isEdit ? 'حفظ التعديلات' : 'إضافة السلوك'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 4,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 18,
    color: Colors.primary,
  },
  saveHeaderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    minWidth: 60,
    alignItems: 'center',
  },
  saveHeaderText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.white,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: Colors.textPrimary,
    transform: [{ scale: 1.15 }],
  },
  iconGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  uploadBtn: {
    backgroundColor: Colors.teal,
    borderRadius: Radius.full,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadow.button,
  },
  uploadBtnText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 14,
    color: Colors.white,
  },
  uploadedName: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.teal,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  orDivider: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    marginVertical: Spacing.sm,
  },
  audioLinked: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  audioLinkedText: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.teal,
  },
  stepBlock: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: 13,
    color: Colors.white,
  },
  addStepBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addStepText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 14,
    color: Colors.primary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadow.button,
  },
  saveBtnText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.white,
  },
});
