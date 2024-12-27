import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function TableDetails({ route, navigation }) {
  const { tableId, sectionId, restaurantId } = route.params;
  const [table, setTable] = useState(null);
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample QR code image URL - replace with your actual QR code
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=table_" + tableId;

  useFocusEffect(
    React.useCallback(() => {
      loadTableDetails();
    }, [tableId])
  );

  const loadTableDetails = async () => {
    try {
      setLoading(true);
      // Load table data
      const tablesJson = await AsyncStorage.getItem(`tables_${restaurantId}_${sectionId}`);
      const tables = tablesJson ? JSON.parse(tablesJson) : {};
      const tableData = tables[tableId];

      if (!tableData) {
        throw new Error('Table not found');
      }

      // Load section name
      const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
      const sections = sectionsJson ? JSON.parse(sectionsJson) : {};
      const section = sections[sectionId];
      setSectionName(section?.name || 'Unknown Section');

      setTable(tableData);
    } catch (error) {
      console.error('Error loading table details:', error);
      Alert.alert('Error', 'Failed to load table details');
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

  if (!table) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Table not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* QR Code */}
        <View style={styles.qrContainer}>
          <Image
            source={{ uri: qrCodeUrl }}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>

        {/* Table Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.tableNumber}>Table {table.tableNumber}</Text>
          <Text style={styles.sectionName}>{sectionName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 24,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    alignItems: 'center',
  },
  tableNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionName: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
}); 