import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function UpdateMenu({ route, navigation }) {
  const { menuId, restaurantId } = route.params;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    fullPrice: '',
    halfPrice: '',
    foodType: 'Vegetarian',
    categoryId: '',
    spicyIndex: '1',
    offer: '',
    rating: '0',
    description: '',
    ingredients: '',
    isSpecial: false,
  });

  useEffect(() => {
    loadMenuData();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesJson = await AsyncStorage.getItem(`categories_${restaurantId}`);
      const categoriesData = categoriesJson ? JSON.parse(categoriesJson) : {};
      setCategories(Object.values(categoriesData));
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories');
    }
  };

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const menusJson = await AsyncStorage.getItem(`menus_${restaurantId}`);
      const menus = menusJson ? JSON.parse(menusJson) : {};
      const menuData = menus[menuId];

      if (!menuData) {
        throw new Error('Menu not found');
      }

      setFormData({
        name: menuData.name || '',
        fullPrice: menuData.fullPrice?.toString() || '',
        halfPrice: menuData.halfPrice?.toString() || '',
        foodType: menuData.foodType || 'Vegetarian',
        categoryId: menuData.categoryId || '',
        spicyIndex: menuData.spicyIndex?.toString() || '1',
        offer: menuData.offer?.toString() || '',
        rating: menuData.rating?.toString() || '0',
        description: menuData.description || '',
        ingredients: menuData.ingredients || '',
        isSpecial: menuData.isSpecial || false,
      });
      setImages(menuData.images || []);
    } catch (error) {
      console.error('Error loading menu:', error);
      alert('Failed to load menu details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please enter menu name');
        return;
      }

      if (!formData.fullPrice.trim()) {
        alert('Please enter full price');
        return;
      }

      if (!formData.categoryId) {
        alert('Please select a category');
        return;
      }

      setLoading(true);

      const menusJson = await AsyncStorage.getItem(`menus_${restaurantId}`);
      const menus = menusJson ? JSON.parse(menusJson) : {};

      // Update menu data
      menus[menuId] = {
        ...menus[menuId],
        ...formData,
        images,
        updatedAt: new Date().toISOString(),
        updatedBy: 'partner', // Or get from user context
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(`menus_${restaurantId}`, JSON.stringify(menus));

      alert('Menu updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('Failed to update menu');
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
        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter menu name"
          />
        </View>

        {/* Prices */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Full Price *</Text>
            <TextInput
              style={styles.input}
              value={formData.fullPrice}
              onChangeText={(text) => setFormData({ ...formData, fullPrice: text })}
              keyboardType="numeric"
              placeholder="Enter full price"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Half Price</Text>
            <TextInput
              style={styles.input}
              value={formData.halfPrice}
              onChangeText={(text) => setFormData({ ...formData, halfPrice: text })}
              keyboardType="numeric"
              placeholder="Enter half price"
            />
          </View>
        </View>

        {/* Food Type and Category */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Food Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.foodType}
                onValueChange={(value) => setFormData({ ...formData, foodType: value })}
              >
                <Picker.Item label="Vegetarian" value="Vegetarian" />
                <Picker.Item label="Non-vegetarian" value="Nonveg" />
              </Picker>
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map((category) => (
                  <Picker.Item 
                    key={category.id} 
                    label={category.name} 
                    value={category.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Spicy Index and Offer */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Spicy Index</Text>
            <TextInput
              style={styles.input}
              value={formData.spicyIndex}
              onChangeText={(text) => setFormData({ ...formData, spicyIndex: text })}
              keyboardType="numeric"
              placeholder="Enter spicy index (1-5)"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Offer (%)</Text>
            <TextInput
              style={styles.input}
              value={formData.offer}
              onChangeText={(text) => setFormData({ ...formData, offer: text })}
              keyboardType="numeric"
              placeholder="Enter offer percentage"
            />
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Rating</Text>
          <TextInput
            style={styles.input}
            value={formData.rating}
            onChangeText={(text) => setFormData({ ...formData, rating: text })}
            keyboardType="numeric"
            placeholder="Enter rating (0-5)"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter menu description"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.label}>Ingredients</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.ingredients}
            onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
            placeholder="Enter ingredients"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.label}>Images (Max 5)</Text>
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <FontAwesome name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <FontAwesome name="plus" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Is Special */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Is Special</Text>
            <Switch
              value={formData.isSpecial}
              onValueChange={(value) => setFormData({ ...formData, isSpecial: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={formData.isSpecial ? '#f5dd4b' : '#f4f3f4'}
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
            {loading ? 'Updating...' : 'Update Menu'}
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  col: {
    flex: 1,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 