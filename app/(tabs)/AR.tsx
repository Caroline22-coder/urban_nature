import React from 'react'
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Linking } from 'react-native';
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
      source={require('../../assets/images/urban.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Explore AR Nature Designs</Text>
        <Trending posts={posts} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.transparentButton} onPress={openLink1}>
            <Text style={styles.transparentButtonText}>Submit your AR design!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transparentButton} onPress={openLink2}>
            <Text style={styles.transparentButtonText}>Rate our app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Saved;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  transparentButton: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
    marginHorizontal: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  transparentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});