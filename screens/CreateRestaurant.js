import React, { useState } from 'react';
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

export default function CreateRestaurant({ navigation }) {
  const { owners, loading: ownersLoading } = useOwners();
  const { createRestaurant } = useRestaurants();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fssaiNumber: '',
    gstNumber: '',
    mobile: '',
    serviceCharges: '1',
    gst: '1',
    vegNonveg: 'Vegetarian',
    owner: '',
    restaurantType: 'Fine Dining',
    upiId: '',
    image: null,
    website: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    googleReview: '',
    googleBusinessLink: '',
    hotelStatus: true,
    isOpen: true,
    address: '',
  });

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
      if (!formData.owner) {
        alert('Please select an owner');
        return;
      }

      setLoading(true);
      await createRestaurant(formData);
      alert('Restaurant created successfully!');
      navigation.goBack();
    } catch (error) {
      alert('Failed to create restaurant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (ownersLoading) {
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
            <Text style={styles.label}>GST Number *</Text>
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
              placeholder="Enter Mobile"
              keyboardType="phone-pad"
              value={formData.mobile}
              onChangeText={(text) => setFormData({ ...formData, mobile: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Charges *</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              keyboardType="numeric"
              value={formData.serviceCharges}
              onChangeText={(text) => setFormData({ ...formData, serviceCharges: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST *</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              keyboardType="numeric"
              value={formData.gst}
              onChangeText={(text) => setFormData({ ...formData, gst: text })}
            />
          </View>
        </View>

        {/* Restaurant Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veg/Non-veg *</Text>
            <Picker
              selectedValue={formData.vegNonveg}
              style={styles.picker}
              onValueChange={(itemValue) => setFormData({ ...formData, vegNonveg: itemValue })}
            >
              <Picker.Item label="Vegetarian" value="Vegetarian" />
              <Picker.Item label="Non-Vegetarian" value="Non-Vegetarian" />
              <Picker.Item label="Both" value="Both" />
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Owner *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.owner}
                style={styles.picker}
                onValueChange={(itemValue) => setFormData({ ...formData, owner: itemValue })}
              >
                <Picker.Item label="Select Owner" value="" />
                {owners.map((owner) => (
                  <Picker.Item 
                    key={owner.id} 
                    label={owner.name} 
                    value={owner.id} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Restaurant Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.restaurantType}
                style={styles.picker}
                onValueChange={(itemValue) => setFormData({ ...formData, restaurantType: itemValue })}
              >
                <Picker.Item label="Fine Dining" value="Fine Dining" />
                <Picker.Item label="Casual Dining" value="Casual Dining" />
                <Picker.Item label="Fast Food" value="Fast Food" />
                <Picker.Item label="Cafe" value="Cafe" />
                <Picker.Item label="Buffet" value="Buffet" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Payment and Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment and Social Media</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>UPI ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID"
              value={formData.upiId}
              onChangeText={(text) => setFormData({ ...formData, upiId: text })}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant Image</Text>
            <TouchableOpacity 
              style={styles.imageButton} 
              onPress={handleImagePick}
            >
              <FontAwesome name="image" size={24} color="#666" />
              <Text style={styles.imageButtonText}>
                {formData.image ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>
            
            {formData.image && (
              <Image
                source={{ uri: formData.image }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Website"
              value={formData.website}
              onChangeText={(text) => setFormData({ ...formData, website: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Instagram"
              value={formData.instagram}
              onChangeText={(text) => setFormData({ ...formData, instagram: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Facebook"
              value={formData.facebook}
              onChangeText={(text) => setFormData({ ...formData, facebook: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp"
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({ ...formData, whatsapp: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Google Review"
              value={formData.googleReview}
              onChangeText={(text) => setFormData({ ...formData, googleReview: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Google Business Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Google Business Link"
              value={formData.googleBusinessLink}
              onChangeText={(text) => setFormData({ ...formData, googleBusinessLink: text })}
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Hotel Status</Text>
            <Switch
              value={formData.hotelStatus}
              onValueChange={(value) => setFormData({ ...formData, hotelStatus: value })}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Is Open</Text>
            <Switch
              value={formData.isOpen}
              onValueChange={(value) => setFormData({ ...formData, isOpen: value })}
            />
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
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    height: 50,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
}); 