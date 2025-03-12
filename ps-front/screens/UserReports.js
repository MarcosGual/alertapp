import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import HeatmapScreen from "./HeatMapScreen";
import { LOCAL_TUNNEL_URL } from "@env";
import axios from "axios";
import ChartScreen from "./ChartScreen";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "../config/firebase";

const UserReports = () => {
  const [selectedInterval, setSelectedInterval] = useState("all");
  const [alertLocations, setAlertLocations] = useState([]);
  const [openTimeOptions, setOpenTimeOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFilter();
  }, [, selectedInterval]);

  const handleFilter = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${LOCAL_TUNNEL_URL}/alerts/locations?interval=${selectedInterval}`
      );

      if (response.data.length > 0) {
        const invalidLocationsFiltered = response.data.filter(
          (alerta) =>
            alerta.geolocation.latitude && alerta.geolocation.longitude
        );

        const locations = invalidLocationsFiltered.map((alerta) => {
          return {
            latitude: alerta.geolocation.latitude,
            longitude: alerta.geolocation.longitude,
          };
        });

        setAlertLocations(locations);
      } else {
        setAlertLocations([]);
      }
    } catch (error) {
      console.error("Error al filtrar alertas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleToggleSection = (sectionKey) => {
  //   if (expandedSection === sectionKey) {
  //     setExpandedSection(null);
  //   } else {
  //     setExpandedSection(sectionKey);
  //   }
  // };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {auth.currentUser.email !== "alertapp.admin@gmail.com" && (
        <Text style={styles.topTitle}>Panel de Información</Text>
      )}
      <Text style={styles.title}>Zonas Más Peligrosas</Text>
      <View style={styles.containerRadio}>
        <Text
          style={{ fontSize: 16 }}
          onPress={() => setOpenTimeOptions(!openTimeOptions)}
        >
          {openTimeOptions ? "▼" : "►"} Seleccione un intervalo de tiempo
        </Text>
        <View style={{ display: openTimeOptions ? null : "none" }}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedInterval === "lastMonth" && styles.selected,
            ]}
            onPress={() => setSelectedInterval("lastMonth")}
          >
            <Text>Último mes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedInterval === "lastYear" && styles.selected,
            ]}
            onPress={() => setSelectedInterval("lastYear")}
          >
            <Text>Último año</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selectedInterval === "all" && styles.selected,
            ]}
            onPress={() => setSelectedInterval("all")}
          >
            <Text>Todas las alertas</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ minHeight: 300 }}>
        <HeatmapScreen
          alertLocations={alertLocations}
          setAlertLocations={setAlertLocations}
        />
      </View>
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.title}>Tendencias de Alertas (por nivel)</Text>
        <ChartScreen />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#ffffff",
  },
  containerRadio: {
    padding: 10,
  },
  topTitle: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    fontWeight: "bold",
  },
  reportContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  reportHeader: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
    marginBottom: 5,
  },
  reportContent: {
    padding: 16,
    backgroundColor: "#fff",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoKey: {
    fontWeight: "bold",
    color: "#555",
  },
  infoValue: {
    color: "#333",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  selected: {
    backgroundColor: "lightblue",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
});

export default UserReports;
