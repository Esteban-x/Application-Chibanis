import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';
import { AuthProvider } from './AuthContext';
import { MessageProvider } from './MessageContext';

export default function App() {
  return (
    <>
      <MessageProvider>
        <UserContext>
          <AuthProvider>
            <StackNavigator />
          </AuthProvider>
        </UserContext>
      </MessageProvider>
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
