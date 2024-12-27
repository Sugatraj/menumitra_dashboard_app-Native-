import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageSections({ route, navigation }) {
  const { restaurantId } = route.params;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadSections();
    }, [restaurantId])
  );

  const loadSections = async () => {
    try {
      setLoading(true);
      const storageKey = `sections_${restaurantId}`;
      const sectionsJson = await AsyncStorage.getItem(storageKey);
      const sectionsData = sectionsJson ? JSON.parse(sectionsJson) : {};
      
      // Convert object to array and sort by creation date
      const sectionsArray = Object.values(sectionsData)
        .filter(section => section.restaurantId === restaurantId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setSections(sectionsArray);
    } catch (error) {
      console.error('Error loading sections:', error);
      Alert.alert('Error', 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('SectionDetails', { 
        sectionId: item.id,
        restaurantId: restaurantId
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.sectionName}>{item.name}</Text>
          <Text style={styles.createdDate}>
            Created on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.tableCountContainer}>
            <FontAwesome name="table" size={16} color="#666" />
            <Text style={styles.tableCount}>{item.tableCount || 0} Tables</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sections found</Text>
            <Text style={styles.emptySubText}>Tap the + button to create one</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateSection', { restaurantId })}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  sectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#666',
  },
  tableCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tableCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#67B279',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
}); 