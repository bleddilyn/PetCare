import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, StatusBar, Image, Modal, SafeAreaView } from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font'; 

const { width } = Dimensions.get('window');
const COR_PRINCIPAL = '#2F4550';
const COR_HEADER = '#8CCCE2';

const LOGO_ASA = require('../assets/images/iconeASA.png');
const LOGO_ASF = require('../assets/images/iconeSaoFrancisco.png');
const LOGO_SLB = require('../assets/images/iconeLuzBicho.png');
const LOGO_PA = require('../assets/images/iconeProanimal.png');

const MARISA = require('../assets/imagePets/MarisaMonte.png');
const ADDAM = require('../assets/imagePets/Addam.png');
const MIA = require('../assets/imagePets/Mia.png'); 
const MUCHEBA = require('../assets/imagePets/Mucheba.png');

const DINO = require('../assets/imagePets/Dino.png');
const PRINCESA = require('../assets/imagePets/Princesa.png');
const FRED = require('../assets/imagePets/Fred.png');
const PANTERA = require('../assets/imagePets/Pantera.png');

const THOR = require('../assets/imagePets/Thor.png');
const REX = require('../assets/imagePets/Rex.png');
const PINGO = require('../assets/imagePets/Pingo.png');
const HERCULES = require('../assets/imagePets/Hercules.png')

const PEROLA = require('../assets/imagePets/Perola.png')
const MILK = require('../assets/imagePets/Milk.png')
const LILY = require('../assets/imagePets/Lily.png') 
const MEL = require('../assets/imagePets/Mel.png')

const ONG_DATA = [
    {
        id: '1',
        nome: 'Amigos Salvando Amigos',
        logo: LOGO_ASA,
        pets: [
            { 
                id: 'p1', 
                nome: 'Marisa Monte', 
                foto: MARISA, 
                descricao: 'Personalidade forte mas convive bem com outros gatinhos. É muito carinhosa com pessoas gosta muito de brincar e receber carinho. - Fêmea',
                castrado: true,
                microchipado: true,
                vacinado: true,
            },
            { 
                id: 'p2', 
                nome: 'Mucheba', 
                foto: MUCHEBA,
                descricao: 'Personalidade forte mas convive bem com outros gatinhos. Melhor amigo do Addam. Recomenda-se adoção conjunta com Addam. Curiosidade: possui polidactillia(6 dedos nas patinhas). - Macho',
                castrado: true,
                microchipado: false,
                vacinado: true,
            },
            { 
                id: 'p3', 
                nome: 'Addam',
                foto: ADDAM,
                descricao: 'Calmo, convive bem com outros gatinhos e humanos. Melhor amigo do Mucheba. Recomenda-se adoção conjunta com Mucheba. - Macho',
                castrado: false,
                microchipado: true,
                vacinado: false,
            },
            { 
                id: 'p4', 
                nome: 'Mia', 
                foto: MIA,
                descricao: 'Reservada e calma. Pode viver com outros gatos. É receptiva com humanos e gosta de carinho. - Fêmea',
                castrado: true,
                microchipado: true,
                vacinado: true,
            },
        ]
    },
    {
        id: '2',
        nome: 'Arca de São Francisco',
        logo: LOGO_ASF,
        pets: [
            { 
                id: 'p5', 
                nome: 'Rex', 
                foto: REX,
                descricao: 'Rex é um cão grande, esperto e super leal. Adora estar ao ar livre, brincar, correr e ficar perto de quem gosta. Apesar do porte imponente, é carinhoso, muito companheiro e está sempre pronto para proteger e receber carinho. - Macho',
                castrado: true,
                microchipado: true,
                vacinado: true,
            },
            { 
                id: 'p6', 
                nome: 'Pingo', 
                foto: PINGO,
                descricao: 'Cheio de charme e alegria. Sempre com a linguinha pra fora, ele conquista todo mundo com seu jeitinho espontâneo e brincalhão. Adora atenção, carinho e qualquer oportunidade de fazer novas amizades. - Macho',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
            { 
                id: 'p7', 
                nome: 'Thor', 
                foto: THOR,
                descricao: 'Thor é um filhote cheio de energia e encanto. Adora brincar, correr atrás de qualquer coisa que se mexa e tirar longos cochilos ao sol. É carinhoso, curioso e ama companhia. - Macho',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
            { 
                id: 'p8', 
                nome: 'Hercules', 
                foto: HERCULES,
                descricao: 'Um cãozinho cheio de energia e simpatia. Com seu olhar doce e a língua sempre de fora, ele conquista qualquer um. Adora correr, brincar e ficar perto de pessoas. - Macho',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
        ]
    },
    {
        id: '3',
        nome: 'Santuário Luz dos Bichos',
        logo: LOGO_SLB,
        pets: [
            { 
                id: 'p9', 
                nome: 'Perola', 
                foto: PEROLA,
                descricao: 'Gata idosa e calma, busca um lar tranquilo para passar o resto de seus dias.',
                castrado: true,
                microchipado: true,
                vacinado: true,
            },
            { 
                id: 'p10', 
                nome: 'Milk', 
                foto: MILK,
                descricao: 'Uma gatinha laranjinha e branca cheia de charme. Carinhosa, curiosa e muito esperta, ela adora brincar e tirar sonecas nos cantinhos mais quentinhos da casa.',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
            { 
                id: 'p11', 
                nome: 'Lily', 
                foto: LILY,
                descricao: 'Uma gatinha delicada e cheia de charme. Curiosa, carinhosa e sempre em busca de um colo quentinho, ela encanta com seu jeitinho calmo e olhar doce. Uma companheira perfeita para quem quer tranquilidade e muito amor.',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
            { 
                id: 'p12', 
                nome: 'Mel', 
                foto: MEL,
                descricao: 'Mel é uma fofura cheia de energia e alegria. Brincalhona, esperta e super afetuosa, ela adora atenção e transforma qualquer momento em diversão. Doce como o nome, Mel está pronta para adoçar o lar de quem a adotar.',
                castrado: false,
                microchipado: false,
                vacinado: true,
            },
        ]
    },
    {
        id: '4',
        nome: 'Pro Animal',
        logo: LOGO_PA,
        pets: [
            { 
                id: 'p13', 
                nome: 'Dino', 
                foto: DINO ,
                descricao: 'Com muita energia para brincar - Macho',
                castrado: true,
                microchipado: false,
                vacinado: true,
            },
            {
                id: 'p14',
                nome: 'Princesa',
                foto: PRINCESA,
                descricao: 'Uma doguinha muito linda, brincalhona e se dá bem com outros cães. - Fêmea',
                castrado: true,
                microchipado: false,
                vacinado: true,
            },
            {
                id: 'p15',
                nome: 'Fred',
                foto: FRED,
                descricao: 'Foi devolvido com 7 meses! Por ter muita energia para brincar! Além disso, é muito carinhoso e ama se divertir com água. - Macho',
                castrado: true,
                microchipado: false,
                vacinado: true,
            },
            {
                id: 'p16',
                nome: 'Pantera',
                foto: PANTERA,
                descricao: 'Muito dócil e com sorriso mais lindo. - Fêmea',
                castrado: true,
                microchipado: false,
                vacinado: true,
            },
        ] 
    },
];

const DetalhesPetModal = ({ pet, visible, onClose }) => {
    if (!pet) return null;

    const StatusItem = ({ label, isTrue }) => (
        <View style={modalStyles.statusItem}>
            <AntDesign 
                name={isTrue ? "checkcircle" : "closecircle"} 
                size={18} 
                color={isTrue ? "#4CAF50" : "#F44336"} 
                style={{ marginRight: 8 }}
            />
            <Text style={modalStyles.statusLabel}>{label}: </Text>
            <Text style={[modalStyles.statusValue, { color: isTrue ? COR_PRINCIPAL : '#F44336' }]}>
                {isTrue ? 'Sim' : 'Não'}
            </Text>
        </View>
    );
    
    const getPetImageSource = (foto) => {
        return typeof foto === 'string' ? { uri: foto } : foto;
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle-outline" size={30} color={COR_PRINCIPAL} />
                    </TouchableOpacity>

                    <Text style={modalStyles.petName}>{pet.nome}</Text>

                    <Image 
                        source={getPetImageSource(pet.foto)} 
                        style={modalStyles.petImage} 
                        resizeMode="cover"
                    />

                    <ScrollView style={modalStyles.scrollView}>
                        <Text style={modalStyles.sectionTitle}>Sobre {pet.nome}:</Text>
                        <Text style={modalStyles.descriptionText}>{pet.descricao}</Text>
                        
                        <Text style={modalStyles.sectionTitle}>Status:</Text>
                        <StatusItem label="Castrado" isTrue={pet.castrado} />
                        <StatusItem label="Microchipado" isTrue={pet.microchipado} />
                        <StatusItem label="Vacinado" isTrue={pet.vacinado} />

                        <Text style={modalStyles.adoteText}>
                            Interessado em adotar? Entre em contato com a ONG!
                        </Text>
                    </ScrollView>
                    
                </View>
            </View>
        </Modal>
    );
};

const ONGItem = ({ ong, onPetPress }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        if (ong.pets && ong.pets.length > 0) {
            setIsExpanded(!isExpanded);
        }
    };
    
    const getImageSource = (logo) => {
        return typeof logo === 'string' ? { uri: logo } : logo;
    };


    return (
        <View style={adocaoStyles.ongContainer}>
            <TouchableOpacity 
                style={adocaoStyles.ongHeader} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={adocaoStyles.ongLogoContainer}>
                    <Image source={getImageSource(ong.logo)} style={adocaoStyles.ongLogo} />
                </View>
                <Text style={adocaoStyles.ongTitle}>{ong.nome}</Text>
                
                {ong.pets && ong.pets.length > 0 ? (
                    <AntDesign 
                        name={isExpanded ? "up" : "down"} 
                        size={width * 0.04} 
                        color={COR_PRINCIPAL} 
                    />
                ) : (
                    <View style={{ width: width * 0.04 }} /> 
                )}
            </TouchableOpacity>

            {isExpanded && ong.pets && ong.pets.length > 0 && (
                <View style={adocaoStyles.petListContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={adocaoStyles.petScrollView}>
                        {ong.pets.map((pet) => (
                            <TouchableOpacity key={pet.id} style={adocaoStyles.petCard} onPress={() => onPetPress(pet)}>
                                <Image source={getImageSource(pet.foto)} style={adocaoStyles.petAvatar} />
                                <Text style={adocaoStyles.petName}>{pet.nome}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default function Adocao({ navigation }) {
    const [userData, setUserData] = useState({}); 
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'), 
    });
    
    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
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
            loadUserData();
        });

        loadUserData();
        return unsubscribe; 
    }, [navigation]);

    if (!fontsLoaded) {
        return <View style={adocaoStyles.loadingContainer}><Text>Carregando fontes...</Text></View>;
    }
    
    const renderHeader = () => (
        <View style={adocaoStyles.customHeader}>
            <TouchableOpacity style={adocaoStyles.menuButton} onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={32} color={COR_PRINCIPAL} />
            </TouchableOpacity>
            
            <Text style={adocaoStyles.headerTitle}>{userData.nome || 'User'}</Text> 
            
            <View style={adocaoStyles.headerPlaceholder} />
        </View>
    );

    return (
        <View style={adocaoStyles.screenContainer}>
            <StatusBar backgroundColor={COR_HEADER} barStyle="dark-content" />
            {renderHeader()} 
            
            <ScrollView contentContainerStyle={adocaoStyles.scrollViewContent}>
                {ONG_DATA.map(ong => (
                    <ONGItem key={ong.id} ong={ong} onPetPress={handlePetPress} />
                ))}
            </ScrollView>
            
            <DetalhesPetModal
                pet={selectedPet}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

const adocaoStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F4F4F9',
    },
    customHeader: {
        backgroundColor: COR_HEADER, 
        height: 100, 
        paddingTop: 50,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', 
    },
    menuButton: {
        padding: 5,
        marginRight: 5, 
    },
    headerTitle: {
        fontFamily: 'Kanit', 
        fontSize: 24, 
        fontWeight: 'normal',
        color: COR_PRINCIPAL, 
    },
    headerPlaceholder: {
        flex: 1, 
    },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    scrollViewContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    ongContainer: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    ongHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    ongLogoContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10,
        overflow: 'hidden',
    },
    ongLogo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    ongTitle: {
        flex: 1,
        fontSize: width * 0.045, 
        color: COR_PRINCIPAL,
        fontFamily: 'Kanit',
        fontWeight: '600',
    },
    petListContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15, 
        borderTopWidth: 1,
        borderTopColor: '#E0F7FA',
        backgroundColor: '#F4F4F9',
    },
    petScrollView: {
        paddingBottom: 10,
    },
    petCard: {
        alignItems: 'center',
        marginRight: 15,
        width: 80, 
    },
    petAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: COR_HEADER,
    },
    petName: {
        fontSize: width * 0.035,
        color: COR_PRINCIPAL,
        textAlign: 'center',
        fontFamily: 'Kanit',
    },
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: width * 0.9,
        maxHeight: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 5,
    },
    petName: {
        fontFamily: 'Kanit',
        fontSize: 28,
        fontWeight: 'bold',
        color: COR_PRINCIPAL,
        marginBottom: 10,
        marginTop: 5,
    },
    petImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: COR_HEADER,
        marginBottom: 15,
    },
    scrollView: {
        width: '100%',
        maxHeight: '60%', 
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontFamily: 'Kanit',
        fontSize: 18,
        fontWeight: 'bold',
        color: COR_PRINCIPAL,
        marginTop: 10,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    descriptionText: {
        fontFamily: 'Kanit',
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        lineHeight: 20,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    statusLabel: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: COR_PRINCIPAL,
        fontWeight: '600',
    },
    statusValue: {
        fontFamily: 'Kanit',
        fontSize: 16,
        fontWeight: 'bold',
    },
    adoteText: {
        fontFamily: 'Kanit',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COR_HEADER,
    }
});