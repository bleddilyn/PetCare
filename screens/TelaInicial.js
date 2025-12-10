import React, { useState, useEffect } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, Clipboard, TextInput, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FALLBACK_PET_DATA = {
    nome: '---------',
    sexo: '---------',
    raca: '---------',
    localizacao: '---------',
    nascimento: '00/00/0000',
    telefone: '00 00000000',
    castracaoStatus: '---------',
    bio: '---------',
    microchip: '0000000000000000',
    fotoUri: null,
};


export default function TelaInicial() {
    const navigation = useNavigation();
    const [petData, setPetData] = useState(FALLBACK_PET_DATA);
    const [userData, setUserData] = useState({}); 
    const [modalBioVisible, setModalBioVisible] = useState(false);
    const [novaBioTemporaria, setNovaBioTemporaria] = useState(FALLBACK_PET_DATA.bio);

    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });

    const COR_FUNDO = '#F4F4F9';
    const COR_HEADER = '#8CCCE2';
    const COR_CARD_FUNDO = '#b3d9e6ff';
    const COR_PRINCIPAL = '#2F4550';
    const COR_DESTAQUE = 'rgba(41, 92, 109, 1)ff';

    const loadPetData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('petData');
            if (storedData) {
                const data = JSON.parse(storedData);
                const finalData = {
                    ...FALLBACK_PET_DATA,
                    ...data,
                    nome: data.nome || '---------',
                    sexo: data.sexo || '---------',
                    raca: data.raca || '---------',
                    localizacao: data.cidade || '---------', 
                    nascimento: data.nascimento || '00/00/0000',
                    castracaoStatus: data.castracaoStatus || '---------',
                    bio: data.bio || '---------',
                    microchip: data.microchip || '0000000000000000',
                };
                setPetData(finalData);
            } else {
                setPetData(FALLBACK_PET_DATA);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do pet:", error);
            setPetData(FALLBACK_PET_DATA);
        }
    };
    
    const loadUserData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('usuario');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserData(user);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadPetData();
            loadUserData();
        });

        loadPetData(); 
        loadUserData();

        return unsubscribe; 
    }, [navigation]);


    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>;
    }
    
    const telefoneExibido = userData.telefone || petData.telefone || '00 00000000';
    
    const handleCopyMicrochip = () => {
          Clipboard.setString(petData.microchip);
          Alert.alert('Copiado', 'Número do Microchip copiado!');
    };
    
    const handleEditBio = () => {
        setNovaBioTemporaria(petData.bio); 
        setModalBioVisible(true);
    };

    const salvarNovaBio = async () => {
        const bioAjustada = novaBioTemporaria.trim();

        if (bioAjustada === petData.bio) {
            setModalBioVisible(false);
            return; 
        }

        try {
            const novosDadosPet = {
                ...petData,
                bio: bioAjustada,
            };
            
            setPetData(novosDadosPet);

            await AsyncStorage.setItem('petData', JSON.stringify(novosDadosPet));

            setModalBioVisible(false);
            Alert.alert('Sucesso', 'Bio do pet atualizada!');
        } catch (error) {
            console.error("Erro ao salvar nova bio:", error);
            Alert.alert('Erro', 'Não foi possível salvar a nova bio.');
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalBioVisible}
                onRequestClose={() => setModalBioVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { backgroundColor: COR_FUNDO, borderColor: COR_DESTAQUE, width: '85%' }]}>
                        <Text style={[styles.modalTitle, { color: COR_PRINCIPAL }]}>Editar Bio do Pet</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: COR_DESTAQUE,
                                    color: COR_PRINCIPAL,
                                    backgroundColor: '#E8F0F2',
                                    height: 100, 
                                    textAlignVertical: 'top',
                                }
                            ]}
                            onChangeText={setNovaBioTemporaria}
                            value={novaBioTemporaria}
                            placeholder="Descreva a personalidade do seu pet"
                            placeholderTextColor={COR_PRINCIPAL}
                            multiline={true} 
                            autoFocus={true}
                            onSubmitEditing={salvarNovaBio}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COR_PRINCIPAL }]}
                                onPress={() => setModalBioVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COR_DESTAQUE }]}
                                onPress={salvarNovaBio}
                            >
                                <Text style={[styles.modalButtonText, { color: 'white' }]}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={[styles.header, { backgroundColor: COR_HEADER }]}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={32} color={COR_PRINCIPAL} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{userData.nome || 'User'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={[styles.card, { backgroundColor: COR_CARD_FUNDO }]}>
                    
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {petData.fotoUri ? (
                                <Image
                                    source={{ uri: petData.fotoUri }}
                                    style={styles.petImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <MaterialIcons name="person-outline" size={40} color="#666" />
                            )}
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.label}>Nome:</Text>
                            <Text style={styles.value}>{petData.nome}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Sexo:</Text>
                            <Text style={styles.value}>{petData.sexo}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Raça/Pelagem</Text>
                            <Text style={styles.value}>{petData.raca}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Localização</Text>
                            <Text style={styles.value}>{petData.localizacao}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Data de nascimento:</Text>
                            <Text style={styles.value}>{petData.nascimento}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.row}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Telefone</Text>
                            <Text style={styles.value}>{telefoneExibido}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Status de Castração:</Text>
                            <Text style={styles.value}>{petData.castracaoStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.bioSection}>
                        <Text style={styles.label}>Bio</Text>
                        <View style={styles.bioContent}>
                            <Text style={styles.valueBio}>{petData.bio}</Text>
                            <TouchableOpacity style={styles.editButton} onPress={handleEditBio}>
                                <Feather name="edit-2" size={18} color={COR_DESTAQUE} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.idSection}>
                        <Text style={styles.idText}>{petData.microchip}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyMicrochip}>
                            <Feather name="copy" size={18} color={COR_DESTAQUE} />
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F9',
    },
    header: {
        backgroundColor: '#8CCCE2', 
        height: 100, 
        paddingTop: 50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute', 
        top: 52, 
        left: 15,
        zIndex: 10,
        padding: 5,
    },
    headerTitle: {
        fontFamily: 'Kanit', 
        fontSize: 24, 
        fontWeight: 'normal',
        color: '#2F4550', 
        marginLeft: 45, 
    },
    scrollContent: {
        padding: 20,
        paddingTop: 20, 
    },
    card: {
        backgroundColor: '#8CCCE2', 
        borderRadius: 20,
        padding: 20,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        marginTop: 0, 
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 85,
        height: 85,
        borderRadius: 42.5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: '#B8D8D9',
        marginRight: 15,
        overflow: 'hidden', 
    },
    petImage: {
        width: '100%',
        height: '100%',
    },
    nameContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        height: 85, 
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15, 
    },
    field: {
        width: '48%', 
    },
    label: {
        fontSize: 14,
        color: '#2F4550', 
        opacity: 0.7, 
        marginBottom: 2,
        fontFamily: 'Kanit',
    },
    value: {
        fontSize: 16,
        color: '#2F4550', 
        fontWeight: 'bold', 
        fontFamily: 'Kanit',
        borderBottomWidth: 0, 
        paddingBottom: 0,
    },
    bioSection: {
        paddingTop: 10,
        marginTop: 10,
    },
    bioContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 0, 
        paddingBottom: 0,
    },
    valueBio: {
        fontSize: 16,
        color: '#2F4550',
        fontWeight: 'normal',
        fontFamily: 'Kanit',
        flexShrink: 1,
    },
    editButton: {
        padding: 5,
        marginLeft: 10,
        marginTop: -5, 
    },
    idSection: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 20,
        padding: 5,
    },
    idText: {
        fontSize: 16,
        color: '#2F4550',
        fontWeight: 'bold',
        fontFamily: 'Kanit',
        marginRight: 10,
    },
    copyButton: {
        padding: 5,
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
    },
    input: {
        height: 50,
        width: '100%',
        marginBottom: 25,
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