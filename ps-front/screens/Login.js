import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  SafeAreaView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../config/firebase";
const backImage = require("../assets/ALERTAPP.png");
import colors from "../colors";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
        })
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Ingresar Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingresar Password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          autoFocus={true}
          v
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Ingresar
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
            No tienes una cuenta?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{ color: colors.red, fontWeight: "600", fontSize: 14 }}
            >
              {" "}
              Registrate
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bacgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.dark,
    alignSelf: "center",
    paddingBottom: 24,
  },
  titleTwo: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.dark,
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    color: "grey",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 270,
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: colors.red,
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
});
