let io;

const initSocketManager = (server) => {
  io = require('socket.io')(server);

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado.');
  }
  return io;
};

module.exports = { initSocketManager, getIO };