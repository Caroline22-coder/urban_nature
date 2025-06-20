import {View, Text, ImageBackground, Image} from 'react-native';
import {Tabs} from 'expo-router';
import React from 'react';
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const TabIcon = ({focused, icon, title}: any) => {
  if(focused){

    return(

      <ImageBackground
        source={images.button}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#15132" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title} </Text>
      </ImageBackground>
    )
  }





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
            name= "AR"
            options= {{
                title: 'AR', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.home}
                    title="AR" 
                    /> 

                )
            }}
            /> 
            <Tabs.Screen
            name= "map"
            options= {{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.save}
                    title="Map" 
                    /> 

                ) 

            }}
            /> 
            <Tabs.Screen
            name= "picture"
            options= {{
                title: 'Picture',
                headerShown: false,
                 tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.person}
                    title="Identify" 
                    /> 

                )

            }}
            /> 
            <Tabs.Screen
            name= "citizen_science"
            options= {{
                title: 'Citizen Science',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                    focused={focused}
                    icon={icons.search}
                    title="Score" 
                    /> 

                )

            }}
            /> 


        </Tabs>
    )
}

export default _Layout 