import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

import ExpenseScreen from '../screens/ExpenseScreen';
import HomeScreen from '../screens/HomeScreen';
import LimitScreen from '../screens/LimitScreen';
import SavingsScreen from '../screens/SavingsScreen';

const Tab = createBottomTabNavigator();

function getIconName(routeName) {
  if (routeName === 'Profile') {
    return 'person';
  }

  if (routeName === 'Home') {
    return 'logo-usd';
  }

  if (routeName === 'Expenses') {
    return 'document';
  }

  return 'settings';
}

function TabBarIcon({ routeName, focused, size }) {
  const color = '#FFFFFF';

  if (routeName === 'Expenses') {
    return (
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons name="document" size={size} color={color} />
        <Ionicons name="add" size={10} color={color} style={styles.plusIcon} />
      </View>
    );
  }

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={getIconName(routeName)} size={size} color={color} />
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarIcon: ({ focused, size }) => (
          <TabBarIcon routeName={route.name} focused={focused} size={size} />
        ),
      })}>
      <Tab.Screen name="Profile" component={HomeScreen} />
      <Tab.Screen name="Home" component={SavingsScreen} />
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
  plusIcon: {
    position: 'absolute',
    right: 4,
    bottom: 5,
  },
});
