import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Linking, Platform, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.9 },
};

const openSceneViewer = async (modelUrl) => {
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    modelUrl
  )}&mode=ar_preferred`;

  if (Platform.OS === 'android') {
    try {
      await Linking.openURL(sceneViewerUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open AR Scene Viewer.');
    }
  } else {
    Alert.alert('Not supported', 'Scene Viewer is only available on Android devices.');
  }
};

const TrendingItem = ({ activeItem, item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => {
      onPress(item.id);
      openSceneViewer(item.url);
      
    }}
    style={{ marginRight: 20 }}
  >
    <Animatable.View
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
      style={{ alignItems: 'center' }}
    >
      <ImageBackground
        source={item.image}
        style={{
          width: 220,
          height: 320,
          borderRadius: 16,
          overflow: 'hidden',
        }}
        resizeMode="cover"
      />
      <Text style={{ color: '#222', marginTop: 8 }}>{item.name}</Text>
    </Animatable.View>
  </TouchableOpacity>
);

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = React.useState(posts[1]?.id);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          item={item}
          onPress={setActiveItem}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;