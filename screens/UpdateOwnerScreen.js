import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateOwnerScreen({ route, navigation }) {
  const { ownerId, ownerData } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ownerData?.name || '',
    email: ownerData?.email || '',
    mobile: ownerData?.mobile || '',
    address: ownerData?.address || '',
    subscription: {
      remainingDays: ownerData?.subscription?.remainingDays || 0,
      hotelsAllowed: ownerData?.subscription?.hotelsAllowed || 0,
    },
    hotelsOwned: ownerData?.hotelsOwned || 0,
    status: ownerData?.status || 'Active',
  });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      // Get current owners
      const ownersData = await AsyncStorage.getItem('owners');
      const owners = ownersData ? JSON.parse(ownersData) : [];
      
      // Find and update the owner
      const updatedOwners = owners.map(owner => 
        owner.id === ownerId ? { ...owner, ...formData } : owner
      );
      
      // Save back to storage
      await AsyncStorage.setItem('owners', JSON.stringify(updatedOwners));
      
      navigation.goBack();
    } catch (error) {
      console.error('Error updating owner:', error);
      Alert.alert('Error', 'Failed to update owner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter Email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              value={formData.mobile}
              onChangeText={(text) => setFormData({ ...formData, mobile: text })}
              placeholder="Enter Mobile"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter Address"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Update Owner</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 