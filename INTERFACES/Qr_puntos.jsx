import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function puntos({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scaneado, setScaneado] = useState(false);
  const [papeleras, setPapeleras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Fetch de papeleras
  useEffect(() => {
    setIsLoading(true); 
    console.log('Iniciando fetch de papeleras...');
    fetch('http://192.168.52.46:3000/papeleras')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
      })
      .then(datos => {
        console.log('Papeleras obtenidas:', JSON.stringify(datos));
        setPapeleras(datos);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener papeleras:', error);
        setIsLoading(false);
        Alert.alert('Error de conexión', 'No se pudieron cargar las papeleras. Verifica tu conexión.');
      });
  }, []);
    
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const buscarPapelera = async ({ type, data }) => {
    console.log("Código escaneado:", data);
    console.log("Buscando en papeleras:", papeleras.length);
    setScaneado(true);
    
    // Buscar papelera por id_qr con comparación directa como string
    const papeleraEncontrada = papeleras.find(papelera => {
      const papeleraQr = String(papelera.id_qr);
      const scannedQr = String(data);
      
      console.log(`Comparing: '${papeleraQr}' with '${scannedQr}'`);
      // Comparación directa o con puntos
      return papeleraQr === scannedQr || 
             (papeleraQr.includes('puntos:') && scannedQr.includes('puntos:') && 
              papeleraQr.includes(scannedQr) || scannedQr.includes(papeleraQr));
    });
  
    if (papeleraEncontrada) {
      console.log("Papelera encontrada:", JSON.stringify(papeleraEncontrada));
        
      // Pequeña pausa para dar feedback visual antes de navegar
      setTimeout(() => {
        navigation.navigate('ListadoEliminacion', {
          ubicacion: papeleraEncontrada.id
        });
      }, 500);
  
      Alert.alert('Papelera encontrada', `¡${papeleraEncontrada.nombre} identificada!`);
    } else {
      console.log("Papelera no encontrada para código:", data);
      Alert.alert('QR no reconocido', 'Esta papelera no está en la base de datos.');
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
          onBarcodeScanned={scaneado ? undefined : buscarPapelera}
          style={styles.camera}
          barcodeScannerSettings={{ 
            barcodeTypes: [
              'aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'
            ], 
          }}
        >
        <View style={styles.overlay}>
          <Text style={styles.textoEscaner}>
            {isLoading ? 'Cargando papeleras...' : 'Escanea un QR'}
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