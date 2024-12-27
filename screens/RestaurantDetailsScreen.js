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
  SafeAreaView,
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
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('BulkUpload', { restaurantId: restaurant.id })}
          >
            <FontAwesome name="upload" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Upload Bulk File</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ManageCategory', { restaurantId: restaurant.id })}
          >
            <FontAwesome name="list" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Category</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ManageMenus', { restaurantId: restaurant.id })}
          >
            <FontAwesome name="cutlery" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Menus</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ManageSections', { restaurantId: restaurant.id })}
          >
            <FontAwesome name="th-large" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Sections</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Orders', { restaurantId: restaurant.id })}
          >
            <FontAwesome name="shopping-cart" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurant Image */}
        {restaurant.image ? (
          <Image
            source={{ uri: restaurant.image }}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="image" size={50} color="#ccc" />
          </View>
        )}

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          {/* Basic Info */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.restaurantCode || '-'}</Text>
                <Text style={styles.label}>Restaurant Code</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.name || '-'}</Text>
                <Text style={styles.label}>Name</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.fssaiNumber || '-'}</Text>
                <Text style={styles.label}>FSSAI Number</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.gstNumber || '-'}</Text>
                <Text style={styles.label}>GST Number</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.mobile || '-'}</Text>
                <Text style={styles.label}>Mobile</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.restaurantType || '-'}</Text>
                <Text style={styles.label}>Restaurant Type</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.address || '-'}</Text>
                <Text style={styles.label}>Address</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.ownerName || '-'}</Text>
                <Text style={styles.label}>Owner Name</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={[styles.value, { color: restaurant.status === 'Active' ? '#28a745' : '#dc3545' }]}>
                  {restaurant.status || '-'}
                </Text>
                <Text style={styles.label}>Status</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.vegNonveg || '-'}</Text>
                <Text style={styles.label}>Veg Nonveg</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.serviceCharges || '0'}%</Text>
                <Text style={styles.label}>Service Charges</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.gst || '0'}%</Text>
                <Text style={styles.label}>GST</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.upiId || '-'}</Text>
                <Text style={styles.label}>UPI ID</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.isOpen ? 'Open' : 'Closed'}</Text>
                <Text style={styles.label}>Is Open</Text>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.totalCategory || '0'}</Text>
                <Text style={styles.label}>Total Category</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.totalMenu || '0'}</Text>
                <Text style={styles.label}>Total Menu</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.totalCompletedOrders || '0'}</Text>
                <Text style={styles.label}>Total Completed Orders</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.totalCancledOrders || '0'}</Text>
                <Text style={styles.label}>Total Canceled Orders</Text>
              </View>
            </View>
          </View>

          {/* Social Media */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.facebook || '-'}</Text>
                <Text style={styles.label}>Facebook</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.instagram || '-'}</Text>
                <Text style={styles.label}>Instagram</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.googleReview || '-'}</Text>
                <Text style={styles.label}>Google Review</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.googleBusinessLink || '-'}</Text>
                <Text style={styles.label}>Google Business Link</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.whatsapp || '-'}</Text>
                <Text style={styles.label}>WhatsApp</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.website || '-'}</Text>
                <Text style={styles.label}>Website</Text>
              </View>
            </View>
          </View>

          {/* Audit Info */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.createdOn || '-'}</Text>
                <Text style={styles.label}>Created On</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.createdBy || '-'}</Text>
                <Text style={styles.label}>Created By</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.updatedOn || '-'}</Text>
                <Text style={styles.label}>Updated On</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.detailItem}>
                <Text style={styles.value}>{restaurant.updatedBy || '-'}</Text>
                <Text style={styles.label}>Updated By</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Add padding at bottom for better spacing */}
        <View style={styles.bottomSection}>
          {/* Delete button inside ScrollView */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Restaurant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FAB for Edit - stays floating */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateRestaurant', { 
          restaurantId: restaurantId,
          restaurant: restaurant
        })}
      >
        <FontAwesome name="edit" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
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
  detailsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  detailItem: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  restaurantImage: {
    width: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '50%',
    alignSelf: 'center',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#67B279',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 45,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
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
    zIndex: 1,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: 'auto',
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
}); 