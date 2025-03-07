import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Perfil({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Imagen de perfil */}
        <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />

      {/* Información del usuario */}
      <Text style={styles.username}>Nombre de Usuario</Text>
      <Text style={styles.points}>Puntos: 1500</Text>

      {/* Botones de navegación */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Ionicons name="trophy-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Ver Ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Configuracion")}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Configuración</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 150,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  points: {
    fontSize: 18,
    color: "#777",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#F4A261",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
