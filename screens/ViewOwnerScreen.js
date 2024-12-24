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

  const handleDelete = async () => {
    try {
      await ownerService.deleteOwner(owner.id);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
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
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{owner.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{owner.mobile}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{owner.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{owner.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Remaining Days:</Text>
            <Text style={styles.value}>{owner.subscription.remainingDays}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hotels Allowed:</Text>
            <Text style={styles.value}>{owner.subscription.hotelsAllowed}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotel Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hotels Owned:</Text>
            <Text style={styles.value}>{owner.hotelsOwned}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UpdateOwner', { ownerData: owner })}
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    flex: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
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
  deleteButton: {
    marginRight: 16,
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
}); 