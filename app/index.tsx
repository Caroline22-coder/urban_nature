import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/butterfly.jpg")}
        style={styles.butterfly}
        resizeMode="contain"
      />
      <Text style={styles.title}>EXPLORE URBAN NATURE</Text>
      <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/map")}>
        <Text style={styles.buttonText}>Start now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e3d3b", // or use an ImageBackground for a blurred effect
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  butterfly: {
    width: width * 0.5,
    height: height * 0.3,
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 80,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f8f8e7",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: width * 0.8,
  },
  buttonText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "500",
  },
});