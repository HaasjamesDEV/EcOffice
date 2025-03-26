import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Login} from '../components/Login.jsx';
import { NavigationContainer } from '@react-navigation/native';


export function Registro({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  registro 
const handleRegister = () => {
    // Aquí puedes agregar la lógica de registro
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Por favor completa todos los campos');
    } else if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');
    } else if(!email.includes('@')){
      Alert.alert('Correo inválido');
    } else if(!email.includes('.com' || '.es')){
      Alert.alert('Correo inválido');
    }else if(password.length < 8){
      Alert.alert('La contraseña debe tener al menos 8 caracteres');
    } else if(password.includes(!/[A-Z]/)){
      Alert.alert('La contraseña debe tener al menos una letra mayúscula');
    } else if(password.includes(!/[0-9]/)){
      Alert.alert('La contraseña debe tener al menos un número');
    } else if(password.includes(!/[!@#$%^&*]/)){
      Alert.alert('La contraseña debe tener al menos un caracter especial');
    } else {
      Alert.alert('¡Registro exitoso!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />

          <View style={styles.innerContainer}>
            <Text style={styles.title}>Registrarse</Text>

            {/* Campo de nombre */}
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            {/* Campo de correo */}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {/* Campo de contraseña */}
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Campo de confirmación de contraseña */}
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* Botón de registro */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            {/* Enlace para iniciar sesión */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#F4A261',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
