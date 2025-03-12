import * as Location from "expo-location";

export const getGeolocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const currentLocation = await Location.getCurrentPositionAsync({});
      return currentLocation;
    } else {
      console.log("Permiso de ubicación denegado");
    }
  } catch (error) {
    console.error("Error al obtener la ubicación:", error);
  }
};

export const randomNumberGenerator = () => {
  let numero = "";
  for (let i = 0; i < 4; i++) {
    numero += Math.floor(Math.random() * 10); // Agrega un dígito aleatorio entre 0 y 9
  }
  return numero;
};

export const getMonthName = (monthNumber) => {
  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  return months[monthNumber - 1] || "dic";
};

export const convertSeverity = (severityNumber) => {
  const severityMap = {
    1: "alta",
    2: "media",
    3: "baja",
    4: "información",
  };

  return severityMap[severityNumber] || "";
};
