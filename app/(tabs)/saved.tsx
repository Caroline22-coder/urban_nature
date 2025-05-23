import React from 'react'
import { View, Text, Button, Linking, Platform, Alert } from 'react-native'

const SUNFLOWER_URL = 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/sunflower.glb'
const DRIVE_URL = 'https://drive.google.com/uc?export=download&id=1aZz34eaBgazi-phk1SvhHvD3oW4wNfYv'

const openSceneViewer = async (modelUrl: string) => {
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    modelUrl
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
      <Button title="Open Sunflower in AR" onPress={() => openSceneViewer(SUNFLOWER_URL)} />
      <View style={{ height: 16 }} />
      <Button title="Open Google Drive Model in AR" onPress={() => openSceneViewer(DRIVE_URL)} />
    </View>
  )
}

export default Saved