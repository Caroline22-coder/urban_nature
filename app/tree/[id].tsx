import {View, Text, ScrollView, Image} from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const TreeDetails = () => {

    const { id, name, image_url } = useLocalSearchParams();

    return (
        <View className= "bg-primary flex-1">
            <ScrollView contentContainerStyle={{paddingBottom: 80}}>
                <Image source={{uri: image_url}} className="w-full h-52 rounded-lg" resizeMode="cover" />
            </ScrollView> 

            <Text className="text-light-200 text-sm">
                {name}
            </Text>
            <Text className="text-light-200 text-sm">
                {id}
            </Text>
        </View> 



    )
}

export default TreeDetails; 