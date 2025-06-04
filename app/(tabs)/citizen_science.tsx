import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as AuthSession from 'expo-auth-session';

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

const defaultImages: ImageData[] = [];

const criteria = [
  { id: 'richness', label: 'Species richness' },
  { id: 'naturalness', label: 'Perceived naturalness' },
  { id: 'humanImpact', label: 'Human impact' }
];

const valueLabels = ["Very low", "Low", "Medium", "High", "Very high"];

const ARCGIS_FEATURE_SERVICE_URL = 'https://services-eu1.arcgis.com/d6WajiXkixlJUEtR/arcgis/rest/services/observations_biodiversity/FeatureServer/0/addFeatures';
const ARCGIS_CLIENT_ID = '3FmlXIe1Vyf8fSLh'; // <-- Replace with your Client ID

export default function BiodiversityAssessment() {
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [images, setImages] = useState<ImageData[]>(defaultImages);
  const [activeBubble, setActiveBubble] = useState<{
    imageId: number;
    criterionId: string;
    value: number;
  } | null>(null);
  const [arcgisToken, setArcgisToken] = useState<string | null>(null);

  useEffect(() => {
    const redirectUri = AuthSession.makeRedirectUri();
    console.log('Redirect URI:', redirectUri);
  }, []);

  // OAuth2 login function with console log
  const loginWithArcGIS = async () => {
    console.log('Login button pressed'); // <-- Added log
    const redirectUri = AuthSession.makeRedirectUri();
    const authUrl = `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${ARCGIS_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}`;
    const result = await AuthSession.startAsync({ authUrl });
    console.log('AuthSession result:', result); // <-- Added log
    if (result.type === 'success' && result.params.access_token) {
      setArcgisToken(result.params.access_token);
      console.log('ArcGIS Token:', result.params.access_token); // <-- Print token for browser test
      Alert.alert('Login Success', 'You are now authenticated with ArcGIS!');
    } else {
      Alert.alert('Login Failed', 'Could not authenticate with ArcGIS.');
    }
  };

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
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
      Alert.alert('Permission denied', 'Camera and location permissions are required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
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

  const uploadToArcGIS = async () => {
    if (!arcgisToken) {
      Alert.alert('Not authenticated', 'Please log in to ArcGIS first.');
      return;
    }
    if (images.length === 0) {
      Alert.alert('No photo', 'Please add a photo before uploading.');
      return;
    }

    for (const image of images) {
      const attributes = {
        perceived_naturalness: ratings[image.id]?.naturalness ?? null,
        human_impact: ratings[image.id]?.humanImpact ?? null,
        species_richness: ratings[image.id]?.richness ?? null,
      };

      const geometry = image.location
        ? {
            x: image.location.longitude,
            y: image.location.latitude,
            spatialReference: { wkid: 4326 }
          }
        : undefined;

      const feature = geometry
        ? { attributes, geometry }
        : { attributes };

      try {
        const response = await fetch(
          `${ARCGIS_FEATURE_SERVICE_URL}?f=json&token=${arcgisToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ features: [feature] })
          }
        );
        const result = await response.json();
        if (result.addResults && result.addResults[0].success) {
          Alert.alert('Success', 'Data uploaded to ArcGIS!');
        } else {
          Alert.alert('Upload failed', JSON.stringify(result));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to upload to ArcGIS.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biodiversity Perception Assessment</Text>
      <Button title="Login to ArcGIS" onPress={loginWithArcGIS} />
      <Button title="Add Photo from Camera" onPress={addUserPhoto} />

      <View style={{ marginVertical: 10, backgroundColor: '#eee', padding: 8, borderRadius: 6 }}>
        <Text style={{ fontWeight: 'bold' }}>OAuth2 Redirect URI:</Text>
        <Text selectable style={{ fontSize: 12 }}>{AuthSession.makeRedirectUri()}</Text>
      </View>

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
      <Button title="Upload to ArcGIS" onPress={uploadToArcGIS} />
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