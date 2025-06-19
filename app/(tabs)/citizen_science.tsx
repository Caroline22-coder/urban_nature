import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CitizenScienceWebView() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://survey123.arcgis.com/share/ac0be5afd0714f64b84480c8bb8afa39'}}
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