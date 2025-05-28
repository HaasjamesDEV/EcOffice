import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';

export function ListadoEliminacion({ route, navigation }) {
  // Estado local para gestionar los productos
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ubicacionInfo, setUbicacionInfo] = useState(null);
  
  useEffect(() => {
    if (route.params?.ubicacion) {
      // Guardar la ubicación en el estado local
      console.log('Información de ubicación recibida:', JSON.stringify(route.params.ubicacion));
      setUbicacionInfo(route.params.ubicacion);
      cargarProductos();
    } else {
      setLoading(false);
      console.warn('No se recibió información de ubicación');
    }
  }, [route.params?.ubicacion]);
  
  // Función para cargar productos desde la API
  const cargarProductos = () => {
    if (route.params?.ubicacion) {
      const ubicacion = route.params.ubicacion;
      // Verificar si la ubicación tiene un ID válido
      const ubicacionId = ubicacion.id || ubicacion;
      
      console.log('Cargando productos de papelera:', ubicacionId);
      
      // Verificar que usamos la URL base consistente
      const baseUrl = 'http://192.168.52.46:3000'; // Debe coincidir con la URL de Perfil
      
      // Construir la URL correctamente según el formato esperado por la API
      const url = `${baseUrl}/productos?id_papelera=${ubicacionId}`;
      console.log('URL de consulta:', url);
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Asegúrate de que `data` es un arreglo
          const productosObtenidos = Array.isArray(data) ? data : [];
          console.log('Productos obtenidos:', productosObtenidos.length);
          
          setProductos(productosObtenidos);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al cargar productos:', error);
          Alert.alert('Error', 'No se pudieron cargar los productos.');
          setLoading(false);
        });
    } else {
      // Si no hay ubicación, simplemente marcamos como cargado
      setLoading(false);
    }
  };

  const procederConEliminacion = (productoId) => {
    console.log('Eliminando producto:', productoId);
    
    // Validación del ID
    if (!productoId) {
      console.error('Error: ID de producto inválido');
      Alert.alert('Error', 'ID de producto inválido');
      return;
    }
    
    // Actualización en memoria primero (optimistic update)
    const nuevosProductos = productos.filter(p => p.id !== productoId);
    setProductos(nuevosProductos);
    
    // Extraer los puntos del QR escaneado con manejo de errores
    try {
      // Usar la información de ubicación del estado local
      const ubicacion = ubicacionInfo || route.params?.ubicacion;
      
      // Para depuración
      console.log('Información completa de ubicación:', JSON.stringify(ubicacion));
      
      // Obtener los puntos con un manejo mejorado
      let puntosGanados = 10; // Valor por defecto
      
      if (ubicacion) {
        // Si hay un campo específico para puntos, intentamos usarlo
        if (ubicacion.conseguir_puntos) {
          const puntosString = ubicacion.conseguir_puntos;
          console.log('Puntos string:', puntosString);
          
          try {
            // Si es un string JSON válido
            const jsonPuntos = JSON.parse(puntosString);
            if (jsonPuntos && jsonPuntos.puntos) {
              puntosGanados = parseInt(jsonPuntos.puntos, 10);
            }
          } catch (e) {
            // Si no es JSON, intentamos extraer con regex
            console.log('No es JSON válido, intentando con regex');
            const puntosMatch = puntosString.match(/puntos:(\d+)/);
            if (puntosMatch && puntosMatch[1]) {
              puntosGanados = parseInt(puntosMatch[1], 10);
            }
          }
        } 
        // Si hay un campo directo de puntos
        else if (ubicacion.puntos) {
          puntosGanados = parseInt(ubicacion.puntos, 10);
        }
      }
      
      // Asegurarnos que los puntos sean un número válido
      puntosGanados = isNaN(puntosGanados) ? 10 : puntosGanados;
      
      console.log('Puntos ganados:', puntosGanados);
      
      Alert.alert('¡Eliminado!', `Has ganado ${puntosGanados} puntos.`);
    
      // Eliminación en el backend
      const baseUrl = 'http://192.168.52.46:3000'; // Usar la misma URL base
      
      // Usar la URL correcta para eliminar un producto
      const url = `${baseUrl}/productos/${productoId}`;
      console.log('URL de eliminación:', url);
      
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Respuesta de eliminación:', response.status);
        
        if (!response.ok) {
          console.warn(`API respondió con error ${response.status}, pero continuamos con la experiencia de usuario`);
        }
        
        // Navegación DESPUÉS de la respuesta del servidor (más confiable)
        setTimeout(() => {
          // Asegurarnos de navegar correctamente con los puntos
          navigation.navigate('Navigation', { 
            screen: 'Perfil',
            params: {
              puntosGanados 
            },
            merge: true // Asegura que los parámetros se fusionan correctamente
          });
        }, 500);
      })
      .catch(error => {
        console.error('Error al eliminar en backend:', error);
        
        // Incluso si hay error, navegamos para dar los puntos
        navigation.navigate('Navigation', { 
          screen: 'Perfil',
          params: {
            puntosGanados 
          },
          merge: true
        });
      });
    } catch (error) {
      console.error('Error procesando puntos:', error);
      Alert.alert('¡Eliminado!', 'Producto eliminado correctamente.');
      
      // Navegación con puntos por defecto
      setTimeout(() => {
        navigation.navigate('Navigation', { 
          screen: 'Perfil',
          params: { 
            puntosGanados: 10 // Valor por defecto si hay error
          }
        });
      }, 500);
    }
  };

  const eliminarProducto = (item) => {
    if (!item || !item.id) {
      console.error('Error: Producto inválido', item);
      Alert.alert('Error', 'No se puede eliminar este producto.');
      return;
    }
    
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de eliminar ${item.nombre || 'este producto'}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => procederConEliminacion(item.id), style: "destructive" }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => eliminarProducto(item)}>
      {item.imagen && <Image source={{ uri: item.imagen }} style={styles.imagen} />}
      <View style={styles.contenido}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion}>{item.descripción || item.descripcion || "Sin descripción"}</Text>
        <View style={styles.codigoContainer}>
          <Text style={styles.codigoLabel}>Código:</Text>
          <Text style={styles.codigo}>{item.codigo_barras || item.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
        <Text style={styles.cargando}>Cargando productos...</Text>
      </View>
    );
  }

  // Si no hay ubicación en estado local ni en route.params, no mostramos nada
  const ubicacion = ubicacionInfo || route.params?.ubicacion;
  if (!ubicacion) {
    return (
      <View style={styles.container}>
        <Text style={styles.vacio}>No se pudo cargar la información de la papelera</Text>
        <TouchableOpacity 
          style={styles.botonVolver} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Productos de {ubicacion.nombre || "Papelera"}</Text>
        <Text style={styles.subtitulo}>Toca un producto para reciclarlo</Text>
      </View>
      
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.vacio}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Añade productos a esta papelera</Text>
          </View>
        }
        contentContainerStyle={productos.length === 0 ? styles.listEmpty : styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#F7F9FC'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 5
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC'
  },
  cargando: { 
    marginTop: 15, 
    fontSize: 16,
    color: '#2A9D8F'
  },
  list: {
    paddingBottom: 20
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  vacio: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center'
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center'
  },
  botonVolver: {
    backgroundColor: '#F4A261',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    width: 150,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contenido: {
    padding: 16,
  },
  nombre: { 
    fontSize: 18, 
    color: '#264653', 
    fontWeight: 'bold',
    marginBottom: 6
  },
  descripcion: {
    color: '#444',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20
  },
  codigoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  codigoLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5
  },
  codigo: {
    color: '#2A9D8F',
    fontSize: 12,
    fontWeight: '500'
  },
  imagen: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  }
});