import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Home() {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />
        
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido a la App</Text>
          <Text style={styles.description}>Descubre cómo usar la aplicación de manera sencilla y eficiente.</Text>
          
          {sections.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Ionicons name={section.icon} size={28} color="#F4A261" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.subtitle}>{section.title}</Text>
                <Text style={styles.text}>{section.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const sections = [
  { icon: "map", title: "Mapa", description: "Consulta las papeleras cercanas y su ubicación en la oficina." },
  { icon: "list", title: "Listado", description: "Revisa los productos comprados y su destino de desecho." },
  { icon: "person", title: "Perfil", description: "Consulta tu información personal y tus puntos acumulados." },
  { icon: "qr-code", title: "QR Web", description: "Escanea el código QR para acceder a funciones web adicionales." },
  { icon: "shield-checkmark", title: "Política de Privacidad", description: "Conoce cómo protegemos tus datos personales." },
  { icon: "cart", title: "Enlace Tienda", description: "Descubre cómo comprar productos con beneficios." }
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
  sectionContainer: {
    flexDirection: 'row',
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
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  text: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
});
