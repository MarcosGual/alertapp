import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import MapView, { Heatmap } from "react-native-maps";
import { LOCAL_TUNNEL_URL } from "@env";
import * as Location from "expo-location";
import MapScreen from "./MapScreen";
import { ActivityIndicator } from "react-native-paper";

const HeatmapScreen = ({ alertLocations, setAlertLocations }) => {
  // const [alertLocations, setAlertLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const obtenerUbicacionUsuario = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permiso no garantiado.");
        throw new Error("Permiso de ubicación no otorgado");
      }

      let location = await Location.getCurrentPositionAsync();
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(userLocation);
    } catch (error) {
      console.error("Error al obtener la ubicación del usuario:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación del usuario");
    }
  };

  useEffect(() => {
    obtenerUbicacionUsuario();
    console.log("actualizado", userLocation);
    console.log("alertLocations", alertLocations)
  }, [alertLocations]);

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {alertLocations.length > 0 ? (
        <MapView
          initialRegion={{
            latitude: userLocation ? userLocation.latitude : 0,
            longitude: userLocation ? userLocation.longitude : 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          <Heatmap points={alertLocations} radius={50} opacity={0.6} />
        </MapView>
      ) : (
        <MapScreen
          latitude={userLocation ? userLocation.latitude : 0}
          longitude={userLocation ? userLocation.longitude : 0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  map: {
    flex: 1,
  },
});

export default HeatmapScreen;
