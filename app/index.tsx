import { Text, View } from "react-native";
import {Link} from "expo-router";


export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-yellow-200">
      <Text className="text-5xl text-red-500 font-bold">Welcome!</Text>
      <Link href="/onboarding">Onboarding</Link>
    </View>
  );
}
