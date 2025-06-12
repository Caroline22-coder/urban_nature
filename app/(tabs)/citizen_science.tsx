import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function CitizenScienceWebView() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://arcg.is/1bnWjX0'}}
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