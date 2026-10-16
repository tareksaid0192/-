import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, TouchableOpacity, Text, StyleSheet, Linking, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { Colors, FontFamily, Radius } from '@/constants/theme';

const WHATSAPP_URL = 'https://wa.me/201019396921';

function WhatsAppFAB({ bottomOffset }: { bottomOffset: number }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        fabStyles.wrapper,
        { bottom: bottomOffset + 16, transform: [{ scale: pulse }] },
      ]}
    >
      <TouchableOpacity
        style={fabStyles.fab}
        onPress={() => Linking.openURL(WHATSAPP_URL)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="chat" size={20} color="#fff" />
        <Text style={fabStyles.label}>تواصل مع الأخصائي</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const fabStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    zIndex: 999,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  fab: {
    backgroundColor: '#25D366',
    borderRadius: Radius.full,
    paddingVertical: 11,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: FontFamily.cairoBold,
    fontSize: 14,
    color: '#fff',
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({
      ios: insets.bottom + 64,
      android: insets.bottom + 64,
      default: 72,
    }),
    paddingTop: 8,
    paddingBottom: Platform.select({
      ios: insets.bottom + 8,
      android: insets.bottom + 8,
      default: 10,
    }),
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  };

  const tabBarHeight = Platform.select({
    ios: insets.bottom + 64,
    android: insets.bottom + 64,
    default: 72,
  }) ?? 72;

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#C0B4D4',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: FontFamily.cairo,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'المحتوى',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder-open" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'المفضلة',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    <WhatsAppFAB bottomOffset={tabBarHeight} />
    </View>
  );
}
