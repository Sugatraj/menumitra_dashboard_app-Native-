import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRestaurants } from '../hooks/useRestaurants';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageRestaurants({ navigation }) {
  const { 
    restaurants, 
    loading, 
    error, 
    refreshRestaurants,
    deleteRestaurant 
  } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState('');

  // Refresh restaurants when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshRestaurants();
    }, [])
  );

  const handleDelete = async (id) => {
    try {
      await deleteRestaurant(id);
      // No need to manually refresh as the useRestaurants hook will update the state
    } catch (error) {
      alert('Failed to delete restaurant');
      console.error(error);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    console.log('Restaurant in list:', item);
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          console.log('Navigating to restaurant with ID:', item.id);
          navigation.navigate('ViewRestaurant', { restaurantId: item.id });
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.mainColumn}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.locationText}>{item.address}</Text>
          </View>
          
          <View style={styles.statusColumn}>
            <Text style={[
              styles.statusText,
              { color: item.isActive ? '#28a745' : '#dc3545' }
            ]}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshRestaurants}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredRestaurants}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          refreshing={loading}
          onRefresh={refreshRestaurants}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRestaurant')}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainColumn: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statusColumn: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
  },
  retryText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
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
  list: {
    flex: 1,
  },
}); 