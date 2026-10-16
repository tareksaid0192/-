import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { BehaviorCard } from '@/components';
import { useApp } from '@/hooks/useApp';
import { useBehaviors } from '@/hooks/useBehaviors';

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { motherName } = useApp();
  const { behaviors } = useBehaviors();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBehaviors = behaviors.filter(
    (b) =>
      searchQuery === '' ||
      b.title.includes(searchQuery) ||
      b.subtitle.includes(searchQuery)
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Image
            source={require('@/assets/images/app-logo.png')}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
          <View>
            <Text style={styles.appTitle}>معاً نقدر</Text>
            <Text style={styles.appSubtitle}>خطوات بسيطة.. لسلوك أفضل</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
          <MaterialIcons name="notifications-none" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/hero-banner.png')}
            style={styles.bannerImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>مرحباً بكِ يا {motherName || 'ماما'} 💜</Text>
            <Text style={styles.bannerSubtitle}>أنتِ تبذلين جهداً رائعاً</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحثي عن سلوك أو موقف..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>السلوكيات الشائعة</Text>
          <Text style={styles.sectionCount}>{filteredBehaviors.length} سلوكيات</Text>
        </View>

        {/* Behavior Cards */}
        {filteredBehaviors.map((behavior) => (
          <BehaviorCard
            key={behavior.id}
            behavior={behavior}
            onPress={() => router.push(`/behavior/${behavior.id}`)}
          />
        ))}

        {filteredBehaviors.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>لا توجد نتائج لبحثك</Text>
          </View>
        )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
  },
  appTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'right',
  },
  appSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  notifBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  bannerContainer: {
    height: 160,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: 'rgba(91, 61, 145, 0.65)',
  },
  bannerTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 18,
    color: Colors.white,
    textAlign: 'right',
  },
  bannerSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  searchIcon: {
    marginLeft: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.cairo,
    fontSize: 16,
    color: Colors.textLight,
  },
});
