import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export function Mapa() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Pantalla de Mapa</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});