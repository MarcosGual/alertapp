import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { LOCAL_TUNNEL_URL } from "@env";
import { getMonthName } from "../utils/utils";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundColor: "#FFFFFF",
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const MonthlyAlertsTable = () => {
  // Datos de ejemplo para las alertas emitidas en los últimos 12 meses
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonthCount, setSelectedMonthCount] = useState(10);

  const handleMonthCountChange = (value) => {
    setSelectedMonthCount(value);
    fetchData(value);
  };

  const fetchData = async (monthCount) => {
    try {
      const response = await axios.get(
        `${LOCAL_TUNNEL_URL}/alerts/frequency?monthsCount=${monthCount || 10}`
      );
      const data = response.data;
      const reversedData = data.reverse();

      let total = { 1: 0, 2: 0, 3: 0, 4: 0 };
      let totalMonths = 0;

      data.forEach((item) => {
        totalMonths++;
        Object.keys(item.count).forEach((key) => {
          total[key] += item.count[key];
        });
      });

      let average = {};
      Object.keys(total).forEach((key) => {
        average[key] = (total[key] / totalMonths).toFixed(2);
      });

      reversedData.push({ count: total, month: "Total", year: "" });
      reversedData.push({ count: average, month: "Media", year: "" });

      if (reversedData) {
        for (let data of reversedData) {
          if (typeof data.month === "number")
            data.month = getMonthName(data.month);
        }
      }

      setMonthlyData(reversedData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={{ height: "100%" }}>
      <Picker
        selectedValue={selectedMonthCount}
        onValueChange={(itemValue, itemIndex) =>
          handleMonthCountChange(itemValue)
        }
      >
        <Picker.Item label="Seleccione la cantidad de meses" value="10" />
        <Picker.Item label="3 meses" value="3" />
        <Picker.Item label="6 meses" value="6" />
        <Picker.Item label="12 meses" value="12" />
        <Picker.Item label="18 meses" value="18" />
        <Picker.Item label="24 meses" value="24" />
      </Picker>
      <AlertBarChart report={monthlyData} />
      <DataTable style={{height: '100%', marginBottom: 50}}>
        <DataTable.Header>
          <DataTable.Title>Mes</DataTable.Title>
          <DataTable.Title>Año</DataTable.Title>
          <DataTable.Title>Alta</DataTable.Title>
          <DataTable.Title>Media</DataTable.Title>
          <DataTable.Title>Baja</DataTable.Title>
          <DataTable.Title>Info</DataTable.Title>
        </DataTable.Header>

        {monthlyData.map((data, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{data.month}</DataTable.Cell>
            <DataTable.Cell>{data.year.toString().slice(2, 4)}</DataTable.Cell>
            <DataTable.Cell>{data.count["1"]}</DataTable.Cell>
            <DataTable.Cell>{data.count["2"]}</DataTable.Cell>
            <DataTable.Cell>{data.count["3"]}</DataTable.Cell>
            <DataTable.Cell>{data.count["4"]}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

const AlertBarChart = ({ report }) => {
  const reporte = report[report.length - 2];
  if (reporte) {
    const data = {
      labels: ["Alto", "Medio", "Bajo", "Info"],
      datasets: [
        {
          data: [
            reporte.count["1"],
            reporte.count["2"],
            reporte.count["3"],
            reporte.count["4"],
          ],
        },
      ],
    };

    return (
      <View style={{alignContent: 'center', alignItems: 'center'}}>
        <BarChart
          data={data}
          width={400}
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
    );
  }

  return null;
};

export default MonthlyAlertsTable;
