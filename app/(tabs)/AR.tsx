import React from 'react'
import { View, Text, Button, Linking, Platform, Alert, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Trending from "../../components/Trending";
import { LinearGradient } from 'expo-linear-gradient';

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

const openLink1 = () => {
    Linking.openURL('https://survey123.arcgis.com/share/a74d56b672024af38d42cfea630305b3');
  };

  const openLink2 = () => {
    Linking.openURL('https://arcg.is/0ffzv52');
  };

const Saved = () => {
  const router = useRouter();

  return (
    <ImageBackground
  source={require('../../assets/images/Background 2.png')}
  style={styles.container}
  resizeMode="cover"
>
    <View style={styles.container}>
      
      <Text style={styles.title}>Nature for</Text>
      <Text style={styles.title}>Nature/You/Society</Text>
      <Text style={styles.subsubtitle}>
        Bring nature to life!</Text>
      <Text style={styles.subtitle}>
        Use AR to explore biodiversity-friendly designs right where you stand!</Text>
      <Trending posts={posts} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={openLink1}>
          <Text style={styles.buttonText}>Submit your AR design!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openLink2}>
          <Text style={styles.buttonText}>Rate our app</Text>
        </TouchableOpacity>
      </View>
    </View>
   </ImageBackground> 
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#194038',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'left',
  },
  subsubtitle: {
    fontSize: 18,
    color: '#357960',
    marginBottom: 8,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#194038',
    marginBottom: 24,
    textAlign: 'left',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100, // Adjust to sit above the tab bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#2d2d2d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    elevation: 2,
    marginHorizontal: 2, // Add this line for spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});