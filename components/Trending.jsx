import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.9 },
};

const TrendingItem = ({ activeItem, item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress(item.id)}
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
          width: 120,
          height: 120,
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
  const [activeItem, setActiveItem] = React.useState(posts[0]?.id);

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