import React from 'react'
import { View, Text, Button, Linking, Platform, Alert } from 'react-native'

// Add your new model URLs here
const MODELS = [
  {
    name: 'Sunflower',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/sunflower.glb',
  },
  {
    name: 'Bushes',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/bushes.glb',

  },
  {
    name: 'Meadow',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/meadow.glb',

  },
  {
    name: 'Mix planting',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/mix_planting.glb',
  },
  {
    name: 'Mix trees row',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/viro-react-starter-kit/main/viroRes/mix_trees_row.glb',
  },
  {
    name: 'Clover',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/mobile_tree_app/main/assets/3Dmodels/little_clover.glb',
  },
  {
    name: 'Grass',
    url: 'https://raw.githubusercontent.com/Caroline21-coder/mobile_tree_app/main/assets/3Dmodels/grass.glb'
  }
  // Add more models as needed
]

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
      <Text>View AR Models</Text>
      {MODELS.map((model, idx) => (
        <View key={model.name} style={{ marginVertical: 8, width: '80%' }}>
          <Button
            title={`Open ${model.name} in AR`}
            onPress={() => openSceneViewer(model.url)}
          />
        </View>
      ))}
    </View>
  )
}

export default Saved