const express = require("express");
const Alert = require("../models/Alert");
const Neighbor = require("../models/Neighbor");
const { getShortMonthName } = require("../utils/utils");

const router = express.Router();

// router.get("/monthly-alerts", async (req, res) => {
//   try {
//     const twelveMonthsAgo = new Date();
//     twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

//     const monthlyAlerts = await Alert.find({
//       date: { $gte: twelveMonthsAgo },
//     });

//     res.json(monthlyAlerts);
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener las alertas mensuales" });
//   }
// });

router.get('/users-registered', async (req, res) => {
  try {
    const monthsAgo = 12 || req.query.months; // Obtener usuarios registrados en los últimos 6 meses
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsAgo);

    const usersByMonth = await Neighbor.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 }, // Ordena por mes ascendente
      },
    ]);

    const usersByMonthMap = {};
    usersByMonth.forEach(({ month, year, count }) => {
      const monthName = getShortMonthName(month - 1); // Obtener el nombre abreviado del mes
      const key = `${monthName} ${year||2023}`;
      usersByMonthMap[key] = count;
    });

    // Asegurarse de que todos los meses estén presentes en el resultado
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsToInclude = 12; // Obtener los últimos 12 meses

    for (let i = 0; i < monthsToInclude; i++) {
      const date = new Date(currentYear, currentMonth - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = getShortMonthName(month);
      const key = `${monthName} ${year}`;
      if (!(key in usersByMonthMap)) {
        usersByMonthMap[key] = 0; // Establecer el valor en 0 si no hay usuarios registrados
      }
    }

    const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
    

    // Ordenar los meses por orden cronológico
    const sortedMonths = Object.keys(usersByMonthMap).sort((a, b) => {
      const dateA = new Date(a.split(' ')[1], monthNames.indexOf(a.split(' ')[0]));
      const dateB = new Date(b.split(' ')[1], monthNames.indexOf(b.split(' ')[0]));
      return dateA - dateB;
    });

    // Construir el resultado final
    const report = sortedMonths.map(month => ({
      month,
      usersRegistered: usersByMonthMap[month]
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios registrados - "+error.message });
  }
});

module.exports = router;
