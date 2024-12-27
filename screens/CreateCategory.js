import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function CreateCategory({ route, navigation }) {
  const { restaurantId } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData({ ...formData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please enter category name');
        return;
      }

      if (!restaurantId) {
        alert('Restaurant ID is required');
        return;
      }

      setLoading(true);
      console.log('Creating category for restaurant:', restaurantId);

      // Get existing categories for this specific restaurant
      const storageKey = `categories_${restaurantId}`;
      const categoriesJson = await AsyncStorage.getItem(storageKey);
      const categories = categoriesJson ? JSON.parse(categoriesJson) : {};

      console.log('Existing categories:', categories);

      // Create new category ID with restaurant prefix
      const categoryId = `${restaurantId}_category_${Date.now()}`;

      // Add new category
      const newCategory = {
        id: categoryId,
        name: formData.name.trim(),
        image: formData.image,
        menuItems: [],
        createdAt: new Date().toISOString(),
        restaurantId: restaurantId, // Explicitly store restaurant ID
      };

      console.log('New category:', newCategory);

      // Save to AsyncStorage with restaurant-specific key
      await AsyncStorage.setItem(storageKey, JSON.stringify({
        ...categories,
        [categoryId]: newCategory
      }));

      console.log('Category saved successfully');
      alert('Category created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {formData.image ? (
              <Image source={{ uri: formData.image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContainer}>
                <FontAwesome name="camera" size={40} color="#666" />
                <Text style={styles.placeholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Create Category'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 