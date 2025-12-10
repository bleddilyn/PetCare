import React, { useState } from 'react'; 
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native'; 
import { useConfig } from '../context/ConfigContext'; 

export default function CadastrarDispositivo() { 
    const navigation = useNavigation();
    const { adicionarDispositivo } = useConfig(); 
    const [nomeDispositivo, setNomeDispositivo] = useState('');
    const [potencia, setPotencia] = useState('');
    const [tensaoSelecionada, setTensaoSelecionada] = useState(null);
    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'), 
    });

    const COR_FUNDO = '#F4F4F9';
    const COR_PRINCIPAL = '#2F4550'; 
    const COR_DESTAQUE = '#B8D8D9'; 
    const COR_INPUT_FUNDO = '#f5f5f5'; 
    const COR_INPUT_BORDA = '#B8D8D9'; 
    const COR_INPUT_TEXTO = '#000000'; 
    const COR_PLACEHOLDER = 'rgba(0, 0, 0, 0.22)';
    
    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>; 
    }

    const handleCadastro = async () => {
        if (nomeDispositivo.trim() === '') {
            Alert.alert('Atenção', 'Por favor, digite um nome para o dispositivo.');
            return;
        }

        if (potencia.trim() !== '' && isNaN(potencia)) {
            Alert.alert('Atenção', 'Por favor, insira uma potência válida em watts (W).');
            return;
        }

        try {
            await adicionarDispositivo({
                nome: nomeDispositivo.trim(),
                tensao: tensaoSelecionada || null,
                potencia: potencia.trim() || null,
            });

            navigation.navigate('Main', { 
                screen: 'TelaInicial',     
                params: { 
                    novoDispositivo: {
                        nome: nomeDispositivo.trim(),
                        tensao: tensaoSelecionada || null,
                        potencia: potencia.trim() || null,
                    }
                }
            });
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível cadastrar o dispositivo.');
            console.error('Erro ao cadastrar dispositivo:', erro);
        }
    };

    const opcaoBotaoDinamico = (tensao) => ({
        borderColor: COR_DESTAQUE,
        backgroundColor: tensaoSelecionada === tensao ? COR_DESTAQUE : COR_INPUT_FUNDO,
    });
    
    const opcaoTextoDinamico = (tensao) => ({
        color: tensaoSelecionada === tensao ? 'white' : COR_PRINCIPAL,
    });

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Image
                source={require('../assets/images/PetCareLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            
            <Text style={[styles.cadastrar, { color: COR_PRINCIPAL }]}>Cadastrar Dispositivo</Text>

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
                value={nomeDispositivo} 
                onChangeText={setNomeDispositivo} 
            />

            <TextInput
                placeholder='Potência (W) — opcional'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                value={potencia}
                onChangeText={setPotencia}
                keyboardType='numeric'
            />

            <Text style={[styles.label, { color: COR_PRINCIPAL }]}>Selecione a tensão (opcional):</Text>
            <View style={styles.opcoesContainer}>
                
                <TouchableOpacity 
                    style={[styles.opcaoBotao, opcaoBotaoDinamico('127V')]}
                    onPress={() => setTensaoSelecionada(
                        tensaoSelecionada === '127V' ? null : '127V'
                    )}
                >
                    <Text style={[styles.opcaoTexto, opcaoTextoDinamico('127V')]}>
                        127V
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.opcaoBotao, opcaoBotaoDinamico('220V')]}
                    onPress={() => setTensaoSelecionada(
                        tensaoSelecionada === '220V' ? null : '220V'
                    )}
                >
                    <Text style={[styles.opcaoTexto, opcaoTextoDinamico('220V')]}>
                        220V
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={[styles.botao, { backgroundColor: COR_DESTAQUE }]}
                onPress={handleCadastro} 
            >
                <Text style={styles.botaoText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        backgroundColor: '#F4F4F9',
    },
    logo: {
        width: 200,
        height: 200,
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
    label: {
        fontFamily: 'Kanit',
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    opcoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginBottom: 40,
    },
    opcaoBotao: {
        borderWidth: 2,
        borderColor: '#B8D8D9',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    opcaoSelecionada: {
        backgroundColor: '#B8D8D9',
    },
    opcaoTexto: {
        fontFamily: 'Kanit',
        color: '#333',
        fontSize: 15,
    },
    opcaoTextoSelecionado: {
        color: 'white',
    },
    botao: {
        backgroundColor: '#B8D8D9',
        width: 307,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    botaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        color: 'white'
    },
});
