import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, SafeAreaView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ListadoEliminacion } from './ListadoEliminacion'; // Asegúrate de importar correctamente el componente
import { Productos } from './Productos';

export function Listado({ navigation, route }) {
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]); // Inicializado como array vacío en lugar de productosIniciales
  const [productosAPI, setProductosAPI] = useState([]);
  // Nuevo estado para los productos de la papelera
  const [productosPapelera, setProductosPapelera] = useState([]);
  
  // Cargar productos de la API
  useEffect(() => {
    fetch('http://192.168.52.46:3000/productos')
      .then(response => response.json())
      .then(data => {
        console.log('Productos API cargados:', data.length);
        setProductosAPI(data);
      })
      .catch(error => console.error('Error al cargar productos de API:', error));
  }, []);

  // Verificar si hay un producto escaneado en la navegación
  useEffect(() => {
    if (route.params?.productoEscaneado) {
      const productoEscaneado = route.params.productoEscaneado;
      console.log("Producto recibido del escáner:", JSON.stringify(productoEscaneado));
      mostrarDetallesProductoEscaneado(productoEscaneado);
    }
  }, [route.params?.productoEscaneado]);

  // Cargar productos específicos de la papelera cuando hay una ubicación
  useEffect(() => {
    if (route.params?.ubicacion) {
      const { ubicacion } = route.params;
      console.log('Cargando productos de papelera desde Listado:', ubicacion.id);
      
      fetch(`http://192.168.52.46:3000/productos?id_papelera=${ubicacion.id}`) 
        .then(response => response.json())
        .then(data => {
          const productosObtenidos = Array.isArray(data) ? data : [];
          console.log('Productos papelera obtenidos en Listado:', productosObtenidos.length);
          setProductosPapelera(productosObtenidos);
        })
        .catch(error => {
          console.error('Error al cargar productos de papelera en Listado:', error);
        });
    }
  }, [route.params?.ubicacion]);

  // Manejar la selección de productos de la lista
  const mostrarDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };
  
  // Manejar la visualización del producto escaneado
  const mostrarDetallesProductoEscaneado = (productoEscaneado) => {
    // Convertir el producto escaneado al formato esperado por la UI
    const productoFormateado = {
      id: productoEscaneado.id,
      nombre: productoEscaneado.nombre,
      descripcion: productoEscaneado.descripción || "Sin descripción",
      colorPapelera: obtenerColorPapelera(productoEscaneado.id_papelera),
    };
    
    // Hack para evitar ids repetidos al escanear el mismo producto varias veces
    setProductos(prevProductos => {
      if (prevProductos.some(producto => producto.id === productoFormateado.id)) {
        productoFormateado.id = `${productoFormateado.id}-${Date.now()}`;
      }
      return [...prevProductos, productoFormateado]; 
    });
    
    // Opcional: mostrar un mensaje
    Alert.alert(
      'Producto Escaneado', 
      `Has escaneado: ${productoFormateado.nombre}`
    );
  };
  
  // Función para obtener el color de la papelera según su ID
  const obtenerColorPapelera = (idPapelera) => {
    switch (idPapelera) {
      case 1: return "Amarilloo";
      case 2: return "Azull";
      case 3: return "Verdee";
      default: return "No especificadoo";
    }
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Determinar si mostrar la lista principal o ListadoEliminacion
  const mostrarListadoEliminacion = route.params?.ubicacion;

  const mostrarInformacion = () => {
    Alert.alert(
    '¿Cómo usar el Listado?',
      `
🔍 Busca un producto usando la barra superior.

📄 Toca un producto para ver su descripción.

🎨 El color indicado te dice a qué papelera va.

🔲 El botón QR te permite escanear códigos.`,
      [{ text: 'Entendido', style: 'default' }]
  );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de información */}
      <TouchableOpacity style={styles.botonInfo} onPress={mostrarInformacion}>
        <Ionicons name="information-circle-outline" size={28} color="#F4A261" />
      </TouchableOpacity>
      <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />

      {!mostrarListadoEliminacion && (
        <>
          <View style={styles.buscadorContainer}>
            <TextInput
              style={styles.buscador}
              placeholder="Buscar producto"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity style={styles.button}>
              <Ionicons name="search-outline" color="white" size={24} />
            </TouchableOpacity>
          </View>

        <Productos
          productos={productosFiltrados}
          loading={false}
          onItemPress={mostrarDetalles}
          titulo="Productos disponibles"
          subtitulo="Toca un producto para ver detalles"
        />

          {/* Detalles del producto seleccionado */}
          {productoSeleccionado && (
            <View style={styles.detallesProducto}>
              <Text style={styles.tituloDetalle}>{productoSeleccionado.nombre}</Text>
              
              <Text style={styles.titulo}>Descripción:</Text>
              <Text>{productoSeleccionado.descripcion}</Text>
              
              <Text style={styles.titulo}>Color de la Papelera:</Text>
              <View style={styles.colorContainer}>
                <View style={[styles.colorIndicator, { backgroundColor: getColorCode(productoSeleccionado.colorPapelera) }]} />
                <Text>{productoSeleccionado.colorPapelera}</Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* Botón para escanear código de barras */}
      <TouchableOpacity
        style={styles.botonFijo}
        onPress={() => navigation.navigate('Camara')}
      >
        <Ionicons name="barcode-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Función para convertir nombre de color a código hex
function getColorCode(colorName) {
  switch (colorName?.toLowerCase()) {
    case 'azull': return '#1E90FF';
    case 'amarilloo': return '#FFD700';
    case 'verdee': return '#32CD32';
    default: return '#CCCCCC';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  buscadorContainer: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buscador: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F4A261',
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: "center",
  },
  producto: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detallesProducto: {
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
  titulo: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  tituloDetalle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: '#F4A261',
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
  emptyMessage: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  botonInfo: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
});

export default Listado;