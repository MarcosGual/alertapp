import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-paper";

const ProfileCard = ({ userName, avatarSource }) => {
  if (
    typeof avatarSource !== "string" ||
    typeof avatarSource !== "number" ||
    avatarSource === null
  ) {
    return (
      <View style={styles.container}>
        <View>
          <Avatar.Image
            size={60}
            source={require("../assets/defaultavatar.png")}
          />
          <Text>{userName}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Avatar.Image
          size={60}
          source={
            avatarSource
              ? { uri: avatarSource }
              : require("../assets/defaultavatar.png")
          }
        />
        <Text>{userName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //   tarjeta: {
  //     marginVertical: 10,
  //     marginHorizontal: 20,
  //     borderRadius: 10,
  //     elevation: 5,
  //   },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  //   nombreUsuario: {
  //     marginLeft: 10,
  //     fontSize: 16,
  //     fontWeight: 'bold',
  //   },
});

export default ProfileCard;
