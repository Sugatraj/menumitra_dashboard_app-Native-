import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ownerService } from '../services/ownerService';

export default function ManageRestaurantOwner({ navigation }) {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOwners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ownerService.getAllOwners();
      setOwners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOwners();
    }, [loadOwners])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ViewOwner', { ownerData: item })}
    >
      <View style={styles.detailsContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          <View style={styles.detailItem}>
            <Text style={styles.value}>{item.name}</Text>
            <Text style={styles.label}>OwnerName</Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <View style={styles.detailItem}>
            <Text style={styles.value}>{item.mobile}</Text>
            <Text style={styles.label}>Mobile</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadOwners}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={owners}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          refreshing={loading}
          onRefresh={loadOwners}
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
    backgroundColor: '#F3F4F6',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  detailItem: {
    marginBottom: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 8,
  },
  retryText: {
    color: '#67B279',
    textDecorationLine: 'underline',
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
