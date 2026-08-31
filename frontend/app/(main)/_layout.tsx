import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="forecast" />
      <Stack.Screen name="market-entry" />
      <Stack.Screen name="vessels" />
      <Stack.Screen name="optimizer" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="risk" />
      <Stack.Screen name="routes" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="policy" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="simulator" />
      <Stack.Screen name="waste" />
    </Stack>
  );
}
