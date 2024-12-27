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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useOwners } from '../hooks/useOwners';
import { useRestaurants } from '../hooks/useRestaurants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateRestaurant({ navigation }) {
  const { createRestaurant } = useRestaurants();
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [formData, setFormData] = useState({
    restaurantCode: '',
    name: '',
    fssaiNumber: '',
    gstNumber: '',
    mobile: '',
    restaurantType: 'Restaurant',
    address: '',
    ownerName: '',
    status: 'Active',
    vegNonveg: 'veg',
    serviceCharges: '1',
    gst: '1',
    upiId: '',
    isOpen: true,
    totalCategory: '0',
    totalMenu: '0',
    totalCompletedOrders: '0',
    totalCancledOrders: '0',
    facebook: '',
    instagram: '',
    googleReview: '',
    googleBusinessLink: '',
    whatsapp: '',
    website: '',
    image: null,
    createdOn: new Date().toLocaleDateString(),
    createdBy: 'admin',
    updatedOn: new Date().toLocaleDateString(),
    updatedBy: 'admin',
    ownerId: '',
    ownerName: ''
  });

  // Load owners from AsyncStorage
  useEffect(() => {
    const loadOwners = async () => {
      try {
        setLoadingOwners(true);
        const ownersData = await AsyncStorage.getItem('owners');
        const parsedOwners = ownersData ? JSON.parse(ownersData) : [];
        setOwners(parsedOwners);
      } catch (error) {
        console.error('Error loading owners:', error);
      } finally {
        setLoadingOwners(false);
      }
    };

    loadOwners();
  }, []);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

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
      if (!formData.ownerId) {
        alert('Please select an owner');
        return;
      }

      const restaurantData = {
        ...formData,
        owner: formData.ownerId,
      };

      setLoading(true);
      await createRestaurant(restaurantData);
      alert('Restaurant created successfully!');
      navigation.goBack();
    } catch (error) {
      alert('Failed to create restaurant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOwners) {
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
            <Text style={styles.label}>Restaurant Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Restaurant Code"
              value={formData.restaurantCode}
              onChangeText={(text) => setFormData({ ...formData, restaurantCode: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FSSAI Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter FSSAI Number"
              value={formData.fssaiNumber}
              onChangeText={(text) => setFormData({ ...formData, fssaiNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter GST Number"
              value={formData.gstNumber}
              onChangeText={(text) => setFormData({ ...formData, gstNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              value={formData.mobile}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({ ...formData, mobile: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Restaurant Type</Text>
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
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Address"
              multiline
              numberOfLines={4}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner *</Text>
            {loadingOwners ? (
              <ActivityIndicator size="small" color="#67B279" />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={formData.ownerId}
                  onValueChange={(value, index) => {
                    if (value) {
                      const selectedOwner = owners.find(owner => owner.id === value);
                      setFormData({
                        ...formData,
                        ownerId: value,
                        ownerName: selectedOwner?.name || ''
                      });
                    }
                  }}
                >
                  <Picker.Item label="Select Owner" value="" />
                  {owners.map((owner) => (
                    <Picker.Item
                      key={owner.id}
                      label={`${owner.name} (${owner.mobile})`}
                      value={owner.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
            <TouchableOpacity 
              style={styles.addOwnerButton}
              onPress={() => navigation.navigate('CreateOwner')}
            >
              <Text style={styles.addOwnerButtonText}>+ Add New Owner</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veg/Non-veg</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.vegNonveg}
                onValueChange={(value) => setFormData({ ...formData, vegNonveg: value })}
              >
                <Picker.Item label="Veg" value="veg" />
                <Picker.Item label="Non-veg" value="nonveg" />
                <Picker.Item label="Both" value="both" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Charges (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Service Charges"
              value={formData.serviceCharges}
              keyboardType="numeric"
              onChangeText={(text) => setFormData({ ...formData, serviceCharges: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter GST"
              value={formData.gst}
              keyboardType="numeric"
              onChangeText={(text) => setFormData({ ...formData, gst: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID"
              value={formData.upiId}
              onChangeText={(text) => setFormData({ ...formData, upiId: text })}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Is Open</Text>
            <Switch
              value={formData.isOpen}
              onValueChange={(value) => setFormData({ ...formData, isOpen: value })}
            />
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Facebook URL"
              value={formData.facebook}
              onChangeText={(text) => setFormData({ ...formData, facebook: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Instagram URL"
              value={formData.instagram}
              onChangeText={(text) => setFormData({ ...formData, instagram: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Google Review URL"
              value={formData.googleReview}
              onChangeText={(text) => setFormData({ ...formData, googleReview: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Business Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Google Business URL"
              value={formData.googleBusinessLink}
              onChangeText={(text) => setFormData({ ...formData, googleBusinessLink: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp Number"
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({ ...formData, whatsapp: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Website URL"
              value={formData.website}
              onChangeText={(text) => setFormData({ ...formData, website: text })}
            />
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Image</Text>
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            <FontAwesome name="image" size={24} color="#666" />
            <Text style={styles.imageButtonText}>Choose Image</Text>
          </TouchableOpacity>
          {formData.image && (
            <Image source={{ uri: formData.image }} style={styles.previewImage} />
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create Restaurant</Text>
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
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  addOwnerButton: {
    marginTop: 8,
    padding: 8,
  },
  addOwnerButtonText: {
    color: '#67B279',
    fontSize: 14,
    fontWeight: '500',
  },
}); 