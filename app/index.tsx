import { View, Text, ImageBackground, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/butterfly.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>EXPLORE URBAN NATURE</Text>
        <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/map")}>
          <Text style={styles.buttonText}>Start now</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14,61,59,0.25)", // Optional: dark overlay for readability
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 120,
    marginBottom: 10,
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
    color: "#194038",
    fontSize: 18,
    fontWeight: "500",
  },
});