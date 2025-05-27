import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

interface Rating {
  [criterionId: string]: number;
}

interface ImageData {
  id: number;
  src: any;
  alt: string;
  isUser?: boolean;
  location?: { latitude: number; longitude: number };
}

const defaultImages: ImageData[] = [
  { id: 1, src: require('../../assets/images/biodiversity1.jpg'), alt: 'Scene 1' },
  { id: 2, src: require('../../assets/images/biodiversity2.jpg'), alt: 'Scene 2' }
];

const criteria = [
  { id: 'richness', label: 'Species richness' },
  { id: 'naturalness', label: 'Perceived naturalness' },
  { id: 'humanImpact', label: 'Human impact' }
];

const valueLabels = ["Very low", "Low", "Medium", "High", "Very high"];

export default function BiodiversityAssessment() {
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [images, setImages] = useState<ImageData[]>(defaultImages);
  const [activeBubble, setActiveBubble] = useState<{
    imageId: number;
    criterionId: string;
    value: number;
  } | null>(null);

  const handleSliderChange = (imageId: number, criterionId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [imageId]: {
        ...(prev[imageId] || {}),
        [criterionId]: value
      }
    }));
    setActiveBubble({ imageId, criterionId, value });
  };

  const handleSliderComplete = () => {
    setActiveBubble(null);
  };

  const addUserPhoto = async () => {
    // Request permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
      Alert.alert('Permission denied', 'Camera and location permissions are required.');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Get current location
      let loc = null;
      try {
        loc = await Location.getCurrentPositionAsync({});
      } catch (e) {
        Alert.alert('Location error', 'Could not get location.');
      }
      const newId = images.length ? Math.max(...images.map(img => img.id)) + 1 : 1;
      setImages(prev => [
        ...prev,
        {
          id: newId,
          src: { uri: result.assets[0].uri },
          alt: 'User photo',
          isUser: true,
          location: loc
            ? {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }
            : undefined,
        }
      ]);
    }
  };

  const exportResults = async () => {
    const resultArray = images.map(image => ({
      imageId: image.id,
      image: image.isUser ? image.src.uri : image.alt,
      location: image.location ? {
        latitude: image.location.latitude,
        longitude: image.location.longitude
      } : null,
      ratings: {
        richness: ratings[image.id]?.richness ?? null,
        naturalness: ratings[image.id]?.naturalness ?? null,
        humanImpact: ratings[image.id]?.humanImpact ?? null,
      }
    }));

    const json = JSON.stringify(resultArray, null, 2);
    const fileUri = FileSystem.documentDirectory + 'biodiversity_results.json';
    await FileSystem.writeAsStringAsync(fileUri, json);
    await Sharing.shareAsync(fileUri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biodiversity Perception Assessment</Text>
      <Button title="Add Photo from Camera" onPress={addUserPhoto} />
      {images.map(image => (
        <View key={image.id} style={styles.imageBox}>
          <Image source={image.src} style={styles.image} resizeMode="cover" />
          {image.location && (
            <Text style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
              Lat: {image.location.latitude.toFixed(5)}, Lon: {image.location.longitude.toFixed(5)}
            </Text>
          )}
          {criteria.map(criterion => {
            const value = ratings?.[image.id]?.[criterion.id] || 3;
            const showBubble =
              activeBubble &&
              activeBubble.imageId === image.id &&
              activeBubble.criterionId === criterion.id;
            return (
              <View key={criterion.id} style={styles.criterionBox}>
                <Text style={styles.label}>{criterion.label}</Text>
                <View style={styles.sliderContainer}>
                  {showBubble && (
                    <View
                      style={[
                        styles.bubble,
                        {
                          left: `${((activeBubble.value - 1) / 4) * 100}%`,
                          transform: [{ translateX: -30 }],
                        },
                      ]}
                    >
                      <Text style={styles.bubbleText}>
                        {valueLabels[activeBubble.value - 1]}
                      </Text>
                    </View>
                  )}
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    minimumTrackTintColor="green"
                    maximumTrackTintColor="red"
                    value={value}
                    onValueChange={(val) => handleSliderChange(image.id, criterion.id, val)}
                    onSlidingComplete={handleSliderComplete}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.min}>1</Text>
                    <Text style={styles.max}>5</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ))}
      <Button title="Validate & Export JSON" onPress={exportResults} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  imageBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 8
  },
  criterionBox: {
    marginTop: 10,
    width: '100%'
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'stretch',
    position: 'relative',
    marginBottom: 10,
    overflow: 'visible', 
  },
  slider: {
    width: '100%',
    height: 40
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  min: {
    color: 'darkgreen'
  },
  max: {
    color: 'red'
  },
  bubble: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 2,
    minWidth: 60,
    alignItems: 'center',
  },
  bubbleText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});