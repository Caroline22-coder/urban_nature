import { useState } from "react";
import { Button, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { useSpeciesAnalysis } from "./speciesAnalysis";
import AWS from 'aws-sdk';

import Constants from 'expo-constants';

import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addAnalysis } = useSpeciesAnalysis();
  const AIRTABLE_API_KEY = 'pat9V5291QvAKblsD.00cf099f8a8f1c60ddee3c302e77a61c6f4403cd4cb68338b1c2972ad894293f';
  const AIRTABLE_BASE_ID = 'appqp0rAAmpnX0LBV';
  const AIRTABLE_TABLE_NAME = 'Publications';
  const S3_BUCKET = 'ucd-sdl-projects';
  const REGION = 'eu-north-1';
  const ACCESS_KEY = Constants.expoConfig?.extra?.ACCESS_KEY;
  const SECRET_KEY = Constants.expoConfig?.extra?.SECRET_KEY;
  

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (uri: string, fileName: string): Promise<string | null> => {
  try {
    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to S3
   const params = {
  Bucket: S3_BUCKET,
  Key: `nbs-media/${fileName}`, // Uploads to the nbs-media folder
  Body: blob,
  ContentType: 'image/jpeg',
};

    const data = await s3.upload(params).promise();
    return data.Location; // This is the public URL
  } catch (error) {
    Alert.alert('S3 Upload Error', error.message);
    return null;
  }
};





const uploadToAirtable = async () => {
  if (!analysisResult || !location || !uri) {
    Alert.alert("Nothing to upload", "Please analyze a picture first.");
    return;
  }
  try {
    // 1. Upload image to S3
    const fileName = `analysis_${Date.now()}.jpg`;
    const image_url = await uploadImageToS3(uri, fileName);

    if (!image_url) {
      Alert.alert('Error', 'Failed to upload image to S3.');
      return;
    }

    // 2. Upload data to Airtable, including imageUrl
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
            image_url: image_url, // Add the S3 image URL here
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
      const response = await fetch("http://192.168.92.177:5000/analyze", {
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
  <Button title="Upload to Airtable" onPress={uploadToAirtable} />
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
