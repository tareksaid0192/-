import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { AudioPlayer } from '@/components';
import { useApp } from '@/hooks/useApp';
import { useBehaviors } from '@/hooks/useBehaviors';

export default function BehaviorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toggleFavorite, isFavorite } = useApp();
  const { behaviors } = useBehaviors();

  const behavior = behaviors.find((b) => b.id === id);

  if (!behavior) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>السلوك غير موجود</Text>
      </View>
    );
  }

  const fav = isFavorite(behavior.id);

  const STEP_COLORS = [Colors.primary, Colors.teal, Colors.yellow, Colors.coral];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: behavior.color + '40' }]}>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(behavior.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons
            name={fav ? 'favorite' : 'favorite-border'}
            size={26}
            color={fav ? Colors.coral : Colors.textLight}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{behavior.title}</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="chevron-right" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle Banner */}
        <View style={[styles.subtitleBanner, { backgroundColor: behavior.color + '15', borderRightColor: behavior.color }]}>
          <MaterialIcons name="info-outline" size={18} color={behavior.color} />
          <Text style={[styles.subtitleText, { color: behavior.color }]}>
            {behavior.subtitle}
          </Text>
        </View>

        {/* Audio Player */}
        <AudioPlayer duration={behavior.audioDuration} script={behavior.audioScript} audioUrl={behavior.audioUrl} />

        {/* Steps Section */}
        <View style={styles.stepsCard}>
          <View style={styles.stepsSectionHeader}>
            <MaterialIcons name="format-list-numbered" size={20} color={Colors.primary} />
            <Text style={styles.stepsTitle}>الخطوات</Text>
          </View>

          <View style={styles.timeline}>
            {behavior.steps.map((step, index) => {
              const stepColor = STEP_COLORS[index % STEP_COLORS.length];
              return (
                <View key={step.number} style={styles.stepRow}>
                  {/* Timeline line */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.stepCircle, { backgroundColor: stepColor }]}>
                      <Text style={styles.stepNumber}>{step.number}</Text>
                    </View>
                    {index < behavior.steps.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: stepColor + '40' }]} />
                    )}
                  </View>

                  {/* Content */}
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: stepColor }]}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            التكرار والاتساق هما مفتاح النجاح في تعديل السلوك. استمري يا ماما!
          </Text>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontFamily: FontFamily.cairo,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
  },
  favBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
  },
  subtitleBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderRightWidth: 3,
    marginBottom: Spacing.md,
  },
  subtitleText: {
    fontFamily: FontFamily.cairoSemiBold,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  stepsSectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  stepsTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.primary,
  },
  timeline: {},
  stepRow: {
    flexDirection: 'row-reverse',
    marginBottom: Spacing.sm,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
    marginLeft: Spacing.sm,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: 14,
    color: Colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    minHeight: 24,
  },
  stepContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  stepTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    textAlign: 'right',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderRightWidth: 3,
    borderRightColor: Colors.primary,
  },
  tipEmoji: {
    fontSize: 22,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
    lineHeight: 22,
  },
});
