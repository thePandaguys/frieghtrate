import { Stack } from 'expo-router';
import { ThemeProvider } from '../constants/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="(main)" />
      </Stack>
    </ThemeProvider>
  );
}