
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapWebView() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://ucdirelandeu.maps.arcgis.com/apps/mapviewer/index.html?webmap=50abb98efab44bf0bbca27031c3dc81a'}}
                        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});