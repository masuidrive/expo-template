import { Text, View, useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#000' : '#fff'
    }}>
      <Text style={{
        color: isDark ? '#fff' : '#000',
        fontSize: 24,
        fontWeight: 'bold'
      }}>
        Hello World v2
      </Text>
      <Text style={{
        color: isDark ? '#aaa' : '#666',
        marginTop: 12,
        fontSize: 16
      }}>
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </Text>
    </View>
  );
}
