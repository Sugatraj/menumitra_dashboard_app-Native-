import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ManageRestaurants from '../screens/ManageRestaurants';
import CreateRestaurant from '../screens/CreateRestaurant';
import ViewRestaurantScreen from '../screens/ViewRestaurantScreen';
import UpdateRestaurantScreen from '../screens/UpdateRestaurantScreen';
import RestaurantDetailsScreen from '../screens/RestaurantDetailsScreen';

const Stack = createStackNavigator();

export default function RestaurantStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ManageRestaurantList" 
        component={ManageRestaurants}
      />
      <Stack.Screen 
        name="CreateRestaurant" 
        component={CreateRestaurant}
      />
      <Stack.Screen 
        name="ViewRestaurant" 
        component={RestaurantDetailsScreen}
        options={{
          title: 'Restaurant Details'
        }}
      />
      <Stack.Screen 
        name="UpdateRestaurant" 
        component={UpdateRestaurantScreen}
      />
    </Stack.Navigator>
  );
} 