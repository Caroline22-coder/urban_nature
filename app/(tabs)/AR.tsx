import React from 'react'
import { View, Text, Button, Linking, Platform, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Trending from "../../components/Trending";

const posts = [
  
  {
    id: 1,
    name: 'Bushes',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/bushes.glb',
    image: require('../../assets/images/Bushes.png'),
  },
  {
    id: 2,
    name: 'Meadow',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/meadow.glb',
    image: require('../../assets/images/Meadow.png'),
  },
  {
    id: 3,
    name: 'Mix planting',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/mix_planting.glb',
    image: require('../../assets/images/MixPlanting.png'),
  },
  {
    id: 4,
    name: 'Mix trees row',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/mix_trees_row.glb',
    image: require('../../assets/images/MixTreesRow.png'),
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

  return(

  
    <View className="w-full flex-1 pt-5 pb-8">
      <Text className="text-gray-100 text-lg font-pregular mb-3">AR Models</Text>
      <Trending posts= {posts} />
  

    </View>
  )
  }

  

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