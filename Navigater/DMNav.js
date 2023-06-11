import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DMRoom from "../Screen/DMRoom";
import DMList from "../Screen/DMList";
import Ionicons from "@expo/vector-icons/Ionicons";
import UseMe from "../Hooks/UseMe";

const Stack = createNativeStackNavigator();

const DMNAv = ({ navigation }) => {
  const {
    data: { me },
  } = UseMe();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
          shadowColor: "rgba(255,255,255,0.3)",
        },
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: me.username,
          headerLeft: ({ tintColor }) => (
            <Ionicons
              onPress={() => navigation.navigate("TabNav")}
              color={tintColor}
              name="chevron-back"
              size={28}
            />
          ),
        }}
        name="DMList"
        component={DMList}
      />
      <Stack.Screen
        options={{
          headerLeft: ({ tintColor }) => (
            <Ionicons
              onPress={() => navigation.navigate("DMList")}
              color={tintColor}
              name="chevron-back"
              size={28}
            />
          ),
        }}
        name="DMRoom"
        component={DMRoom}
      />
    </Stack.Navigator>
  );
};
export default DMNAv;
