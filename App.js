import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppTabs from './src/navigation/AppTabs';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function AppContent() {
  const { session, isLoading } = useAuth();
  const [screen, setScreen] = useState('login');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB657" />
      </View>
    );
  }

  if (session) {
    return (
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    );
  }

  if (screen === 'register') {
    return <RegisterScreen onGoToLogin={() => setScreen('login')} />;
  }

  return <LoginScreen onGoToRegister={() => setScreen('register')} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
