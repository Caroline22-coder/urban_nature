import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Step1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>
      <Text style={styles.title}>EXPLORE</Text>
      <Text style={styles.description}>
        Take pictures of flowers or trees around your city. Add them to our digital map. This will be of great value for our research community.
      </Text>
      <Image
        source={require("../../assets/images/explore.svg")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <Pressable style={styles.button} onPress={() => router.push("/explanation/step2")}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

export const options = {headerShown: false};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  progressDot: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#6fd1c2",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 18,
    textAlign: "center",
    color: "#222",
  },
  description: {
    fontSize: 15,
    color: "#222",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#19c2a6",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});