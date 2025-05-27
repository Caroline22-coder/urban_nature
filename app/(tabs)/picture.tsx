import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { useSpeciesAnalysis } from "../speciesAnalysis";

export default function App() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { addAnalysis } = useSpeciesAnalysis();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    const handleRequestPermission = async () => {
      const result = await requestPermission();
      if (result.granted) {
        // No need to setPermission, useCameraPermissions handles it
      }
    };

    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={handleRequestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri);
    setAnalysisResult(null); // Reset previous analysis
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      setLocation(null);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const recordVideo = async () => {
    if (recording) {
      setRecording(false);
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
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
      const response = await fetch("http://192.168.199.226:5000/analyze", {
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

  const renderPicture = () => {
    return (
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
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>
          <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: mode === "picture" ? "white" : "red",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
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
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});