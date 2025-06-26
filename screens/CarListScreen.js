import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import toyotaImg from '../images/toyota.png';
import hondaImg from '../images/honda_civic.jpg';
import fordImg from '../images/ford_ranger.jpg';
import suzukiImg from '../images/suzuki.jpg';
import SignIn from './SignIn';
import SignUp from './SignUp';

const { width } = Dimensions.get('window');

const cars = [
  {
    id: '1',
    name: 'Toyota Vios',
    price: '₱2,500/day',
    image: toyotaImg,
    stock: Math.floor(Math.random() * 7) + 4, // 4-10
  },
  {
    id: '2',
    name: 'Honda Civic',
    price: '₱3,200/day',
    image: hondaImg,
    stock: Math.floor(Math.random() * 7) + 4,
  },
  {
    id: '3',
    name: 'Ford Ranger',
    price: '₱4,500/day',
    image: fordImg,
    stock: Math.floor(Math.random() * 7) + 4,
  },
  {
    id: '4',
    name: 'Suzuki Ertiga',
    price: '₱2,800/day',
    image: suzukiImg,
    stock: Math.floor(Math.random() * 7) + 4,
  },
];

export default function CarListScreen({ navigation }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [carStocks, setCarStocks] = useState({});
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkSignIn = async () => {
      const signed = await AsyncStorage.getItem('isSignedIn');
      setIsSignedIn(signed === 'true');
    };
    const unsubscribe = navigation.addListener('focus', checkSignIn);
    checkSignIn();
    return unsubscribe;
  }, [navigation, refreshKey]);

  useEffect(() => {
    const loadStocks = async () => {
      const stocks = await AsyncStorage.getItem('carStocks');
      if (stocks) setCarStocks(JSON.parse(stocks));
    };
    if (isFocused && isSignedIn) loadStocks();
  }, [isFocused, isSignedIn]);

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' }}>
        <Text style={{ fontSize: 18, color: '#222', marginBottom: 20, textAlign: 'center' }}>
          You need to create an account to access this page.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#06a566',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={() => setShowSignUp(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Go To Registration</Text>
        </TouchableOpacity>
        {/* SignIn Modal */}
        {showSignIn && (
          <SignIn
            visible={showSignIn}
            onClose={() => setShowSignIn(false)}
            onShowSignUp={() => {
              setShowSignIn(false);
              setShowSignUp(true);
            }}
            onLoginSuccess={() => {
              setIsSignedIn(true);
              setShowSignIn(false);
              setRefreshKey(k => k + 1); // Force refresh!
            }}
          />
        )}
        {/* SignUp Modal */}
        {showSignUp && (
          <SignUp
            visible={showSignUp}
            onClose={() => setShowSignUp(false)}
            onShowSignIn={() => {
              setShowSignUp(false);
              setTimeout(() => setShowSignIn(true), 300); // Wait for modal to close before opening SignIn
            }}
          />
        )}
      </View>
    );
  }

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
        renderItem={({ item }) => {
          const stock = carStocks[item.id] ?? item.stock;
          const outOfStock = stock <= 0;

          return (
            <View style={styles.card}>
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
              {outOfStock ? (
                <Text style={styles.stockOut}>Out of Stock</Text>
              ) : (
                <Text style={styles.stockAvailable}>Available: {stock}</Text>
              )}
              <TouchableOpacity
                style={[
                  styles.button,
                  outOfStock && { backgroundColor: '#ccc' }
                ]}
                onPress={() => {
                  if (!outOfStock) {
                    navigation.navigate('CarDetails', { 
                      car: item, 
                      onRent: async () => {
                        const updatedStocks = { ...carStocks, [item.id]: carStocks[item.id] - 1 };
                        setCarStocks(updatedStocks);
                        await AsyncStorage.setItem('carStocks', JSON.stringify(updatedStocks));
                      }
                    });
                  }
                }}
                disabled={outOfStock}
              >
                <Text style={[
                  styles.buttonText,
                  outOfStock && { color: '#888' }
                ]}>
                  {outOfStock ? 'Out of Stock' : 'View Details'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#d32f2f',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignSelf: 'center',
          marginBottom: 10,
        }}
        onPress={async () => {
          await AsyncStorage.removeItem('carStocks'); // Only remove carStocks!
          // Re-initialize stocks with new random values
          const initialStocks = {};
          cars.forEach(car => { initialStocks[car.id] = Math.floor(Math.random() * 7) + 4; });
          await AsyncStorage.setItem('carStocks', JSON.stringify(initialStocks));
          setCarStocks(initialStocks);
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reset Car Stocks</Text>
      </TouchableOpacity>
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
  stockAvailable: {
    color: '#06a566',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 15,
  },
  stockOut: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 15,
  },
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
