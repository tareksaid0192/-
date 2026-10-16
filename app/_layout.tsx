import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { AppProvider } from '@/contexts/AppContext';
import { BehaviorProvider } from '@/contexts/BehaviorContext';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AppProvider>
          <BehaviorProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="behavior/[id]" options={{ headerShown: false, animation: 'slide_from_left' }} />
              <Stack.Screen name="admin/index" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
              <Stack.Screen name="admin/behavior-form" options={{ headerShown: false, animation: 'slide_from_left' }} />
            </Stack>
          </BehaviorProvider>
        </AppProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
