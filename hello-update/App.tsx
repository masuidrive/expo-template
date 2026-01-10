import { Text, View } from "react-native";
import packageJson from "./package.json";

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#FFFFFF" }}>Hello World v{packageJson.version}</Text>
    </View>
  );
}
