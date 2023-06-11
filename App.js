import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import LoggedInNav from "./Navigater/LoggedInNav";
import LoggedOutNav from "./Navigater/LoggedOutNav";
import styled from "styled-components/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { cache, isLoggedInVar, logUserOut, tokenVar } from "./Apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

const OnlayoutView = styled.View`
  flex: 1;
`;
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  useEffect(() => {
    async function preLoadAsset() {
      try {
        const FontsToLoad = [Ionicons.font];
        const FontsPromise = FontsToLoad.map((font) => {
          Font.loadAsync(font);
        });
        // const ImagesToLoad = [require("./assets/logo.png")];
        // const ImagePromise = ImagesToLoad.map((image) => {
        //   Asset.loadAsync(image);
        // });
        // return Promise.all([...FontsPromise, ...ImagePromise]);
        return Promise.all([...FontsPromise]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    const preload = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        isLoggedInVar(true);
        tokenVar(token);
      }
      // await persistCache({
      //   cache,
      //   storage: new AsyncStorageWrapper(AsyncStorage),
      // });
      return preLoadAsset();
    };

    preload();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <OnlayoutView onLayout={onLayoutRootView}>
          {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
        </OnlayoutView>
      </NavigationContainer>
    </ApolloProvider>
  );
}
