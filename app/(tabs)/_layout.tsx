import {View, Text, ImageBackground, Image} from 'react-native';
import {Tabs} from 'expo-router';
import React from 'react';
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const TabIcon = ({focused, icon, title}: any) => {
    if(focused){

    return (
        <ImageBackground 
                        source={images.highlight}
                        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
        >
                            <Image source={icon} tintColor="#15132" className="size-5" /> 
                            <Text className= "text-secondary text-base font-semibold ml-2"> {title} </Text>

        </ImageBackground> 


    )
}
    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
           <Image source= {icon} tintColor="#A8B5DB" className="size-5" />
        </View>
    )
}

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
            name= "index"
            options= {{
                title: 'Home', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.home}
                    title="Home" 
                    /> 

                )
            }}

            
            /> 

            <Tabs.Screen
            name= "picture"
            options= {{
                title: 'picture', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.camera}
                    title="Picture" 
                    /> 

                )
            }}

            
            /> 
            <Tabs.Screen
            name= "saved"
            options= {{
                title: 'Saved',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.save}
                    title="Saved" 
                    /> 

                ) 
            }}
            /> 
            <Tabs.Screen
            name= "biodiversity_assessment"
            options= {{
                title: 'Biodiversity_assessment',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.person}
                    title="Biodiversity_assessment" 
                    /> 

                )
            }}
            /> 
            


        </Tabs>
    )
}

export default _Layout 