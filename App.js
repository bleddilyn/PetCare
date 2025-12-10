import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { ConfigProvider } from './context/ConfigContext';
import { useFonts } from 'expo-font'; 

import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import CadastroAnimal from './screens/CadastroAnimal';
import TelaInicial from './screens/TelaInicial';
import Configuracoes from './screens/Configuracoes';
import Manuais from './screens/Manuais';
import Adocao from './screens/Adocao';
import LoadingScreen from './screens/LoadingScreen'; 

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const LOGO_EMPRESA_URI = require('./assets/images/PetCareLogo.png'); 
const COR_HEADER_DRAWER = '#8CCCE2'; 


function CustomDrawerContent(props) {
    return (
        <View style={customStyles.container}>
            <View style={[customStyles.header, { backgroundColor: COR_HEADER_DRAWER }]}>
                <Image
                    source={LOGO_EMPRESA_URI}
                    style={customStyles.logo}
                    resizeMode="contain"
                />
                <Text style={customStyles.logoText}>PetCare</Text> 
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
}

const customStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 280, 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        paddingTop: 0, 
    },
    logo: {
        width: 200, 
        height: 200, 
        marginTop: 120,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Jua', 
        marginBottom: 90,
    },
});

function LogoutScreen({ navigation }) {
    React.useEffect(() => {
        navigation.replace('Login'); 
    }, [navigation]);

    return (
        <View style={styles.center}>
            <Text style={{ fontSize: 18, color: '#2F4550' }}>Saindo da conta...</Text>
        </View>
    );
}

const getDrawerScreenOptions = () => {
    return {
        headerShown: false,
        drawerActiveBackgroundColor: '#c5e6f0ff',
        drawerActiveTintColor: '#2F4550', 
        drawerInactiveTintColor: '#2F4550',
        drawerContentStyle: { backgroundColor: '#F4F4F9' },
        drawerLabelStyle: { fontFamily: 'Kanit', fontSize: 16 }, 
    };
};

function DrawerTelaInicial() {
    return (
        <Drawer.Navigator 
            initialRouteName="TelaInicial" 
            screenOptions={getDrawerScreenOptions()}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            
            <Drawer.Screen 
                name="TelaInicial" 
                component={TelaInicial} 
                options={{ 
                    title: 'Tela Inicial',
                    drawerIcon: ({ color, size }) => (
                        <Image
                            source={require('./assets/images/iconeInicial.png')} 
                            style={{ 
                                width: size, 
                                height: size, 
                            }}
                        />
                    ),
                }} 
            />
            
            <Drawer.Screen 
                name="Manuais" 
                component={Manuais} 
                options={{ 
                    title: 'Manuais',
                    drawerIcon: ({ color, size }) => (
                        <Image
                            source={require('./assets/images/iconeManuais.png')} 
                            style={{ 
                                width: size, 
                                height: size, 
                            }}
                        />
                    ),
                }} 
            />
            
            <Drawer.Screen 
                name="Adocao" 
                component={Adocao} 
                options={{ 
                    title: 'Adoção',
                    drawerIcon: ({ color, size }) => (
                        <Image
                            source={require('./assets/images/iconeAdocao.png')} 
                            style={{ 
                                width: size, 
                                height: size, 
                            }}
                        />
                    ),
                }} 
            />
            
            <Drawer.Screen 
                name="Configurações" 
                component={Configuracoes} 
                options={{ 
                    title: 'Configurações',
                    drawerIcon: ({ color, size }) => (
                        <Image
                            source={require('./assets/images/iconeConfig.png')} 
                            style={{ 
                                width: size, 
                                height: size, 
                            }}
                        />
                    ),
                }} 
            />
            
            <Drawer.Screen 
                name="Sair" 
                component={LogoutScreen} 
                options={{ 
                    title: 'Sair',
                }} 
            />
            
        </Drawer.Navigator>
    );
}

export default function App() {
    const [fontsLoaded] = useFonts({
        'Jua': require('./assets/fontes/Jua-Regular.ttf'), 
        'Kanit': require('./assets/fontes/Kanit-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null; 
    }
    
    return (
        <ConfigProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
               <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}> 
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="CadastroAnimal" component={CadastroAnimal} />
                <Stack.Screen name="Main" component={DrawerTelaInicial} />
            </Stack.Navigator>
            </NavigationContainer>
        </ConfigProvider>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});