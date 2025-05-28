import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Ranking({ navigation }) {
  const [rankingData, setRankingData] = useState([]); // Estado para almacenar el ranking

  // Hacer la solicitud a la API para obtener el ranking
  useEffect(() => {
    fetch('http://192.168.52.46:3000/ranking')  
      .then((response) => response.json())
      .then((data) => setRankingData(data))  
      .catch((error) => console.error('Error al obtener el ranking:', error));
  }, []); 

  return (
    <SafeAreaView style={styles.safeContainer}>
      <TouchableOpacity
        style={styles.buttonAtras}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-circle" color="gray" size={30} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../img/logo_tres-removebg-preview.png')}
          style={styles.logo}
        />
        
        <View style={styles.container}>
          <Text style={styles.title}>Ranking de Usuarios</Text>
          <Text style={styles.description}>Consulta el top 5 usuarios con más puntos acumulados.</Text>
          
          {rankingData.length > 0 ? (
            rankingData.map((user, index) => (
              <View
                key={user.id}  
                style={[styles.rankContainer, index < 3 && styles.topThree]} 
              >
                <Ionicons
                  name="trophy"
                  size={28}
                  color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.rank}>{`#${index + 1}`}</Text>
                  <Text style={styles.username}>{user.nombre}</Text>
                  <Text style={styles.points}>{`${user.puntos} puntos`}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>Cargando ranking...</Text> 
          )}
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
  buttonAtras: {
    marginTop: 50,
    marginLeft: 10,
  },
  noData: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});