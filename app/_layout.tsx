import { Stack, Slot } from "expo-router";
import './globals.css';
import {SpeciesAnalysisProvider} from "./(tabs)/speciesAnalysis";

export default function RootLayout() {
  return (
  <SpeciesAnalysisProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
      name="index"
      options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="tree/[id]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  </SpeciesAnalysisProvider>
  );

}