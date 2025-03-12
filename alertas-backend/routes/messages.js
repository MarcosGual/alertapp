const express = require('express');
const router = express.Router({ mergeParams: true });
const messageController = require('../controllers/message.controller');

// Ruta para obtener todos los mensajes de una alerta específica
router.get('/', messageController.getMessagesByAlert);

// Ruta para crear un nuevo mensaje en una alerta específica
router.post('/', messageController.createMessage);

// Ruta para actualizar un mensaje existente en una alerta específica
router.put('/:messageId', messageController.updateMessage);

// Ruta para eliminar un mensaje existente de una alerta específica
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;