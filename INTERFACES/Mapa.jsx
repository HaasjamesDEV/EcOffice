import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export function Mapa() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Pantalla de Mapa</Text>


      <TouchableOpacity style={styles.botonFijo}>
        <Ionicons name="qr-code-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonFijo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F4A261',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});