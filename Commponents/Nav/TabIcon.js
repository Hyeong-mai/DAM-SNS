import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabIcon = ({ name, focused, size }) => {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      color={"white"}
      size={size}
    />
  );
};
export default TabIcon;
