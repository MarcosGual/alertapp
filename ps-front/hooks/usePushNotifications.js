import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform, Alert } from "react-native";

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState();
  const [notification, setNotification] = useState();

  const notificationListener = useRef();
  const responseListener = useRef();

  const setNotificationHandler = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldShowAlert: true,
        shouldSetBadge: false,
      }),
    });
  };

  async function registerForPushNotificationsAsync() {
    let token;
    try {
      if (Device.isDevice||!Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          throw new Error("Failed to get push token for push notification");
        }

        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        });
      } else {
        throw new Error("Must be using a physical device for Push notifications");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      Alert.alert("Error", error.message);
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    }).catch((error) => {
      console.error("Error getting push token:", error);
      Alert.alert("Error", error.message);
    });

    setNotificationHandler();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      try {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      } catch (error) {
        console.error("Error removing notification subscription:", error);
        Alert.alert("Error", error.message);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};