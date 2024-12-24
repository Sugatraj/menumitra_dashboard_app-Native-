import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import RestaurantStack from './RestaurantStack';
import OwnerStack from './OwnerStack';
import { useNavigation, useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#67B279',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          padding: 5,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ManageRestaurants"
        component={RestaurantStack}
        options={{
          tabBarLabel: 'Restaurants',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="store" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ManageOwner"
        component={OwnerStack}
        options={{
          tabBarLabel: 'Owners',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator; 