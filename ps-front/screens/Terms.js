import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../colors';

const Terms = ({ navigation }) => {
    const [termsData, setTermsData] = useState(null);

    const loadTerms = async () => {
        // Aquí debes realizar la solicitud a la API para obtener los términos y condiciones
        // Supongamos que la API devuelve los datos en un objeto JSON llamado response
        // Reemplaza la siguiente línea por tu lógica de solicitud a la API
        try {
            const { data } = await axios.get('https://mock-server.loca.lt/terms')
            setTermsData(data);
        } catch (error) {
            console.log(error.message)
            Alert.alert('Error al cargar términos y condiciones')
            navigation.navigate('Signup');
        }
    }

    useEffect(() => { loadTerms() }, []);

    if (!termsData) {
        return <Text style={{ marginTop: 30 }}>Cargando términos y condiciones...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>{termsData.title}</Text>
            {termsData.sections.map((section, index) => (
                <View key={index}>
                    <Text style={styles.subHeading}>{section.title}</Text>
                    <Text style={styles.paragraph}>{section.content}</Text>
                </View>
            ))}
            <TouchableOpacity style={styles.button}
                onPress={() => navigation.goBack()}>
                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Volver atrás</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: colors.red,
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
});

export default Terms;