import axios from "axios";
import { LOCAL_TUNNEL_URL } from "@env";

export const fetchNeighbor = async (userUid) => {
  try {
    const { data } = await axios.get(
      LOCAL_TUNNEL_URL + "/neighbors/" + userUid
    );

    return data;
  } catch (error) {
    console.log("Error al obtener usuario - " + error.message);
  }
};

export const fetchGroups = async (userUid) => {
  try {
    const { data } = await axios.get(
      LOCAL_TUNNEL_URL + "/groups/neighbor/" + userUid
    );

    return data;
  } catch (error) {
    console.error("Error al obtener la lista de grupos:", error);
  }
};

export const updateNeighbor = async (id, neighbor) => {
  try {
    await axios.put(LOCAL_TUNNEL_URL + "/neighbors/" + id, neighbor);
    console.log("usuario actualizado");
  } catch (error) {
    console.log("Error al actualizar los datos de usuario:", error);
  }
};

export const addLastLocation = async (id, lastLocation) => {
  try {
    await axios.put(
      LOCAL_TUNNEL_URL + "/neighbors/locations/" + id,
      lastLocation
    );
  } catch (error) {
    console.log("Error al agregar geolocalización - " + error.message);
  }
};
