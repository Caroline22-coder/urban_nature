import {View, Text, ScrollView, Image} from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const TreeDetails = () => {

    const { id, image_url } = useLocalSearchParams();

    return (
        <View className= "bg-primary flex-1">
            <Text> {id} this is the id </Text>
            <Image source={{ uri : image_url }} className = "w-52 h-52" /> 
        </View>
    )
}

export default TreeDetails; 