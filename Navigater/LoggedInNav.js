import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNav from "./TabNav";
import UploadNav from "./UploadNav";
import UploadForm from "../Screen/UploadForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import DMNAv from "./DMNav";

const Stack = createNativeStackNavigator();

const LoggedInNav = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="TabNav"
        component={TabNav}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Upload"
        component={UploadNav}
      />
      <Stack.Screen
        options={{
          headerBackTitleVisible: false,
          headerTintColor: "white",
          headerTitle: "Upload",
          headerStyle: {
            backgroundColor: "black",
            shadowColor: "rgba(255,255,255,0.3)",
          },
          headerLeft: ({ tintColor }) => (
            <Ionicons
              onPress={() => navigation.navigate("TabNav")}
              color={tintColor}
              name="close"
              size={28}
            />
          ),
        }}
        name="UploadForm"
        component={UploadForm}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="DM"
        component={DMNAv}
      />
    </Stack.Navigator>
  );
};
export default LoggedInNav;
