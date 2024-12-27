import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateSection({ route, navigation }) {
  const { restaurantId } = route.params;
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!sectionName.trim()) {
        Alert.alert('Error', 'Please enter section name');
        return;
      }

      setLoading(true);

      // Get existing sections
      const storageKey = `sections_${restaurantId}`;
      const sectionsJson = await AsyncStorage.getItem(storageKey);
      const sections = sectionsJson ? JSON.parse(sectionsJson) : {};

      // Create new section
      const newSection = {
        id: `section_${Date.now()}`,
        name: sectionName.trim(),
        tableCount: 0,
        createdAt: new Date().toISOString(),
        restaurantId: restaurantId,
      };

      // Add new section to existing sections
      sections[newSection.id] = newSection;

      // Save to AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(sections));

      Alert.alert(
        'Success',
        'Section created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating section:', error);
      Alert.alert('Error', 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Section Name *</Text>
        <TextInput
          style={styles.input}
          value={sectionName}
          onChangeText={setSectionName}
          placeholder="Enter section name"
          autoFocus
          maxLength={50}
        />

        <TouchableOpacity 
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Section</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#a5d6b0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 