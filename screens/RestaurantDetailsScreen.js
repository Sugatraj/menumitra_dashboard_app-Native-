import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRestaurants } from '../hooks/useRestaurants';
import { useOwners } from '../hooks/useOwners';

export default function RestaurantDetailsScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { getRestaurant, deleteRestaurant } = useRestaurants();
  const { getOwner } = useOwners();
  const [restaurant, setRestaurant] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading restaurant with ID:', restaurantId);
      
      const restaurantData = await getRestaurant(restaurantId);
      console.log('Loaded restaurant data:', restaurantData);
      
      if (!restaurantData) {
        throw new Error('Restaurant data is missing');
      }
      
      setRestaurant(restaurantData);
      
      if (restaurantData.owner) {
        try {
          const ownerData = await getOwner(restaurantData.owner);
          setOwner(ownerData);
        } catch (ownerErr) {
          console.log('Error loading owner:', ownerErr);
        }
      }
    } catch (err) {
      console.error('Error in loadRestaurantData:', err);
      setError(err.message || 'Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Restaurant',
      'Are you sure you want to delete this restaurant?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRestaurant(restaurantId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete restaurant');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {restaurant.image && (
          <Image
            source={{ uri: restaurant.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.subtitle}>{restaurant.restaurantType}</Text>
          </View>
          <View style={styles.headerButtons}>
         
            <TouchableOpacity
              style={[styles.headerButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <FontAwesome name="trash" size={20} color="#dc3545" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>FSSAI Number</Text>
            <Text style={styles.value}>{restaurant.fssaiNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>GST Number</Text>
            <Text style={styles.value}>{restaurant.gstNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{restaurant.mobile}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Service Charges</Text>
            <Text style={styles.value}>{restaurant.serviceCharges}%</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.value}>{restaurant.gst}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{restaurant.vegNonveg}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Owner</Text>
            <Text style={styles.value}>{owner ? owner.name : 'Not assigned'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>UPI ID</Text>
            <Text style={styles.value}>{restaurant.upiId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[
              styles.statusText,
              { color: restaurant.hotelStatus ? '#28a745' : '#dc3545' }
            ]}>
              {restaurant.hotelStatus ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Currently</Text>
            <Text style={[
              styles.statusText,
              { color: restaurant.isOpen ? '#28a745' : '#dc3545' }
            ]}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        {restaurant.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.address}>{restaurant.address}</Text>
          </View>
        )}

        {(restaurant.website || restaurant.instagram || restaurant.facebook) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            {restaurant.website && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Website</Text>
                <Text style={styles.link}>{restaurant.website}</Text>
              </View>
            )}
            {restaurant.instagram && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Instagram</Text>
                <Text style={styles.link}>{restaurant.instagram}</Text>
              </View>
            )}
            {restaurant.facebook && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Facebook</Text>
                <Text style={styles.link}>{restaurant.facebook}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateRestaurant', { 
          restaurant: restaurant
        })}
      >
        <FontAwesome name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    padding: 10,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  link: {
    fontSize: 16,
    color: '#0066cc',
    flex: 2,
    textAlign: 'right',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 10,
  },
  linkText: {
    color: '#0066cc',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#e8f5e9',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
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
}); 