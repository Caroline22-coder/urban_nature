import React from 'react'
import { View, Text, Button, Linking, Platform, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MODELS = [
  
  {
    name: 'Bushes',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/bushes.glb',
  },
  {
    name: 'Meadow',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/meadow.glb',
  },
  {
    name: 'Mix planting',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/mix_planting.glb',
  },
  {
    name: 'Mix trees row',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/mix_trees_row.glb',
  }
];

const openSceneViewer = async (modelUrl: string) => {
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    modelUrl
  )}&mode=ar_preferred`;

  if (Platform.OS === 'android') {
    try {
      await Linking.openURL(sceneViewerUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open AR Scene Viewer.');
    }
  } else {
    Alert.alert('Not supported', 'Scene Viewer is only available on Android devices.');
  }
};

const Saved = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 20, marginTop: 60 }}>View AR Models</Text>
      {MODELS.map((model) => (
        <View key={model.name} style={{ marginVertical: 8, width: '80%' }}>
          <Button
            title={`Open ${model.name} in AR`}
            onPress={() => openSceneViewer(model.url)}
          />
        </View>
      ))}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});