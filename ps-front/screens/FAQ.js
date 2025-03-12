import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../colors';

const FAQs = ({ navigation }) => {
    const [faqs, setFAQs] = useState([]);

    const loadFAQ = async () => {
        // Aquí debes realizar la solicitud a la API para obtener los términos y condiciones
        // Supongamos que la API devuelve los datos en un objeto JSON llamado response
        // Reemplaza la siguiente línea por tu lógica de solicitud a la API
        const { data } = await axios.get('https://mock-server.loca.lt/faq')

        setFAQs(data);
    }

    useEffect(() => {
        loadFAQ();
    }, []);

    if (!faqs) {
        return <Text style={{ marginTop: 20 }}>Cargando preguntas frecuentes...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Preguntas Frecuentes</Text>
            {faqs.map((faq, index) => (
                <View key={index} style={styles.faqContainer}>
                    <Text style={styles.question}>{faq.question}</Text>
                    <Text style={styles.answer}>{faq.answer}</Text>
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
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    faqContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    answer: {
        fontSize: 16,
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

export default FAQs;