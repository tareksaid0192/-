import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useBehaviors } from '@/hooks/useBehaviors';

const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  headphones: 'headphones',
  list: 'list-alt',
  psychology: 'psychology',
  favorite: 'favorite',
};

export default function ContentTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isFavorite } = useApp();
  const { behaviors } = useBehaviors();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>دليل السلوكيات</Text>
        <Text style={styles.headerSubtitle}>اختاري السلوك للاطلاع على التفاصيل</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {behaviors.map((behavior) => {
          const iconName = ICON_MAP[behavior.iconName] || 'article';
          const fav = isFavorite(behavior.id);
          return (
            <TouchableOpacity
              key={behavior.id}
              style={styles.card}
              onPress={() => router.push(`/behavior/${behavior.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconCircle, { backgroundColor: behavior.color + '20' }]}>
                  <MaterialIcons name={iconName} size={32} color={behavior.color} />
                </View>
                {fav && (
                  <View style={styles.favBadge}>
                    <MaterialIcons name="favorite" size={14} color={Colors.coral} />
                  </View>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{behavior.title}</Text>
                <Text style={styles.cardSubtitle}>{behavior.subtitle}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.durationBadge}>
                    <MaterialIcons name="access-time" size={13} color={Colors.textSecondary} />
                    <Text style={styles.durationText}>{behavior.audioDuration}</Text>
                  </View>
                  <Text style={styles.stepsCount}>{behavior.steps.length} خطوات</Text>
                </View>
              </View>
              <View style={[styles.colorStripe, { backgroundColor: behavior.color }]} />
            </TouchableOpacity>
          );
        })}
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
    ...Shadow.card,
  },
  colorStripe: {
    width: 5,
  },
  cardTop: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardBody: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingRight: Spacing.md,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontFamily: FontFamily.poppins,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepsCount: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
