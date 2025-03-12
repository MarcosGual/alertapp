import React, { useState } from "react";
import { StyleSheet, Text, Alert, Image, View, SafeAreaView, Button } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Checkbox } from 'react-native-paper';
import { auth } from "../config/firebase";
import colors from "../colors";
import axios from "axios";
const backImage = require('../assets/ALERTAPP.png');

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordtwo, setPasswordtwo] = useState('');
    const [checked, setChecked] = useState(false);

    const onHandleTerms = () => {
        navigation.navigate('Terms');
    }

    onHandleFAQs = () => {
        navigation.navigate('FAQs');
    }

    const onHandleSignup = () => {
        // Aquí puedes realizar la lógica para enviar los datos del formulario al servidor
        // Por ejemplo, puedes hacer una solicitud HTTP POST utilizando fetch()
        // y enviar los datos en el cuerpo de la solicitud

        if (email === '' && password === '') {
            Alert.alert('Falta completar los campos');
        } else if (password !== passwordtwo) {
            Alert.alert('Los passwords deben coincidir');
        } else if (checked !== true) {
            Alert.alert('Debe aceptar términos y condiciones para continuar');
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    console.log('Signup success');
                    try {
                        const neighbor = {
                            email: email,
                            uid: userCredential.user.uid,
                            terms: true,
                            name: email.split('@')[0]
                        }
                        await axios.post('https://mock-server.loca.lt/neighbors', neighbor);
                        if (!userCredential.user.displayName) {
                            updateProfile(user, {
                                displayName: email.split('@')[0],
                            })
                                .then(() => {
                                    // Actualización exitosa
                                    console.log("Datos de usuario actualizados");
                                    navigation.navigate('Login');
                                })
                                .catch((error) => {
                                    // Error al actualizar
                                    console.log("Error al actualizar los datos de usuario:", error);
                                });
                        }
                    } catch (error) {
                        console.log('Error al guardar vecino: ' + error.message);
                    }
                })
                .catch(err => {
                    Alert.alert('Error en el registro: ', err.message);
                    navigation.navigate('Login');
                });
        }
    };

    return (
        <View style={styles.container}>
            <Image source={backImage} style={styles.backImage} />
            <View style={styles.whiteSheet} />
            <SafeAreaView style={styles.form}>
                <TextInput style={styles.input}
                    placeholder="Ingresar Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoFocus={true}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput style={styles.input}
                    placeholder="Ingresar Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType="password"
                    autoFocus={true} v
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TextInput style={styles.input}
                    placeholder="Confirmar Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType="password"
                    autoFocus={true}
                    value={passwordtwo}
                    onChangeText={text => setPasswordtwo(text)}
                />
                <View style={{ marginBottom: -20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android
                            color={colors.red} // Cambia el color del checkbox cuando está seleccionado
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(!checked)}
                        />
                        <Text style={{ fontSize: 14 }}>Acepto los</Text>
                        <TouchableOpacity onPress={() => onHandleTerms()}>
                            <Text style={{ color: colors.red, fontWeight: '600', fontSize: 14 }}> términos y condiciones</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Registrarse</Text>
                </TouchableOpacity>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 14 }}>Preguntas frecuentes - </Text>
                        <TouchableOpacity onPress={() => onHandleFAQs()}>
                            <Text style={{ color: colors.red, fontWeight: '600', fontSize: 14 }}>FAQs</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bacgroundColor: '#fff'
    },
    // title: {
    //     fontSize: 32,
    //     fontWeight: 'bold',
    //     color: colors.dark,
    //     alignSelf: 'center',
    //     paddingBottom: 24,
    //     textTransform: 'uppercase'
    // },
    input: {
        backgroundColor: '#F6F7FB',
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
    },
    backImage: {
        width: '100%',
        height: 340,
        position: 'absolute',
        top: 0,
        resizeMode: 'cover'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
        top: 80
    },
    button: {
        backgroundColor: colors.red,
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    backImage: {
        width: '100%',
        height: 270,
        position: 'absolute',
        top: 0,
        resizeMode: 'cover'
    },
    whiteSheet: {
        width: '100%',
        height: '75%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 60
    }
})