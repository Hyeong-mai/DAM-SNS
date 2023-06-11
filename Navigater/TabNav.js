import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "../Screen/Feed";
import Search from "../Screen/Search";
import Notification from "../Screen/Notification";
import Profile from "../Screen/Profile";
import TabIcon from "../Commponents/Nav/TabIcon";
import { Image, View } from "react-native";
import StackNavFactory from "./StackNavFactory";
import UseMe from "../Hooks/UseMe";

const Tabs = createBottomTabNavigator();

const TabNav = () => {
  const { data } = UseMe();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "rgba(255,255,255,0.5)",
        },
        tabBarActiveTintColor: "white",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="Feed"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name={"home"} color={color} focused={focused} size={22} />
          ),
        }}
      >
        {() => <StackNavFactory screenName={"Feed"} />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              name={"search"}
              color={color}
              focused={focused}
              size={22}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName={"Search"} />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Camera"
        component={View}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Upload");
          },
        })}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              name={"add-circle"}
              color={color}
              focused={focused}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name={"heart"} color={color} focused={focused} size={22} />
          ),
        }}
      >
        {() => <StackNavFactory screenName={"Notification"} />}
      </Tabs.Screen>
      <Tabs.Screen
        name="Me"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            data?.me?.avatar ? (
              <Image
                source={{ uri: data?.me?.avatar }}
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: "tomato",
                  borderRadius: 30,
                  ...(focused && {
                    borderColor: "rgba(255,255,255,0.5)",
                    borderWidth: 1,
                  }),
                }}
              />
            ) : (
              <TabIcon
                name={"person"}
                color={color}
                focused={focused}
                size={22}
              />
            ),
        }}
      >
        {() => <StackNavFactory screenName={"Me"} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
};
export default TabNav;
