import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Login from "./screens/Login";
import Signup from "./screens/SignUp";
import AppStack from "./screens/AppStack";
import Terms from "./screens/Terms";
import FAQs from "./screens/FAQ";
import { Provider as PaperProvider, DefaultTheme, configureFonts } from "react-native-paper";
import colors from "./colors";

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'System',
      default: 'sans-serif',
    }),
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  }
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#da1e28", // Cambiar el color primario
    accent: "#a1a8de", // Cambiar el color de acento
    primaryContainer: "#717597",
    secondaryContainer: "#ebeeff",
    // tertiaryContainer: "#ffffff",
    // surface: "#a1a8de",
    // background: colors.dark,
    // surface: "#FFC0CB",
    surfaceVariant: colors.mediumGray,
    surfaceDisabled: "#808080",
  },
  // fonts: "light",
  roundness: 1,
  fonts: configureFonts({config: fontConfig}),
};

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="FAQs" component={FAQs} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return unsubscribeAuth;
  }, []);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <PaperProvider theme={theme}>
        {user ? <AppStack /> : <AuthStack />}
      </PaperProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
