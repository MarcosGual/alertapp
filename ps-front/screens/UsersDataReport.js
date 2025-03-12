import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ActivityIndicator, DataTable } from "react-native-paper";
import axios from "axios";
import { LOCAL_TUNNEL_URL } from "@env";

const UsersReportScreen = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(
        LOCAL_TUNNEL_URL + "/reports/users-registered"
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
            flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Reporte de usuarios registrados por mes
      </Text>
      <Text>Abrir Gráfico</Text>

      {reportData && (
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: reportData.map((item) => item.month.slice(0, -4)),
              datasets: [
                {
                  data: reportData.map((item) => item.usersRegistered),
                },
              ],
            }}
            width={400}
            height={220}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}
      <View style={styles.tableContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Mes</DataTable.Title>
            <DataTable.Title numeric>Usuarios Registrados</DataTable.Title>
          </DataTable.Header>

          {reportData.map((item) => (
            <DataTable.Row key={item.month}>
              <DataTable.Cell>{item.month}</DataTable.Cell>
              <DataTable.Cell numeric>{item.usersRegistered}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tableContainer: {
    width: "100%",
  },
});

export default UsersReportScreen;
