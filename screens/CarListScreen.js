import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import toyotaImg from '../images/toyota.png';
import hondaImg from '../images/honda_civic.jpg';
import fordImg from '../images/ford_ranger.jpg';
import suzukiImg from '../images/suzuki.jpg';

const { width } = Dimensions.get('window');

const cars = [
  {
    id: '1',
    name: 'Toyota Vios',
    price: '₱2,500/day',
    image: toyotaImg,
  },
  {
    id: '2',
    name: 'Honda Civic',
    price: '₱3,200/day',
    image: hondaImg,
  },
  {
    id: '3',
    name: 'Ford Ranger',
    price: '₱4,500/day',
    image: fordImg,
  },
  {
    id: '4',
    name: 'Suzuki Ertiga',
    price: '₱2,800/day',
    image: suzukiImg,
  },
];

export default function CarListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />
      {/* Spacer for top margin */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>Available Cars</Text>
      <View style={{ height: 10 }} />
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CarDetails', { car: item })}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#222',
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  imageWrapper: {
    width: width * 0.88,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eaeaea',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 4, color: '#222' },
  price: { fontSize: 16, color: '#06a566', marginBottom: 8, marginTop: 2 },
  button: {
    backgroundColor: '#06a566',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'stretch',
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
