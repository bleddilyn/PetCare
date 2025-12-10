import React, { useEffect } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function LoadingScreen() {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });

    const COR_FUNDO = '#F4F4F9';
    const COR_PRINCIPAL = '#8CCCE2';
    
    useEffect(() => {
        const navigateAfterDelay = async () => {
            if (!fontsLoaded) return;
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigation.replace('Login');
        };
        if (fontsLoaded) {
            navigateAfterDelay();
        }
    }, [fontsLoaded, navigation]);

    if (!fontsLoaded) {
        return <View style={[styles.container, { backgroundColor: COR_FUNDO }]} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Image
                source={require('../assets/images/PetCareLogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={[styles.loadingText, { color: COR_PRINCIPAL }]}>O miau cuidado para seu aumigo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 250,
        height: 250,
    },
    loadingText: {
        fontFamily: 'Kanit',
        fontSize: 24,
        marginTop: 20,
    },
});