import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { useBehaviors } from '@/hooks/useBehaviors';
import { deleteBehavior } from '@/services/behaviorService';
import { useAlert } from '@/template';

const ADMIN_PIN = '1234';

export default function AdminPanel() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { behaviors, isLoading, refresh } = useBehaviors();
  const { showAlert } = useAlert();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('الرقم السري غير صحيح، حاولي مرة أخرى');
      setPin('');
    }
  };

  const handleDelete = (id: string, title: string) => {
    showAlert(
      'حذف السلوك',
      `هل أنتِ متأكدة من حذف "${title}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(id);
            const { error } = await deleteBehavior(id);
            setDeletingId(null);
            if (error) {
              showAlert('خطأ', 'فشل الحذف: ' + error);
            } else {
              await refresh();
              showAlert('تم', 'تم حذف السلوك بنجاح');
            }
          },
        },
      ]
    );
  };

  // --- PIN Screen ---
  if (!isAuthenticated) {
    return (
      <View style={[styles.pinScreen, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={26} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.pinCard}>
          <View style={styles.lockIcon}>
            <MaterialIcons name="admin-panel-settings" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.pinTitle}>لوحة التحكم</Text>
          <Text style={styles.pinSubtitle}>أدخلي الرقم السري للدخول</Text>

          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={(t) => { setPin(t); setPinError(''); }}
            placeholder="• • • •"
            placeholderTextColor={Colors.textLight}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            textAlign="center"
          />

          {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>دخول</Text>
          </TouchableOpacity>

          <Text style={styles.pinHint}>الرقم الافتراضي: 1234</Text>
        </View>
      </View>
    );
  }

  // --- Admin Dashboard ---
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsAuthenticated(false)} activeOpacity={0.7}>
          <MaterialIcons name="lock" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>لوحة التحكم</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="close" size={26} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add New */}
        <TouchableOpacity
          style={styles.addCard}
          onPress={() => router.push('/admin/behavior-form')}
          activeOpacity={0.85}
        >
          <MaterialIcons name="add-circle" size={28} color={Colors.white} />
          <Text style={styles.addCardText}>إضافة سلوك / مهارة جديدة</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.primary + '15' }]}>
            <Text style={[styles.statNum, { color: Colors.primary }]}>{behaviors.length}</Text>
            <Text style={styles.statLabel}>سلوكيات</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.teal + '15' }]}>
            <Text style={[styles.statNum, { color: Colors.teal }]}>
              {behaviors.filter((b) => b.audioUrl).length}
            </Text>
            <Text style={styles.statLabel}>صوتيات مرفوعة</Text>
          </View>
        </View>

        {/* Behaviors List */}
        <Text style={styles.sectionTitle}>السلوكيات الحالية</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
        ) : (
          behaviors.map((b) => (
            <View key={b.id} style={styles.behaviorCard}>
              <View style={[styles.colorDot, { backgroundColor: b.color }]} />
              <View style={styles.behaviorInfo}>
                <Text style={styles.behaviorTitle}>{b.title}</Text>
                <Text style={styles.behaviorSub}>{b.steps.length} خطوات</Text>
                {b.audioUrl ? (
                  <View style={styles.audioBadge}>
                    <MaterialIcons name="audio-file" size={12} color={Colors.teal} />
                    <Text style={styles.audioBadgeText}>صوت مرفوع</Text>
                  </View>
                ) : (
                  <View style={[styles.audioBadge, { backgroundColor: Colors.coral + '15' }]}>
                    <MaterialIcons name="volume-off" size={12} color={Colors.coral} />
                    <Text style={[styles.audioBadgeText, { color: Colors.coral }]}>بدون صوت</Text>
                  </View>
                )}
              </View>
              <View style={styles.behaviorActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push({ pathname: '/admin/behavior-form', params: { id: b.id } })}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="edit" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(b.id, b.title)}
                  activeOpacity={0.7}
                  disabled={deletingId === b.id}
                >
                  {deletingId === b.id ? (
                    <ActivityIndicator size="small" color={Colors.coral} />
                  ) : (
                    <MaterialIcons name="delete" size={20} color={Colors.coral} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pinScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  closeBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
  },
  pinCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Shadow.card,
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pinTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 4,
  },
  pinSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  pinInput: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontFamily: FontFamily.poppinsBold,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: 8,
    marginBottom: Spacing.sm,
  },
  pinError: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.coral,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadow.button,
  },
  loginBtnText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.white,
  },
  pinHint: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
    color: Colors.textLight,
    marginTop: Spacing.md,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
    fontSize: 20,
    color: Colors.primary,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md },
  addCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.button,
  },
  addCardText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: 28,
  },
  statLabel: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 17,
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  behaviorCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  behaviorInfo: { flex: 1 },
  behaviorTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  behaviorSub: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  audioBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.teal + '15',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  audioBadgeText: {
    fontFamily: FontFamily.cairo,
    fontSize: 11,
    color: Colors.teal,
  },
  behaviorActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.coral + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
