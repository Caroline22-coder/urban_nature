import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MyMapApp = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 53.3105931,
          longitude: -6.2355255,
          latitudeDelta: 0.1,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 53.3050, longitude: -6.2206 }}
          title="Spatial Dynamics Lab"
          description="University College Dublin"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MyMapApp;