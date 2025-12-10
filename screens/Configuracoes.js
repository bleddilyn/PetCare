import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native'; 
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker'; 
import { Feather } from '@expo/vector-icons'; 

export default function Configuracoes() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('Carregando...');
    const [email, setEmail] = useState('Carregando...');
    const FOTO_PLACEHOLDER = 'https://via.placeholder.com/150/8CCCE2/FFFFFF?text=PET'; 
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState(FOTO_PLACEHOLDER); 
    const [novoNome, setNovoNome] = useState('');
    const [editandoNome, setEditandoNome] = useState(false);
    
    const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    
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
    const COR_TEXTO_SECUNDARIO = '#555555';
    const COR_BOTAO_SAIR = '#E57373'; 
    const COR_SECUNDARIA_ESCURO = '#2F4550'; 

    useEffect(() => {
        const carregarUsuario = async () => {
            try {
                const usuarioSalvo = await AsyncStorage.getItem('usuario');
                if (usuarioSalvo) {
                    const usuario = JSON.parse(usuarioSalvo);
                    setNome(usuario.nome || 'Usuário Padrão');
                    setEmail(usuario.email || 'email@nao.encontrado');
                    setFotoPerfilUrl(usuario.foto || FOTO_PLACEHOLDER); 
                    setNovoNome(usuario.nome || 'Usuário Padrão');
                } else {
                    setNome('Nenhum usuário');
                    setEmail('Por favor, faça o cadastro.');
                    setFotoPerfilUrl(FOTO_PLACEHOLDER);
                }
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
                Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
            }
        };

        carregarUsuario();
    }, []);

    const handleAlterarFoto = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'É preciso de permissão para acessar a galeria de fotos.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], 
                quality: 1,
            });

            if (result.canceled) {
                return;
            }
            
            const novaFotoUri = result.assets[0].uri;
            
            setFotoPerfilUrl(novaFotoUri);
            
            const usuarioSalvo = await AsyncStorage.getItem('usuario');
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                const novoUsuario = { ...usuario, foto: novaFotoUri }; 
                
                await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
                Alert.alert('Sucesso', 'Foto de perfil atualizada!');
            } else {
                 Alert.alert('Erro', 'Nenhum usuário logado para salvar a foto.');
            }

        } catch (error) {
            console.error("Erro ao alterar foto:", error);
            Alert.alert('Erro', 'Não foi possível selecionar ou salvar a foto.');
        }
    };

    const handleSalvarNome = async () => {
        if (!novoNome.trim()) {
            Alert.alert('Atenção', 'O nome não pode estar vazio.');
            return;
        }

        try {
            const usuarioSalvo = await AsyncStorage.getItem('usuario');
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                const novoUsuario = { ...usuario, nome: novoNome.trim() };
                
                await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
                
                setNome(novoNome.trim());
                setEditandoNome(false);
                Alert.alert('Sucesso', 'Nome de usuário atualizado!');
            }
        } catch (error) {
            console.error("Erro ao salvar nome:", error);
            Alert.alert('Erro', 'Não foi possível salvar o novo nome.');
        }
    };
    
    const handleOpenAlterarSenha = () => {
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarNovaSenha('');
        setModalSenhaVisible(true);
    };

    const handleSalvarNovaSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
            Alert.alert('Atenção', 'Todos os campos devem ser preenchidos.');
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
            return;
        }
        
        if (novaSenha.length < 6) { 
            Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        try {
            const usuarioSalvo = await AsyncStorage.getItem('usuario');
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
            
                if (usuario.senha !== senhaAtual) {
                     Alert.alert('Erro', 'A senha atual está incorreta.');
                     return;
                }

                const novoUsuario = { ...usuario, senha: novaSenha };
                await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));

                setModalSenhaVisible(false);
                Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');

            } else {
                Alert.alert('Erro', 'Nenhum usuário logado. Por favor, faça o login novamente.');
            }
        } catch (error) {
            console.error("Erro ao salvar nova senha:", error);
            Alert.alert('Erro', 'Não foi possível salvar a nova senha.');
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Sair da Conta',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    onPress: async () => {
                        await AsyncStorage.removeItem('usuario');
                        navigation.navigate('Login'); 
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };


    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>;
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COR_FUNDO }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalSenhaVisible}
                onRequestClose={() => setModalSenhaVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: COR_FUNDO, borderColor: COR_DESTAQUE }]}>
                        <Text style={[styles.modalTitle, { color: COR_SECUNDARIA_ESCURO }]}>Alterar Senha</Text>
                        
                        <TextInput
                            style={[styles.modalInput, { borderColor: COR_DESTAQUE, color: COR_INPUT_TEXTO, backgroundColor: COR_INPUT_FUNDO }]}
                            placeholder="Senha Atual"
                            placeholderTextColor={COR_TEXTO_SECUNDARIO}
                            secureTextEntry={true}
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                        />
                        <TextInput
                            style={[styles.modalInput, { borderColor: COR_DESTAQUE, color: COR_INPUT_TEXTO, backgroundColor: COR_INPUT_FUNDO }]}
                            placeholder="Nova Senha (min 6 caracteres)"
                            placeholderTextColor={COR_TEXTO_SECUNDARIO}
                            secureTextEntry={true}
                            value={novaSenha}
                            onChangeText={setNovaSenha}
                        />
                         <TextInput
                            style={[styles.modalInput, { borderColor: COR_DESTAQUE, color: COR_INPUT_TEXTO, backgroundColor: COR_INPUT_FUNDO }]}
                            placeholder="Confirmar Nova Senha"
                            placeholderTextColor={COR_TEXTO_SECUNDARIO}
                            secureTextEntry={true}
                            value={confirmarNovaSenha}
                            onChangeText={setConfirmarNovaSenha}
                            onSubmitEditing={handleSalvarNovaSenha}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COR_TEXTO_SECUNDARIO }]}
                                onPress={() => setModalSenhaVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COR_DESTAQUE }]}
                                onPress={handleSalvarNovaSenha}
                            >
                                <Text style={styles.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            <View style={styles.container}>
                <Text style={[styles.titulo, { color: COR_PRINCIPAL }]}>Configurações de Perfil</Text>
                
                <TouchableOpacity onPress={handleAlterarFoto} style={styles.fotoContainer}>
                    <Image
                        source={{ uri: fotoPerfilUrl }}
                        style={styles.fotoPerfil}
                        onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
                    />
                    <Text style={[styles.link, { color: COR_PRINCIPAL }]}>Alterar Foto</Text>
                </TouchableOpacity>

                <View style={styles.detalhesContainer}>
                    <Text style={[styles.label, { color: COR_TEXTO_SECUNDARIO }]}>Nome:</Text>
                    {editandoNome ? (
                        <View style={styles.edicaoContainer}>
                            <TextInput
                                style={[styles.input, { borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO, backgroundColor: COR_INPUT_FUNDO }]}
                                value={novoNome}
                                onChangeText={setNovoNome}
                                autoFocus
                            />
                            <TouchableOpacity style={[styles.botaoSalvar, { backgroundColor: COR_DESTAQUE }]} onPress={handleSalvarNome}>
                                <Text style={styles.botaoText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoText}>{nome}</Text>
                            <TouchableOpacity onPress={() => setEditandoNome(true)}>
                                <Text style={[styles.linkPequeno, { color: COR_PRINCIPAL }]}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <Text style={[styles.label, { marginTop: 20, color: COR_TEXTO_SECUNDARIO }]}>Email:</Text>
                    <Text style={styles.infoText}>{email}</Text>
                    
                    <TouchableOpacity style={styles.opcaoSecundaria} onPress={handleOpenAlterarSenha}>
                       <Text style={[styles.link, { color: COR_PRINCIPAL }]}>Alterar Senha</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.botaoSair, { backgroundColor: COR_BOTAO_SAIR }]}
                    onPress={handleLogout}
                >
                    <Text style={styles.botaoText}>Sair da Conta</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    titulo: {
        fontFamily: 'Jua',
        fontSize: 28,
        marginBottom: 40,
        marginTop: 50,
    },
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    fotoPerfil: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#E0E0E0',
        marginBottom: 10,
    },
    detalhesContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 40,
    },
    label: {
        fontFamily: 'Kanit',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
    },
    infoText: {
        fontFamily: 'Kanit',
        fontSize: 18,
        color: '#000000',
        flexShrink: 1, 
    },
    link: {
        fontFamily: 'Kanit',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    linkPequeno: {
        fontFamily: 'Kanit',
        fontSize: 14,
        marginLeft: 10,
        textDecorationLine: 'underline',
    },
    edicaoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
        fontSize: 16,
        fontFamily: 'Kanit',
    },
    botaoSalvar: {
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        color: 'white',
    },
    botaoSair: {
        width: '80%',
        maxWidth: 300,
        height: 45,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    opcaoSecundaria: {
        alignSelf: 'flex-start',
        marginTop: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
        borderWidth: 2,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Kanit',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalInput: {
        height: 50,
        width: '100%',
        marginBottom: 15,
        borderWidth: 2,
        padding: 12,
        borderRadius: 12,
        fontFamily: 'Kanit',
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        gap: 15,
    },
    modalButton: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 2,
        flex: 1,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontFamily: 'Kanit',
        fontSize: 16,
        textAlign: 'center',
    },
});