import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importamos el ícono de Ionicons
import colors from '../colors';
import { useEffect } from 'react';
import axios from 'axios';
import { Icon } from 'react-native-elements';

const CreateGroupScreen = ({ navigation, route }) => {
    const { group, neighbor } = route.params;
    const [groupName, setGroupName] = useState(group ? group.groupName : '');
    const [neighborhoods, setNeighborhoods] = useState(group ? group.neighborhoods : []);
    const [neighborhood, setNeighborhood] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedNeighbors, setSelectedNeighbors] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredNeighbors, setFilteredNeighbors] = useState([]);
    const [showInviteButton, setShowInviteButton] = useState(false);
    // const [groupNeighbors, setGroupNeighbors] = useState([]);
    const [neighbors, setNeighbors] = useState([]);

    const getGroupNeighbors = async () => {
        try {
            const { data } = await axios.get(`https://mock-server.loca.lt/neighbors/group/${group._id}`);
            // setGroupNeighbors(data);
            setSelectedNeighbors(data);
        } catch (error) {
            console.log('Error en obtener vecinos - ' + error.message);
        }
    }

    const addNeighborToGroup = async (neighbor) => {
        neighbor.groups.push(`${group._id}`);
        try {
            await axios.put(`https://mock-server.loca.lt/neighbors/${neighbor._id}`, neighbor)
        } catch (error) {
            console.log(error.message);
        }
    }

    const removeNeighborFromGroup = async (neighbor) => {
        try {
            console.log(group._id);
            neighbor.groups = neighbor.groups.map(x => x._id);
            console.log(neighbor.groups);
            neighbor.groups = neighbor.groups.filter(x => x !== group._id);
            await axios.put(`https://mock-server.loca.lt/neighbors/${neighbor._id}`, neighbor)
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (group) {
            getGroupNeighbors();
        }
    }, []);

    const getAllNeighbors = async () => {
        try {
            const { data } = await axios.get(`https://mock-server.loca.lt/neighbors/`);
            setNeighbors(data);
        } catch (error) {
            console.log('Error en obtener vecinos - ' + error.message);
        }
    }

    const handleAddNeighbor = (neighbor) => {
        const found = selectedNeighbors.find(x => x._id === neighbor._id)
        if (!found) {
            setSelectedNeighbors((prevNeighbors) => [...prevNeighbors, neighbor]);
            if (group) addNeighborToGroup(neighbor);
            // console.log(selectedNeighbors)
            setModalVisible(false);
            setSearchText('');
        } else {
            Alert.alert('El vecino ya está en el grupo.')
        }
    };

    const handleDeleteNeighbor = async (selectedNeighbor) => {
        await Alert.alert('Eliminar vecino', `Confirma la eliminación del grupo del vecino ${selectedNeighbor.name}?`, [
            {
                text: 'Cancelar',
                onPress: () => false,
                style: 'cancel',
            },
            {
                text: 'Confirmar',
                onPress: () => {
                    // console.log(selectedNeighbor)
                    const updatedNeighbors = selectedNeighbors.filter((neighbor) => neighbor._id !== selectedNeighbor._id);
                    if (group) removeNeighborFromGroup(selectedNeighbor);
                    setSelectedNeighbors(updatedNeighbors);
                },
                style: 'default'
            },
        ]);;
    }

    const handleSaveGroup = async () => {
        // const prevSelected = selectedNeighbors.length;
        // const neighbors = [...selectedNeighbors, neighbor];
        // setSelectedNeighbors(neighbors);
        // console.log(selectedNeighbors)
        // if (prevSelected === selectedNeighbors.length) return;
        console.log(neighbor)
        // Aquí puedes guardar los datos del nuevo grupo en la base de datos o hacer otras acciones necesarias
        const newGroupData = {
            groupName: groupName,
            neighbours: [...selectedNeighbors,neighbor],
            neighborhoods: neighborhoods,
            admins: [neighbor._id]
        };
        console.log(newGroupData);
        // Lógica para guardar los datos del nuevo grupo
        if (group) {
            try {
                await axios.put('https://mock-server.loca.lt/groups/' + group._id, newGroupData)
                // console.log('Grupo actualizado...');
                Alert.alert('Grupo actualizado');
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error en la actualización del grupo');
                console.warn(error.message);
            }
        } else {
            try {
                await axios.post('https://mock-server.loca.lt/groups/', newGroupData)
                // console.log('Grupo actualizado...');
                Alert.alert('Grupo creado');
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error en la creación del grupo');
                console.warn(error.message);
            }
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length >= 2) {
            const filtered = neighbors.filter((neighbor) => {
                const nameMatch = neighbor.name.toLowerCase().includes(text.toLowerCase());
                const emailMatch = neighbor.email.toLowerCase().includes(text.toLowerCase());
                return nameMatch || emailMatch;
            });
            setFilteredNeighbors(filtered);
            if (filtered.length === 0 && isValidEmail(text)) {
                setShowInviteButton(true);
            } else if (showInviteButton && !(!filtered && isValidEmail(text))) {
                setShowInviteButton(false)
            }
        }
    };

    const prompt = (title, msg) => {
        return new Promise((resolve, reject) => {
            try {
                Alert.alert(title, msg, [
                    {
                        text: "Cancelar",
                        onPress: () => resolve(false),
                        style: "cancel",
                    },
                    { text: "Confirmar", onPress: () => resolve(true) },
                ]);
            } catch (error) {
                reject(new Error('Error al mostrar el prompt'))
            }
        });
    };

    const saveNeighbor = async () => {
        try {
            const neighbor = {
                email: searchText,
                terms: false,
                name: searchText.split('@')[0],
                groups: [`${group._id}`]
            }
            console.log(neighbor)
            const { data } = await axios.post('https://mock-server.loca.lt/neighbors', neighbor);
            return data ? data : false;
        } catch (error) {
            console.log('Error al guardar vecino: ' + error.message);
            return false;
        }
    }


    const sendInvitationByEmail = async () => {
        try {
            const confirmation = await prompt('Invitación', '¿Está seguro que desea enviar la invitación al mail de esta persona?');
            if (confirmation) {
                const emailData = {
                    to: 'mlgual@hotmail.com',
                    dynamicTemplateData: {
                        group: group
                    }
                }
                const success = await saveNeighbor();
                if (success) {
                    await axios.post('https://mock-server.loca.lt/send-email/', emailData);
                    Alert.alert('E-mail enviado exitosamente');
                    setSearchText('');
                }
            }
        } catch (error) {
            console.log('error al enviar mail - ' + error.message);
            Alert.alert('Error al enviar invitación...');
        }

    }

    const handleAddNeighborhood = () => {
        if (neighborhood.trim() !== '' && !neighborhoods.includes(neighborhood)) {
            let capitalizedNeighborhood = neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1);
            setNeighborhoods((prevNeighborhoods) => [...prevNeighborhoods, capitalizedNeighborhood.trim()]);
            setNeighborhood('');
        }
    };

    const handleRemoveNeighborhood = (neighborhood) => {
        setNeighborhoods((prevNeighborhoods) => prevNeighborhoods.filter((item) => item !== neighborhood));
    };

    const isValidEmail = (str) => {
        // Expresión regular para validar una dirección de correo electrónico
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(str);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre del grupo"
                value={groupName}
                onChangeText={setGroupName}
            />

            <Button color={colors.darkViolet} title="Agregar Vecinos" onPress={() => {
                getAllNeighbors();
                setModalVisible(true);
            }
            } />

            <Text style={styles.label}>Vecinos en el grupo:</Text>
            <FlatList
                data={selectedNeighbors}
                renderItem={({ item }) =>
                    item.uid && <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{ textAlign: 'center' }}>{item.name} - ({item.email})</Text>
                        <Ionicons onPress={() => handleDeleteNeighbor(item)} name="close-circle-outline" size={24} color={colors.dark} />
                    </View>}
                keyExtractor={(item) => item._id}
            />

            <View style={styles.tagsContainer}>
                {neighborhoods ? neighborhoods.map((neighborhood) => (
                    <TouchableOpacity
                        key={neighborhood}
                        style={styles.tag}
                        onPress={() => handleRemoveNeighborhood(neighborhood)}
                    >
                        <Text style={styles.tagText}>{neighborhood}</Text>
                    </TouchableOpacity>
                )) : 'Cargando barrios...'}
            </View>

            <View style={styles.addNeighborhoodContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]} // Utilizamos flex: 1 para expandir el ancho del input
                    placeholder="Agregar barrio"
                    value={neighborhood}
                    onChangeText={setNeighborhood}
                />
                <TouchableOpacity style={{ paddingBottom: 10, paddingLeft: 15 }} onPress={handleAddNeighborhood}>
                    <Ionicons name="add" size={24} color={colors.dark} />
                </TouchableOpacity>
            </View>

            <Button color={colors.darkViolet} title="Guardar Grupo" onPress={handleSaveGroup} />

            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={{ fontSize: 16, marginBottom: 30, marginTop: 10 }}>Búsqueda de vecinos por e-mail o nombre:</Text>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar vecino por nombre o email"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                        {showInviteButton && (
                            <TouchableOpacity
                                style={[styles.inviteButton]}
                                onPress={sendInvitationByEmail}
                                disabled={!showInviteButton}
                            >
                                <Icon name="inbox" size={20} color="#fff" />
                                <Text style={styles.inviteButtonText}>Invitar</Text>
                            </TouchableOpacity>)}
                    </View>
                    <FlatList
                        data={filteredNeighbors}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleAddNeighbor(item)}>
                                <Text style={styles.modalItem}>{item.name} - {item.email}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                    />
                    <Button color={colors.dark} title="Cancelar" onPress={() => { setModalVisible(false) }} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    modalItem: {
        fontSize: 16,
        marginBottom: 10,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#e6e6e6',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#e6e6e6',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
    },
    addNeighborhoodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 400,
        marginHorizontal: 'auto',
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        padding: 5,
        fontSize: 14,
        backgroundColor: colors.dark,
        borderRadius: 5,
        marginLeft: 5,
    },
    disabledInviteButton: {
        backgroundColor: '#ccc',
    },
    inviteButtonText: {
        marginLeft: 5,
        color: '#fff',
    },
});

export default CreateGroupScreen;