import { Stack } from "expo-router";
import './globals.css';
import {SpeciesAnalysisProvider} from "./speciesAnalysis";

export default function RootLayout() {
  return (
  <SpeciesAnalysisProvider>
    <Stack>
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