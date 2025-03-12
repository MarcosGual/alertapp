import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Avatar,
  Checkbox,
  FAB,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import colors from "../colors";
import { StyleSheet } from "react-native";
import axios from "axios";
import { LOCAL_TUNNEL_URL } from "@env";
import { auth, uploadToFirebase } from "../config/firebase";
// import firebase from "../config/firebase";

const userInitialState = {
  _id: "",
  username: "",
  name: "",
  phone: "",
  city: "",
  country: "",
  imageUrl: "",
  notificationPreferences: {
    securityAlerts: "",
    proximityAlerts: "",
  },
};

const UpdateUserForm = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(userInitialState);

  const getNeighbor = async () => {
    try {
      const { data } = await axios.get(
        `${LOCAL_TUNNEL_URL}/neighbors/${auth.currentUser.uid}`
      );
      // console.log(data);
      setUser({ ...data });
      setImage(data.imageUrl);
      // console.log(user);
    } catch (error) {
      console.log("error al obtener vecino - " + error.message);
    }
  };

  const updateNeighbor = async (imageUrl) => {
    try {
      await axios.put(`${LOCAL_TUNNEL_URL}/neighbors/${user._id}`, {
        ...user,
        imageUrl: imageUrl ? imageUrl : image,
      });
      console.log("vecino actualizado");
    } catch (error) {
      console.log("error al actualizar vecino - " + error.message);
    }
  };

  useEffect(() => {
    getNeighbor();

    return () => {
      setUser(user);
    };
  }, []);

  const saveImage = async () => {
    const fbResponse = await selectImage();
    setImage(fbResponse.downloadUrl);
    setUser({ ...user, imageUrl: fbResponse.downloadUrl });
    updateNeighbor(fbResponse.downloadUrl);
  };

  const selectImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se necesita permiso para acceder a la galería de imágenes.");
        return;
      }
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!resultado.canceled) {
      const fileName = `profilePic_${
        auth.currentUser.displayName
      }_${resultado.assets[0].uri.substring(image.lastIndexOf(".") + 1)}`;

      try {
        const fbResponse = await uploadToFirebase(
          resultado.assets[0].uri,
          fileName,
          (v) => console.log(v)
        );
        return fbResponse;
      } catch (error) {
        console.log("error al subir imagen - " + error);
      }
    }
  };

  const handleUpdateUserInfo = async () => {
    await updateNeighbor();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View style={{ padding: 20 }}>
        <Text variant="titleLarge">Actualizar Usuario</Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Avatar.Image
            size={80}
            source={
              user.imageUrl
                ? { uri: user.imageUrl }
                : require("../assets/defaultavatar.png")
            }
          />
          <FAB
            size="small"
            icon="pencil"
            color="white"
            style={{
              position: "absolute",
              bottom: 0,
              right: 120,
              backgroundColor: "#354d77",
            }}
            onPress={() => saveImage()}
          />
        </View>
        <TextInput
          label="Nombre de usuario"
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Teléfono"
          value={user.phone.toString()}
          onChangeText={(text) => setUser({ ...user, phone: text })}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Ciudad"
          value={user.city}
          onChangeText={(text) => setUser({ ...user, city: text })}
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="País"
          value={user.country}
          onChangeText={(text) => setUser({ ...user, country: text })}
          style={{ marginBottom: 20 }}
        />
        <Checkbox.Item
          label="Alerta por Cercanía"
          status={
            user.notificationPreferences.proximityAlerts
              ? "checked"
              : "unchecked"
          }
          onPress={() =>
            setUser({
              ...user,
              notificationPreferences: {
                ...user.notificationPreferences,
                proximityAlerts: !user.notificationPreferences.proximityAlerts,
              },
            })
          }
        />
        <View style={styles.checkboxContainer}>
          <Text variant="titleMedium">Otras Notificaciones de Seguridad</Text>
          <View style={{ flexDirection: "column" }}>
            <Checkbox.Item
              label="Alta"
              status={
                user.notificationPreferences.securityAlerts["1"]
                  ? "checked"
                  : "unchecked"
              }
              onPress={() =>
                setUser({
                  ...user,
                  notificationPreferences: {
                    ...user.notificationPreferences,
                    securityAlerts: {
                      ...user.notificationPreferences.securityAlerts,
                      1: !user.notificationPreferences.securityAlerts["1"],
                    },
                  },
                })
              }
            />
            <Checkbox.Item
              label="Media"
              status={
                user.notificationPreferences.securityAlerts["2"]
                  ? "checked"
                  : "unchecked"
              }
              onPress={() =>
                setUser({
                  ...user,
                  notificationPreferences: {
                    ...user.notificationPreferences,
                    securityAlerts: {
                      ...user.notificationPreferences.securityAlerts,
                      2: !user.notificationPreferences.securityAlerts["2"],
                    },
                  },
                })
              }
            />
            <Checkbox.Item
              label="Baja"
              status={
                user.notificationPreferences.securityAlerts["3"]
                  ? "checked"
                  : "unchecked"
              }
              onPress={() =>
                setUser({
                  ...user,
                  notificationPreferences: {
                    ...user.notificationPreferences,
                    securityAlerts: {
                      ...user.notificationPreferences.securityAlerts,
                      3: !user.notificationPreferences.securityAlerts["3"],
                    },
                  },
                })
              }
            />
            <Checkbox.Item
              label="Información"
              status={
                user.notificationPreferences.securityAlerts["4"]
                  ? "checked"
                  : "unchecked"
              }
              onPress={() =>
                setUser({
                  ...user,
                  notificationPreferences: {
                    ...user.notificationPreferences,
                    securityAlerts: {
                      ...user.notificationPreferences.securityAlerts,
                      4: !user.notificationPreferences.securityAlerts["4"],
                    },
                  },
                })
              }
            />
          </View>
        </View>

        <Button
          labelStyle={{ fontSize: 16 }}
          mode="contained"
          onPress={handleUpdateUserInfo}
        >
          Actualizar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  checkboxContainer: {
    alignSelf: "stretch",
  },
});

export default UpdateUserForm;
