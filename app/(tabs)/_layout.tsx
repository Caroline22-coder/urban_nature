import { View, Text, ImageBackground } from 'react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { images } from "@/constants/images";

const TabIcon = ({ focused, iconName, title }: any) => {
     const containerClass =
    "flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden";

  if (focused) {
    return (
      <ImageBackground
        source={images.button}
        className={containerClass}
      >
        <Ionicons name={iconName} size={18} color="white" />
        <Text className="text-white text-base ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }
  return (
     <View className={containerClass}>
      <Ionicons name={iconName} size={18} color="#b0b0b0" />
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0f0D23'
        }
      }}
    >
      <Tabs.Screen
        name="AR"
        options={{
          title: 'AR',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="cube-outline" // AR
              title="AR"
            />
          )
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="map-outline" // Map
              title="Map"
            />
          )
        }}
      />
      <Tabs.Screen
        name="picture"
        options={{
          title: 'Picture',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="leaf-outline" // Identify
              title="Identify"
            />
          )
        }}
      />
      <Tabs.Screen
        name="citizen_science"
        options={{
          title: 'Citizen Science',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName="star-outline" // Score
              title="Score"
            />
          )
        }}
      />
    </Tabs>
  );
};

export default _Layout;