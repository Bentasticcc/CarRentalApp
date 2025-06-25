import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ visible = true, onClose, onShowSignIn }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const handleRegister = async () => {
    if (!user || !pass || !repeat) {
      alert('Please fill all fields.');
      return;
    }
    if (pass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    if (pass !== repeat) {
      alert('Passwords do not match.');
      return;
    }
    try {
      await AsyncStorage.setItem('user', user);
      await AsyncStorage.setItem('pass', pass);
      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => {
            if (onClose) onClose();
            if (onShowSignIn) onShowSignIn();
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save user.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView style={styles.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              value={pass}
              onChangeText={setPass}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Repeat Password"
              value={repeat}
              onChangeText={setRepeat}
              secureTextEntry={!showRepeat}
            />
            <TouchableOpacity onPress={() => setShowRepeat(!showRepeat)} style={styles.eyeBtn}>
              <Ionicons name={showRepeat ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <MaterialCommunityIcons name="account-plus" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 10, alignSelf: 'center' }}
            onPress={onShowSignIn}
          >
            <Text style={{ color: '#06a566', fontWeight: 'bold', fontSize: 15 }}>
              Already have an account? Click here
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    alignItems: 'stretch',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 2,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0,
    color: '#222',
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 4,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 6,
    paddingVertical: 13,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});