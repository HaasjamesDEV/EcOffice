import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions, Image } from "react-native";
import LottieView from "lottie-react-native";
import leaves from "../lotties/leaves.json";
import { NavigationContainer } from '@react-navigation/native';

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

export function Carga({ navigation }) {
  //useEffect para hacer la navegación después de 3 segundos
  useEffect(() => {
    //temporizador para navegar a la pantalla 'Listado'
    const timer = setTimeout(() => {
      navigation.navigate('Inicio'); 
    }, 1000); // 1000 ms = 1 segundos

    // Limpiamos el temporizador si el componente se desmonta antes de que termine el tiempo
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo centrado en la pantalla */}
      <Image 
        source={require('../img/logo_tres-removebg-preview.png')} 
        style={styles.logo} 
        resizeMode="contain"
        />


      {/* Animación de carga */}
      <LottieView
        source={leaves}
        autoPlay
        loop={true} // Mantener la animación en un ciclo continuo
        style={[styles.animation, { width, height }]}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
  },
  animation: {
    flex: 1, //a animación se expande para ocupar toda la pantalla
    position: "absolute", // Pone la animación detrás del logo
    justifyContent: "center", // Centra la animación horizontalmente
    alignItems: "center", // Centra la animación verticalmente
  },
  logo: {
    width: 200, // Ajusta el tamaño según lo necesites
    height: 200,
    position: "absolute",
    alignSelf: "center", // Centra automáticamente el logo
    top: "40%", // Ajusta esto según tu diseño (entre 35%-45%)
    zIndex: 1,
  }  
});