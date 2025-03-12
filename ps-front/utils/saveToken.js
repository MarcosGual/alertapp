import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LOCAL_TUNNEL_URL } from "@env";
import { auth } from "../config/firebase";

export const saveToken = async (expoPushToken) => {
  if (expoPushToken) {
    try {
      const existingTokensJSON = await AsyncStorage.getItem("firebaseTokens");
      const existingTokens = existingTokensJSON
        ? JSON.parse(existingTokensJSON)
        : [];

      for (let existingToken of existingTokens) {
        if (existingToken.data === expoPushToken.data) {
          console.log("El token push ya está guardado");
          return;
        }
      }

      try {
        await axios.put(
          `${LOCAL_TUNNEL_URL}/neighbors/token/${auth.currentUser.uid}`,
          {
            deviceToken: expoPushToken,
          }
        );
      } catch (error) {
        console.log(error.message);
      }

      const updatedTokens = [...existingTokens, expoPushToken];
      await AsyncStorage.setItem(
        "firebaseTokens",
        JSON.stringify(updatedTokens)
      );
      console.log("Token guardado exitosamente");
    } catch (error) {
      console.log("error al guardar el token - " + error.message);
    }
  } else {
    console.log("Token expo no encontrado.");
  }
};
