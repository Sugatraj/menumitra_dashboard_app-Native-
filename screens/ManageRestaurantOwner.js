import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useOwners } from '../hooks/useOwners';

export default function ManageRestaurantOwner({ navigation }) {
  const { owners, loading, error, refreshOwners } = useOwners();
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  // Filter owners based on search query
  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.mobile.includes(searchQuery)
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ViewOwner', { ownerData: item })}
    >
      <View style={styles.cardContent}>
        <View style={styles.nameColumn}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.mobileText}>{item.mobile}</Text>
        </View>
        
        <View style={styles.subscriptionColumn}>
          <Text style={styles.subscriptionText}>
            Remaining Days: {item.subscription.remainingDays}
          </Text>
          <Text style={styles.subscriptionText}>
            Hotel Allowed: {item.subscription.hotelsAllowed}
          </Text>
        </View>
        
        <View style={styles.hotelColumn}>
          <Text style={styles.hotelText}>{item.hotelsOwned}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
     

    

      

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshOwners}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredOwners}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          refreshing={loading}
          onRefresh={refreshOwners}
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateOwner')}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#67B279',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  createButtonText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  entriesControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entriesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 50,
    marginHorizontal: 8,
    padding: 4,
  },
  searchControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 200,
    marginLeft: 8,
    padding: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  nameColumn: {
    flex: 1,
  },
  subscriptionColumn: {
    flex: 1,
  },
  hotelColumn: {
    flex: 0.5,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#17a2b8',
  },
  editButton: {
    backgroundColor: '#6f42c1',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  nameText: {
    fontWeight: '500',
  },
  mobileText: {
    color: '#666',
  },
  subscriptionText: {
    color: '#666',
  },
  hotelText: {
    fontWeight: '500',
  },
  pagination: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  paginationText: {
    color: '#666',
    marginBottom: 8,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginHorizontal: 4,
  },
  pageNumber: {
    padding: 8,
    backgroundColor: '#007bff',
    marginHorizontal: 4,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 4,
  },
  errorText: {
    color: '#721c24',
  },
  retryText: {
    color: '#007bff',
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
  },
});
