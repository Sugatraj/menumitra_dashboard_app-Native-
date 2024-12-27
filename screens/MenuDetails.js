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

  const renderDetailItem = (label, value) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Images Section */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          style={styles.imageContainer}
        >
          {menu.images && menu.images.length > 0 ? (
            menu.images.map((uri, index) => (
              <Image 
                key={index}
                source={{ uri }} 
                style={styles.image}
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={styles.noImageContainer}>
              <FontAwesome name="image" size={50} color="#666" />
              <Text style={styles.noImageText}>No images available</Text>
            </View>
          )}
        </ScrollView>

        {/* Details Grid - 2 columns */}
        <View style={styles.detailsGrid}>
          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('NAME', menu.name)}
            </View>
            <View style={styles.col}>
              {renderDetailItem('FULL PRICE', `₹${menu.fullPrice}`)}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('HALF PRICE', menu.halfPrice ? `₹${menu.halfPrice}` : 'N/A')}
            </View>
            <View style={styles.col}>
              {renderDetailItem('FOOD TYPE', menu.foodType)}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('SPICY INDEX', menu.spicyIndex)}
            </View>
            <View style={styles.col}>
              {renderDetailItem('CATEGORY', categoryName)}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('OFFER', menu.offer || 'No offer')}
            </View>
            <View style={styles.col}>
              {renderDetailItem('RATING', menu.rating || 'Not rated')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('IS SPECIAL', menu.isSpecial ? 'Yes' : 'No')}
            </View>
            <View style={styles.col}>
              {renderDetailItem('CREATED ON', new Date(menu.createdAt).toLocaleDateString())}
            </View>
          </View>

          {/* Full width items */}
          <View style={styles.row}>
            <View style={styles.fullWidth}>
              {renderDetailItem('DESCRIPTION', menu.description || 'No description')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fullWidth}>
              {renderDetailItem('INGREDIENTS', menu.ingredients || 'No ingredients listed')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('CREATED BY', menu.createdBy || 'System')}
            </View>
            <View style={styles.col}>
              {renderDetailItem('UPDATED ON', menu.updatedAt ? new Date(menu.updatedAt).toLocaleDateString() : 'Never')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              {renderDetailItem('UPDATED BY', menu.updatedBy || 'N/A')}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Delete Button - Top Right */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <FontAwesome name="trash" size={24} color="#dc3545" />
      </TouchableOpacity>

      {/* Update FAB - Bottom Right */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateMenu', { 
          menuId,
          restaurantId 
        })}
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
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 400,
    height: 250,
  },
  noImageContainer: {
    width: 400,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noImageText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  detailsGrid: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },
  fullWidth: {
    flex: 1,
    paddingHorizontal: 8,
    width: '100%',
  },
  detailItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
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