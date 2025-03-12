import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

const UserManagementScreen = () => {

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAdmin, setSearchAdmin] = useState('');

  const getUsers = async () => {
    try {
      const response = await axios.get("https://mock-server.loca.lt/neighbors/");
      setUsers(response.data);
      // console.log(alert)
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor");
      } else {
        console.error("Error al procesar la solicitud");
      }
    }
  };

  useEffect(()=>{
    getUsers();
  }, [])

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItemContainer}>
      <Text style={styles.userItemTitle}>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>{item.isAdmin ? 'Admin' : 'Regular User'}</Text>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    const filteredUsers = initialUsers.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const adminMatch = user.isAdmin && searchAdmin.toLowerCase() === 'admin';
      const regularUserMatch = !user.isAdmin && searchAdmin.toLowerCase() === 'regular user';
      return nameMatch && (adminMatch || regularUserMatch);
    });
    setUsers(filteredUsers);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre de usuario"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por Admin"
        value={searchAdmin}
        onChangeText={text => setSearchAdmin(text)}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  userItemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  userItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default UserManagementScreen;
