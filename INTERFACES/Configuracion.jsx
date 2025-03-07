import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';


export function Configuracion({navigation}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
      style={styles.buttonAtras}
      onPress={() =>navigation.navigate('Navigation')}
      >
        <Ionicons name= 'chevron-back-circle'  color="gray" size={30}/>
        
      </TouchableOpacity>
    <View style={styles.container}>
      
      <Text style={styles.text}>Pantalla de Configuracion.</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
  buttonAtras:{
    marginTop:50,
    marginLeft:10,
  },
});