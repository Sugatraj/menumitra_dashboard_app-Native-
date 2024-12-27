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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageMenus({ route, navigation }) {
  const { restaurantId } = route.params;
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadMenus();
    }, [restaurantId])
  );

  const loadMenus = async () => {
    try {
      setLoading(true);
      console.log('Loading menus for restaurant:', restaurantId);
      
      const storageKey = `menus_${restaurantId}`;
      const menusJson = await AsyncStorage.getItem(storageKey);
      const menusData = menusJson ? JSON.parse(menusJson) : {};
      
      // Get categories for this restaurant to show category names
      const categoriesJson = await AsyncStorage.getItem(`categories_${restaurantId}`);
      const categories = categoriesJson ? JSON.parse(categoriesJson) : {};
      
      // Convert object to array and add additional info
      const menusArray = Object.values(menusData)
        .filter(menu => menu.restaurantId === restaurantId)
        .map(menu => ({
          ...menu,
          categoryName: categories[menu.categoryId]?.name || 'Uncategorized',
          price: parseFloat(menu.price || 0).toFixed(2)
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log('Processed menus:', menusArray);
      setMenus(menusArray);
    } catch (error) {
      console.error('Error loading menus:', error);
      alert('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('MenuDetails', { 
        menuId: item.id,
        restaurantId: restaurantId
      })}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.menuName}>{item.name}</Text>
          <Text style={styles.categoryName}>{item.categoryName}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.price}>₹{item.price}</Text>
          <View style={[styles.statusBadge, 
            { backgroundColor: item.isAvailable ? '#4CAF50' : '#FF5252' }]}>
            <Text style={styles.statusText}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
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
        data={menus}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menus found</Text>
            <Text style={styles.emptySubText}>Tap the + button to create one</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateMenu', { restaurantId })}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#67B279',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
}); 