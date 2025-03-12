import PushNotification from "react-native-push-notification";
import io from "socket.io-client";
import PushNotification from "react-native-push-notification";

const showLocalNotification = (group, title) => {
  // Muestra una notificación local
  PushNotification.localNotification({
    channelId: group, // Android: Necesitas especificar un channelId configurado previamente
    title: title,
    message: "Se ha generado una nueva alerta",
    // smallIcon: 'ic_notification', // Android: Nombre del icono en la carpeta "drawable"
  });
};

//useEffect para notificaciones en COMPONENTE
// useEffect(() => {
// try {
//   const socket = io(LOCAL_TUNNEL_URL);
//   socket.on("new-alert", (alertData) => {
//     console.log("Alerta recibida:", alertData);
//     if (group) getAlerts();
//     showLocalNotification(group.groupName, alertData.title);
//   });
//   return () => {
//     socket.disconnect();
//   };
// } catch (error) {
//   console.log("Error en notificaciones - " + error.message);
// }
// }, []);
