import React from 'react';
import { TouchableOpacity, SafeAreaView, View, Text, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import BulkUploadScreen from './screens/BulkUploadScreen';
import ManageCategory from './screens/ManageCategory'; // Added import
import CreateCategory from './screens/CreateCategory';
import CategoryDetailsScreen from './screens/CategoryDetailsScreen';
import UpdateCategory from './screens/UpdateCategory';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Dashboard</Text>
        </View>
        <DrawerItem
          label="Manage Restaurants"
          icon={({ color, size }) => (
            <FontAwesome name="building" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.navigate("MainStack", {
              screen: "Root",
              params: {
                screen: "ManageRestaurants",
              },
            });
          }}
        />
        <DrawerItem
          label="Manage Owners"
          icon={({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.navigate("MainStack", {
              screen: "Root",
              params: {
                screen: "ManageOwner",
              },
            });
          }}
        />
        <DrawerItem
          label="Manage Categories"
          icon={({ color, size }) => (
            <FontAwesome name="list" size={size} color={color} />
          )}
          onPress={() => {
            props.navigation.navigate("MainStack", {
              screen: "ManageCategory",
            });
          }}
        />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <FontAwesome name="sign-out" size={size} color={color} />
          )}
          onPress={() => {
            // Add your logout logic here
            Alert.alert("Logout", "Are you sure you want to logout?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                  // Add logout logic here
                  alert("Logging out...");
                },
              },
            ]);
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
      <Stack.Screen 
        name="BulkUpload" 
        component={BulkUploadScreen}
        options={{
          title: 'Upload Bulk File',
          headerStyle: {
            backgroundColor: '#67B279',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="ManageCategory" 
        component={ManageCategory}
        options={{
          title: 'Manage Categories',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CreateCategory" 
        component={CreateCategory}
        options={{
          title: 'Create Category',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="CategoryDetails" 
        component={CategoryDetailsScreen}
        options={{
          title: 'Category Details',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="UpdateCategory" 
        component={UpdateCategory}
        options={{
          title: 'Update Category',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

const getHeaderTitle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case 'Home':
      return 'Home';
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
    case 'ManageCategory':
      return 'Manage Categories'; // Added case
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
