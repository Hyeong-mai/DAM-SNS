import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../Screen/Welcome";
import Login from "../Screen/Login";
import CreateAccount from "../Screen/CreateAccount";

const Stack = createNativeStackNavigator();

const LoggedOutNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        component={Welcome}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
};
export default LoggedOutNav;
