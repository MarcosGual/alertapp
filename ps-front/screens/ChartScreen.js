import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { LOCAL_TUNNEL_URL } from "@env";

const ChartScreen = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${LOCAL_TUNNEL_URL}/alerts/frequency?monthsCount=10`
      );
      const data = response.data;
      const reversedData = data.reverse();
      setChartData(reversedData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  if (!chartData || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: chartData.map((entry) => `${entry.month}/${entry.year?.toString().slice(2, 4)}`),
          datasets: [
            {
              data: chartData.map((entry) => entry.count[1]),
              label: "Nivel 1",
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            },
            {
              data: chartData.map((entry) => entry.count[2]),
              label: "Nivel 2",
              color: (opacity = 1) => `rgba(255, 85, 0, ${opacity})`,
            },
            {
              data: chartData.map((entry) => entry.count[3]),
              label: "Nivel 3",
              color: (opacity = 1) => `rgba(255, 200, 0, ${opacity})`,
            },
            {
              data: chartData.map((entry) => entry.count[4]),
              label: "Nivel 4",
              color: (opacity = 1) => `rgba(0, 180, 150, ${opacity})`,
            },
          ],
        }}
        width={480}
        height={300}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#f3f3f3',
          },
        }}
        bezier
      />
      <View style={styles.legend}>
        <View style={[styles.legendItem, { backgroundColor: 'rgb(255, 0, 0)' }]} />
        <Text style={[styles.lengendText]}>Nivel 1</Text>
        <View style={[styles.legendItem, { backgroundColor: 'rgb(255, 85, 0)' }]} />
        <Text style={[styles.lengendText]}>Nivel 2</Text>
        <View style={[styles.legendItem, { backgroundColor: 'rgb(255, 200, 0)' }]} />
        <Text style={[styles.lengendText]}>Nivel 3</Text>
        <View style={[styles.legendItem, { backgroundColor: 'rgb(0, 180, 150)' }]} />
        <Text style={[styles.lengendText]}>Nivel 4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 350,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    // maxWidth: '95%',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  lengendText:{
    marginRight: 20
  }
});

export default ChartScreen;
