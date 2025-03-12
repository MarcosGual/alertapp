import firebase from "firebase/compat/storage";
import "firebase/storage";

// const storageRef = firebase.storage().ref();

export const uploadImage = async (fileName, file) => {
  try {
    const imagenRef = storageRef.child(fileName);
    await imagenRef.put(file);
    console.log("Imagen subida exitosamente.");
  } catch (error) {
    console.error("Error al subir la imagen:", error);
  }
};

export const getImageURL = async (fileName) => {
  try {
    const imagenRef = storageRef.child(fileName);
    const url = await imagenRef.getDownloadURL();
    console.log("URL de la imagen:", url);
    return url;
  } catch (error) {
    console.error("Error al obtener la URL de la imagen:", error);
  }
};
