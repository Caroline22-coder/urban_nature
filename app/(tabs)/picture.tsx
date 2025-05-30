import { useState } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { useSpeciesAnalysis } from "./speciesAnalysis";

export default function App() {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addAnalysis } = useSpeciesAnalysis();

  const takePicture = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== "granted" || locationStatus !== "granted") {
      Alert.alert("Permission denied", "Camera and location permissions are required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUri(result.assets[0].uri);
      setAnalysisResult(null);
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    }
  };

  const analyzeSpecies = async () => {
    if (!uri) {
      Alert.alert("No image found", "Please take a picture first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("http://192.168.155.226:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);

      if (!data.error && location && uri) {
        addAnalysis({
          id: Date.now().toString(),
          imageUri: uri,
          analysis: data,
          location,
          timestamp: new Date().toISOString(),
        });
      }

      if (data.error) {
        Alert.alert("Error", data.error);
      } else {
        Alert.alert(
          "Analysis Result",
          `Common Name: ${data.common_name}\nScientific Name: ${data.scientific_name}\nFamily: ${data.family}\nGenus: ${data.genus}\nScore: ${data.score}\nLatitude: ${location?.latitude}\nLongitude: ${location?.longitude}`
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to analyze the species.");
      console.error("Error:", error);
    }
  };

  const exportToJson = async () => {
    if (!analysisResult || !location || !uri) {
      Alert.alert("Nothing to export", "Please take a picture and analyze it first.");
      return;
    }
    const exportData = {
      imageUri: uri,
      analysis: analysisResult,
      location,
      timestamp: new Date().toISOString(),
    };
    const fileUri = FileSystem.documentDirectory + "analysis_export.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));
    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={styles.container}>
      {!uri ? (
        <Button title="Take a picture" onPress={takePicture} />
      ) : (
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: 300, aspectRatio: 1 }}
          />
          <Text>
            Latitude: {location?.latitude ?? "N/A"} {"\n"}
            Longitude: {location?.longitude ?? "N/A"}
          </Text>
          <Button onPress={() => setUri(null)} title="Take another picture" />
          <Button title="Analyse the species" onPress={analyzeSpecies} />
          {analysisResult && (
            <Button title="Export to JSON" onPress={exportToJson} />
          )}
          <Button title="View on the map" onPress={() => router.push("/map")} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});