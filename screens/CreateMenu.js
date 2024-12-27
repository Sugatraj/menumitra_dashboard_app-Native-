import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function CreateMenu({ route, navigation }) {
  const { restaurantId } = route.params;
  const [loading, setLoading] = useState(false);
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesJson = await AsyncStorage.getItem(`categories_${restaurantId}`);
      const categoriesData = categoriesJson ? JSON.parse(categoriesJson) : {};
      setCategories(Object.values(categoriesData));
    } catch (error) {
      console.error('Error loading categories:', error);
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

      const menuId = `menu_${Date.now()}`;
      const storageKey = `menus_${restaurantId}`;
      
      // Get existing menus
      const menusJson = await AsyncStorage.getItem(storageKey);
      const menus = menusJson ? JSON.parse(menusJson) : {};

      // Create new menu
      const newMenu = {
        id: menuId,
        ...formData,
        images: images,
        createdAt: new Date().toISOString(),
        restaurantId,
        isAvailable: true,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify({
        ...menus,
        [menuId]: newMenu
      }));

      alert('Menu created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating menu:', error);
      alert('Failed to create menu');
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
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter menu name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Price *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full price"
              keyboardType="numeric"
              value={formData.fullPrice}
              onChangeText={(text) => setFormData({ ...formData, fullPrice: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Half Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter half price"
              keyboardType="numeric"
              value={formData.halfPrice}
              onChangeText={(text) => setFormData({ ...formData, halfPrice: text })}
            />
          </View>
        </View>

        {/* Category and Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category & Type</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.foodType}
                onValueChange={(value) => setFormData({ ...formData, foodType: value })}
              >
                <Picker.Item label="Vegetarian" value="Vegetarian" />
                <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Menu Category *</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Spicy Index</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.spicyIndex}
                onValueChange={(value) => setFormData({ ...formData, spicyIndex: value })}
              >
                <Picker.Item label="Not Spicy" value="1" />
                <Picker.Item label="Mild" value="2" />
                <Picker.Item label="Medium" value="3" />
                <Picker.Item label="Hot" value="4" />
                <Picker.Item label="Extra Hot" value="5" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Offer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter offer details"
              value={formData.offer}
              onChangeText={(text) => setFormData({ ...formData, offer: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter menu description"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredients</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter ingredients"
              multiline
              numberOfLines={4}
              value={formData.ingredients}
              onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
            />
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images (Max 5)</Text>
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <FontAwesome name="times" size={20} color="#fff" />
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

        {/* Special Flag */}
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
            {loading ? 'Creating...' : 'Create Menu'}
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
    marginBottom: 25,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
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
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
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
    borderRadius: 5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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