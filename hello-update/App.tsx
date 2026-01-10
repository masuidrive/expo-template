import { Text, View } from "react-native";
import packageJson from "./package.json";
import { ThemeProvider, useTheme } from "./ThemeContext";

function AppContent() {
  const { theme, isDark } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>
        Hello World v{packageJson.version} ({isDark ? 'Dark' : 'Light'} Mode)
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
