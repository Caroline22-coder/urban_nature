import React from 'react';
import { View, Button, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SURVEY_URL = 'https://arcg.is/1bnWjX0';

export default function CitizenScienceSurvey() {
  const router = useRouter();
  const openSurvey = () => {
    Linking.openURL(SURVEY_URL);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <Button title="Score the biodiversity in your city" onPress={openSurvey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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