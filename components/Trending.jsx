import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, Linking, Platform, Alert, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 220 + 20; // card width + marginRight

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

const TrendingItem = ({ isActive, item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => {
      onPress(item.id);
      openSceneViewer(item.url);
    }}
    style={{ marginRight: 20 }}
  >
    <Animatable.View
      animation={isActive ? zoomIn : zoomOut}
      duration={500}
      style={{ alignItems: 'center' }}
    >
      <ImageBackground
        source={item.image}
        style={{
          width: 220,
          height: 220,
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
  const [activeIndex, setActiveIndex] = useState(1);
  const flatListRef = useRef();

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / ITEM_WIDTH);
    setActiveIndex(newIndex);
  };

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TrendingItem
          isActive={activeIndex === index}
          item={item}
          onPress={() => setActiveIndex(index)}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={{ paddingLeft: 0, paddingRight: 0 }}
    />
  );
};

export default Trending;