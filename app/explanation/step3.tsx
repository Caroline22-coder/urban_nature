import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Step3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={[styles.progressDot, styles.activeDot]} />
      </View>
      <Text style={styles.title}>TAKE ACTION</Text>
      <Text style={styles.description}>
        Add trees or flowers in Augmented Reality to the streets of your city. Have a direct impact on decision making.
      </Text>
      <Image
        source={require("../../assets/images/AR.png")}
        style={styles.illustration}
        resizeMode="contain"
      />
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace("/explanation/step2")}>
          <Text style={styles.secondaryButtonText}>Previous</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/AR")}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}



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
    fontSize: 20,
    fontWeight: "400",
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
    fontWeight: "500",
  },
  illustration: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: "#19c2a6",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "#19c2a6",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    marginRight: 10,
  },
  secondaryButtonText: {
    color: "#19c2a6",
    fontSize: 16,
    fontWeight: "500",
  },
});