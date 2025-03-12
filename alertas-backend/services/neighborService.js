const { default: mongoose } = require("mongoose");
const Neighbor = require("../models/Neighbor");
const sendNotification = require("../utils/pushNotification");

async function getAllNeighbors() {
  try {
    const neighbors = await Neighbor.find();
    return neighbors;
  } catch (error) {
    throw new Error("Error al obtener los vecinos");
  }
}

async function createNeighbor(data) {
  try {
    const newNeighbor = new Neighbor(data);
    const neighborSaved = await newNeighbor.save();
    return neighborSaved;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al crear el vecino - " + error.message);
  }
}

async function getNeighborById(id) {
  try {
    const neighbor = await Neighbor.findOne({ uid: id });
    if (!neighbor) {
      throw new Error("Vecino no encontrado");
    }
    return neighbor;
  } catch (error) {
    throw new Error("Error al obtener el vecino");
  }
}

async function updateNeighbor(id, data) {
  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const neighborId = new mongoose.Types.ObjectId(id);
      const updatedNeighbor = await Neighbor.findOneAndUpdate(
        { _id: neighborId },
        data,
        {
          new: true,
        }
      );
      return updatedNeighbor;
    } else {
      console.log("Error en el id del vecino...");
    }
  } catch (error) {
    throw new Error("Error al actualizar el vecino - " + error.message);
  }
}

const saveNeighborLocations = async (uid, lastLocation) => {
  try {
    const neighbor = await Neighbor.findOne({ uid: uid });

    if (!neighbor) {
      return res.status(404).json({ mensaje: "Vecino no encontrado" });
    }

    if (lastLocation) {
      if (neighbor.locationHistory.length > 10) {
        //limpio la bd
        neighbor.locationHistory.shift();
      }

      neighbor.lastLocation = [lastLocation.longitude, lastLocation.latitude];
      neighbor.lastLocationTime = new Date();
      neighbor.locationHistory.push(lastLocation);

      await neighbor.save();
    }

    return neighbor;
  } catch (error) {
    console.error("Error al actualizar las ubicaciones del vecino:", error);
    throw new Error("Error al actualizar ubicaciones del vecino.");
  }
};

async function deleteNeighbor(id) {
  try {
    await Neighbor.findByIdAndDelete(id);
    return { message: "Vecino eliminado exitosamente" };
  } catch (error) {
    throw new Error("Error al eliminar el vecino - " + error.message);
  }
}

async function getNeighborsByGroupId(groupId) {
  try {
    const neighbors = await Neighbor.find({ groups: groupId }).populate(
      "groups"
    );
    return neighbors;
  } catch (error) {
    throw new Error(
      "Error al obtener los vecinos del grupo - " + error.message
    );
  }
}

async function getNeighborsByIds(neighborsIds) {
  const fieldsToSelect = "name phone city imageUrl email";
  try {
    const neighbors = await Neighbor.find({
      uid: { $in: neighborsIds },
    })
      .select(fieldsToSelect)
      .exec();

    // console.log(neighbors)

    return neighbors;
  } catch (error) {
    throw new Error("Error al obtener los vecinos - " + error.message);
  }
}

async function addGroupToNeighbors(groupId, neighborIds, adminId) {
  try {
    // Buscar todos los vecinos cuyos IDs están en el array neighborIds
    const neighbors = await Neighbor.find({ _id: { $in: neighborIds } });

    console.log(neighbors, adminId);
    await Promise.all(
      neighbors.map(async (neighbor) => {
        neighbor.groups.push(groupId);

        if (neighbor._id.toString() == adminId) {
          neighbor.adminOfGroups.push(groupId);
        }
        await neighbor.save(); // Hacemos el save() asincrónico
      })
    );

    return neighbors; // Retorna los vecinos actualizados si es necesario
  } catch (error) {
    throw new Error(
      "Error al agregar el grupo a los vecinos - " + error.message
    );
  }
}

async function saveNeighborToken(neighborId, token) {
  try {
    const neighbor = await Neighbor.findOne({ uid: neighborId });
    if (!neighbor) {
      throw new Error("Vecino no encontrado.");
    }

    neighbor.deviceTokens.forEach((deviceToken) => {
      if (deviceToken.data == token.data) {
        throw new Error("Token ya existente.");
      }
    });

    neighbor.deviceTokens.push(token);
    await neighbor.save();

    return neighbor;
  } catch (error) {
    throw new Error("Error al guardar el token del vecino - " + error.message);
  }
}

async function getNeighborsFromGroups(alert) {
  try {
    // console.log(alert);
    const neighbors = await Neighbor.find({
      [`notificationPreferences.securityAlerts.${alert.level}`]: true, //verifica si está activada la notificación del nivel
      groups: { $in: alert.group },
    });
    return neighbors;
  } catch (error) {
    console.error("Error al obtener los vecinos de los grupos:", error);
    throw error;
  }
}

async function notifyNeighbors(newAlert, title, body) {
  try {
    const neighbors = await getNeighborsFromGroups(newAlert);
    for (const neighbor of neighbors) {
      for (const token of neighbor.deviceTokens) {
        await sendNotification(token.data, title, body);
      }
    }

    if (newAlert.level == 1) {
      console.log("notificando de alerta cercana");
      notifyNearbyNeighbors(
        newAlert.geolocation.latitude,
        newAlert.geolocation.longitude,
        newAlert.group,
        newAlert.title
      );
    }

    console.log("Notificaciones enviadas a los vecinos del grupo");
  } catch (error) {
    console.error("Error al notificar a los vecinos:", error);
    throw error;
  }
}

async function notifyNearbyNeighbors(
  latitude,
  longitude,
  notInGroups,
  alertTitle
) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const nearbyNeighbors = await Neighbor.find({
      // lastLocationTime: { $gte: tenMinutesAgo },
      "notificationPreferences.proximityAlerts": true,
      //groups: { $nin: notInGroups }, // No pertenece al grupo especificado
      lastLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 200,
        },
      },
    });

    console.log(nearbyNeighbors);

    // for (const neighbor of nearbyNeighbors) {
    //   for (const token of neighbor.deviceTokens) {
    //     await sendNotification(
    //       token.data,
    //       "Cuidado: Alerta Cercana",
    //       alertTitle
    //     );
    //   }
    // }
  } catch (error) {
    throw new Error(
      "Error al intentar encontrar usuarios cercanos - " + error.message
    );
  }
}

module.exports = {
  getAllNeighbors,
  createNeighbor,
  getNeighborById,
  updateNeighbor,
  deleteNeighbor,
  getNeighborsByGroupId,
  addGroupToNeighbors,
  saveNeighborToken,
  getNeighborsFromGroups,
  notifyNeighbors,
  saveNeighborLocations,
  getNeighborsByIds,
};
