import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Index } from "./index";
import { Calculator } from "./Calculator";
import { Resources } from "./Resource";
import { UserCenter } from "./UserCenter";
import * as Analytics from "expo-firebase-analytics";


import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { firebaseConfig } from "./secret";
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();
// Analytics.setUnavailabilityLogging(false);
Analytics.setAnalyticsCollectionEnabled(true);
// Analytics.setUserId("1");

console.log("app init");

export default function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        console.log("previousRouteName",previousRouteName);
        console.log("currentRouteName",currentRouteName);

        if (previousRouteName !== currentRouteName) {
          // The line below uses the expo-firebase-analytics tracker
          // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
          // Change this line to use another Mobile analytics SDK
          // Analytics.setCurrentScreen(currentRouteName, currentRouteName);
          // alert(`The route changed to ${currentRouteName}`);
          let eventName = "FROM" + previousRouteName + "TO" + currentRouteName;
          await Analytics.setCurrentScreen(currentRouteName);

          await Analytics.logEvent(eventName, {
            name: "ChangeScreen",
            screen: "Menu",
            purpose: "Opens the internal settings",
          });
        }

        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{
          headerShown: false,
          headerLeft: null,
        }}
      >
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Calculator" component={Calculator} />
        <Stack.Screen name="Resources" component={Resources} />
        <Stack.Screen name="UserCenter" component={UserCenter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
// 	text: {
// 		fontWeight: "bold",
// 		fontSize: 30
// 	}
// })

// export default App;
