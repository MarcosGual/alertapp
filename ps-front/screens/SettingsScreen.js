import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase/app";
import { auth } from "../config/firebase";
import "firebase/firestore";
import colors from "../colors";
import { updateProfile } from "firebase/auth";
import UpdateUserForm from "./UpdateUserForm";
import { Button, Dialog, IconButton, Paragraph, Portal } from "react-native-paper";

const UserProfileForm = () => {
  const [displayName, setDisplayName] = useState("");
  const [visible, setVisible] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const guardarDatosUsuario = () => {
    const user = auth.currentUser;

    if (user) {
      updateProfile(user, {
        displayName: displayName,
        photoURL: photoUrl,
      })
        .then(() => {
          // Actualización exitosa
          console.log("Datos de usuario actualizados");
        })
        .catch((error) => {
          // Error al actualizar
          console.log("Error al actualizar los datos de usuario:", error);
        });

      //   firebase.firestore().collection("usuarios").doc(user.uid).set({
      //     phoneNumber: phoneNumber,
      //   });
    }
  };

  const cerrarSesion = () => {
    auth.signOut();
  };

  const onDismiss = ()=>{
    setVisible(false);
  }

  const onConfirm=()=>{
    setVisible(false);
    cerrarSesion();
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="exit-to-app"
        onPress={()=>setVisible(true)}
        style={styles.icon}
      />
      <UpdateUserForm />
      <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Confirmación</Dialog.Title>
        <Dialog.Content>
          <Paragraph>¿Estás seguro de que quieres cerrar sesión?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={onConfirm}>Confirmar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
      {/* <View>
        <Button
          labelStyle={{ fontSize: 16 }}
          mode="contained"
          onPress={cerrarSesion}
        >
          Cerrar Sesión
        </Button>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  icon:{
    width: 30,
    height: 25,
    alignSelf: 'flex-end'
  }
});

const SettingsScreen = () => {
  return <UserProfileForm />;
};

export default SettingsScreen;
