import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ownerService } from '../services/ownerService';

export default function ViewOwnerScreen({ route, navigation }) {
  const { ownerData } = route.params;
  const [owner, setOwner] = useState(ownerData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOwner = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getOwnerById(ownerData.id);
      if (data) {
        setOwner(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ownerData.id]);

  useFocusEffect(
    useCallback(() => {
      loadOwner();
    }, [loadOwner])
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Owner',
      'Are you sure you want to delete this owner?',
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
              setLoading(true);
              await ownerService.deleteOwner(owner.id);
              navigation.goBack();
            } catch (err) {
              setError(err.message);
              Alert.alert('Error', 'Failed to delete owner');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Owner',
              'Are you sure you want to delete this owner?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: handleDelete, style: 'destructive' }
              ]
            );
          }}
        >
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, owner]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadOwner}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.card}>
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.grid}>
              {/* Left Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.name || '-'}</Text>
                  <Text style={styles.label}>Name</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.mobile || '-'}</Text>
                  <Text style={styles.label}>Mobile</Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.email || '-'}</Text>
                  <Text style={styles.label}>Email</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.address || '-'}</Text>
                  <Text style={styles.label}>Address</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Subscription Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription Details</Text>
            <View style={styles.grid}>
              {/* Left Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.subscription?.remainingDays || '-'}</Text>
                  <Text style={styles.label}>Remaining Days</Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.subscription?.hotelsAllowed || '-'}</Text>
                  <Text style={styles.label}>Hotels Allowed</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hotel Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hotel Information</Text>
            <View style={styles.grid}>
              {/* Left Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.hotelsOwned || '0'}</Text>
                  <Text style={styles.label}>Hotels Owned</Text>
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.column}>
                <View style={styles.detailItem}>
                  <Text style={styles.value}>{owner?.status || 'Active'}</Text>
                  <Text style={styles.label}>Status</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Delete Button - Updated to match RestaurantDetailsScreen */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Owner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FAB for Edit */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateOwner', { 
          ownerId: owner?.id,
          ownerData: owner
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
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  detailItem: {
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    textTransform: 'uppercase',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  retryText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
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
  deleteSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-start',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },
}); 