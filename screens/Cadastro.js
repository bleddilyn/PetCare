import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react'; 

export default function Cadastro() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState(''); 
    
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

    const salvarUsuarioLocalmente = async (usuario) => {
        try {
            const dados = await AsyncStorage.getItem('usuarios');
            let lista = [];

            if (dados) {
                lista = JSON.parse(dados);
            }

            lista.push(usuario);

            await AsyncStorage.setItem('usuarios', JSON.stringify(lista));
        } catch (error) {
            console.log("Erro ao salvar usuário:", error);
        }
    };

    const handleCadastroUsuario = async () => {
        if (!nome || !email || !senha || !telefone) { 
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        const novoUsuario = { 
            id: Date.now(),
            nome, 
            email, 
            senha, 
            telefone 
        }; 

        await salvarUsuarioLocalmente(novoUsuario);

        try {
            await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
        } catch (error) {
            console.log("Erro ao definir usuário ativo:", error);
        }
        

        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('CadastroAnimal');
    };

    const handleNavigateToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Image
                source={require('../assets/images/PetCareLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={[styles.cadastrar, { color: COR_PRINCIPAL }]}>Cadastrar-se</Text>

            <TextInput
                placeholder='Nome:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                onChangeText={setNome}
                value={nome}
            />
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
            <TextInput
                placeholder='Telefone:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                onChangeText={setTelefone}
                value={telefone}
                keyboardType='phone-pad' 
            />

            <TouchableOpacity 
                style={[styles.botao, { backgroundColor: COR_DESTAQUE }]}
                onPress={handleCadastroUsuario}
            >
                <Text style={styles.botaoText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.jaTem}>
                <Text style={[styles.texto, { color: COR_TEXTO_SECUNDARIO }]}>Já tem conta?</Text>
                <TouchableOpacity onPress={handleNavigateToLogin}>
                    <Text style={[styles.entrar, { color: COR_LINK }]}>Entrar</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.nomePetCare, { color: COR_PRINCIPAL }]}>PetCare</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        backgroundColor: '#F4F4F9'
    },
    logo: {
        width: 200,
        height: 200,
    },
    cadastrar: {
        fontFamily: 'Jua',
        fontWeight: '400',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 30, 
    },
    input: {
        width: 307,
        borderColor: '#B8D8D9',
        borderWidth: 2,
        borderRadius: 16,
        marginBottom: 15, 
        backgroundColor: '#f5f5f5ff',
        paddingLeft: 10,
        fontSize: 16
    },
    botao: {
        width: 307,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30, 
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
        marginLeft: 5,
    },
    nomePetCare: {
        fontFamily: 'Jua',
        fontWeight: '400',
        fontSize: 20,
        marginTop: 20,
        marginBottom: -10,
    },
});
