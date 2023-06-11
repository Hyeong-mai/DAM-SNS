import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const DismissKeyboard = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
