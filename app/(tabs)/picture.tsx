import { useState } from "react";
import { Button, StyleSheet, Text, View, Alert, TouchableOpacity, ImageBackground, Dimensions, Modal } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { useSpeciesAnalysis } from "./speciesAnalysis";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");

export default function App() {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const { addAnalysis } = useSpeciesAnalysis();
  const AIRTABLE_API_KEY = 'patoqivXcP3in1xUG.2c30536ebb5360d066b5fa9f0bac25c11e847d4e7bf2c1f5c45591f0c49b70f3';
  const AIRTABLE_BASE_ID = 'appfpAaw5R6A2Wuzt';
  const AIRTABLE_TABLE_NAME = 'Observations';

  const uploadToAirtable = async () => {
    if (!analysisResult || !location || !uri) {
      Alert.alert("Nothing to upload", "Please analyze a picture first.");
      return;
    }
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              common_name: String(analysisResult.common_name),
              scientific_name: String(analysisResult.scientific_name),
              family: String(analysisResult.family),
              genus: String(analysisResult.genus),
              score: String(analysisResult.score),
              latitude: String(location.latitude),
              longitude: String(location.longitude),
            }
          }),
        }
      );
      const result = await response.json();
      if (result.id) {
        Alert.alert('Success', 'Data uploaded to Airtable!');
      } else {
        Alert.alert('Upload failed', JSON.stringify(result));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to upload to Airtable.');
      console.error('Airtable upload error:', e);
    }
  };

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
      const response = await fetch("http://192.168.186.177:5000/analyze", {
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
        setShowResult(true); // Show custom modal
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

  const localImage = require('../../assets/images/forest.jpg');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ImageBackground
          source={localImage}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.container}>
            {!uri ? (
              <TouchableOpacity style={styles.button} onPress={takePicture} activeOpacity={0.6}>
                <Text style={styles.text}>Take a picture</Text>
              </TouchableOpacity>
            ) : (
               <View style={styles.modalContent}>
    <Image
      source={{ uri }}
      contentFit="contain"
      style={{ width: 300, aspectRatio: 1 }}
    />
    <Text style={{ marginTop: 8, marginBottom: 8 }}>
      Latitude: {location?.latitude ?? "N/A"} {"\n"}
      Longitude: {location?.longitude ?? "N/A"}
    </Text>
    <TouchableOpacity style={styles.closeButton} onPress={() => setUri(null)}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Take another picture</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.closeButton} onPress={analyzeSpecies}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>Analyse the species</Text>
    </TouchableOpacity>
    {analysisResult && (
      <TouchableOpacity style={styles.closeButton} onPress={uploadToAirtable}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Upload to Airtable</Text>
      </TouchableOpacity>
    )}
  </View>
              
            )}
          </View>
          {/* Custom Modal for Analysis Result */}
          <Modal
            visible={showResult}
            transparent
            animationType="fade"
            onRequestClose={() => setShowResult(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Analysis Result</Text>
                <Text style={styles.modalText}>Common Name: {analysisResult?.common_name}</Text>
                <Text style={styles.modalText}>Scientific Name: {analysisResult?.scientific_name}</Text>
                <Text style={styles.modalText}>Family: {analysisResult?.family}</Text>
                <Text style={styles.modalText}>Genus: {analysisResult?.genus}</Text>
                <Text style={styles.modalText}>Score: {analysisResult?.score}</Text>
                <Text style={styles.modalText}>Latitude: {location?.latitude}</Text>
                <Text style={styles.modalText}>Longitude: {location?.longitude}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowResult(false)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    lineHeight: 34,
    textAlign: 'center',
    backgroundColor: '#00000060',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center'
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12
  },
  modalText: {
    fontSize: 16,
    marginBottom: 4
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    padding: 10
  }
});