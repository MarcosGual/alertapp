const generateMonthList = (startDate, numMonths) => {
  const monthList = [];
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();

  for (let i = 0; i < numMonths; i++) {
    monthList.push({ month: currentMonth, year: currentYear });
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }

  return monthList;
};

const countAlertsByMonth = (alerts) => {
  const alertCounts = {};
  alerts.forEach((alert) => {
    const month = alert.createdAt.getMonth();
    const year = alert.createdAt.getFullYear();
    const key = `${month}-${year}`;
    if (!alertCounts[key]) {
      alertCounts[key] = { count: 0, level: { 1: 0, 2: 0, 3: 0, 4: 0 } };
    }

    // Incrementar el conteo para el nivel de gravedad correspondiente
    alertCounts[key].count++;
    alertCounts[key].level[alert.level]++;
  });

  return alertCounts;
};

const mergeMonthListWithCounts = (monthList, alertCounts) => {
  return monthList.map((month) => {
    const key = `${month.month}-${month.year}`;
    // console.log(alertCounts[key]?.level)
    const countByGravity = alertCounts[key]?.level || {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    };
    return {
      month: month.month,
      year: month.year,
      count: countByGravity,
    };
  });
};

const getShortMonthName = (month) => {
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
  return monthNames[month];
};

module.exports = {
  generateMonthList,
  countAlertsByMonth,
  mergeMonthListWithCounts,
  getShortMonthName,
};
