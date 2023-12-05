import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';
import { AuthProvider } from './AuthContext';

export default function App() {
  return (
    <>
      <UserContext>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
