import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import "react-native-get-random-values";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { auth } from "../config/firebase";
import moment from "moment/moment";
import "moment/locale/es";
import { ScrollView } from "react-native-gesture-handler";
import { LOCAL_TUNNEL_URL } from "@env";
import MapScreen from "./MapScreen";
import colors from "../colors";
import { ActivityIndicator, Avatar } from "react-native-paper";

const AlertThreadScreen = ({ route, navigation }) => {
  let { thread, neighbor } = route.params;
  let [messages, setMessages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  moment.locale("es");

  const getMessages = async () => {
    try {
      setMessages([]);

      const response = await axios.get(
        `${LOCAL_TUNNEL_URL}/alerts/${thread._id}/messages`
      );
      const { data } = response;
      // console.log(data, "datos");
      setMessages(data);
      loadNeighbors();
    } catch (error) {
      console.error("Error al obtener las alertas:", error);
    }
  };

  const getMessagesWithNeighborInfo = async () => {
    try {
      let neighborsUids = [];

      if (messages) {
        if (messages.length > 0) {
          for (let message of messages) {
            if (!neighborsUids.includes(message.authorUid)) {
              neighborsUids.push(message.authorUid);
            }
          }
        }
      }

      const { data } = await axios.post(
        LOCAL_TUNNEL_URL + `/neighbors/array/`,
        { uidsArray: neighborsUids }
      );

      if (messages.length > 0 && data.length > 0) {
        let messagesWithNeighborInfo = [];

        for (let i = 0; i < messages.length; i++) {
          for (let j = 0; j < data.length; j++) {
            messagesWithNeighborInfo.push({
              ...messages[i],
              neighbor: data[j],
            });
          }
        }
        // console.log(messagesWithNeighborInfo)
        if (messagesWithNeighborInfo.length > 0) {
          // console.log(messagesWithNeighborInfo)
          return messagesWithNeighborInfo;
        } else {
          // return messages;
        }
      }
    } catch (error) {
      console.log("error al obtener info de vecinos - " + error.message);
    }
  };

  const loadNeighbors = async () => {
    const messagesWithInfo = await getMessagesWithNeighborInfo();

    if (messagesWithInfo) {
      if (messagesWithInfo.length > 0) {
        console.log(messagesWithInfo);
        setMessages(messagesWithInfo);
      }
    }
    // console.log(messages)
  };

  useFocusEffect(
    useCallback(() => {
      console.log(auth.currentUser.displayName || neighbor.name);
      getMessages();
      setImageUrl(thread.imageUrl);
    }, [])
  );

  const [newMessage, setNewMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [editedMessageIndex, setEditedMessageIndex] = useState(null);

  const addMessage = async () => {
    if (newMessage.trim() !== "") {
      const message = {
        content: newMessage,
        authorUid: auth.currentUser.uid,
        alertId: thread._id,
        authorName: auth.currentUser.displayName || neighbor.name,
      };
      setMessages((prevState) => [...prevState, message]);

      try {
        await axios.post(
          `${LOCAL_TUNNEL_URL}/alerts/${thread._id}/messages`,
          message
        );
        getMessages();
        setNewMessage("");
      } catch (error) {
        console.log(
          "error al agregar el msj a la base de datos - " + error.message
        );
      }
    }
  };

  const editMessage = async () => {
    if (editedMessage.trim() && editedMessageIndex) {
      try {
        await axios.put(
          `${LOCAL_TUNNEL_URL}/alerts/${thread._id}/messages/${editedMessageIndex}`,
          { newContent: editedMessage }
        );
        getMessages();
        setNewMessage("");
      } catch (error) {
        console.log(
          "error al agregar el msj a la base de datos - " + error.message
        );
      }

      setEditedMessage("");
      setEditedMessageIndex(null);
    }
  };

  const prompt = (title, msg) => {
    return new Promise((resolve, reject) => {
      Alert.alert(title, msg, [
        {
          text: "Cancel",
          onPress: () => resolve(false),
          style: "cancel",
        },
        { text: "OK", onPress: () => resolve(true) },
      ]);
    });
  };

  const deleteMessage = async (index, id) => {
    const confirmation = await prompt(
      "Confirmación",
      "Desea eliminar este mensaje?"
    );

    if (confirmation) {
      let updatedMessages = [...messages];
      updatedMessages.splice(index, 1);
      // console.log(updatedMessages);
      setMessages(updatedMessages);

      try {
        await axios.delete(
          `${LOCAL_TUNNEL_URL}/alerts/${thread._id}/messages/${id}`
        );
        Alert.alert("Mensaje eliminado");
        getMessages();
      } catch (error) {
        console.log("Error al borrar mensaje - " + error.message);
      }
    }
  };

  if (!thread) {
    return <Text>No hay alerta seleccionada...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.threadTitle}>{thread.title}</Text>
        <Text style={styles.threadParagraph}>{thread.description}</Text>
        {thread.title === "Alerta de Pánico" && (
          <Text
            style={styles.threadParagraph}
          >{`Emitida por el vecino ${neighbor.name}.`}</Text>
        )}
        {thread.createdAt ? (
          <Text style={styles.threadParagraph}>
            Fecha y hora: {moment(thread.createdAt).format("LLLL")}
          </Text>
        ) : null}
        <Text style={styles.threadParagraph}>
          Lugar: {thread.location ? thread.location : "Sin lugar determinado"}
        </Text>
        {imageUrl && (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center'}}>Imagen</Text>
            <Image
            style={{
              width: 200,
              height: 200,
            }}
              source={{ uri: imageUrl }}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
        )}
        {thread.geolocation && (
          <View
            style={{
              minHeight: showMap ? 250 : 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={[styles.mapButton]}
              onPress={() => setShowMap(!showMap)}
            >
              <Text style={{ color: "white" }}>
                {showMap ? "Ocultar Mapa" : "Mostrar Mapa"}
              </Text>
            </TouchableOpacity>
            {showMap ? (
              <MapScreen
                latitude={thread.geolocation.latitude}
                longitude={thread.geolocation.longitude}
              />
            ) : null}
          </View>
        )}

        {messages ? (
          <View style={styles.messagesContainer}>
            <Text style={styles.heading}>{messages?.length} respuestas</Text>
            {messages.map((message, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  marginBottom: 10,
                  borderRadius: 8,
                }}
              >
                <View style={styles.messageHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: -20,
                    }}
                  >
                    {message.neighbor && (
                      <Avatar.Image
                        source={
                          !message.neighbor.imageUrl
                            ? require("../assets/defaultavatar.png")
                            : { uri: message.neighbor.imageUrl }
                        }
                        size={25}
                      />
                    )}
                    <Text
                      style={[
                        styles.messageUser,
                        message.authorUid === auth.currentUser.uid
                          ? { fontWeight: "bold" }
                          : null,
                        { marginLeft: 5 },
                      ]}
                    >
                      {message.authorUid === auth.currentUser.uid
                        ? "Yo"
                        : message.authorName}
                    </Text>
                  </View>
                  <Text style={styles.messageDate}>
                    {message.lastModifiedAt
                      ? `${moment(message.datetime).fromNow()}`
                      : new Date().toLocaleString()}
                  </Text>
                </View>
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{message.content}</Text>
                  {message.authorUid === auth.currentUser.uid && (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setEditedMessage(message.content);
                        setEditedMessageIndex(message._id);
                      }}
                    >
                      <Ionicons name="md-create" size={14} color="#000" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteMessage(index, message._id)}
                  >
                    <Ionicons name="md-trash" size={14} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>Cargando mensajes...</Text>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva Respuesta"
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addMessage}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      {editedMessageIndex !== null && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Editar mensaje"
            value={editedMessage}
            onChangeText={(text) => setEditedMessage(text)}
          />
          <TouchableOpacity style={styles.editButton} onPress={editMessage}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // margin: 5,
  },
  threadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scroll: {
    marginBottom: 30,
  },
  threadParagraph: {
    fontSize: 14,
    paddingBottom: 12,
  },
  messagesContainer: {
    borderTopStartRadius: 2,
    borderBottomEndRadius: 0,
    padding: 10,
    // backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: colors.lightViolet,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: -5,
    borderRadius: 8,
    padding: 10,
    marginLeft: 0,
  },
  messageHeader: {
    paddingLeft: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageUser: {
    color: "grey",
    fontSize: 12,
  },
  messageDate: {
    color: "grey",
    fontSize: 12,
    paddingRight: 10,
    alignSelf: "center",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    // backgroundColor: "#fff",
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#e6e6e6",
    borderRadius: 4,
    marginRight: 10,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffcccc",
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    paddingTop: 0,
    paddingBottom: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 0,
    marginRight: 0,
    paddingLeft: 8,
  },
  addButton: {
    backgroundColor: "#e6e6e6",
    borderRadius: 0,
    padding: 12,
    marginRight: 0,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  mapButton: {
    backgroundColor: colors.red,
    height: 30,
    width: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AlertThreadScreen;
