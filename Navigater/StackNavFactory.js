import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Profile from "../Screen/Profile";
import Feed from "../Screen/Feed";
import Search from "../Screen/Search";
import Notification from "../Screen/Notification";
import Me from "../Screen/Me";
import Like from "../Screen/Like";
import Comments from "../Screen/Comments";
import PhotoScreen from "../Screen/PhotoScreen";
import Logo from "../Commponents/Logo";

const Stack = createNativeStackNavigator();

const StackNavFactory = ({ screenName }) => {
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
      {screenName === "Feed" ? (
        <Stack.Screen
          name="FeedS"
          component={Feed}
          options={{
            headerTitle: () => <Logo />,
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="SearchS" component={Search} />
      ) : null}
      {screenName === "Notification" ? (
        <Stack.Screen
          name="NotificationS"
          component={Notification}
          options={{ headerTitle: "알림" }}
        />
      ) : null}
      {screenName === "Me" ? <Stack.Screen name="MeS" component={Me} /> : null}
      <Stack.Screen name="Photo" component={PhotoScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Likes" component={Like} />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
};
export default StackNavFactory;
