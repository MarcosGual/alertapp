const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const firebaseService = require("../services/firebaseService");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/terms", function (req, res) {
  res.status(200).json({
    title: "Términos y Condiciones",
    sections: [
      {
        title: "Uso de la Aplicación",
        content:
          "Esta aplicación se proporciona para uso gratuito y es solo para fines informativos y de seguridad vecinal. No debe utilizarse para ninguna actividad ilegal o maliciosa.",
      },
      {
        title: "Responsabilidad del Usuario",
        content:
          "El usuario es responsable de la información que publique en la aplicación. No se deben compartir datos personales sensibles o información falsa.",
      },
      {
        title: "Uso Adecuado",
        content:
          "Los usuarios deben utilizar la aplicación de manera adecuada y respetuosa con los demás. No se permiten contenidos ofensivos, discriminatorios o dañinos.",
      },
      {
        title: "Privacidad",
        content:
          "La privacidad de los usuarios es importante para nosotros. Toda la información personal recopilada se tratará según nuestra política de privacidad.",
      },
      {
        title: "Actualizaciones",
        content:
          "Podemos actualizar estos términos y condiciones en cualquier momento. Es responsabilidad del usuario revisar periódicamente los cambios realizados.",
      },
      {
        title: "Contacto",
        content:
          "Si tiene alguna pregunta o inquietud sobre estos términos y condiciones, por favor contáctenos a través de la sección de soporte en la aplicación.",
      },
    ],
  });
});

router.get("/faq", function (req, res) {
  res.status(200).json([
    {
      question: "¿Cómo puedo reportar una alerta?",
      answer:
        "Para reportar una alerta, ve a la pantalla de Nueva Alerta por el panel de navegación inferior. Luego, ingresa los detalles de la alerta y selecciona el grupo o los grupos al que pertenece.",
    },
    {
      question:
        "¿Cuánto tiempo se tarda en recibir una respuesta de las autoridades?",
      answer:
        "El tiempo de respuesta de las autoridades puede variar dependiendo de la urgencia y la ubicación del incidente. Si es una emergencia, se recomienda fuertemente llamar a los servicios de emergencia locales además de reportarlo en la aplicación.",
    },
    {
      question: "¿Cómo puedo unirme a un grupo vecinal?",
      answer:
        'Para unirte a un grupo vecinal, solicita al administrador que agregue tu dirección de correo electrónico. Al invitarte, te aparecerá una confirmación por email.',
    },
    {
      question: "¿Puedo recibir notificaciones sobre alertas específicas?",
      answer:
        "Sí, puedes configurar tus preferencias de notificación para recibir alertas solo de ciertos niveles. Ve a la pantalla de configuración de usuario para ajustar tus preferencias.",
    },
    {
      question: "¿Puedo compartir una alerta en redes sociales?",
      answer:
        "Todavía no podés, pero estamos trabajando para que muy pronto puedas compartirla en Whatsapp, Facebook y en otras redes.",
    },
    {
      question: "¿Cómo puedo editar una alerta que he publicado?",
      answer:
        "Actualmente, no es posible editar una alerta una vez que ha sido publicada. Si cometiste un error, puedes marcar la alerta y publicar una nueva alerta con la información correcta.",
    },
    {
      question:
        "¿Qué debo hacer en caso de que no pueda acceder a la aplicación?",
      answer:
        "Si tienes problemas para acceder a la aplicación, asegúrate de tener una conexión a Internet estable y que estás utilizando la última versión de la aplicación. Si el problema persiste, ponte en contacto con el soporte técnico para obtener asistencia.",
    },
    {
      question:
        "¿Cuál es el radio de las notificaciones por proximidad de alerta?",
      answer:
        "Las notificaciones por proximidad tienen un radio de aproximadamente 100 metros. Eso puede variar por la precisión del GPS de tu dispositivo.",
    },
    {
      question: "¿Qué debo hacer si encuentro un error en la aplicación?",
      answer:
        'Si encuentras un error o problema en la aplicación, te agradeceríamos que nos lo informaras para poder solucionarlo. Puedes enviar un correo electrónico al equipo de soporte técnico o utilizar la opción de "Reportar un problema" en la aplicación.',
    },
    {
      question: "¿Cómo puedo cambiar mi contraseña?",
      answer:
        "Para cambiar tu contraseña, ve a la pantalla de configuración de cuenta y selecciona la opción para cambiar contraseña. Luego, sigue las instrucciones para ingresar tu contraseña actual y establecer una nueva contraseña.",
    },
  ]);
});

router.post("/send-email", (req, res) => {
  const { to, dynamicTemplateData } = req.body;

  console.log(req.body);

  const msgData = {
    to,
    from: "alertapp.ar@gmail.com", // Reemplaza con tu dirección de correo
    templateId: "d-2234889e77b64fdbb923adba19cb6b65", // Reemplaza con el ID de tu template de SendGrid
    dynamicTemplateData,
  };

  sgMail
    .send(msgData)
    .then(() => {
      res.json({ success: true, message: "Correo enviado exitosamente." });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error al enviar el correo." });
    });
});

router.post("/registerPushToken", async (req, res) => {
  const userId = String(req.body.userId);
  const token = String(req.body.token);
  await firebaseService.saveToken(userId, token);
  res.status(200).send("success");
});

router.post("/sample", async (_, res) => {
  // const { token } = await firebaseService.getToken("0000001");
  // expo.sendPushNotificationsAsync([
  //   {
  //     to: token,
  //     title: "Soil Water Level too Low!",
  //     body: "Water your plant",
  //   },
  // ]);

  // res.status(200).send("success");
  const moistureLevel = Number(req.body.moisture);
  const userId = String(req.body.userId);

  firebaseService.saveSample(moistureLevel, userId);
  res.status(200).send("success");
});

router.get("/analytics", async (req, res) => {
  const userId = String(req.query.userId);
  const samples = await firebaseService.getSamples(userId);
  res.status(200).send(samples);
});

module.exports = router;
