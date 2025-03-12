import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Datos de ejemplo para la búsqueda (puedes reemplazar esto con datos reales)
const dummySearchResults = [
  { id: '1', name: 'Grupo Vecinal A' },
  { id: '2', name: 'Grupo de Seguridad B' },
  { id: '3', name: 'Vecinos Unidos' },
  { id: '4', name: 'Seguridad Sarmiento' },
  { id: '5', name: 'Rivadavia Alertas' },
  { id: '6', name: 'Policía Maipú' },
  { id: '7', name: 'Vecinos del Sur de Córdoba' },
];

const SearchGroupScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Función para realizar la búsqueda de grupos
  const handleSearchGroups = () => {

    const filteredResults = dummySearchResults.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  // Función para enviar una solicitud de unión a un grupo
  const handleJoinGroup = (groupId) => {
    alert(`Solicitud enviada para unirse al Grupo ID: ${groupId}`);
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar grupo..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearchGroups}
      />

      {/* Resultados de búsqueda */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => handleJoinGroup(item.id)}
            >
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.joinButton}>Enviar solicitud</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No se encontraron resultados.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  groupItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
  },
  joinButton: {
    color: '#007BFF',
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchGroupScreen;