import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';

export default function RentalsScreen({ navigation }) {
  const [rentals, setRentals] = useState([]);
  const isFocused = useIsFocused();
  const route = useRoute();

  useEffect(() => {
    if (isFocused && route.params && route.params.rentedCar) {
      setRentals((prev) => [...prev, route.params.rentedCar]);
      navigation.setParams({ rentedCar: undefined });
    }
  }, [isFocused, route.params, navigation]);

  return (
    <View style={styles.container}>
      {/* Spacer for top margin */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>My Rentals</Text>
      <View style={{ height: 10 }} />
      <FlatList
        data={rentals}
        keyExtractor={item => item.id + item.dateTo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.carName}>{item.name}</Text>
            <Text style={styles.dates}>
              {item.dateFrom} to {item.dateTo}
            </Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no rentals yet.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: 'bold', alignSelf: 'center', color: '#222', letterSpacing: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  carName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  dates: { fontSize: 16, color: '#888', marginTop: 2 },
  status: { fontSize: 16, color: '#06a566', marginTop: 5, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
});