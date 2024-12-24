import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRestaurants } from '../hooks/useRestaurants';
import { FontAwesome } from '@expo/vector-icons';

export default function ViewRestaurantScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { getRestaurant } = useRestaurants();
  const [restaurant, setRestaurant] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurant(restaurantId);
      setRestaurant(data);
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    // Implement delete functionality here
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, styles.editButton]}
            onPress={() => navigation.navigate('UpdateRestaurant', { restaurantId })}
          >
            <FontAwesome name="edit" size={20} color="#67B279" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
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

        <View style={styles.infoRow}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>{restaurant.vegNonveg}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Owner</Text>
          <Text style={styles.value}>{restaurant.owner}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Restaurant Type</Text>
          <Text style={styles.value}>{restaurant.restaurantType}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>UPI ID</Text>
          <Text style={styles.value}>{restaurant.upiId}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={[
            styles.statusText,
            { color: restaurant.isActive ? '#28a745' : '#dc3545' }
          ]}>
            {restaurant.isActive ? 'Active' : 'Inactive'}
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

        <View style={styles.addressContainer}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.address}>{restaurant.address}</Text>
        </View>
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
  section: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    marginTop: 20,
  },
  address: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    lineHeight: 24,
  },
}); 