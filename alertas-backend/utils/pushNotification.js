const { Expo } = require("expo-server-sdk");

const expo = new Expo({ accessToken: process.env.FCM_SERVER_KEY });

async function sendNotification(token, titulo, cuerpo) {
  try {
    // console.log(token, process.env.FCM_SERVER_KEY);
    if (token) {
      await expo.sendPushNotificationsAsync([
        {
          to: token,
          title: titulo,
          body: cuerpo,
        },
      ]);
    //   console.log("Notificación enviada");
    }
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
  }
}

// const token = 'token_del_dispositivo';
// const titulo = 'Nuevo mensaje';
// const cuerpo = 'Has recibido un nuevo mensaje';

// enviarNotificacion(token, titulo, cuerpo);

module.exports = sendNotification;
