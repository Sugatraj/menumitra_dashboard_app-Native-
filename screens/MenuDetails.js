import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function MenuDetails({ route, navigation }) {
  const { menuId, restaurantId } = route.params;
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadMenuDetails();
    }, [menuId])
  );

  const loadMenuDetails = async () => {
    try {
      setLoading(true);
      // Load menu data
      const menusJson = await AsyncStorage.getItem(`menus_${restaurantId}`);
      const menus = menusJson ? JSON.parse(menusJson) : {};
      const menuData = menus[menuId];

      if (!menuData) {
        throw new Error('Menu not found');
      }

      // Load category name
      const categoriesJson = await AsyncStorage.getItem(`categories_${restaurantId}`);
      const categories = categoriesJson ? JSON.parse(categoriesJson) : {};
      const category = categories[menuData.categoryId];
      setCategoryName(category?.name || 'Uncategorized');

      setMenu(menuData);
    } catch (error) {
      console.error('Error loading menu details:', error);
      alert('Failed to load menu details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Menu',
      'Are you sure you want to delete this menu?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const menusJson = await AsyncStorage.getItem(`menus_${restaurantId}`);
              const menus = JSON.parse(menusJson);
              delete menus[menuId];
              await AsyncStorage.setItem(`menus_${restaurantId}`, JSON.stringify(menus));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting menu:', error);
              alert('Failed to delete menu');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!menu) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Menu not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Images Section */}
        <View style={styles.imageContainer}>
          {menu.images && menu.images.length > 0 ? (
            <Image 
              source={{ uri: menu.images[0] }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <FontAwesome name="image" size={50} color="#666" />
              <Text style={styles.placeholderText}>No image available</Text>
            </View>
          )}
        </View>

        {/* Details Section - 2 Columns */}
        <View style={styles.detailsContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.name}</Text>
                <Text style={styles.label}>Name</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{categoryName}</Text>
                <Text style={styles.label}>Category</Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>₹{menu.fullPrice}</Text>
                <Text style={styles.label}>Full Price</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.halfPrice ? `₹${menu.halfPrice}` : 'N/A'}</Text>
                <Text style={styles.label}>Half Price</Text>
              </View>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.foodType}</Text>
                <Text style={styles.label}>Food Type</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.spicyIndex}</Text>
                <Text style={styles.label}>Spicy Index</Text>
              </View>
            </View>
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.rating || 'Not rated'}</Text>
                <Text style={styles.label}>Rating</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{menu.isSpecial ? 'Yes' : 'No'}</Text>
                <Text style={styles.label}>Special</Text>
              </View>
            </View>
          </View>

          {/* Full Width Items */}
          <View style={styles.fullWidthItem}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{menu.description || 'No description'}</Text>
          </View>

          <View style={styles.fullWidthItem}>
            <Text style={styles.label}>Ingredients</Text>
            <Text style={styles.value}>{menu.ingredients || 'No ingredients listed'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Delete Button */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <FontAwesome name="trash" size={24} color="#dc3545" />
      </TouchableOpacity>

      {/* Update FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateMenu', { menuId, restaurantId })}
      >
        <FontAwesome name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  detailItem: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  fullWidthItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#67B279',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
}); 