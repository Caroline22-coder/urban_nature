import React from 'react';
import { View, Button, StyleSheet, Linking } from 'react-native';

const SURVEY_URL = 'https://arcg.is/1bnWjX0';

export default function CitizenScienceSurvey() {
  const openSurvey = () => {
    Linking.openURL(SURVEY_URL);
  };

  return (
    <View style={styles.container}>
      <Button title="Open ArcGIS Survey" onPress={openSurvey} />
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
});