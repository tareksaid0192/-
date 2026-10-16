import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { Chip, StarRating } from '@/components';
import { useApp } from '@/hooks/useApp';
import {
  BEHAVIOR_CHIPS,
  TIME_CHIPS,
  CAUSE_CHIPS,
  DURATION_CHIPS,
  RESULT_CHIPS,
} from '@/constants/behaviors';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');

const DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export default function FavoritesTab() {
  const insets = useSafeAreaInsets();
  const { trackerRecords, addTrackerRecord } = useApp();
  const { showAlert } = useAlert();

  const [selectedBehavior, setSelectedBehavior] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCause, setSelectedCause] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [severity, setSeverity] = useState(0);
  const [selectedResult, setSelectedResult] = useState('');

  const handleSave = () => {
    if (!selectedBehavior || !selectedTime || !selectedResult || severity === 0) {
      showAlert('تنبيه', 'يرجى تعبئة الحقول الأساسية: السلوك، الوقت، الشدة، والنتيجة');
      return;
    }
    addTrackerRecord({
      behavior: selectedBehavior,
      time: selectedTime,
      cause: selectedCause,
      duration: selectedDuration,
      severity,
      result: selectedResult,
    });
    setSelectedBehavior('');
    setSelectedTime('');
    setSelectedCause('');
    setSelectedDuration('');
    setSeverity(0);
    setSelectedResult('');
    showAlert('تم الحفظ ✅', 'تم تسجيل السلوك بنجاح. استمري هكذا يا ماما!');
  };

  // Build weekly chart data from last 7 records
  const recentRecords = trackerRecords.slice(-7);
  const maxSeverity = 5;
  const chartWidth = width - Spacing.md * 2 - Spacing.md * 2;
  const barWidth = Math.max(1, (chartWidth - 24) / 7);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>متابعة السلوك اليومي</Text>
        <Text style={styles.headerSubtitle}>سجّلي الملاحظات لمتابعة التحسن</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View style={styles.formCard}>
          {/* Behavior */}
          <FormSection title="السلوك">
            <View style={styles.chips}>
              {BEHAVIOR_CHIPS.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedBehavior === chip}
                  onPress={() => setSelectedBehavior(chip)}
                  color={Colors.primary}
                />
              ))}
            </View>
          </FormSection>

          {/* Time */}
          <FormSection title="وقت الحدوث">
            <View style={styles.chips}>
              {TIME_CHIPS.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedTime === chip}
                  onPress={() => setSelectedTime(chip)}
                  color={Colors.teal}
                />
              ))}
            </View>
          </FormSection>

          {/* Cause */}
          <FormSection title="السبب (السوابق)">
            <View style={styles.chips}>
              {CAUSE_CHIPS.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedCause === chip}
                  onPress={() => setSelectedCause(chip)}
                  color={Colors.yellow}
                />
              ))}
            </View>
          </FormSection>

          {/* Duration */}
          <FormSection title="مدة النوبة">
            <View style={styles.chips}>
              {DURATION_CHIPS.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedDuration === chip}
                  onPress={() => setSelectedDuration(chip)}
                  color={Colors.coral}
                />
              ))}
            </View>
          </FormSection>

          {/* Severity */}
          <FormSection title="شدة السلوك">
            <View style={styles.starCenter}>
              <StarRating value={severity} onChange={setSeverity} size={40} />
              {severity > 0 && (
                <Text style={styles.severityLabel}>
                  {['', 'خفيف جداً', 'خفيف', 'متوسط', 'شديد', 'شديد جداً'][severity]}
                </Text>
              )}
            </View>
          </FormSection>

          {/* Result */}
          <FormSection title="النتيجة">
            <View style={styles.chips}>
              {RESULT_CHIPS.map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  selected={selectedResult === chip}
                  onPress={() => setSelectedResult(chip)}
                  color={Colors.teal}
                />
              ))}
            </View>
          </FormSection>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
            <MaterialIcons name="save" size={20} color={Colors.white} />
            <Text style={styles.saveButtonText}>حفظ</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 التحسن خلال الأسبوع</Text>
          <Text style={styles.chartSubtitle}>شدة السلوك (1-5)</Text>

          <View style={styles.chartArea}>
            {/* Y axis labels */}
            <View style={styles.yAxis}>
              {[5, 4, 3, 2, 1].map((v) => (
                <Text key={v} style={styles.yLabel}>{v}</Text>
              ))}
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              {recentRecords.map((record, index) => {
                const barH = Math.max(4, (record.severity / maxSeverity) * 120);
                const color =
                  record.severity <= 2
                    ? Colors.teal
                    : record.severity <= 3
                    ? Colors.yellow
                    : Colors.coral;
                return (
                  <View key={record.id} style={styles.barColumn}>
                    <View style={[styles.bar, { height: barH, backgroundColor: color }]} />
                    <Text style={styles.barLabel}>{index + 1}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.chartLegend}>
            <LegendItem color={Colors.teal} label="خفيف" />
            <LegendItem color={Colors.yellow} label="متوسط" />
            <LegendItem color={Colors.coral} label="شديد" />
          </View>
        </View>

        {/* History */}
        <Text style={styles.historyTitle}>آخر السجلات</Text>
        {trackerRecords
          .slice()
          .reverse()
          .slice(0, 5)
          .map((record) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <Text style={styles.historyBehavior}>{record.behavior}</Text>
                <Text style={styles.historyDate}>{record.date}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyMeta}>{record.time} • {record.cause}</Text>
                <View style={styles.historySeverity}>
                  {Array.from({ length: record.severity }).map((_, i) => (
                    <MaterialIcons key={i} name="star" size={12} color={Colors.primary} />
                  ))}
                </View>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: record.result === 'هدأ بسرعة' ? Colors.teal + '20' : Colors.coral + '20' }]}>
                <Text style={[styles.resultText, { color: record.result === 'هدأ بسرعة' ? Colors.teal : Colors.coral }]}>
                  {record.result}
                </Text>
              </View>
            </View>
          ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={formStyles.section}>
      <Text style={formStyles.label}>{title}</Text>
      {children}
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ fontFamily: FontFamily.cairo, fontSize: 12, color: Colors.textSecondary }}>{label}</Text>
    </View>
  );
}

const formStyles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 22,
    color: Colors.primary,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  chips: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  starCenter: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  severityLabel: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    ...Shadow.button,
  },
  saveButtonText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.white,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  chartTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.md,
  },
  chartArea: {
    flexDirection: 'row-reverse',
    height: 140,
    alignItems: 'flex-end',
  },
  yAxis: {
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: Spacing.xs,
    paddingBottom: 4,
  },
  yLabel: {
    fontFamily: FontFamily.poppins,
    fontSize: 10,
    color: Colors.textLight,
    width: 12,
    textAlign: 'center',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: 140,
    paddingBottom: 20,
  },
  bar: {
    width: 20,
    borderRadius: 6,
    marginBottom: 4,
  },
  barLabel: {
    fontFamily: FontFamily.poppins,
    fontSize: 10,
    color: Colors.textLight,
    position: 'absolute',
    bottom: 0,
  },
  chartLegend: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  historyTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  historyRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyBehavior: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  historyDate: {
    fontFamily: FontFamily.poppins,
    fontSize: 12,
    color: Colors.textLight,
  },
  historyMeta: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  historySeverity: {
    flexDirection: 'row-reverse',
    gap: 2,
  },
  resultBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  resultText: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
  },
});
