import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator 
} from 'react-native';

// Componente Productos para mostrar una lista de productos
export function Productos({ 
  productos, 
  loading, 
  onItemPress, 
  titulo = "Lista de Productos", 
  subtitulo = "Toca un producto para ver detalles",
  mostrarImagen = true
}) {
  //Esta función se hizo para renderizar cada producto en la lista de listado y listadoEliminacion
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => onItemPress && onItemPress(item)}
    >
      {mostrarImagen && item.imagen && (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      )}
      <View style={styles.contenido}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.descripcion}>
          {item.descripción || item.descripcion || "Sin descripción"}
        </Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>
      
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.vacio}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>Añade productos a la lista</Text>
          </View>
        }
        contentContainerStyle={productos && productos.length === 0 ? styles.listEmpty : styles.list}
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