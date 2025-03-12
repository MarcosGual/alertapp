const { Alert } = require("../models/Alert");
const { Message } = require("../models/Message");

// Obtener todos los mensajes de una alerta específica
async function getMessagesByAlert(req, res) {
  try {
    const { alertId } = req.params;
    const alerta = await Alert.findById(alertId);
    if (!alerta) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }
    const messages = alerta.messages;
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
}

// Crear un nuevo mensaje en una alerta específica
async function createMessage(req, res) {
  try {
    const { alertId } = req.params;
    const alerta = await Alert.findById(alertId);
    if (!alerta) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }
    const nuevoMensaje = new Message(req.body);
    console.log(nuevoMensaje);
    alerta.messages.push(nuevoMensaje);
    await alerta.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el mensaje - " + error.message });
  }
}

// Actualizar un mensaje existente en una alerta específica
async function updateMessage(req, res) {
  try {
    const {alertId, messageId} = req.params;
    const {newContent} = req.body;

    const resultado = await Alert.findOneAndUpdate(
      { _id: alertId, "messages._id": messageId }, // Encuentra el hilo por su ID y el ID del mensaje
      { $set: { "messages.$.content": newContent } }, // Utiliza $set para actualizar el contenido del mensaje
      { new: true } // Opcional: Devuelve el documento actualizado después de la operación
    );
    res.status(200).json({message: 'Mensaje modificado exitosamente', result: resultado });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
}

// Eliminar un mensaje existente de una alerta específica
async function deleteMessage(req, res) {
  try {
    const { alertId, messageId } = req.params;

    const resultado = await Alert.findByIdAndUpdate(
      alertId,
      { $pull: { messages: { _id: messageId } } }, // Utiliza $pull para eliminar el mensaje por su ID
      { new: true } // Opcional: Devuelve el documento actualizado después de la operación
    );

    res.status(200).json({ message: "Mensaje eliminado exitosamente", result: resultado });
  } catch (error) {
    console.log("Error al eliminar un mensaje - " + error.message);
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
}

module.exports = {
  getMessagesByAlert,
  createMessage,
  updateMessage,
  deleteMessage,
};
