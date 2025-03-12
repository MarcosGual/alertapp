const { Alert } = require("../models/Alert");
const { Message } = require("../models/Message");
const Neighbor = require("../models/Neighbor");
const { getIO } = require("../utils/socketManager");
const neighborService = require("../services/neighborService");
const alertService = require("../services/alertService");
const utils = require("../utils/utils");

async function getAlertsByGroup(req, res) {
  try {
    const { groupId } = req.params;
    const alerts = await Alert.find({ group: groupId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las alertas del grupo" });
  }
}

async function getAlerts(req, res) {
  try {
    const level = parseInt(req.query.level);
    let alerts;
    console.log(level);
    if (level && level <= 4 && level >= 0) {
      console.log("entróoo");
      alerts = await Alert.find({ level: { $in: [level] } });
    } else {
      console.log("todas");
      alerts = await Alert.find();
    }

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las alertas" });
  }
}

async function getAlertFrequencyByMonth(req, res) {
  try {
    let query = {};
    let monthsCount = 12;

    if (req.query.monthsCount) {
      const currentDate = new Date();
      let startDate;
      monthsCount = req.query.monthsCount;

      switch (req.query.monthsCount) {
        case "lastMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
          );
          break;
        case "lastYear":
          startDate = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            1
          );
          break;
        default:
          break;
      }

      if (startDate) {
        query.date = { $gte: startDate, $lte: currentDate };
      }
    }

    const alerts = await Alert.find(query);

    const startDate = new Date();
    const monthList = utils.generateMonthList(startDate, monthsCount);
    const alertCounts = utils.countAlertsByMonth(alerts);

    const result = utils.mergeMonthListWithCounts(monthList, alertCounts);

    res.json(result);
  } catch (error) {
    console.error("Error al obtener frecuencia de alertas:", error);
    res.status(500).json({ message: "Error al obtener frecuencia de alertas" });
  }
}

async function getAlertLocations(req, res) {
  try {
    let query = {};

    if (req.query.monthsCount) {
      const currentDate = new Date();
      let startDate;

      switch (req.query.monthsCount) {
        case "lastMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
          );
          break;
        case "lastYear":
          startDate = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            1
          );
          break;
        default:
          break;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate, $lte: currentDate };
      }
    }
    query.geolocation = { $exists: true, $ne: null };

    const alerts = await Alert.find(query, { _id: 0, geolocation: 1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las alertas" });
  }
}

async function getAlertById(req, res) {
  try {
    const { id } = req.params;
    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la alerta" });
  }
}

async function createAlert(req, res) {
  // const io = req.io;
  // const io = getIO();
  try {
    const newAlert = new Alert(req.body);
    const alertSaved = await newAlert.save();
    // io.emit('new-alert', alertSaved);
    // Emitir un evento de socket.io para notificar a los clientes
    console.log(req.body);
    const gravedad =
      newAlert.level == 1
        ? "Alta"
        : newAlert.level == 2
        ? "Media"
        : newAlert.level == 3
        ? "Baja"
        : "Información";

    neighborService.notifyNeighbors(
      newAlert,
      "Nueva Alerta",
      "Se ha emitido una nueva alerta: " +
        newAlert.title +
        ". Gravedad: " +
        gravedad,
      newAlert
    );

    res.status(201).json(alertSaved);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear la alerta: " + error.message });
  }
}

async function updateAlert(req, res) {
  try {
    const { id } = req.params;
    const updatedAlert = await Alert.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedAlert);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la alerta" });
  }
}

async function deleteAlert(req, res) {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id);
    res.json({ message: "Alerta eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la alerta" });
  }
}

module.exports = {
  getAlertsByGroup,
  getAlertById,
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  getAlertLocations,
  getAlertFrequencyByMonth,
};
