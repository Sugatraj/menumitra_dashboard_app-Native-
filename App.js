import React from 'react';
import { TouchableOpacity, SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import BottomTabNavigator from './navigation/BottomTabNavigator';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menu</Text>
        </View>
        <DrawerItem
          label="Manage Restaurants"
          icon={({ color, size }) => (
            <FontAwesome name="store" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('ManageRestaurants')}
        />
        <DrawerItem
          label="Manage Owners"
          icon={({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('ManageOwner')}
        />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <FontAwesome name="sign-out" size={size} color={color} />
          )}
          onPress={() => {
            // Add your logout logic here
            alert('Logout functionality to be implemented');
          }}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.openDrawer()}
          >
            <FontAwesome name="bars" size={24} color="#000" />
          </TouchableOpacity>
        ),
        headerLeft: () => {
          if (navigation.canGoBack()) {
            return (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.goBack()}
              >
                <FontAwesome name="arrow-left" size={24} color="#000" />
              </TouchableOpacity>
            );
          }
          return null;
        },
      })}
    >
      <Stack.Screen 
        name="Root"
        component={BottomTabNavigator}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
        })}
      />
    </Stack.Navigator>
  );
}

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case 'Home':
      return 'Dashboard';
    case 'ManageRestaurants':
      return 'Manage Restaurants';
    case 'ManageOwner':
      return 'Manage Owners';
    case 'ViewOwner':
      return 'Owner Details';
    case 'CreateOwner':
      return 'Add Owner';
    case 'UpdateOwner':
      return 'Update Owner';
    default:
      return 'Dashboard';
  }
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
