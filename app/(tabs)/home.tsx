import { View, Text, Pressable, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/butterfly.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={() => router.replace("/map")}>
          <Text style={styles.buttonText}>VIEW MAP</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.replace("/picture")}>
          <Text style={styles.buttonText}>EXPLORE</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.replace("/citizen_science")}>
          <Text style={styles.buttonText}>ENGAGE</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.replace("/AR")}>
          <Text style={styles.buttonText}>TAKE ACTION</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 10,
    minWidth: 220,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  }
});