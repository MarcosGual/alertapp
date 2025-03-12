import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import colors from "../colors";
import { Button } from "react-native-elements";
import { auth } from "../config/firebase";
import { Heatmap } from "react-native-maps";
import MonthlyAlertsTable from "./MonthlyAlertsTable";

const dummyReportesData = [
  {
    key: "reporteRespuestas",
    title: "Reporte de Respuestas",
    totalRespuestas: 120,
    respuestasUsuarios: 90,
    respuestasEquipoSeguridad: 30,
    respuestasPromedio: "2.5 respuestas por alerta",
  },
  {
    key: "reporteTiemposRespuesta",
    title: "Reporte de Tiempos de Respuesta",
    tiempoPromedioRespuesta: "1.5 horas",
    tiempoMaximoRespuesta: "4 horas",
    tiempoMinimoRespuesta: "30 minutos",
  },
];

const ReportScreen = ({ navigation }) => {
  const [expandedReport, setExpandedReport] = useState(null);

  const toggleReport = (reportKey) => {
    setExpandedReport((prevExpanded) =>
      prevExpanded === reportKey ? null : reportKey
    );
  };

  const renderReporteItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleReport(item.key)}>
      <View style={styles.reporteItemContainer}>
        <Text style={styles.reporteItemTitle}>{item.title}</Text>
        {expandedReport === item.key && renderReporteDetails(item)}
      </View>
    </TouchableOpacity>
  );

  const renderReporteDetails = (reporte) => {
    switch (reporte.key) {
      case "reporteRespuestas":
        return (
          <View>
            <Text>Total de Respuestas: {reporte.totalRespuestas}</Text>
            <Text>Respuestas de Usuarios: {reporte.respuestasUsuarios}</Text>
            <Text>
              Respuestas del Equipo de Seguridad:{" "}
              {reporte.respuestasEquipoSeguridad}
            </Text>
            <Text>
              Promedio de Respuestas por Alerta: {reporte.respuestasPromedio}
            </Text>
          </View>
        );
      case "reporteTiemposRespuesta":
        return (
          <View>
            <Text>
              Tiempo Promedio de Respuesta: {reporte.tiempoPromedioRespuesta}
            </Text>
            <Text>
              Tiempo Máximo de Respuesta: {reporte.tiempoMaximoRespuesta}
            </Text>
            <Text>
              Tiempo Mínimo de Respuesta: {reporte.tiempoMinimoRespuesta}
            </Text>
          </View>
        );
      case "mapaDeCalor":
        return (<View>
            <Text>Zonas Peligrosas Cerca - HeatMap</Text>
            <Heatmap />
        </View>);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
      <Button
        title="Lista de Grupos"
        onPress={() => navigation.navigate("ReporteGrupos")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Button
        title="Lista de Usuarios"
        onPress={() => navigation.navigate("ReporteUsuarios")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Button
        title="Estadísticas de Alertas"
        onPress={() => navigation.navigate("ReporteAlertas")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Button
        title="Estadísticas de Usuarios"
        onPress={() => navigation.navigate("EstadisticasUsuarios")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Button
        title="Peligrosidad de Zonas"
        onPress={() => navigation.navigate("PeligrosidadZonas")}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      </View>
      <FlatList
        data={dummyReportesData}
        renderItem={renderReporteItem}
        keyExtractor={(item) => item.key}
      />
      <Button
        title="Cerrar Sesión"
        onPress={() => auth.signOut()}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  reporteItemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 2,
  },
  reporteItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chartContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 30,
    width: 150,
    backgroundColor: colors.darkViolet,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 15,
    alignSelf: "center",
    textAlign: "center",
  },
});

export default ReportScreen;
