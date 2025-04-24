import { Image, Text, View, ScrollView, ActivityIndicator, FlatList } from "react-native";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import {useRouter} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";


export default function Index() {

  const router= useRouter(); 

  const{data : movies, 
    loading: moviesLoading,
    error: moviesError
  } = useFetch( () => fetchMovies({
    query: ''}
  )) 

  return (
    <View className="flex-1 bg-primary"> 
          <Image source={images.bg} className="absolute w-full z-0" /> 
          <View className="flex-1 px-5">
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" /> 
                {moviesLoading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    className="mt-10 self-center"

                  />
                ) : moviesError ? (
                  <Text> Error: {moviesError?.message} </Text>
                ) : ( 
                <View className="flex-1 mt-5">
                    <SearchBar 
                          onPress={() => router.push("/search")}
                          placeholder= "Search for a movie"
              /> 

              <> 
                  <Text className= "test-lg font-bold mt-5 mb-3"> Latest Movies </Text>
                  
                  <FlatList

                    data={movies}
                    renderItem={({item}) => (
                      <Text> {item.title} </Text>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: 'flex-start',
                      gap:20,
                      paddingRight: 5,
                      marginBottom:10 
                    }}
                    
                    /> 

              </>
                    </View>
                )}

          </View>
    </View>
  );
}
