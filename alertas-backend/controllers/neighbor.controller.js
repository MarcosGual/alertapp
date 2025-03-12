const Neighbor = require("../models/Neighbor");
const neighborService = require("../services/neighborService");

async function getAllNeighbors(req, res) {
  try {
    const neighbors = await neighborService.getAllNeighbors();
    res.json(neighbors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNeighborsByGroupId(req, res) {
  try {
    const { groupId } = req.params;
    const neighbors = await neighborService.getNeighborsByGroupId(groupId);
    res.json(neighbors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createNeighbor(req, res) {
  try {
    const newNeighbor = await neighborService.createNeighbor(req.body);
    res.status(201).json(newNeighbor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNeighborByUid(req, res) {
  try {
    const { id } = req.params;
    const neighbor = await neighborService.getNeighborById(id);
    res.json(neighbor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNeighborByUid(req, res) {
  try {
    const { id } = req.params;
    const neighbor = await neighborService.getNeighborById(id);
    res.json(neighbor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateNeighbor(req, res) {
  try {
    const { id } = req.params;
    const updatedNeighbor = await neighborService.updateNeighbor(id, req.body);
    res.json(updatedNeighbor);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getNeighborsArrayByUids(req, res) {
  try {
    const uidsArray = req.body.uidsArray;
    const neighbors = await neighborService.getNeighborsByIds(uidsArray);
    console.log(neighbors);
    res.status(200).json(neighbors);
  } catch (error) {
    console.log("error al obtener array de vecinos - " + error.message);
    res.status(500).json({ error: error.message });
  }
}

async function updateNeighborLocations(req, res) {
  try {
    const { uid } = req.params;
    const { lastLocation } = req.body;
    if (lastLocation) {
      neighborService.saveNeighborLocations(uid, lastLocation);
      res
        .status(200)
        .json({ message: "Localizaciones del vecino actualizadas" });
    } else {
      res
        .status(400)
        .json({ message: "No se recibió la localización del vecino" });
    }
  } catch (error) {
    console.log(
      "Error al actualizar localizaciones del vecino - " + error.message
    );
    res.status(500).json({ message: "Error al actualizar localizaciones" });
  }
}

// Eliminar un vecino existente
async function deleteNeighbor(req, res) {
  try {
    const { id } = req.params;
    const result = await neighborService.deleteNeighbor(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function saveNeighborToken(req, res) {
  try {
    const neighborId = req.params.id;
    const { deviceToken } = req.body;
    console.log(deviceToken);

    await neighborService.saveNeighborToken(neighborId, deviceToken);
    res.status(200).json({ message: "token guardado exitosamente" });
  } catch (error) {
    console.log("error al guardar token - " + error.message);
    res.status(500).json({ error: "Error al guardar el token de usuario" });
  }
}

module.exports = {
  getAllNeighbors,
  createNeighbor,
  getNeighborByUid,
  updateNeighbor,
  deleteNeighbor,
  getNeighborsByGroupId,
  saveNeighborToken,
  updateNeighborLocations,
  getNeighborsArrayByUids,
};
