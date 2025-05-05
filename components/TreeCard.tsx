import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Link} from 'expo-router'; 
import {icons} from '@/constants/icons';

const TreeCard = ({ id, name, scientific_name, image_url} : any) => {
    console.log(image_url);
    
    return (
      <Link href={{
        pathname : "/tree/[id]",
        params : {id, name, image_url}}}
        asChild 
        >
            <TouchableOpacity className="w-[30%]">
                <Image
                    source={{
                        uri: image_url
                    }}

                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"

            /> 

                <Text className= "text-sm font-bold text-white mt-2" numberOfLines={1}> {name} </Text>
                <Text className= "text-xs text-white italic"> {scientific_name} </Text>

            </TouchableOpacity>

        </Link>
       
       
    );
};

export default TreeCard;