import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Registro({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Función para verificar si el correo ya existe en el servidor
  const verificarCorreo = async () => {
    var disponible=true;
    try {
      console.log("Dentro de la funcion d verificacion")
      const response = await fetch(`http://192.168.52.46:3000/usuario/verify?correo=${email}`);
      const data = await response.json();

      if (response.ok && data.exists) {
        console.log("El correo existe")
        Alert.alert('Error', 'El correo electrónico ya está registrado');
        disponible= false;  // Si el correo ya existe, retorna false
      }
      console.log("correo disponible")
      return disponible;  // Si el correo no existe, retorna true
    } catch (error) {
      Alert.alert('Error', 'No es posible conectarse con el servidor para encontrar el correo');
      console.log("Error en el catch d validar correo")
      console.error(error);
      return false;
    }
  };

  const logicaRegistro = async () => {
    console.log("LLAMADA LOGICA REGISTRO");
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Por favor completa todos los campos');

    } else if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');

    } else if (!email.includes('@')) {
      Alert.alert('Correo inválido');

    } else if (!email.endsWith('.com') && !email.endsWith('.es')) {
      Alert.alert('Correo inválido');

    } else if (password.length < 8) {
      Alert.alert('La contraseña debe tener al menos 8 caracteres');

    } else if (!/[A-Z]/.test(password)) {
      Alert.alert('La contraseña debe tener al menos una letra mayúscula');

    } else if (!/[0-9]/.test(password)) {
      Alert.alert('La contraseña debe tener al menos un número');

    } else if (!/[!@#$%^&*+-]/.test(password)) {
      Alert.alert('La contraseña debe tener al menos un carácter especial');
      
    } else {
      // Verificar si el correo ya está registrado
      console.log("Los datos son validos")
      const correoDisponible = await verificarCorreo();
      console.log(correoDisponible)
      if (!correoDisponible){
        console.log("El correo ya existe")
        Alert.alert('El correo ya existe')
      } else{
        // Si todo está bien, hacer el registro
        try {
          const response = await fetch('http://192.168.52.46:3000/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: name, correo: email, contrasenia: password })
            
          });
          console.log("Datos a enviar:", { nombre: name, correo: email, contrasenia: password });

          const data = await response.json();
          console.log(data)
          console.log(response)
          if (response.ok) {
            // Guardar los datos del usuario en AsyncStorage
            await AsyncStorage.setItem('usuario', JSON.stringify({
              id: data.id,
              nombre: data.nombre,
              correo: data.correo
            }));
          
            Alert.alert('¡Registro exitoso!',`Bienvenido/a, ${data.nombre}!`);
            navigation.navigate('Navigation', { screen: 'Home' });
          } else {
            Alert.alert('Error', 'No se pudo registrar el usuario');
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo conectar al servidor');
          console.error(error);
        }
    
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
            <Text style={styles.title}>Registrarse</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
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
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={() => {
              console.log('Botón Registrarse presionado');
              logicaRegistro();
            }}>
              
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

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