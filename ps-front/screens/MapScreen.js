import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ latitude, longitude }) => {
  console.log('mapa', latitude, longitude)
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude, 
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421, 
        }}
      >
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }} // Coordenadas del marcador
          title="Marcador de ejemplo" // Título del marcador
          description="Este es un marcador de ejemplo" // Descripción del marcador
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: '100%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    minHeight: 100
  },
});

export default MapScreen;
