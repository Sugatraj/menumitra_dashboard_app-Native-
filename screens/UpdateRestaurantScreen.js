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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRestaurants } from '../hooks/useRestaurants';

export default function UpdateRestaurantScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { getRestaurant, updateRestaurant } = useRestaurants();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: restaurant.name,
    fssaiNumber: restaurant.fssaiNumber,
    gstNumber: restaurant.gstNumber,
    mobile: '',
    serviceCharges: '',
    gst: '',
    vegNonveg: 'Vegetarian',
    owner: '',
    restaurantType: restaurant.restaurantType,
    upiId: '',
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

  useEffect(() => {
    loadRestaurant();
  }, [restaurant]);

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurant(restaurant.id);
      setFormData(data);
    } catch (error) {
      console.error('Error loading restaurant:', error);
      alert('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateRestaurant(restaurant.id, formData);
      alert('Restaurant updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Failed to update restaurant');
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
              placeholder="Enter Service Charges"
              keyboardType="numeric"
              value={formData.serviceCharges.toString()}
              onChangeText={(text) => setFormData({ ...formData, serviceCharges: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter GST"
              keyboardType="numeric"
              value={formData.gst.toString()}
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
            <Text style={styles.label}>UPI ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID"
              value={formData.upiId}
              onChangeText={(text) => setFormData({ ...formData, upiId: text })}
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
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Updating...' : 'Update Restaurant'}
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});