import { Text, View } from "react-native";
import Constants from "expo-constants";

export default function App() {
  const version = Constants.expoConfig?.version || "unknown";

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#FFFFFF" }}>Hello World v{version}</Text>
    </View>
  );
}
