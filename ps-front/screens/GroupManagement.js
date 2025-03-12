import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LOCAL_TUNNEL_URL } from "@env";

const GroupManagementScreen = () => {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAdmin, setSearchAdmin] = useState("");

  const getAlerts = async () => {
    try {
      const response = await axios.get(`${LOCAL_TUNNEL_URL}/groups/`);
      setGroups(response.data);
      // console.log(alert)
    } catch (error) {
      console.error("Error al obtener las alertas:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor");
      } else {
        console.error("Error al procesar la solicitud");
      }
    }
  };

  useEffect(() => {
    getAlerts();
  }, []);

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItemContainer}>
      <Text style={styles.groupItemTitle}>{item.groupName}</Text>
      <Text>Total Miembros: {item.members}</Text>
      <Text>Admins: {item.admins.join(", ")}</Text>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    const filteredGroups = initialGroups.filter((group) => {
      const nameMatch = group.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const adminMatch = group.admins.includes(searchAdmin);
      return nameMatch && adminMatch;
    });
    setGroups(filteredGroups);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre de grupo"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por admin"
        value={searchAdmin}
        onChangeText={(text) => setSearchAdmin(text)}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
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
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  groupItemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  groupItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default GroupManagementScreen;
