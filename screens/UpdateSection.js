import React, { useState, useEffect } from 'react';
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

export default function UpdateSection({ route, navigation }) {
  const { sectionId, restaurantId } = route.params;
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSectionData();
  }, []);

  const loadSectionData = async () => {
    try {
      setLoading(true);
      const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
      const sections = sectionsJson ? JSON.parse(sectionsJson) : {};
      const section = sections[sectionId];

      if (!section) {
        throw new Error('Section not found');
      }

      setSectionName(section.name);
    } catch (error) {
      console.error('Error loading section:', error);
      Alert.alert('Error', 'Failed to load section details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!sectionName.trim()) {
        Alert.alert('Error', 'Please enter section name');
        return;
      }

      setUpdating(true);

      // Get current sections data
      const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
      const sections = JSON.parse(sectionsJson);

      // Update section
      sections[sectionId] = {
        ...sections[sectionId],
        name: sectionName.trim(),
        updatedAt: new Date().toISOString()
      };

      // Save updated data
      await AsyncStorage.setItem(`sections_${restaurantId}`, JSON.stringify(sections));

      Alert.alert(
        'Success',
        'Section updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating section:', error);
      Alert.alert('Error', 'Failed to update section');
    } finally {
      setUpdating(false);
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
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Section Name *</Text>
        <TextInput
          style={styles.input}
          value={sectionName}
          onChangeText={setSectionName}
          placeholder="Enter section name"
          maxLength={50}
        />

        <TouchableOpacity 
          style={[
            styles.updateButton,
            updating && styles.updateButtonDisabled
          ]}
          onPress={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Section</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  updateButton: {
    backgroundColor: '#67B279',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#a5d6b0',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 