import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoryDetailsScreen({ route, navigation }) {
  const { categoryId, restaurantId } = route.params;
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadCategory();
    }, [categoryId])
  );

  const loadCategory = async () => {
    try {
      setLoading(true);
      const storageKey = `categories_${restaurantId}`;
      const categoriesJson = await AsyncStorage.getItem(storageKey);
      const categories = categoriesJson ? JSON.parse(categoriesJson) : {};
      
      const categoryData = categories[categoryId];
      if (!categoryData) {
        throw new Error('Category not found');
      }
      
      setCategory(categoryData);
    } catch (error) {
      console.error('Error loading category:', error);
      alert('Failed to load category details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storageKey = `categories_${restaurantId}`;
              const categoriesJson = await AsyncStorage.getItem(storageKey);
              const categories = categoriesJson ? JSON.parse(categoriesJson) : {};
              
              // Delete the category
              delete categories[categoryId];
              
              // Save updated categories
              await AsyncStorage.setItem(storageKey, JSON.stringify(categories));
              
              alert('Category deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting category:', error);
              alert('Failed to delete category');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {category.image ? (
            <Image 
              source={{ uri: category.image }} 
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

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{category.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Created On</Text>
            <Text style={styles.value}>
              {new Date(category.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Menu Items</Text>
            <Text style={styles.value}>
              {category.menuItems?.length || 0} items
            </Text>
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
        onPress={() => navigation.navigate('UpdateCategory', { 
          categoryId,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
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