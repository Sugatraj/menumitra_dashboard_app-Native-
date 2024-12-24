import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function DashboardScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tilesContainer}>
        <View style={styles.tile}>
          <Text style={styles.tileNumber}>12</Text>
          <Text style={styles.tileText}>Total Owners</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileNumber}>25</Text>
          <Text style={styles.tileText}>Total Restaurants</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tilesContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tileNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tileText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 