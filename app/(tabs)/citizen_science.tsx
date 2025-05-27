import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Rating {
  [criterionId: string]: number;
}

interface ImageData {
  id: number;
  src: any;
  alt: string;
}

const images: ImageData[] = [
  { id: 1, src: require('../../assets/images/biodiversity1.jpg'), alt: 'Scene 1' },
  { id: 2, src: require('../../assets/images/biodiversity2.jpg'), alt: 'Scene 2' }
];

const criteria = [
  { id: 'richness', label: 'Species richness' },
  { id: 'naturalness', label: 'Perceived naturalness' },
  { id: 'humanImpact', label: 'Human impact' }
];

export default function BiodiversityAssessment() {
  const [ratings, setRatings] = useState<Record<number, Rating>>({});

  const handleSliderChange = (imageId: number, criterionId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [imageId]: {
        ...(prev[imageId] || {}),
        [criterionId]: value
      }
    }));
  };

  const exportResults = async () => {
    const resultArray = images.map(image => ({
      imageId: image.id,
      ratings: ratings[image.id] || {}
    }));

    const json = JSON.stringify(resultArray, null, 2);
    const fileUri = FileSystem.documentDirectory + 'biodiversity_results.json';
    await FileSystem.writeAsStringAsync(fileUri, json);
    await Sharing.shareAsync(fileUri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Biodiversity Perception Assessment</Text>
      {images.map(image => (
        <View key={image.id} style={styles.imageBox}>
          <Image source={image.src} style={styles.image} resizeMode="cover" />
          {criteria.map(criterion => (
            <View key={criterion.id} style={styles.criterionBox}>
              <Text style={styles.label}>{criterion.label}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                minimumTrackTintColor="green"
                maximumTrackTintColor="red"
                value={ratings?.[image.id]?.[criterion.id] || 3}
                onValueChange={(value) => handleSliderChange(image.id, criterion.id, value)}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.min}>1</Text>
                <Text style={styles.max}>5</Text>
              </View>
            </View>
          ))}
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
  slider: {
    width: '100%',
    height: 40
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  min: {
    color: 'darkgreen'
  },
  max: {
    color: 'red'
  }
});
