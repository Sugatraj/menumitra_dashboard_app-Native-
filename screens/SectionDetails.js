import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SectionDetails({ route, navigation }) {
  const { sectionId, restaurantId } = route.params;
  const [section, setSection] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadSectionDetails();
    }, [sectionId])
  );

  const loadSectionDetails = async () => {
    try {
      setLoading(true);
      // Load section data
      const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
      const sections = sectionsJson ? JSON.parse(sectionsJson) : {};
      const sectionData = sections[sectionId];

      if (!sectionData) {
        throw new Error('Section not found');
      }

      // Load tables for this section
      const tablesJson = await AsyncStorage.getItem(`tables_${restaurantId}_${sectionId}`);
      const tablesData = tablesJson ? JSON.parse(tablesJson) : {};
      const tablesArray = Object.values(tablesData)
        .sort((a, b) => a.tableNumber - b.tableNumber);

      setSection(sectionData);
      setTables(tablesArray);
    } catch (error) {
      console.error('Error loading section details:', error);
      Alert.alert('Error', 'Failed to load section details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Section',
      'Are you sure you want to delete this section? This will also delete all tables in this section.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete section
              const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
              const sections = JSON.parse(sectionsJson);
              delete sections[sectionId];
              await AsyncStorage.setItem(`sections_${restaurantId}`, JSON.stringify(sections));

              // Delete tables
              await AsyncStorage.removeItem(`tables_${restaurantId}_${sectionId}`);

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting section:', error);
              Alert.alert('Error', 'Failed to delete section');
            }
          },
        },
      ]
    );
  };

  const renderTableItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.tableCard}
      onPress={() => navigation.navigate('TableDetails', {
        tableId: item.id,
        sectionId,
        restaurantId
      })}
    >
      <View style={styles.tableInfo}>
        <Text style={styles.tableNumber}>Table {item.tableNumber}</Text>
        <Text style={styles.tableCapacity}>{item.capacity} Seats</Text>
      </View>
      <View style={[styles.statusBadge, 
        { backgroundColor: item.isOccupied ? '#FF5252' : '#4CAF50' }]}>
        <Text style={styles.statusText}>
          {item.isOccupied ? 'Occupied' : 'Available'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const createNewTable = async () => {
    try {
      // Get existing tables
      const tablesKey = `tables_${restaurantId}_${sectionId}`;
      const tablesJson = await AsyncStorage.getItem(tablesKey);
      const tablesData = tablesJson ? JSON.parse(tablesJson) : {};

      // Find the highest table number
      const existingTables = Object.values(tablesData);
      const highestTableNumber = existingTables.length > 0
        ? Math.max(...existingTables.map(t => t.tableNumber))
        : 0;

      // Create new table with next number
      const newTable = {
        id: `table_${Date.now()}`,
        tableNumber: highestTableNumber + 1,
        capacity: 4, // Default capacity
        isOccupied: false,
        sectionId: sectionId,
        restaurantId: restaurantId,
        createdAt: new Date().toISOString()
      };

      // Add new table to existing tables
      tablesData[newTable.id] = newTable;
      await AsyncStorage.setItem(tablesKey, JSON.stringify(tablesData));

      // Update section's table count
      const sectionsJson = await AsyncStorage.getItem(`sections_${restaurantId}`);
      const sections = JSON.parse(sectionsJson);
      sections[sectionId] = {
        ...sections[sectionId],
        tableCount: (sections[sectionId].tableCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem(`sections_${restaurantId}`, JSON.stringify(sections));

      // Refresh the data
      loadSectionDetails();

      Alert.alert('Success', `Table ${newTable.tableNumber} created successfully!`);
    } catch (error) {
      console.error('Error creating table:', error);
      Alert.alert('Error', 'Failed to create table');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!section) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Section not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionName}>{section.name}</Text>
          <Text style={styles.createdDate}>
            Created on {new Date(section.createdAt).toLocaleDateString()}
          </Text>
        </View>

      </View>

      {/* Tables List */}
      <View style={styles.tablesContainer}>
        <View style={styles.tablesHeader}>
          <View style={styles.tablesHeaderLeft}>
            <Text style={styles.tablesTitle}>Tables ({tables.length})</Text>
          </View>
          <TouchableOpacity 
            style={styles.addTableButton}
            onPress={createNewTable}
          >
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.addTableButtonText}>Add Table</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.tablesList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tables in this section</Text>
              <Text style={styles.emptySubText}>Tap the + button to add tables</Text>
            </View>
          )}
        />
      </View>

      {/* Delete FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, styles.fabDelete]}
          onPress={handleDelete}
        >
          <FontAwesome name="trash" size={24} color="white" />
        </TouchableOpacity>

        {/* Edit FAB */}
        <TouchableOpacity 
          style={[styles.fab, styles.fabEdit]}
          onPress={() => navigation.navigate('UpdateSection', { 
            sectionId,
            restaurantId 
          })}
        >
          <FontAwesome name="edit" size={24} color="white" />
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 10,
  },
  tablesContainer: {
    flex: 1,
  },
  tablesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  tablesHeaderLeft: {
    flex: 1,
  },
  tablesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addTableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#67B279',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  addTableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  tablesList: {
    padding: 20,
    paddingTop: 0,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tableInfo: {
    flex: 1,
  },
  tableNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tableCapacity: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16, // Space between FABs
  },
  fabEdit: {
    backgroundColor: '#007AFF',
  },
  fabDelete: {
    backgroundColor: '#dc3545',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
}); 