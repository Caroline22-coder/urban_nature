import React from 'react'
import { View, Text, Button, Linking, Platform, Alert } from 'react-native'

const MODEL_URL = 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/sunflower.glb'

const openSceneViewer = async () => {
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    MODEL_URL
  )}&mode=ar_preferred`

  if (Platform.OS === 'android') {
    try {
      await Linking.openURL(sceneViewerUrl)
    } catch (error) {
      Alert.alert('Error', 'Could not open AR Scene Viewer.')
    }
  } else {
    Alert.alert('Not supported', 'Scene Viewer is only available on Android devices.')
  }
}

const Saved = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>View AR Model</Text>
      <Button title="Open in AR" onPress={openSceneViewer} />
    </View>
  )
}

export default Saved