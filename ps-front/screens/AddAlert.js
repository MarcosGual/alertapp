import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import axios from "axios";
import colors from "../colors.js";
import format from "date-fns-tz/format";
import es from "date-fns/locale/es";
import { Checkbox, IconButton } from "react-native-paper";
import { auth, uploadToFirebase } from "../config/firebase.js";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
// import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native-elements";

const AddAlertScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alertLevel, setAlertLevel] = useState("");
  const [location, setLocation] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [isThereGeo, setIsThereGeo] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [photoUri, setPhotoUri] = useState(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      console.log(result.assets);

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("error al adjuntar imagen - " + error.message);
      Alert.alert("Error al adjuntar imagen");
    }
  };

  const deleteImage = () => {
    setPhotoUri(null);
  };

  const saveImageToFirebase = async () => {
    const fileName = `alertPic_${
      auth.currentUser.displayName
    }_${photoUri.substring(photoUri.lastIndexOf("/") + 1)}`;

    try {
      const fbResponse = await uploadToFirebase(
        photoUri,
        fileName,
        (v) => console.log(v)
      );
      return fbResponse;
    } catch (error) {
      console.log("error al subir imagen - " + error);
      return null;
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        "https://mock-server.loca.lt/groups/neighbor/" + auth.currentUser.uid
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de grupos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (groups.length === 0) fetchGroups();
      return () => resetForm();
    }, [])
  );

  const handleSubmit = async () => {
    if (title.trim() === "") {
      Alert.alert("Error", "Ingrese el título de la alerta");
      return;
    }

    if (description.trim() === "") {
      Alert.alert("Error", "Ingrese la descripción de la alerta");
      return;
    }

    if (alertLevel.trim() === "") {
      Alert.alert("Error", "Ingrese el grado de alerta");
      return;
    }

    if (!selectedGroups) {
      Alert.alert("Error", "Seleccione al menos un grupo");
    }

    const { downloadUrl } = await saveImageToFirebase();
    const level = Number(alertLevel);

    if (!downloadUrl) {
      Alert.alert("Error al subir la imagen");
      return;
    }

    console.log(downloadUrl)

    const newAlert = {
      title: title,
      description: description,
      level: level,
      location: location,
      geolocation: geoLocation,
      imageUrl: downloadUrl,
      messages: [],
      group: selectedGroups,
    };
    try {
      await axios.post("https://mock-server.loca.lt/alerts", newAlert);
      Alert.alert("Alerta enviada exitosamente!");
      resetForm();
      navigation.navigate("Inicio");
    } catch (error) {
      console.log(error.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAlertLevel("");
    setLocation("");
    setGeoLocation("");
    setSelectedGroups([]);
    setIsThereGeo(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      console.log("agregando geolocalización");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Error",
          "Se requiere permiso para acceder a la ubicación del dispositivo"
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      setGeoLocation(coords);
      console.log(coords);
      if (coords) {
        setIsThereGeo(true);
      }
    } catch (error) {
      console.log("Error al obtener la ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación del dispositivo");
    }
  };

  const toggleSelectedGroup = (grupoId) => {
    if (selectedGroups.includes(grupoId)) {
      setSelectedGroups(selectedGroups.filter((id) => id != grupoId));
    } else {
      setSelectedGroups([...selectedGroups, grupoId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nueva Alerta</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ingrese el título de la alerta"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ingrese la descripción de la alerta"
        multiline
      />

      <Text style={styles.label}>Grado de Alerta</Text>
      <Picker
        style={styles.picker}
        selectedValue={alertLevel}
        onValueChange={(itemValue) =>
          itemValue != 0 ? setAlertLevel(itemValue) : null
        }
      >
        <Picker.Item label="Seleccione un valor..." value="0" />
        <Picker.Item label="Alta" value="1" />
        <Picker.Item label="Media" value="2" />
        <Picker.Item label="Baja" value="3" />
        <Picker.Item label="Información" value="4" />
      </Picker>

      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ingrese la ubicación del hecho"
      />

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleGetCurrentLocation}
      >
        <Text style={styles.locationButtonText}>Agregar Geolocalización</Text>
      </TouchableOpacity>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Checkbox.Android
          color={colors.red} // Cambia el color del checkbox cuando está seleccionado
          status={isThereGeo ? "checked" : "unchecked"}
        />
        <Text style={styles.checkboxLabel}>Geolocalización agregada</Text>
      </View>
      <Text style={[styles.label, { marginTop: -15 }]}>Imagen</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: -8,
        }}
      >
        {/* Botón para seleccionar una imagen */}
        {!photoUri ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton icon="camera" onPress={pickImage} />
            <Text style={styles.checkboxLabel}>Agregar imagen</Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "flex-start",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: photoUri }}
              style={{ width: 150, height: 150 }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton icon="cancel" onPress={deleteImage} />
              <Text style={styles.checkboxLabel}>Borrar imagen</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.header}>Grupos:</Text>
      {groups.map((grupo) => (
        <View key={grupo._id} style={styles.checkboxContainer}>
          <Checkbox
            value={selectedGroups.includes(grupo._id)}
            onPress={() => toggleSelectedGroup(grupo._id)}
            status={
              selectedGroups.includes(grupo._id) ? "checked" : "unchecked"
            }
            color={colors.red}
          />
          <Text style={styles.checkboxLabel}>{grupo.groupName}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar Alerta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: colors.darkViolet,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 25,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxMark: {
    width: 10,
    height: 10,
    backgroundColor: "#333",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default AddAlertScreen;
