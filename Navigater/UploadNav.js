import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../Screen/SelectPhoto";
import TakePhoto from "../Screen/TakePhoto";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tabs = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const UploadNav = ({ navigation }) => {
  return (
    <Tabs.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarActiveTintColor: "white",
        tabBarIndicatorStyle: { backgroundColor: "white", top: 0 },
      }}
    >
      <Tabs.Screen
        name={"SelectTab"}
        options={{
          tabBarLabel: "Select Photo",
        }}
      >
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
              headerBackTitleVisible: false,
              headerTintColor: "white",
              headerTitle: "Choose Photo",
              headerStyle: {
                backgroundColor: "black",
                shadowColor: "rgba(255,255,255,0.3)",
              },
              headerLeft: ({ tintColor }) => (
                <Ionicons
                  onPress={() => navigation.navigate("TabNav")}
                  color={tintColor}
                  name="chevron-back"
                  size={28}
                />
              ),
            }}
          >
            <Stack.Screen name="SelectStack" component={SelectPhoto} />
          </Stack.Navigator>
        )}
      </Tabs.Screen>
      <Tabs.Screen
        name={"Take"}
        options={{
          tabBarLabel: "Take Photo",
        }}
        component={TakePhoto}
      />
    </Tabs.Navigator>
  );
};
export default UploadNav;
