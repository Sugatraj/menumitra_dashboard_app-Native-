import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRestaurants } from '../hooks/useRestaurants';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOwners } from '../hooks/useOwners';

export default function UpdateRestaurantScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { getRestaurant, updateRestaurant } = useRestaurants();
  const { owners, refreshOwners } = useOwners();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const restaurantData = await getRestaurant(restaurantId);
      await refreshOwners();

      if (restaurantData) {
        setRestaurant(restaurantData);
        setFormData({
          name: restaurantData.name || '',
          fssaiNumber: restaurantData.fssaiNumber || '',
          gstNumber: restaurantData.gstNumber || '',
          mobile: restaurantData.mobile || '',
          serviceCharges: restaurantData.serviceCharges || '1',
          gst: restaurantData.gst || '1',
          vegNonveg: restaurantData.vegNonveg || 'Vegetarian',
          owner: restaurantData.owner || '',
          restaurantType: restaurantData.restaurantType || 'Restaurant',
          upiId: restaurantData.upiId || '',
          address: restaurantData.address || '',
          image: restaurantData.image || null,
          website: restaurantData.website || '',
          instagram: restaurantData.instagram || '',
          facebook: restaurantData.facebook || '',
          whatsapp: restaurantData.whatsapp || '',
          googleReview: restaurantData.googleReview || '',
          googleBusinessLink: restaurantData.googleBusinessLink || '',
          hotelStatus: restaurantData.hotelStatus || 'Active',
          isOpen: restaurantData.isOpen || 'Open',
        });
      } else {
        setError('Restaurant not found');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (!formData.name || !formData.fssaiNumber || !formData.gstNumber) {
        throw new Error('Please fill in all required fields');
      }

      await updateRestaurant(restaurantId, formData);
      Alert.alert('Success', 'Restaurant updated successfully');
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to update restaurant');
      Alert.alert('Error', err.message || 'Failed to update restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setFormData({ ...formData, image: result.uri });
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (loading || !formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#67B279" />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.imageSection}>
          {formData.image ? (
            <Image 
              source={{ uri: formData.image }} 
              style={styles.previewImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FontAwesome name="image" size={50} color="#ccc" />
            </View>
          )}
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            <FontAwesome name="camera" size={20} color="#fff" />
            <Text style={styles.imageButtonText}>Change Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* FSSAI Number</Text>
            <TextInput
              style={styles.input}
              value={formData.fssaiNumber}
              onChangeText={(text) => setFormData({ ...formData, fssaiNumber: text })}
              placeholder="Enter FSSAI Number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* GST Number</Text>
            <TextInput
              style={styles.input}
              value={formData.gstNumber}
              onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
              placeholder="Enter GST Number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Mobile</Text>
            <TextInput
              style={styles.input}
              value={formData.mobile}
              onChangeText={(text) => setFormData({ ...formData, mobile: text })}
              placeholder="Enter Mobile Number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Service Charges</Text>
            <TextInput
              style={styles.input}
              value={formData.serviceCharges}
              onChangeText={(text) => setFormData({ ...formData, serviceCharges: text })}
              placeholder="Enter Service Charges"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* GST</Text>
            <TextInput
              style={styles.input}
              value={formData.gst}
              onChangeText={(text) => setFormData({ ...formData, gst: text })}
              placeholder="Enter GST"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Veg Nonveg</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.vegNonveg}
                onValueChange={(value) => setFormData({ ...formData, vegNonveg: value })}
              >
                <Picker.Item label="Vegetarian" value="Vegetarian" />
                <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
                <Picker.Item label="Both" value="Both" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Owner</Text>
            <TextInput
              style={styles.input}
              value={formData.owner}
              onChangeText={(text) => setFormData({ ...formData, owner: text })}
              placeholder="Enter Owner Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Restaurant Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.restaurantType}
                onValueChange={(value) => setFormData({ ...formData, restaurantType: value })}
              >
                <Picker.Item label="Restaurant" value="Restaurant" />
                <Picker.Item label="Fine Dining" value="Fine Dining" />
                <Picker.Item label="Cafe" value="Cafe" />
                <Picker.Item label="Fast Food" value="Fast Food" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* UPI ID</Text>
            <TextInput
              style={styles.input}
              value={formData.upiId}
              onChangeText={(text) => setFormData({ ...formData, upiId: text })}
              placeholder="Enter UPI ID"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>* Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter Address"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media & Additional Info</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) => setFormData({ ...formData, website: text })}
              placeholder="Enter Website URL"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              value={formData.instagram}
              onChangeText={(text) => setFormData({ ...formData, instagram: text })}
              placeholder="Enter Instagram URL"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              value={formData.facebook}
              onChangeText={(text) => setFormData({ ...formData, facebook: text })}
              placeholder="Enter Facebook URL"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp</Text>
            <TextInput
              style={styles.input}
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({ ...formData, whatsapp: text })}
              placeholder="Enter WhatsApp Number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Review</Text>
            <TextInput
              style={styles.input}
              value={formData.googleReview}
              onChangeText={(text) => setFormData({ ...formData, googleReview: text })}
              placeholder="Enter Google Review URL"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Business Link</Text>
            <TextInput
              style={styles.input}
              value={formData.googleBusinessLink}
              onChangeText={(text) => setFormData({ ...formData, googleBusinessLink: text })}
              placeholder="Enter Google Business URL"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hotel Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.hotelStatus}
                onValueChange={(value) => setFormData({ ...formData, hotelStatus: value })}
              >
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Inactive" value="Inactive" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Is Open</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.isOpen}
                onValueChange={(value) => setFormData({ ...formData, isOpen: value })}
              >
                <Picker.Item label="Open" value="Open" />
                <Picker.Item label="Closed" value="Closed" />
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Update Restaurant</Text>
          )}
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
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 15,
    paddingHorizontal: 20,
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
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
  restaurantImage: {
    width: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#67B279',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  imageButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});