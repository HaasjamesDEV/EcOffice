import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importar AsyncStorage

export function Configuracion({ navigation }) {
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    try {
      // Elimina el token o los datos de la sesión
      await AsyncStorage.removeItem('userToken'); 

      // Redirige a la pantalla de login
      navigation.navigate('Inicio');  
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        style={styles.buttonAtras}
        onPress={() => navigation.goBack()}>
        <Ionicons name='chevron-back-circle' color='gray' size={30} />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.description}>Personaliza la experiencia según tus preferencias.</Text>
          
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Notificacioness</Text>
            <Switch
              value={notificaciones}
              onValueChange={setNotificaciones}
            />
          </View>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.button}
            onPress={cerrarSesion} 
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  container: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFEBCD',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  buttonAtras: {
    marginTop: 50,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#D60023",
    padding: 15,
    borderRadius: 10,
    marginTop: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
