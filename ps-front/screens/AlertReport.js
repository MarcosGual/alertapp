import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import MonthlyAlertsTable from "./MonthlyAlertsTable";

const AlertReport = () => {
  return (
    <View>
      <Text variant="titleLarge">Alertas Mensuales por Nivel</Text>
      <MonthlyAlertsTable />
    </View>
  );
};

export default AlertReport;
