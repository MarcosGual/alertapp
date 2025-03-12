import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../colors";
import { createStackNavigator } from "@react-navigation/stack";
import CreateGroupScreen from "./CreateGroup";
import AlertScreen from "./AlertScreen";
import { useFocusEffect } from "@react-navigation/native";
import AlertThreadScreen from "./AlertThread";
import SearchButton from "./SearchButton";
import SearchGroupScreen from "./SearchGroupScreen";
import { updateProfile } from "firebase/auth";
import { addLastLocation, fetchGroups, fetchNeighbor } from "../utils/api";
import { Avatar, IconButton, Text } from "react-native-paper";
import ProfileCard from "./ProfileCardScreen";
import { Image } from "react-native";
import { auth } from "../config/firebase";
import { getGeolocation } from "../utils/utils";
import FAQs from "./FAQ";

const GroupStack = createStackNavigator();

function GroupStackScreen() {
  return (
    <GroupStack.Navigator independent="true">
      <GroupStack.Screen
        name="Select"
        component={SelectGroupScreen}
        options={{
          title: "Inicio",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <GroupStack.Screen
        name="AddGroup"
        component={CreateGroupScreen}
        options={{
          title: "Administración de Grupos",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <GroupStack.Screen
        name="Alerts"
        component={AlertScreen}
        options={{
          title: "Lista de Alertas",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <GroupStack.Screen
        name="AlertThread"
        component={AlertThreadScreen}
        options={{
          title: "Alerta",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <GroupStack.Screen
        name="SearchGroup"
        component={SearchGroupScreen}
        options={{
          title: "Buscar Grupo",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <GroupStack.Screen
      name="FAQ"
      component={FAQs}
      options={{
        title: "FAQ",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }} />
    </GroupStack.Navigator>
  );
}

const SelectGroupScreen = ({ navigation }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [groups, setGroups] = useState([]);
  const [neighbor, setNeighbor] = useState({ adminOfGroups: [] });
  const [imageUrl, setImageUrl] = useState("");
  const scaleValue = new Animated.Value(1);

  const fetchData = async () => {
    try {
      const fetchedNeighbor = await fetchNeighbor(auth.currentUser.uid);
      setNeighbor(fetchedNeighbor);
      setImageUrl(fetchedNeighbor.imageUrl);
      const fetchedGroups = await fetchGroups(auth.currentUser.uid);
      setGroups(fetchedGroups);
      const { coords } = await getGeolocation();
      //console.log(coords);
      if (coords) {
        await addLastLocation(auth.currentUser.uid, { lastLocation: coords });
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      console.log("nombre display", auth.currentUser.displayName);
      // console.log(neighbor.imageUrl)
      if (!auth.currentUser.displayName) {
        updateProfile(auth.currentUser, {
          displayName: neighbor.name,
        })
          .then(() => {
            console.log("Datos de usuario actualizados");
          })
          .catch((error) => {
            console.log("Error al actualizar los datos de usuario:", error);
          });
      }
    }, [])
  );

  const handleSearchGroup = () => {
    navigation.navigate("SearchGroup");
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate("Alerts", { group, neighbor });
  };

  const handleCreateGroup = () => {
    navigation.navigate("AddGroup", { group: null, neighbor: neighbor });
  };

  const handleEditGroup = (group) => {
    navigation.navigate("AddGroup", { group, neighbor: neighbor });
  };

  const filteredGroups = groups
    ? groups.filter((group) =>
        group.groupName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  if (!groups) {
    return <View style={styles.container}></View>;
  }

  return (
    <View style={styles.container}>
      {imageUrl && (
        <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Avatar.Image
            userName={neighbor.name}
            source={
              imageUrl ? {uri:imageUrl} : require("../assets/defaultavatar.png")
            }
          />
        </View>
      )}
      <View style={{flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
      <Text variant="titleLarge">Mis Grupos</Text>
      <IconButton
        icon="help-circle-outline"
        onPress={()=>navigation.navigate('FAQ')}
        style={styles.icon}
      />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar grupo..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          onPress={() => setSearchText("")}
          style={styles.clearButton}
        >
          <Icon name="times" size={18} color="#666666" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleGroupSelect(item)}
          >
            <View
              style={[
                styles.groupItem,
                item === selectedGroup && styles.selectedGroup,
              ]}
            >
              <Text style={styles.groupName}>{item.groupName}</Text>
              <View style={{ flexDirection: "row", gap: 30 }}>
                {neighbor.adminOfGroups.includes(item._id) && (
                  <Icon
                    name="pencil"
                    size={18}
                    color="#666666"
                    onPress={() => handleEditGroup(item)}
                  />
                )}
                <Icon name="chevron-right" size={18} color="#666666" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity onPress={() => handleCreateGroup()}>
        <View style={styles.buttonContainer}>
          <Text style={[styles.buttonText]}>Crear Grupo</Text>
        </View>
      </TouchableOpacity>
      <SearchButton onPress={handleSearchGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 10,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.lightViolet,
    borderRadius: 5,
    marginBottom: 15,
    elevation: 5,
    borderRadius: 10,
  },
  selectedGroup: {
    color: "#ffffff",
    elevation: 0,
  },
  groupName: {
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: colors.darkViolet, // Color de fondo del botón
    borderRadius: 8, // Bordes redondeados
    paddingVertical: 12, // Espacio vertical dentro del botón
    paddingHorizontal: 16, // Espacio horizontal dentro del botón
    alignItems: "center", // Centra el contenido horizontalmente
    justifyContent: "center", // Centra el contenido verticalmente
  },
  buttonText: {
    color: "#FFFFFF", // Color del texto del botón
    fontSize: 16, // Tamaño del texto
    fontWeight: "bold", // Peso del texto
  },
});

export default GroupStackScreen;
