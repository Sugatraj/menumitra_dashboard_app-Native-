import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function OrderDetails({ route }) {
  const { orderId, restaurantId } = route.params;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({
    id: '1',
    orderNumber: '#975735',
    totalBillAmount: 755.00,
    orderStatus: 'PAID',
    createdOn: '26 Dec 2024 19:09:42',
    paymentMethod: 'Card',
    restaurantName: 'Jagadamb',
    customerName: 'Sugatraj',
    table: 'Party Hall:1',
    // Additional amounts
    serviceChargesAmount: {
      amount: 5.80,
      percentage: 1.00
    },
    gstAmount: {
      amount: 5.80,
      percentage: 1.00
    },
    discountAmount: {
      amount: 175.50,
      percentage: 23.25
    },
    grandTotal: 591.10,
    // Menu items
    items: [
      {
        index: 1,
        name: 'Chicken Tandoori',
        price: 500.00,
        quantity: 1,
        total: 500
      },
      {
        index: 2,
        name: 'Ukghkjg',
        price: 255.00,
        quantity: 1,
        total: 255
      }
    ]
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => setLoading(false), 1000);
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Order Info - First Row */}
      <View style={styles.section}>
        <View style={styles.orderGrid}>
          {/* Left Column */}
          <View style={styles.gridColumn}>
            <View style={styles.fieldGroup}>
              <Text style={styles.value}>{order.orderNumber}</Text>
              <Text style={styles.label}>ORDER NUMBER</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>{order.paymentMethod}</Text>
              <Text style={styles.label}>PAYMENT METHOD</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>₹{order.totalBillAmount.toFixed(2)}</Text>
              <Text style={styles.label}>TOTAL BILL AMOUNT</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>₹{order.serviceChargesAmount.amount} ({order.serviceChargesAmount.percentage}%)</Text>
              <Text style={styles.label}>SERVICE CHARGES AMOUNT</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>₹{order.grandTotal}</Text>
              <Text style={styles.label}>GRAND TOTAL</Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.gridColumn}>
            <View style={styles.fieldGroup}>
              <Text style={styles.value}>₹{order.totalBillAmount.toFixed(2)}</Text>
              <Text style={styles.label}>TOTAL BILL AMOUNT</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>{order.restaurantName}</Text>
              <Text style={styles.label}>RESTAURANT NAME</Text>
            </View>

            <View style={styles.fieldGroup}>
              <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statusText}>{order.orderStatus}</Text>
              </View>
              <Text style={styles.label}>ORDER STATUS</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.value}>₹{order.gstAmount.amount} ({order.gstAmount.percentage}%)</Text>
              <Text style={styles.label}>GST AMOUNT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.section}>
        <View style={styles.orderGrid}>
          {/* Left Column */}
          <View style={styles.gridColumn}>
            <View style={styles.fieldGroup}>
              <Text style={styles.value}>{order.customerName}</Text>
              <Text style={styles.label}>CUSTOMER NAME</Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.gridColumn}>
            <View style={styles.fieldGroup}>
              <Text style={styles.value}>{order.table}</Text>
              <Text style={styles.label}>TABLE</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Items Table */}
      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>INDEX</Text>
          <Text style={[styles.headerCell, styles.menuCell]}>MENU</Text>
          <Text style={styles.headerCell}>PRICE</Text>
          <Text style={styles.headerCell}>QTY</Text>
          <Text style={styles.headerCell}>TOTAL</Text>
        </View>
        {order.items.map((item) => (
          <View key={item.index} style={styles.tableRow}>
            <Text style={styles.cell}>{item.index}</Text>
            <Text style={[styles.cell, styles.menuCell]}>{item.name}</Text>
            <Text style={styles.cell}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>₹{item.total}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
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
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalSection: {
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  grandTotalRow: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
    color: '#666',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  menuCell: {
    flex: 2,
  },
}); 