import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function RegistrationForm({ onRegister }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [repeat, setRepeat] = useState('');

  const handleRegister = () => {
    if (!user || !pass || !repeat) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (pass !== repeat) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    onRegister(user, pass);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={user}
        onChangeText={setUser}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={pass}
        onChangeText={setPass}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        value={repeat}
        onChangeText={setRepeat}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#06a566',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f6fef9',
  },
  button: {
    backgroundColor: '#06a566',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});