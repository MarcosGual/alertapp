import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AddAlertScreen from "./AddAlert";
import SettingsScreen from "./SettingsScreen";
import ReportScreen from "./ReportScreen";
import { auth } from "../config/firebase";
import GroupManagementScreen from "./GroupManagement";
import UserManagementScreen from "./UserManagement";
import { createStackNavigator } from "@react-navigation/stack";
import GroupStackScreen from "./SelectGroupScreen";
import UserReports from "./UserReports";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { saveToken } from "../utils/saveToken";
import colors from "../colors";
import AlertScreen from "./AlertScreen";
import AlertReport from "./AlertReport";
import UsersDataReport from "./UsersDataReport";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppStack = () => {
  const { expoPushToken } = usePushNotifications();
  // console.log(expoPushToken)

  useEffect(() => {
    saveToken(expoPushToken);
  }, []);

  if (auth.currentUser.email === process.env.ADMIN_EMAIL) {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Reportes"
            component={ReportScreen}
            options={{ title: "Reportes" }}
          />
          <Stack.Screen
            name="ReporteGrupos"
            component={GroupManagementScreen}
            options={{ title: "Reporte de Grupos" }}
          />
          <Stack.Screen
            name="ReporteUsuarios"
            component={UserManagementScreen}
            options={{ title: "Gestión de Usuarios" }}
          />
          <Stack.Screen
            name="ReporteAlertas"
            component={AlertReport}
            options={{ title: "Actividad de Alertas" }}
          />
          <Stack.Screen
            name="EstadisticasUsuarios"
            component={UsersDataReport}
            options={{ title: "Actividad de Usuarios" }}
          />
          <Stack.Screen
            name="PeligrosidadZonas"
            component={UserReports}
            options={{ title: "Actividad de Usuarios" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Inicio") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Agregar Alerta") {
                iconName = focused ? "add-circle" : "add-circle-outline";
              } else if (route.name === "Botón de Pánico") {
                iconName = focused ? "alert-circle" : "alert-circle-outline";
              } else if (route.name === "Opciones") {
                iconName = focused ? "menu" : "menu-outline";
              } else if (route.name === "Alerta") {
                iconName = focused ? "information" : "information-outline";
              } else if (route.name === "Informacion") {
                iconName = focused ? "laptop" : "laptop-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#f0edf6",
            tabBarInactiveTintColor: "#1F2937",
            tabBarActiveBackgroundColor: colors.darkViolet,
            headerStyle: {
              backgroundColor: "#1F2937", // Establecer el color de fondo del header
            },
            headerTintColor: "#FFFFFF", // Establecer el color del texto del header
            headerTitleStyle: {
              fontWeight: "bold", // Establecer el estilo del texto del header
            },
          })}
        >
          <Tab.Screen name="Inicio" component={GroupStackScreen} />
          {/* <Tab.Screen name="Inicio" component={AlertScreen} /> */}
          <Tab.Screen name="Agregar Alerta" component={AddAlertScreen} />
          <Tab.Screen name="Informacion" component={UserReports} />
          <Tab.Screen name="Opciones" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

export default AppStack;
