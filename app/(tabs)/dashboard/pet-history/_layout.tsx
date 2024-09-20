import { Stack } from 'expo-router';

export default function PetHistoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}