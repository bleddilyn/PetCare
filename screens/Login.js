import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native'; 
import { useState } from 'react';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [fontsLoaded] = useFonts({
        'Jua': require('../assets/fontes/Jua-Regular.ttf'), 
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });

    const COR_FUNDO = '#F4F4F9';
    const COR_PRINCIPAL = '#8CCCE2'; 
    const COR_DESTAQUE = '#8CCCE2'; 
    const COR_INPUT_FUNDO = '#f5f5f5'; 
    const COR_INPUT_BORDA = COR_DESTAQUE; 
    const COR_INPUT_TEXTO = '#000000';
    const COR_PLACEHOLDER = 'rgba(0, 0, 0, 0.22)';
    const COR_TEXTO_SECUNDARIO = 'rgba(0, 0, 0, 0.22)'; 
    const COR_LINK = COR_DESTAQUE; 

    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>; 
    }

    const handleNavigateToCadastro = () => {
        navigation.navigate('Cadastro');
    };

    const handleLogin = async () => {
        const usuarioSalvo = await AsyncStorage.getItem('usuario');

        if (!usuarioSalvo) {
            Alert.alert('Atenção', 'Nenhum usuário cadastrado! Faça o cadastro primeiro.');
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        if (usuario.email === email && usuario.senha === senha) {
            navigation.navigate('Main');
        } else {
            Alert.alert('Erro', 'Email ou senha incorretos.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Image
                source={require('../assets/images/PetCareLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={[styles.nomePetCare, { color: COR_PRINCIPAL }]}>PetCare</Text>
            <Text style={[styles.slogan, { color: COR_PRINCIPAL }]}>O miau cuidado para seu aumigo</Text>
            <Text style={[styles.cadastrar, { color: COR_PRINCIPAL }]}>Login</Text>

            <TextInput
                placeholder='Email:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder='Senha:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                secureTextEntry 
                onChangeText={setSenha}
                value={senha}
            />
            
            <TouchableOpacity 
                style={[styles.botao, { backgroundColor: COR_DESTAQUE }]}
                onPress={handleLogin} 
            >
                <Text style={styles.botaoText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.jaTem}>
                <Text style={[styles.texto, { color: COR_TEXTO_SECUNDARIO }]}>Não tem conta?</Text>
                <TouchableOpacity onPress={handleNavigateToCadastro}>
                    <Text style={[styles.entrar, { color: COR_LINK }]}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 90,
        backgroundColor: '#F4F4F9'
    },
    logo: {
        width: 200,
        height: 200,
    },
    nomePetCare:{
        fontFamily: 'Jua',
        fontWeight: '400',
        fontSize: 30,
        marginTop: 20,
        marginBottom: -10,
    },
    slogan:{
        fontFamily: 'Kanit',
        fontWeight: '400',
        fontSize: 15,
        marginTop: 20,
        marginBottom: 10,   
    },
    cadastrar: {
        fontFamily: 'Kanit',
        fontWeight: '400',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 50,
    },
    input: {
        width: 307,
        borderColor: '#B8D8D9',
        borderWidth: 2,
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: '#f5f5f5ff',
        paddingLeft: 10,
        fontSize: 16
    },
    botao: {
        backgroundColor: '#B8D8D9',
        width: 307,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    botaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        color: 'white'
    },
    jaTem: {
        flexDirection: 'row',  
        justifyContent: 'center',
        marginTop: 20,
    },
    texto: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.22)'
    },
    entrar: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: '#586F7C', 
        marginLeft: 5,
    }
});
