import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function Qr({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scaneado, setScaneado] = useState(false);
  const [codigo_barras, setCodigo_barras] = useState('');
  const [ubicacions, setubicacions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Fetch de ubicaciones
  useEffect(() => {
    setIsLoading(true); 
    console.log('Iniciando fetch de ubicaciones...');
    fetch('http://192.168.52.46:3000/qr')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
      })
      .then(datos => {
        console.log('ubicacions obtenidos:', JSON.stringify(datos));
        setubicacions(datos);
        setCodigo_barras(datos.codigo_barras); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener ubicacions:', error);
        setIsLoading(false);
        Alert.alert('Error de conexión', 'No se pudieron cargar los ubicacions. Verifica tu conexión.');
      });
  }, []);
    
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

  const Buscarubicacion = async ({ type, data }) => {
    console.log("Código escaneado:", data);
    console.log("Buscando en ubicacions:", ubicacions.length);
    setScaneado(true);
      
    const ubicacionEncontrado = ubicacions.find(ubicacion => 
      ubicacion.qr === data
    );
    if (ubicacionEncontrado) {
      console.log("ubicacion encontrado:", JSON.stringify(ubicacionEncontrado));
        
      // Pequeña pausa para dar feedback visual antes de navegar
      setTimeout(() => {
        navigation.navigate('Navigation', { 
          screen: 'Mapa',
          params: {
            ubicacionEscaneado: ubicacionEncontrado 
          }
        });
      }, 1000);
        
      Alert.alert('ubicacion encontrado', `¡${ubicacionEncontrado.nombre} identificado!`);
    } else {
      console.log("ubicacion no encontrado para código:", data);
      Alert.alert('Código de barras no encontrado', 'Este ubicacion no está en la base de datos.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos tu permiso para usar la cámara</Text>
        <Button onPress={requestPermission} title="Dar Permiso" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scaneado ? undefined : Buscarubicacion}
          style={styles.camera}
          barcodeScannerSettings={{ 
            barcodeTypes: [
              'aztec' , 'ean13' , 'ean8' , 'qr' , 'pdf417' , 'upc_e' , 'datamatrix' , 'code39' , 'code93' , 'itf14' , 'codabar' , 'code128','upc_a'
            ], 
          }}
        >
        <View style={styles.overlay}>
          <Text style={styles.textoEscaner}>
            {isLoading ? 'Cargando ubicacions...' : 'Escanea un QR'}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
            
            {scaneado && (
              <TouchableOpacity 
                style={styles.boton} 
                onPress={() => setScaneado(false)}
              >
                <Text style={styles.textoBoton}>Escanear Otro</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Indicador visual de escaneo */}
          <View style={styles.scanFrame} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  boton: {
    backgroundColor: '#F4A261',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
  textoEscaner: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 60,
    alignSelf: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    width: '70%',
    height: '20%',
    borderWidth: 2,
    borderColor: '#F4A261',
    borderRadius: 10,
    backgroundColor: 'rgba(244, 162, 97, 0.1)',
    alignSelf: 'center',
  },
});