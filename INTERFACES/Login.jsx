import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Simulación de llamada a la API para obtener usuarios registrados
    fetch('http://10.14.205.50:3000/usuario')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  const logicaLogin = () => {
    if (!email || !password) {
      Alert.alert('Por favor ingresa tu correo y contraseña');
    } else if (!email.includes('@') || !email.includes('.com')) {
      Alert.alert('Correo inválido');
    } else {
      // Comprobar si el usuario está registrado
      const userFound = users.find(user => user.correo === email && user.contrasenia === password);
      
      if (userFound) {
        Alert.alert('¡Iniciado sesión con éxito!');
        navigation.navigate('Navigation');
      } else {
        Alert.alert('Correo o contraseña incorrectos');
      }
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
            <Text style={styles.title}>Iniciar sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={logicaLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('RecuperarContrasenia')}>
              <Text style={styles.recuperarContrasenia}>Recuperar contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
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
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 80,
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
  registerText: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
  recuperarContrasenia: {
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
});