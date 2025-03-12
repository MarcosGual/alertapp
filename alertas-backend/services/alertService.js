const {Alert} = require("../models/Alert");

async function getAlertGroups(alertId) {
  try {
    const alerta = await Alert.findById(alertId);
    if (!alerta) {
      throw new Error("Alerta no encontrada");
    }
    return alerta.grupos;
  } catch (error) {
    console.error("Error al obtener los grupos de la alerta:", error);
    throw error;
  }
}

async function getAlertById(alertId) {
  try {
    // console.log(alertId)
    const alerta = await Alert.findById(alertId);
    // console.log(alerta)
    return alerta;
  } catch (error) {
    throw new Error("Error al obtener la alerta:", error);
  }
}

module.exports = { getAlertGroups, getAlertById };
