import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-paper";

const PanicButton = ({ onPress, panicTimes }) => {
  const sirenAnimation = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.loop(
      Animated.timing(sirenAnimation, {
        toValue: 1,
        duration: 1000, // Duration of the animation in milliseconds
        easing: Easing.linear, // Type of interpolation
        useNativeDriver: true, // Use native driver to improve performance
      })
    ).start();

    onPress();
  };

  return (
    <View style={styles.container}>
      {panicTimes < 4 ? (
        <TouchableOpacity onPress={handlePress} style={styles.panicButton}>
          <Text style={[styles.panicButtonText, panicTimes && styles.panic]}>
            {panicTimes && panicTimes < 4
              ? panicTimes
              : panicTimes === 4
              ? "!!!"
              : "PANICO"}
          </Text>
        </TouchableOpacity>
      ) : (
        <Animated.Image
          source={require("../assets/panic_siren.gif")} // Replace with the path to your siren image or GIF
          style={[
            styles.siren,
            {
              transform: [
                {
                  scale: sirenAnimation.interpolate({
                    inputRange: [0, 0],
                    outputRange: [0.8, 0.8],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: "red",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  siren: {
    width: 100,
    height: 100,
  },
  panicButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
    backgroundColor: "#DA1E28",
    borderRadius: 32,
    // borderWidth: 1,
    // borderColor: 'grey',
    justifyContent: "center",
    alignItems: "center",
  },
  panicButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  panic: {
    fontSize: 24,
  },
});

export default PanicButton;

// import React from "react";
// import { TouchableOpacity, Text, StyleSheet } from "react-native";

// const PanicButton = ({ onPress, panicTimes }) => {
//   return (
//     <TouchableOpacity style={styles.panicButton} onPress={onPress}>
//       <Text style={[styles.panicButtonText, panicTimes && styles.panic]}>
//         {panicTimes && panicTimes < 4
//           ? panicTimes
//           : panicTimes === 4
//           ? ""
//           : "PANICO"}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   panicButton: {
//     position: "absolute",
//     bottom: 16,
//     right: 16,
//     width: 64,
//     height: 64,
//     backgroundColor: "#DA1E28",
//     borderRadius: 32,
//     // borderWidth: 1,
//     // borderColor: 'grey',
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   panicButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   panic: {
//     fontSize: 24,
//   },
// });

// export default PanicButton;
