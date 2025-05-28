import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function Camara({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scaneado, setScaneado] = useState(false);
  const [codigo_barras, setCodigo_barras] = useState('');
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Fetch de productos
  useEffect(() => {
    setIsLoading(true);
    
    console.log('Iniciando fetch de productos...');
    fetch('http://192.168.52.46:3000/productos') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
      })
      .then(datos => {
        console.log('Productos obtenidos:', JSON.stringify(datos));
        setProductos(datos);
        setCodigo_barras(datos.codigo_barras); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setIsLoading(false);
        Alert.alert('Error de conexión', 'No se pudieron cargar los productos. Verifica tu conexión.');
      });
  }, []);
    
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const BuscarProducto = async ({ type, data }) => {
      console.log("Código escaneado:", data);
      console.log("Buscando en productos:", productos.length);
      setScaneado(true);
      
    // Buscar el producto en la lista de productos
      const productoEncontrado = productos.find(producto => 
        producto.codigo_barras === data
      );
      if (productoEncontrado) {
        console.log("Producto encontrado:", JSON.stringify(productoEncontrado));
        
        // Pequeña pausa para dar feedback visual antes de navegar
        setTimeout(() => {
          // Navegar a la pantalla de listado con el producto escaneado
          navigation.navigate('Navigation', {
            screen: 'Listado',
            params: { productoEscaneado: productoEncontrado }
          });          
        }, 1000);
        
        Alert.alert('Producto encontrado', `¡${productoEncontrado.nombre} identificado!`);
      } else {
        console.log("Producto no encontrado para código:", data);
        Alert.alert('Código de barras no encontrado', 'Este producto no está en la base de datos.');
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
          onBarcodeScanned={scaneado ? undefined : BuscarProducto}
          style={styles.camera}
          barcodeScannerSettings={{ 
            barcodeTypes: [
              'aztec' , 'ean13' , 'ean8' , 'qr' , 'pdf417' , 'upc_e' , 'datamatrix' , 'code39' , 'code93' , 'itf14' , 'codabar' , 'code128','upc_a'
            ], 
          }}
        >
        <View style={styles.overlay}>
          <Text style={styles.textoEscaner}>
            {isLoading ? 'Cargando productos...' : 'Escanea un código de barras'}
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