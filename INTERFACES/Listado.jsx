import React, { useState } from "react";
import { 
  SafeAreaView, Dimensions, StyleSheet, TextInput, 
  FlatList, TouchableOpacity, Text, View, Image 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const productos = [
  { id: "1", nombre: "Producto 1", descripcion: "Descripción del producto 1", colorPapelera: "Azul" },
  { id: "2", nombre: "Producto 2", descripcion: "Descripción del producto 2", colorPapelera: "Rojo" },
  { id: "3", nombre: "Producto 3", descripcion: "Descripción del producto 3", colorPapelera: "Verde" },
  { id: "4", nombre: "Producto 4", descripcion: "Descripción del producto 4", colorPapelera: "Amarillo" },
];

export function Listado() {
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const mostrarDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };

  return (
    <SafeAreaView style={[styles.container, StyleSheet.absoluteFillObject]}>
      <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />

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

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.producto} onPress={() => mostrarDetalles(item)}>
            <Text style={styles.nombreProducto}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {productoSeleccionado && (
        <View style={styles.detallesProducto}>
          <Text style={styles.titulo}>Descripción:</Text>
          <Text>{productoSeleccionado.descripcion}</Text>
          <Text style={styles.titulo}>Color de la Papelera:</Text>
          <Text>{productoSeleccionado.colorPapelera}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.botonFijo}>
        <Ionicons name="barcode-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    marginTop: 10,
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
  }
});

export default Listado;
