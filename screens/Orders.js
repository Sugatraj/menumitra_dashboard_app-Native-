import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function Orders({ route, navigation }) {
  const { restaurantId } = route.params;
  const [loading, setLoading] = useState(true);
  
  // Dummy data for orders
  const [orders] = useState([
    {
      id: '1',
      tableNumber: '1',
      sectionName: 'Party Hall',
      orderNumber: '#975735',
      createdOn: '26 Dec 2024 19:09:42',
      orderStatus: 'Paid',
      menuCount: 2,
      totalBillAmount: 755.00,
    },
    // Add more dummy orders if needed
  ]);

  useFocusEffect(
    React.useCallback(() => {
      // Simulate loading
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#4CAF50';
      case 'Pending':
        return '#FFA500';
      default:
        return '#666';
    }
  };

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetails', { 
        orderId: item.id,
        restaurantId 
      })}
    >
      <View style={styles.orderGrid}>
        {/* Left Column */}
        <View style={styles.gridColumn}>
          <View style={styles.fieldGroup}>
            <View>
              <Text style={styles.value}>Table No:{item.tableNumber}</Text>
              <Text style={styles.value}>Section Name:{item.sectionName}</Text>
            </View>
            <Text style={styles.label}>TABLE</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.value}>{item.orderNumber}</Text>
            <Text style={styles.label}>ORDER NUMBER</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.value}>{item.createdOn}</Text>
            <Text style={styles.label}>CREATED ON</Text>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.gridColumn}>
          <View style={styles.fieldGroup}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) }]}>
              <Text style={styles.statusText}>{item.orderStatus}</Text>
            </View>
            <Text style={styles.label}>ORDER STATUS</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.value}>{item.menuCount}</Text>
            <Text style={styles.label}>MENU COUNT</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.amount}>{item.totalBillAmount.toFixed(2)} Rs.</Text>
            <Text style={styles.label}>TOTAL BILL AMOUNT</Text>
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
        data={orders}
        renderItem={renderOrderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 