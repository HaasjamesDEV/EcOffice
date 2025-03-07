import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';


export function Ranking({navigation}) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
              style={styles.buttonAtras}
              onPress={() =>navigation.navigate('Navigation')}
              >
                <Ionicons name= 'chevron-back-circle'  color="gray" size={30}/>
                
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />
        
        <View style={styles.container}>
          <Text style={styles.title}>Ranking de Usuarios</Text>
          <Text style={styles.description}>Consulta el top de usuarios con más puntos acumulados.</Text>
          
          {rankingData.map((user, index) => (
            <View key={index} style={[styles.rankContainer, index < 3 && styles.topThree]}>
              <Ionicons name="trophy" size={28} color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.rank}>{`#${index + 1}`}</Text>
                <Text style={styles.username}>{user.name}</Text>
                <Text style={styles.points}>{`${user.points} puntos`}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const rankingData = [
  { name: "Ana López", points: 1500 },
  { name: "Carlos Pérez", points: 1400 },
  { name: "María García", points: 1300 },
  { name: "Luis Fernández", points: 1200 },
  { name: "Sofía Romero", points: 1100 },
];

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
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 30,
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
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF3E0',
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
  topThree: {
    backgroundColor: '#FFEBCD',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flexShrink: 1,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  username: {
    fontSize: 16,
    color: '#333',
  },
  points: {
    fontSize: 14,
    color: '#666',
  },
  buttonAtras:{
    marginTop:50,
    marginLeft:10,
  },
});
