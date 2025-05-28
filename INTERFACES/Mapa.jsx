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
  import { Ionicons } from '@expo/vector-icons';

  export function Mapa({ route, navigation }) {
    const [markers, setMarkers] = useState([]);
    const [ubicacionSeleccionado, setubicacionSeleccionado] = useState({});
    const [papeleraCercana, setPapeleraCercana] = useState(null);
    const [ubicacionsAPI, setubicacionsAPI] = useState([]);
    const [papeleras, setPapeleras] = useState([]);
    const ubicacionsIniciales = useRef([]);

    useEffect(() => {
      fetch('http://192.168.52.46:3000/qr')
        .then(response => response.json())
        .then(data => {
          console.log('ubicacions API cargados:', data.length);
          setubicacionsAPI(data);
        })
        .catch(error => console.error('Error al cargar ubicacions de API:', error));
    }, []);


    useEffect(() => {
      fetch('http://192.168.52.46:3000/papeleras')
        .then(response => response.json())
        .then(data => {
          console.log('Papeleras cargadas:', data);
          setPapeleras(data);
        })
        .catch(error => console.error('Error al cargar papeleras:', error));
    }, []);

    useEffect(() => {
      const ubicacionParam = route.params?.params?.ubicacionEscaneado;
      
      if (ubicacionParam) {
        console.log("Ubicación recibida desde navegación anidada:", ubicacionParam);
        
        // Verificamos que tenemos los datos necesarios
        if (papeleras.length > 0 && ubicacionsAPI.length > 0) {
          mostrarDetallesubicacionEscaneado(ubicacionParam);
        } else {
          console.log("Esperando a que se carguen papeleras y ubicaciones");
        }
      } else {
        console.log("No se recibió ubicación escaneada en params.params");
        

        const ubicacionDirecta = route.params?.ubicacionEscaneado;
        if (ubicacionDirecta) {
          console.log("Ubicación recibida directamente en params:", ubicacionDirecta);
          
          if (papeleras.length > 0 && ubicacionsAPI.length > 0) {
            mostrarDetallesubicacionEscaneado(ubicacionDirecta);
          } else {
            console.log("Esperando a que se carguen papeleras y ubicaciones");
          }
        } else {
          console.log("No se recibió ubicación en ningún lugar de route.params");
        }
      }
    }, [route.params, papeleras, ubicacionsAPI]);
    
    
    const mostrarDetallesubicacionEscaneado = (ubicacionEscaneado) => {
      const ubicacionFormateado = {
        id: ubicacionEscaneado.id,
        nombre: ubicacionEscaneado.nombre,
        x: ubicacionEscaneado.x,
        y: ubicacionEscaneado.y,
        qr: ubicacionEscaneado.qr,
      };

      while (ubicacionsIniciales.current.some(ubic => ubic.id === ubicacionFormateado.id)) {
        ubicacionFormateado.id += 1;
      }

      setubicacionSeleccionado(ubicacionFormateado);
      ubicacionsIniciales.current = []; // ← Limpia lista anterior
      ubicacionsIniciales.current.push(ubicacionFormateado);


      // Enriquecer papeleras con coordenadas del QR correspondiente
      const papelerasConCoord = papeleras.map(papelera => {
        const qrData = ubicacionsAPI.find(qr => qr.id === papelera.id_qr);
        return {
          ...papelera,
          x: qrData?.x,
          y: qrData?.y,
        };
      }).filter(p => p.x !== undefined && p.y !== undefined); // Asegurarse que tiene coords

      // Calcular papelera más cercana
      let minDist = Infinity;
      let masCercana = null;

      papelerasConCoord.forEach(papelera => {
        const dist = Math.sqrt(
          Math.pow(papelera.x - ubicacionFormateado.x, 2) +
          Math.pow(papelera.y - ubicacionFormateado.y, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          masCercana = papelera;
        }
      });

      setPapeleraCercana(masCercana);
      setMarkers([masCercana]);

      Alert.alert(
        'Ubicación Escaneada',
        `Has escaneado: ${ubicacionFormateado.nombre}`
      );
    };
    // Mostrar información sobre el mapa cuando el usuario toca el botón de información
    const mostrarInformacion = () => {
      Alert.alert(
        '¿Cómo funciona el Mapa?',
  
        `    
      Aquí podrás visualizar los puntos de 
      reciclaje más cercanos a tu ubicación. 
    
      Toca un punto para ver más detalles y 
      usa el escáner QR para registrar tu 
      visita.
    
    📍 El mapa te muestra la ubicación de las papeleras en la oficina.
  
    📷 El botón de la cámara te permite escanear un qr que te lleva a los productos para eliminar y conseguir puntos!!!.
  
    🔲 El botón del código QR te permite ver la papelera mas cercana.`,
        [{ text: 'Entendido', style: 'default' }]
    );
    };

    return (
      <SafeAreaView style={styles.container}>
        {/* Botón de información arriba a la derecha */}
      <TouchableOpacity style={styles.botonInfo} onPress={mostrarInformacion}>
        <Ionicons name="information-circle-outline" size={28} color="#F4A261" />
      </TouchableOpacity>

        <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Ubicación actual: {'\n'}<Text>{ubicacionSeleccionado?.nombre}</Text> </Text>
          
          <Text style={styles.titulo}>Papelera más cercana: {'\n'}<Text>{papeleraCercana?.nombre}</Text></Text>
          
        </View>

        <ImageBackground
          source={require('../img/planouax.png')}
          style={styles.plano}
          resizeMode="contain"
        >
          {/* Marcadores */}
          {markers.map((marker, index) => (
            marker && (
              <View
                key={index}
                style={[styles.marker, { top: marker.y, left: marker.x }]}
              >
                <Text style={styles.markerText}>{marker.nombre}</Text>
                <View style={styles.redDot} />
              </View>
            )
          ))}
          
          <TouchableOpacity
            style={styles.botonFijo}
            onPress={() => navigation.navigate('Qr')}
          >
            <Ionicons name="qr-code-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonFijo2}
            onPress={() => navigation.navigate('Qr_puntos')}
            >
            <Ionicons name="camera-outline" size={30} color="white" />
          </TouchableOpacity>

        </ImageBackground>
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
    botonFijo2: {
      position: 'absolute',
      bottom: 100,
      right: 20,
      backgroundColor: '#F4A261',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    botonInfo: {
      position: 'absolute',
      top: 20,
      right: 20,
      padding: 10,
    },
  });
