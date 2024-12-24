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
import { useOwners } from '../hooks/useOwners';

export default function ManageRestaurants({ navigation }) {
  const { 
    restaurants, 
    loading, 
    error, 
    refreshRestaurants,
    deleteRestaurant 
  } = useRestaurants();
  const { getOwner } = useOwners();
  const [restaurantsWithOwners, setRestaurantsWithOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Refresh restaurants when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshRestaurants();
    }, [])
  );

  useEffect(() => {
    loadRestaurantsWithOwners();
  }, [restaurants]);

  const loadRestaurantsWithOwners = async () => {
    try {
      const updatedRestaurants = await Promise.all(
        restaurants.map(async (restaurant) => {
          if (restaurant.owner) {
            const ownerData = await getOwner(restaurant.owner);
            return {
              ...restaurant,
              ownerName: ownerData?.name || 'Not Assigned'
            };
          }
          return {
            ...restaurant,
            ownerName: 'Not Assigned'
          };
        })
      );
      setRestaurantsWithOwners(updatedRestaurants);
    } catch (error) {
      console.error('Error loading owners:', error);
    }
  };

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

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ViewRestaurant', { restaurantId: item.id })}
    >
      <View style={styles.cardContent}>
        {/* First Row */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            
            <Text style={[styles.value, styles.boldText]}>{item.name}</Text>
          </View>
          <View style={styles.rightColumn}>
         
            <Text style={[
              styles.statusText,
              { color: item.isOpen ? '#28a745' : '#dc3545' }
            ]}>
              {item.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {/* Second Row */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            
            <Text style={styles.value}>{item.id}</Text>
          </View>
          <View style={styles.rightColumn}>
           
            <Text style={styles.value}>{item.mobile}</Text>
          </View>
        </View>

        {/* Third Row */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <View style={styles.ownerRow}>
              <FontAwesome name="user-o" size={16} color="#666" style={styles.ownerIcon} />
              <Text style={styles.value}>{item.ownerName}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          data={restaurantsWithOwners}
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
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 5,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#dc3545",
    marginBottom: 10,
  },
  retryText: {
    color: "#0066cc",
    textDecorationLine: "underline",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#67B279",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  list: {
    flex: 1,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerIcon: {
    marginRight: 8,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 
