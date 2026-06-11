import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import ExpenseScreen from '../screens/ExpenseScreen';
import HomeScreen from '../screens/HomeScreen';
import LimitScreen from '../screens/LimitScreen';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{label}</Text>
    </View>
  );
}

function getIconName(routeName, focused) {
  if (routeName === 'Home') {
    return focused ? 'home' : 'home-outline';
  }

  if (routeName === 'Balance') {
    return 'logo-usd';
  }

  if (routeName === 'Add') {
    return focused ? 'add-circle' : 'add-circle-outline';
  }

  return focused ? 'person' : 'person-outline';
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#F2FFF4',
        tabBarIcon: ({ color, focused, size }) => (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Ionicons name={getIconName(route.name, focused)} size={size} color={color} />
          </View>
        ),
      })}>
      <Tab.Screen name="Home">
        {() => <PlaceholderScreen label="Home em construcao" />}
      </Tab.Screen>
      <Tab.Screen name="Balance" component={LimitScreen} />
      <Tab.Screen name="Add" component={ExpenseScreen} />
      <Tab.Screen name="Profile" component={HomeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    backgroundColor: '#4DB657',
    borderTopWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#3F9447',
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  placeholderText: {
    color: '#222222',
    fontSize: 18,
    textAlign: 'center',
  },
});
