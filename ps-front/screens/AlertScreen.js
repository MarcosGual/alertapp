import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import PanicButton from "./PanicButton";
import "react-native-get-random-values";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../config/firebase";
import colors from "../colors";
import moment from "moment/moment";
import "moment/locale/es";
import { LOCAL_TUNNEL_URL } from "@env";
import { Button, Dialog, Divider, Paragraph, Portal } from "react-native-paper";
import { getGeolocation, randomNumberGenerator } from "../utils/utils";
import { Chip } from "react-native-paper";

const AlertScreen = ({ navigation, route }) => {
  const [filteredAlerts, setFilteredAlerts] = useState();
  const [alerts, setAlerts] = useState([]);
  const [panicTimes, setPanicTimes] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [group, setGroup] = useState(route.params ? route.params.group : null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [location, setLocation] = useState("");
  const [selectedChips, setSelectedChips] = useState([
    "alta",
    "media",
    "baja",
    "info",
  ]);
  let { neighbor } = route.params || null;
  const user = auth.currentUser;
  // if (route.params) { setGroup(route.params) };
  moment.locale("es");

  const handleChipPress = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(
        selectedChips.filter((selectedChip) => selectedChip !== chip)
      );
      setFilteredAlerts((prev) => {
        switch (chip) {
          case "alta":
            return prev.filter((alert) => alert.level[0] !== 1);
          case "media":
            return prev.filter((alert) => alert.level[0] !== 2);
          case "baja":
            return prev.filter((alert) => alert.level[0] !== 3);
          case "info":
            return prev.filter((alert) => alert.level[0] !== 4);
          default:
            return alerts;
        }
      });
    } else {
      setSelectedChips([...selectedChips, chip]);
      setFilteredAlerts((prev) => {
        switch (chip) {
          case "alta":
            return [
              ...prev,
              ...alerts.filter((alert) => alert.level[0] === 1),
            ].sort((a, b) => b.date.localeCompare(a.date));
          case "media":
            return [
              ...prev,
              ...alerts.filter((alert) => alert.level[0] === 2),
            ].sort((a, b) => b.date.localeCompare(a.date));
          case "baja":
            return [
              ...prev,
              ...alerts.filter((alert) => alert.level[0] === 3),
            ].sort((a, b) => b.date.localeCompare(a.date));
          case "info":
            return [
              ...prev,
              ...alerts.filter((alert) => alert.level[0] === 4),
            ].sort((a, b) => b.date.localeCompare(a.date));
          default:
            return alerts;
        }
      });
    }
  };

  const getAlerts = async () => {
    try {
      console.log(group._id);
      const response = await axios.get(
        `${LOCAL_TUNNEL_URL}/alerts/group/` + group._id
      );
      const alertasOrdenadas = response.data.sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      setAlerts(alertasOrdenadas);
      setFilteredAlerts(alertasOrdenadas);
      // console.log(alert)
    } catch (error) {
      console.error("Error al obtener las alertas:", error);
      Alert.alert("Error obteniendo las alertas...");
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
    let intervalId;

    if (panicTimes >= 3) {
      setDialogVisible(true);
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [panicTimes]);

  const cancelPanicAlert = async () => {
    setCountdown(10);
    setPanicTimes(0);
    setDialogVisible(false);
  };

  useEffect(() => {
    if (countdown > 0) {
      const vibrationInterval = setInterval(() => {
        Vibration.vibrate(100);
      }, 1000);

      return () => clearInterval(vibrationInterval);
    }
  }, [countdown]);

  useFocusEffect(
    useCallback(() => {
      // console.log("Focus in... ", route.params ? route.params.group : null);
      if (route.params) {
        setGroup(route.params.group);
        getAlerts();
      }
      return () => {
        console.log("Focus out");
      };
    }, [])
  );

  const navigateToThread = (threadId) => {
    const selectedThread = filteredAlerts.find((thread) => thread._id === threadId);
    // console.log(selectedThread);
    if (selectedThread) {
      navigation.navigate("AlertThread", { thread: selectedThread, neighbor });
    }
  };

  const alertLevelRenderSwitch = (level) => {
    switch (level[0]) {
      case 1:
        return <Ionicons name="alert-circle" size={18} color="#da1e28" />;
      case 2:
        return <Ionicons name="alert-circle" size={18} color="#ff832b" />;
      case 3:
        return <Ionicons name="alert-circle" size={18} color="#f1c21b" />;
      case 4:
        return <Ionicons name="alert-circle" size={18} color="#24a141" />;
      default:
        return <Ionicons name="alert-circle" size={18} color="#000" />;
    }
  };

  const ajustarHorarioArgentino = (fecha) => {
    const horarioArgentino = new Date(fecha);
    horarioArgentino.setMinutes(horarioArgentino.getMinutes() - 1);
    return horarioArgentino;
  };

  const handlePanicButtonPress = async () => {
    setPanicTimes((prev) => ++prev);

    if (panicTimes < 3) return;

    await sendPanicAlert();
    cancelPanicAlert();
  };

  const sendPanicAlert = async () => {
    let data;
    try {
      const geolocation = await getGeolocation();
      setLocation(geolocation);
      const newAlert = {
        title: "Alerta de Pánico",
        description: "Botón de emergencia disparado!",
        level: 1,
        location: "n/a",
        geolocation: location.coords || null,
        messages: [],
        group: [`${group._id}`],
      };
      // console.log(newAlert);
      const { data } = await axios.post(
        "https://mock-server.loca.lt/alerts",
        newAlert
      );

      cancelPanicAlert();
      Alert.alert("Alerta de Pánico Enviada.");

      if (!data) {
        const randomNumber = randomNumberGenerator();
        setAlert((prevAlerts) => [
          { ...newAlert, _id: randomNumber },
          ...prevAlerts,
        ]);
      } else {
        setAlert((prevAlerts) => [
          { ...newAlert, _id: data._id },
          ...prevAlerts,
        ]);
      }
    } catch (error) {
      console.log("error al enviar alerta - " + error.message);
    }
  };

  if (group === null) {
    return (
      <Text style={styles.warningText}>Por favor, seleccione un grupo.</Text>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Divider /> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Chip
          icon="alert"
          selected={selectedChips.includes("alta")}
          onPress={() => handleChipPress("alta")}
          style={{
            backgroundColor: selectedChips.includes("alta")
              ? "#f86f6f"
              : "#f0c1c1",
          }}
        >
          Alta
        </Chip>
        <Chip
          icon="alert"
          selected={selectedChips.includes("media")}
          onPress={() => handleChipPress("media")}
          style={{
            backgroundColor: selectedChips.includes("media")
              ? "#f8b05f"
              : "#f2d8c6",
          }}
        >
          Media
        </Chip>
        <Chip
          icon="alert"
          selected={selectedChips.includes("baja")}
          onPress={() => handleChipPress("baja")}
          style={{
            backgroundColor: selectedChips.includes("baja")
              ? "#ff9f43"
              : "#f7e1c2",
          }}
        >
          Baja
        </Chip>
        <Chip
          icon="information"
          selected={selectedChips.includes("info")}
          onPress={() => handleChipPress("info")}
          style={{
            backgroundColor: selectedChips.includes("info")
              ? "#5fba7d"
              : "#a7d7c5",
          }}
        >
          Información
        </Chip>
      </View>
      <ScrollView>
        {filteredAlerts ? (
          filteredAlerts.map((thread, index) => (
            <TouchableOpacity
              key={thread._id}
              style={[
                styles.threadContainer,
                thread.authorUid === user.uid ? styles.ownAlertContainer : null,
              ]}
              onPress={() => navigateToThread(thread._id)}
            >
              <Text
                style={[
                  styles.threadTitle,
                  thread.authorUid === user.uid ? styles.ownAlertTitle : null,
                ]}
              >
                {alertLevelRenderSwitch(thread.level)} {thread.title}
              </Text>
              <View style={styles.threadDateTime}>
                <Text style={styles.threadDateTimeText}>
                  {moment(
                    ajustarHorarioArgentino(thread.date),
                    "YYYYMMDD"
                  ).fromNow()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Cargando alertas...</Text>
        )}
      </ScrollView>
      <PanicButton onPress={handlePanicButtonPress} panicTimes={panicTimes} />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={cancelPanicAlert}>
          <Dialog.Title>Alerta de Pánico</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{`¡Alerta de pánico activada! La alerta se enviará en ${countdown} segundos.`}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelPanicAlert}>Cancelar</Button>
            <Button onPress={sendPanicAlert}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  threadContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 15,
    marginBottom: 1,
    elevation: 1,
    paddingLeft: 10,
  },
  threadTitle: {
    fontSize: 14,
    flexWrap: "wrap",
  },
  threadDateTime: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // flexWrap: 'wrap',
    alignItems: "center",
    marginTop: 5,
  },
  threadDateTimeText: {
    color: "gray",
    fontSize: 12,
  },
  ownAlertContainer: {
    backgroundColor: colors.lightGray, // Estilo para las alertas propias (amarillo)
  },
  ownAlertTitle: {
    color: "#333", // Estilo para el título de las alertas propias (color oscuro)
    fontWeight: "600",
  },
  warningText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 350,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default AlertScreen;
