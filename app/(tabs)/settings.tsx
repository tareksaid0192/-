import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow, FontFamily } from '@/constants/theme';
import { ChatBubble } from '@/components';
import { useApp } from '@/hooks/useApp';
import { getMockAIResponse } from '@/services/aiService';
import { ChatMessage } from '@/contexts/AppContext';
import { useAlert } from '@/template';
import { useRouter } from 'expo-router';

const WHATSAPP_URL = 'https://wa.me/201019396921';

export default function SettingsTab() {
  const insets = useSafeAreaInsets();
  const { motherName, childName, setMotherName, setChildName, chatMessages, addChatMessage } =
    useApp();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [editingMother, setEditingMother] = useState('');
  const [editingChild, setEditingChild] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSaveProfile = () => {
    if (editingMother) setMotherName(editingMother);
    if (editingChild) setChildName(editingChild);
    setIsEditingProfile(false);
    showAlert('تم الحفظ', 'تم تحديث بياناتك بنجاح 💜');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date(),
    };
    addChatMessage(userMsg);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await getMockAIResponse(chatInput);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addChatMessage(assistantMsg);
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'آسفة يا ماما، في مشكلة صغيرة. حاولي تاني بعد شوية 💜',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>الإعدادات</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>الملف الشخصي</Text>
            </View>

            {!isEditingProfile ? (
              <View style={styles.profileView}>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>اسم الأم</Text>
                  <Text style={styles.profileValue}>{motherName || 'غير محدد'}</Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>اسم الطفل</Text>
                  <Text style={styles.profileValue}>{childName || 'غير محدد'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingMother(motherName);
                    setEditingChild(childName);
                    setIsEditingProfile(true);
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="edit" size={16} color={Colors.white} />
                  <Text style={styles.editButtonText}>تعديل</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.profileEdit}>
                <Text style={styles.inputLabel}>اسم الأم</Text>
                <TextInput
                  style={styles.input}
                  value={editingMother}
                  onChangeText={setEditingMother}
                  placeholder="أدخلي اسمك"
                  placeholderTextColor={Colors.textLight}
                  textAlign="right"
                />
                <Text style={styles.inputLabel}>اسم الطفل</Text>
                <TextInput
                  style={styles.input}
                  value={editingChild}
                  onChangeText={setEditingChild}
                  placeholder="أدخلي اسم طفلك"
                  placeholderTextColor={Colors.textLight}
                  textAlign="right"
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: Colors.border }]}
                    onPress={() => setIsEditingProfile(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionBtnText, { color: Colors.textSecondary }]}>إلغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
                    onPress={handleSaveProfile}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionBtnText}>حفظ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* AI Chat Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>المساعد الذكي - أخصائي السلوك</Text>
            </View>
            <Text style={styles.aiSubtitle}>
              اسأليني عن أي سلوك وهأساعدك بطرق علمية وعملية 💜
            </Text>

            {/* Chat Messages */}
            <View style={styles.chatContainer}>
              <FlatList
                ref={flatListRef}
                data={chatMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ChatBubble message={item} />}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                nestedScrollEnabled
              />

              {isLoading && (
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>الأخصائي يكتب...</Text>
                </View>
              )}
            </View>

            {/* Chat Input */}
            <View style={styles.chatInputRow}>
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  { opacity: chatInput.trim() && !isLoading ? 1 : 0.5 },
                ]}
                onPress={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                activeOpacity={0.8}
              >
                <MaterialIcons name="send" size={22} color={Colors.white} />
              </TouchableOpacity>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="اكتبي سؤالك هنا..."
                placeholderTextColor={Colors.textLight}
                textAlign="right"
                multiline
                maxLength={300}
                onSubmitEditing={handleSendMessage}
              />
            </View>
          </View>

          {/* Admin Panel */}
          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => router.push('/admin/index')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="admin-panel-settings" size={20} color={Colors.white} />
            <Text style={styles.adminBtnText}>لوحة التحكم (للمشرف)</Text>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>معاً نقدر v1.0</Text>
            <Text style={styles.appInfoSubtext}>خطوات بسيطة.. لسلوك أفضل</Text>
          </View>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  profileView: {},
  profileRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileLabel: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileValue: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    ...Shadow.button,
  },
  editButtonText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.white,
  },
  profileEdit: {},
  inputLabel: {
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.cairo,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  editActions: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  actionBtnText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.white,
  },
  aiSubtitle: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  chatContainer: {
    height: 300,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  chatList: {
    padding: Spacing.sm,
  },
  loadingBubble: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  loadingText: {
    fontFamily: FontFamily.cairo,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chatInputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.cairo,
    fontSize: 14,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  appInfoText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
  adminBtn: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.full,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  adminBtnText: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 15,
    color: Colors.white,
  },
  appInfoSubtext: {
    fontFamily: FontFamily.cairo,
    fontSize: 12,
    color: Colors.textLight,
  },
});
