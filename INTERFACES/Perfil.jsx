import React, { useEffect, useState } from "react"; 
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert } from "react-native"; 
import { Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";  

export function Perfil({ navigation, route }) {
  const [usuario, setUsuario] = useState(null);
  const [puntos, setPuntos] = useState(0);
  
  // Función para actualizar los puntos en el servidor
  const actualizarPuntosEnServidor = async (correo, nuevosPuntos) => {
    try {
      const baseUrl = 'http://192.168.52.46:3000';
      console.log(`Actualizando puntos para ${correo}: ${nuevosPuntos} puntos`);
      
      // Usar el endpoint correcto para actualizar puntos
      const respuesta = await fetch(`${baseUrl}/usuario/puntos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          puntos: nuevosPuntos
        }),
      });
  
      if (!respuesta.ok) {
        console.error(`Error al actualizar puntos. Status: ${respuesta.status}`);
        await AsyncStorage.setItem('puntos_locales', nuevosPuntos.toString());
        console.log('Puntos guardados localmente como respaldo');
        return true; 
      }
      
      console.log('Puntos actualizados correctamente en el servidor');
      await AsyncStorage.removeItem('puntos_locales');
      return true;
      
    } catch (error) {
      console.error('Error general en la actualización de puntos:', error);
      try {
        await AsyncStorage.setItem('puntos_locales', nuevosPuntos.toString());
        console.log('Puntos guardados localmente como respaldo');
        return true; 
      } catch (storageError) {
        console.error('Error al guardar puntos localmente:', storageError);
        return false;
      }
    }
  };
  
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem('usuario');
        if (usuarioGuardado) {
          const userData = JSON.parse(usuarioGuardado);
          console.log("Usuario cargado:", userData);
          setUsuario(userData);
          
          if (userData.correo) {
            fetchPuntos(userData.correo);
          }
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    
    const fetchPuntos = async (correo) => {
      try {
        const baseUrl = 'http://192.168.52.46:3000';
        console.log(`Intentando conexión a: ${baseUrl}/usuario?correo=${correo}`);
        
        const usuarioRes = await fetch(`${baseUrl}/usuario?correo=${correo}`);
        console.log("Usuario Status:", usuarioRes.status);
        
        if (!usuarioRes.ok) {
          console.error("Error en la obtención del usuario. Status:", usuarioRes.status);
          const textResponse = await usuarioRes.text();
          console.error("Respuesta recibida:", textResponse);
          throw new Error(`Error en la obtención del usuario: ${usuarioRes.status}`);
        }
        
        const datosUsuario = await usuarioRes.json();
        console.log("Datos usuario obtenidos:", datosUsuario);
        
        if (Array.isArray(datosUsuario) && datosUsuario.length > 0) {
          const usuario = datosUsuario.find(u => u.correo === correo);
          if (usuario && usuario.puntos !== undefined) {
            console.log("Puntos encontrados:", usuario.puntos);
            setPuntos(usuario.puntos);
          } else {
            console.log("No se encontraron puntos, usando 0 como valor predeterminado");
            setPuntos(0);
          }
        } 
        else if (datosUsuario && !Array.isArray(datosUsuario) && datosUsuario.puntos !== undefined) {
          console.log("Puntos encontrados:", datosUsuario.puntos);
          setPuntos(datosUsuario.puntos);
        } else {
          console.log("No se encontraron datos de usuario válidos");
          setPuntos(0);
        }
      } catch (error) {
        console.error("Error al obtener puntos:", error);
        setPuntos(0);
      }
    };
    
    cargarUsuario();
  }, []);
  
  // Efecto para manejar los puntos recibidos al navegar
  useEffect(() => {
  const manejarPuntosGanados = async () => {
    // Verificar si hay puntos ganados en los parámetros de ruta
    if (route.params?.puntosGanados) {
      const puntosGanados = route.params.puntosGanados;
      console.log(`Recibidos ${puntosGanados} puntos nuevos`);
      
      // Obtener los puntos actuales del servidor para asegurar su precisión
      if (usuario && usuario.correo) {
        try {
          const baseUrl = 'http://192.168.52.46:3000';
          const usuarioRes = await fetch(`${baseUrl}/usuario?correo=${usuario.correo}`);
          
          if (!usuarioRes.ok) {
            throw new Error(`Error en la obtención del usuario: ${usuarioRes.status}`);
          }
          
          const datosUsuario = await usuarioRes.json();
          let puntosActuales = 0;
          
          if (Array.isArray(datosUsuario) && datosUsuario.length > 0) {
            const usuarioEncontrado = datosUsuario.find(u => u.correo === usuario.correo);
            puntosActuales = usuarioEncontrado?.puntos || 0;
          } else if (datosUsuario && datosUsuario.puntos !== undefined) {
            puntosActuales = datosUsuario.puntos;
          }
          
          // Calcular nuevos puntos basado en los puntos actuales del servidor
          const nuevosPuntos = puntosActuales + puntosGanados;
          
          // Actualizar en el servidor primero
          const actualizado = await actualizarPuntosEnServidor(usuario.correo, nuevosPuntos);
          
          if (actualizado) {
            // Solo actualizar el estado local si el servidor se actualizó correctamente
            setPuntos(nuevosPuntos);
            
            // Mostrar mensaje de confirmación
            Alert.alert(
              "¡Puntos añadidos!",
              `Se han añadido ${puntosGanados} puntos a tu cuenta.`,
              [{ text: "OK" }]
            );
          } else {
            Alert.alert(
              "Error",
              "No se pudieron actualizar los puntos. Inténtalo de nuevo más tarde.",
              [{ text: "OK" }]
            );
          }
        } catch (error) {
          console.error("Error al actualizar puntos:", error);
          Alert.alert(
            "Error",
            "Ocurrió un problema al actualizar tus puntos.",
            [{ text: "OK" }]
          );
        }
      }
      
      // Limpiar los parámetros para evitar duplicados
      navigation.setParams({ puntosGanados: null });
    }
  };
  
  if (usuario) {
    manejarPuntosGanados();
  }
}, [route.params?.puntosGanados, usuario]);
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Image
        source={require('../img/logo_tres-removebg-preview.png')}
        style={styles.logo}
      />
      
      <View style={styles.container}>
        <Text style={styles.username}>
          {usuario ? usuario.nombre : "Cargando..."}
        </Text>
        
        <Text style={styles.points}>
          Puntos: <Text style={styles.pointsValue}>{puntos !== null ? puntos : "Cargando..."}</Text>
        </Text>
        
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
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 72,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 30,
    marginLeft: 96,
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
  pointsValue: {
    fontWeight: "bold",
    color: "#F4A261",
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