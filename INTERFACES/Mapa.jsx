import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export function Mapa() {
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [markers, setMarkers] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    const [name, x, y] = data.split(';');
    setMarkers((prev) => [...prev, { name, x: parseInt(x), y: parseInt(y) }]);
    setShowCamera(false); 
  };

  if (hasPermission === null) {
    return <Text>Solicitando permisos de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Ubicación actual: </Text>
        <Text style={styles.titulo}>Papelera más cercana: </Text>
      </View>
      {showCamera ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          onBarCodeScanned={handleBarCodeScanned}
        />
        
      ) : (
        <ImageBackground
          source={require('../img/plano.png')}
          style={styles.plano}
          resizeMode="contain"
        >

          {/* Marcadores */}
          {markers.map((marker, index) => (
            <View
              key={index}
              style={[styles.marker, { top: marker.y, left: marker.x }]}
            >
              <Text style={styles.markerText}>{marker.name}</Text>
              <View style={styles.redDot} />
            </View>
          ))}

          

          <TouchableOpacity style={styles.botonFijo} onPress={() => setShowCamera(true)}>
            <Ionicons name="qr-code-outline" size={30} color="white" />
          </TouchableOpacity>
        </ImageBackground>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: "center",
  },
  plano: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  tituloContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  titulo: {
    fontWeight: 'bold',
    backgroundColor: '#FFEBCD',
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    minHeight: 80,
    width: 120,
    marginHorizontal: 20,
    fontSize: 15,
    paddingTop: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  redDot: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 4,
  },
  markerText: {
    fontSize: 12,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 4,
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
