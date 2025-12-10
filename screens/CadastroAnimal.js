import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react'; 
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons'; 

export default function CadastroAnimal() { 
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [sexo, setSexo] = useState(null); 
    const [raca, setRaca] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [castracaoStatus, setCastracaoStatus] = useState(null); 
    const [cidade, setCidade] = useState('');
    const [microchip, setMicrochip] = useState(''); 
    const [petImageUri, setPetImageUri] = useState(null); 
    const [uploadStatus, setUploadStatus] = useState('');
    const [tipoAnimal, setTipoAnimal] = useState(null); 
    const [tipoPersonalizado, setTipoPersonalizado] = useState(''); 
    const [modalTipoVisible, setModalTipoVisible] = useState(false); 
    
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
    const COR_SUCESSO = 'green';
    const COR_CINZA_CLARO = '#E0E0E0';

    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>;
    }

    const salvarAnimalLocalmente = async (animal) => {
        try {
            const dados = await AsyncStorage.getItem('pets');
            let lista = dados ? JSON.parse(dados) : [];
            lista.push(animal);
            await AsyncStorage.setItem('pets', JSON.stringify(lista));
        } catch (error) {
            console.log("Erro ao salvar pet:", error);
        }
    };

    const formatarData = (text) => {
        let limpa = text.replace(/\D/g, ''); 
        if (limpa.length > 8) limpa = limpa.substring(0, 8);
        if (limpa.length > 2) limpa = `${limpa.substring(0,2)}/${limpa.substring(2)}`;
        if (limpa.length > 5) limpa = `${limpa.substring(0,5)}/${limpa.substring(5)}`;
        setNascimento(limpa);
    };

    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar a galeria.');
            setUploadStatus('Permissão negada');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [4, 3], 
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setPetImageUri(uri);
            setUploadStatus('Foto selecionada com sucesso!');
        } else {
            setPetImageUri(null);
            setUploadStatus('Seleção cancelada.');
        }
    };

    const handleSelectTipo = (tipo) => {
        setTipoAnimal(tipo);
        if (tipo !== 'Outros') {
            setTipoPersonalizado(''); 
            setModalTipoVisible(false); 
        } else {
            setTipoPersonalizado(''); 
        }
    };

    const handleCadastroAnimal = async () => {
        let tipoFinal = tipoAnimal;
        if (tipoAnimal === 'Outros') {
            if (!tipoPersonalizado.trim()) {
                Alert.alert('Atenção', 'Por favor, digite o tipo do animal ou selecione uma opção.');
                return;
            }
            tipoFinal = tipoPersonalizado.trim();
        } else if (!tipoAnimal) {
             Alert.alert('Atenção', 'Selecione o tipo do animal.');
             return;
        }
        
        if (!nome || !raca || !cidade || !sexo) { 
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
            return;
        }

        if (nascimento.length > 0 && nascimento.length !== 10) {
            Alert.alert('Atenção', 'Data incompleta. Use DD/MM/AAAA.');
            return;
        }
        
        const novoAnimal = { 
            id: Date.now(), 
            nome: nome.trim(),
            tipo: tipoFinal, 
            sexo: sexo, 
            raca: raca.trim(), 
            nascimento: nascimento.trim() || null, 
            castracaoStatus: castracaoStatus, 
            cidade: cidade.trim(),
            microchip: microchip.trim() || null,
            fotoUri: petImageUri
        }; 

        await salvarAnimalLocalmente(novoAnimal);

        try {
            await AsyncStorage.setItem('petData', JSON.stringify(novoAnimal));
        } catch (error) {
            console.log("Erro ao definir pet ativo:", error);
        }

        Alert.alert('Sucesso', `Animal ${nome} cadastrado!`);
        navigation.navigate('Main');
    };
    
    const opcaoBotaoDinamico = (status) => ({
        borderColor: COR_DESTAQUE,
        backgroundColor: castracaoStatus === status ? COR_DESTAQUE : COR_INPUT_FUNDO,
    });
    
    const opcaoTextoDinamico = (status) => ({
        color: castracaoStatus === status ? 'white' : COR_PRINCIPAL,
    });

    const handleNavigateToLogin = () => navigation.navigate('Login');
    
    const getTipoDisplay = () => {
        if (tipoAnimal === 'Outros' && tipoPersonalizado) {
            return tipoPersonalizado;
        }
        return tipoAnimal || 'Tipo de Animal:';
    }


    return (
    <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        <ScrollView 
            style={{ flex: 1, backgroundColor: COR_FUNDO }}
            contentContainerStyle={{ paddingTop: 50, alignItems: 'center', paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>

                <Image source={require('../assets/images/PetCareLogo.png')} 
                    style={styles.logo} resizeMode="contain"
                />

                <Text style={[styles.cadastrar, { color: COR_PRINCIPAL }]}>Cadastrar Pet</Text>
                
                <TextInput
                    placeholder='Nome:'
                    placeholderTextColor={COR_PLACEHOLDER}
                    style={[styles.input, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO }]}
                    onChangeText={setNome}
                    value={nome}
                />
                
                <Text style={[styles.label, { color: COR_PRINCIPAL }]}>Sexo:</Text>
                <View style={styles.opcoesContainer}>
                    <TouchableOpacity 
                        style={[styles.opcaoBotao, { backgroundColor: sexo === 'Fêmea' ? COR_DESTAQUE : COR_INPUT_FUNDO }]}
                        onPress={() => setSexo('Fêmea')}
                    >
                        <Text style={{ fontFamily: 'Kanit', fontSize: 16, color: sexo === 'Fêmea' ? 'white' : COR_PRINCIPAL }}>
                            Fêmea
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.opcaoBotao, { backgroundColor: sexo === 'Macho' ? COR_DESTAQUE : COR_INPUT_FUNDO }]}
                        onPress={() => setSexo('Macho')}
                    >
                        <Text style={{ fontFamily: 'Kanit', fontSize: 16, color: sexo === 'Macho' ? 'white' : COR_PRINCIPAL }}>
                            Macho
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <TextInput
                    placeholder='Raça/Pelagem:'
                    placeholderTextColor={COR_PLACEHOLDER}
                    style={[styles.input, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO }]}
                    onChangeText={setRaca}
                    value={raca}
                />

                <TouchableOpacity 
                    style={[styles.input, styles.tipoInputContainer, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA }]}
                    onPress={() => setModalTipoVisible(true)}
                >
                    <Text 
                        style={[
                            styles.tipoInputText, 
                            { color: tipoAnimal ? COR_INPUT_TEXTO : COR_PLACEHOLDER }
                        ]}
                    >
                        {getTipoDisplay()}
                    </Text>
                    <Feather name="chevron-down" size={24} color={COR_PLACEHOLDER} />
                </TouchableOpacity>
                
                <TextInput
                    placeholder='Nascimento (DD/MM/AAAA) - opcional'
                    placeholderTextColor={COR_PLACEHOLDER}
                    style={[styles.input, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO }]}
                    onChangeText={formatarData}
                    value={nascimento}
                    keyboardType='numeric'
                    maxLength={10}
                />

                <Text style={[styles.label, { color: COR_PRINCIPAL }]}>Status de Castração:</Text>
                <View style={styles.opcoesContainer}>
                    <TouchableOpacity 
                        style={[styles.opcaoBotao, opcaoBotaoDinamico('Castrado')]}
                        onPress={() => setCastracaoStatus('Castrado')}
                    >
                        <Text style={[styles.opcaoTexto, opcaoTextoDinamico('Castrado')]}>Castrado</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.opcaoBotao, opcaoBotaoDinamico('Não Castrado')]}
                        onPress={() => setCastracaoStatus('Não Castrado')}
                    >
                        <Text style={[styles.opcaoTexto, opcaoTextoDinamico('Não Castrado')]}>Não Castrado</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder='Cidade:'
                    placeholderTextColor={COR_PLACEHOLDER}
                    style={[styles.input, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO }]}
                    onChangeText={setCidade}
                    value={cidade}
                />

                <TextInput
                    placeholder='Microchip (opcional)'
                    placeholderTextColor={COR_PLACEHOLDER}
                    style={[styles.input, { backgroundColor: COR_INPUT_FUNDO, borderColor: COR_INPUT_BORDA, color: COR_INPUT_TEXTO }]}
                    onChangeText={setMicrochip}
                    value={microchip}
                    keyboardType='numeric'
                />

                <TouchableOpacity 
                    style={[styles.uploadBotao, { borderColor: COR_DESTAQUE, backgroundColor: petImageUri ? '#E1F5FE' : COR_INPUT_FUNDO }]}
                    onPress={handleImageUpload}
                >
                    <Text style={[styles.uploadBotaoText, { color: COR_DESTAQUE }]}>
                        {petImageUri ? 'Foto Selecionada (Trocar)' : 'Upload da Foto do Pet'}
                    </Text>
                </TouchableOpacity>

                {uploadStatus ? (
                    <Text style={[styles.uploadStatusText, { color: petImageUri ? COR_SUCESSO : 'red' }]}>
                        {uploadStatus}
                    </Text>
                ) : null}

                {petImageUri && (
                    <Image 
                        source={{ uri: petImageUri }}
                        style={styles.previewImage}
                        resizeMode="cover"
                    />
                )}
                <TouchableOpacity 
                    style={[styles.botao, { backgroundColor: COR_DESTAQUE }]}
                    onPress={handleCadastroAnimal}
                >
                    <Text style={styles.botaoText}>Cadastrar Pet</Text>
                </TouchableOpacity>

                <View style={styles.jaTem}>
                    <Text style={[styles.texto, { color: COR_TEXTO_SECUNDARIO }]}>Voltar ao Login?</Text>
                    <TouchableOpacity onPress={handleNavigateToLogin}>
                        <Text style={[styles.entrar, { color: COR_LINK }]}>Clique aqui</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.nomePetCare, { color: COR_PRINCIPAL }]}>PetCare</Text>

            </View>
        </ScrollView>
        
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalTipoVisible}
            onRequestClose={() => setModalTipoVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: COR_FUNDO, borderColor: COR_DESTAQUE }]}>
                    <Text style={[styles.modalTitle, { color: COR_PRINCIPAL }]}>Selecione o Tipo de Animal</Text>
                    
                    {['Gato', 'Cachorro', 'Hamster', 'Tartaruga', 'Peixe','Coelho','Outros'].map((tipo) => (
                        <TouchableOpacity
                            key={tipo}
                            style={[
                                styles.modalOption,
                                { backgroundColor: tipoAnimal === tipo ? COR_DESTAQUE : 'white', borderColor: COR_CINZA_CLARO }
                            ]}
                            onPress={() => handleSelectTipo(tipo)}
                        >
                            <Text style={[
                                styles.modalOptionText, 
                                { color: tipoAnimal === tipo ? 'white' : COR_INPUT_TEXTO }
                            ]}>
                                {tipo}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {tipoAnimal === 'Outros' && (
                        <>
                        <TextInput
                            placeholder='Digite o tipo (ex: Pássaro, Réptil)'
                            placeholderTextColor={COR_PLACEHOLDER}
                            style={[
                                styles.input, 
                                styles.modalCustomInput, 
                                { 
                                    backgroundColor: COR_INPUT_FUNDO, 
                                    borderColor: COR_INPUT_BORDA, 
                                    color: COR_INPUT_TEXTO, 
                                    marginTop: 15 
                                }
                            ]}
                            onChangeText={setTipoPersonalizado}
                            value={tipoPersonalizado}
                            autoFocus
                        />
                         <TouchableOpacity
                            style={[styles.botao, styles.modalBotaoConfirmar, { backgroundColor: COR_DESTAQUE }]}
                            onPress={() => {
                                if (tipoPersonalizado.trim()) {
                                    setModalTipoVisible(false);
                                } else {
                                    Alert.alert('Atenção', 'Por favor, digite o tipo do animal.');
                                }
                            }}
                        >
                            <Text style={styles.botaoText}>Confirmar</Text>
                        </TouchableOpacity>
                        </>
                    )}

                    {!tipoAnimal || tipoAnimal !== 'Outros' ? (
                         <TouchableOpacity
                            style={[styles.botao, styles.modalBotaoFechar, { backgroundColor: COR_CINZA_CLARO }]}
                            onPress={() => setModalTipoVisible(false)}
                        >
                            <Text style={styles.botaoText}>Fechar</Text>
                        </TouchableOpacity>
                    ) : null}
                   
                </View>
            </View>
        </Modal>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    cadastrar: {
        fontFamily: 'Jua',
        fontWeight: '400',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Kanit',
        fontSize: 15,
        marginBottom: 5,
    },
    input: {
        width: 307,
        borderColor: '#B8D8D9',
        borderWidth: 2,
        borderRadius: 16,
        marginBottom: 15,
        backgroundColor: '#f5f5f5ff',
        paddingLeft: 10,
        fontSize: 16,
        height: 50, 
        fontFamily: 'Kanit',
    },
    tipoInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
    },
    tipoInputText: {
        fontFamily: 'Kanit',
        fontSize: 16,
        flex: 1,
    },
    opcoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 307,
        marginBottom: 15,
    },
    opcaoBotao: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#8CCCE2',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#f5f5f5',
    },
    opcaoTexto: {
        fontFamily: 'Kanit',
        fontSize: 16,
    },
    botao: {
        backgroundColor: '#B8D8D9',
        width: 307,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    botaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        color: 'white'
    },
    jaTem: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    texto: {
        fontFamily: 'Kanit',
        fontSize: 16,
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
        marginTop: 90,
        marginBottom: -10,
    },
    uploadBotao: {
        width: 307,
        borderWidth: 2,
        borderRadius: 16,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 5,
    },
    uploadBotaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        fontWeight: 'bold',
    },
    uploadStatusText: {
        fontFamily: 'Kanit',
        fontSize: 14,
        marginBottom: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#8CCCE2',
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
        fontFamily: 'Jua',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalOption: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        alignItems: 'center',
    },
    modalOptionText: {
        fontFamily: 'Kanit',
        fontSize: 18,
    },
    modalCustomInput: {
        width: '100%',
        height: 45,
    },
    modalBotaoConfirmar: {
        marginTop: 10,
        width: '100%',
    },
    modalBotaoFechar: {
        marginTop: 20,
        width: '100%',
    },
});