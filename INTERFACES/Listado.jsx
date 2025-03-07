import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, View, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';


// Datos de ejemplo para los productos
const productos = [
  { id: "1", nombre: "Producto 1", descripcion: "Descripción del producto 1", colorPapelera: "Azul" },
  { id: "2", nombre: "Producto 2", descripcion: "Descripción del producto 2", colorPapelera: "Rojo" },
  { id: "3", nombre: "Producto 3", descripcion: "Descripción del producto 3", colorPapelera: "Verde" },
  { id: "4", nombre: "Producto 4", descripcion: "Descripción del producto 4", colorPapelera: "Amarillo" },
  // Agrega más productos según sea necesario
];

export function Listado() {
  const [busqueda, setBusqueda] = useState(""); // Estado para el buscador
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para el producto seleccionado

  // Filtrar productos según la búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const mostrarDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../img/logo_tres-removebg-preview.png')} style={styles.logo} />
      
      <View style={styles.buscadorContainer}>
       
        <TextInput
          style={styles.buscador}
          placeholder="Buscar producto"
          value={busqueda}
          onChangeText={(texto) => setBusqueda(texto)} // Actualizar el texto del buscador
        />
        <TouchableOpacity
        style={styles.button}
        >
          <Ionicons name= 'search-outline'  color="white" size={30}/>
          
        </TouchableOpacity>
        

      </View>
      
      {/* Lista de productos */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.producto} onPress={() => mostrarDetalles(item)}>
            <Text style={styles.nombreProducto}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Detalles del producto seleccionado */}
      {productoSeleccionado && (
        <View style={styles.detallesProducto}>
          <Text style={styles.titulo}>Descripción:</Text>
          <Text>{productoSeleccionado.descripcion}</Text>
          <Text style={styles.titulo}>Color de la Papelera:</Text>
          <Text>{productoSeleccionado.colorPapelera}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  buscadorContainer:{
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    flexDirection: "row",
  },
  button:{
    height:32,
    width:45,
    backgroundColor: '#F4A261',
    borderRadius:15,
    paddingLeft:8,
    marginTop:3,
    marginLeft:190,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 30,
    marginLeft: 75,
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
    backgroundColor: '#FAF3E0',
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
});