import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Inicio } from './components/Inicio';  // Asegúrate que la ruta sea correcta
import { Login } from './components/Login'; // Asegúrate que la ruta sea correcta
import { Registro } from './components/Registro'; // Asegúrate que la ruta sea correcta
import { Carga } from './components/Carga';
import { Listado } from './components/Listado';
import { Perfil } from './components/Perfil';
import { Mapa } from './components/Mapa';
import { Main } from './components/Home';
import {EnviarEmail} from './components/EnviarEmail';
import {Ranking} from './components/Ranking';
import {Configuracion} from './components/Configuracion';
import {Navigation} from './navegation/Navigation';
import { Camara } from './components/Camara';
import { Qr } from './components/Qr';
import { puntos } from './components/Qr_puntos';
import {ListadoEliminacion} from './components/ListadoEliminacion';


const Stack = createStackNavigator();
//const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Carga">
          
          <Stack.Screen name="Inicio" component={Inicio} options={{ headerShown: false }} />
     
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />

          <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />

          <Stack.Screen name="Carga" component={Carga} options={{ headerShown: false }} />

          <Stack.Screen name="Listado" component={Listado} options={{ headerShown: false }} />

          <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />

          <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: false }} />

          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          
          <Stack.Screen name="EnviarEmail" component={EnviarEmail} options={{ headerShown: false }} />

          <Stack.Screen name="Ranking" component={Ranking} options={{ headerShown: false }} />

          <Stack.Screen name="Configuracion" component={Configuracion} options={{ headerShown: false }} />

          <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} />

          <Stack.Screen name="Camara" component={Camara} options={{ headerShown: false }} />

          <Stack.Screen name="Qr" component={Qr} options={{ headerShown: false }} />

          <Stack.Screen name="Qr_puntos" component={puntos} options={{ headerShown: false }} />

          <Stack.Screen name="ListadoEliminacion" component={ListadoEliminacion} options={{ headerShown: false }} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
/*const TabNavigator=() => {
  //1.Main
  //2.Mapa
  //3.Listado
  //4.Perfil
  return <Tab.Navigator>

  </Tab.Navigator>
}*/