import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

import ExpenseScreen from '../screens/ExpenseScreen';
import HomeScreen from '../screens/HomeScreen';
import LimitScreen from '../screens/LimitScreen';
import SavingsScreen from '../screens/SavingsScreen';

const Tab = createBottomTabNavigator();

function getIconName(routeName, focused) {
  if (routeName === 'Profile') {
    return focused ? 'person' : 'person-outline';
  }

  if (routeName === 'Savings') {
    return 'logo-usd';
  }

  if (routeName === 'Expenses') {
    return focused ? 'document' : 'document-outline';
  }

  return focused ? 'settings' : 'settings-outline';
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
      <Tab.Screen name="Profile" component={HomeScreen} />
      <Tab.Screen name="Savings" component={SavingsScreen} />
      <Tab.Screen name="Expenses" component={ExpenseScreen} />
      <Tab.Screen name="Limits" component={LimitScreen} />
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
});
