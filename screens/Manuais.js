import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ManualItem = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={manualStyles.panelContainer}>
            <TouchableOpacity 
                style={manualStyles.header} 
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
            >
                <Text style={manualStyles.title}>{title}</Text>
                <AntDesign 
                    name={isExpanded ? "up" : "down"} 
                    size={width * 0.04} 
                    color="#8CCCE2" 
                />
            </TouchableOpacity>

            {isExpanded && (
                <View style={manualStyles.content}>
                    {children}
                    
                    <View style={manualStyles.animalButtons}>
                        <TouchableOpacity style={manualStyles.animalButtonGato}>
                            <Text style={manualStyles.animalButtonText}>GATO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={manualStyles.animalButtonCao}>
                            <Text style={manualStyles.animalButtonText}>CÃO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default function Manuais({ navigation }) {
    const [userData, setUserData] = useState({}); 

    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });
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
        return <View style={manualStyles.loadingContainer}><Text>Carregando fontes...</Text></View>;
    }
    
    const renderHeader = () => (
        <View style={manualStyles.customHeader}>
            <TouchableOpacity style={manualStyles.menuButton} onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={32} color="#2F4550" />
            </TouchableOpacity>
            
            <Text style={manualStyles.headerTitle}>{userData.nome || 'User'}</Text> 
        </View>
    );

    return (
        <View style={manualStyles.screenContainer}>
            {renderHeader()} 
            
            <ScrollView contentContainerStyle={manualStyles.scrollViewContent}>
                
                <ManualItem title="PEQUENO MANUAL DE EMERGÊNCIA">
                    <Text style={manualStyles.previewText}>
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                    </Text>
                </ManualItem>

                <ManualItem title="PEQUENO MANUAL DE ALIMENTAÇÃO">
                    <Text style={manualStyles.previewText}>
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview
                    </Text>
                </ManualItem>

                <ManualItem title="MANUAL DE MEDICINA VETERINÁRIA">
                    <Text style={manualStyles.previewText}>
                        preview preview preview preview preview
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                    </Text>
                </ManualItem>
                
                 <ManualItem title="PEQUENO MANUAL DE ADOÇÃO">
                    <Text style={manualStyles.previewText}>
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                        preview preview preview preview preview 
                    </Text>
                </ManualItem>
                
            </ScrollView>
        </View>
    );
}

const manualStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#F4F4F9',
        paddingTop: 0,
    },
    customHeader: {
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
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    scrollViewContent: {
        padding: 20,
    },
    panelContainer: {
        backgroundColor: '#b3d9e6ff', 
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden', 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
    },
    title: {
        fontSize: width * 0.045, 
        fontWeight: 'bold',
        color: '#2F4550',
        maxWidth: '90%', 
    },
    content: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#C5E6F0',
    },
    previewText: {
        fontSize: width * 0.035,
        color: '#2F4550',
        marginBottom: 10,
    },
    animalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    animalButtonGato: {
        backgroundColor: '#8CCCE2',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    animalButtonCao: {
        backgroundColor: '#8CCCE2',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    animalButtonText: {
        color: '#2F4550',
        fontWeight: 'bold',
        fontSize: width * 0.035,
    },
});