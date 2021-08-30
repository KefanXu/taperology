import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Index } from "./index";
import { Calculator } from "./Calculator";
import { Resources } from "./Resource";
import { UserCenter} from "./UserCenter";

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Calculator"
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
}

// const styles = StyleSheet.create({
// 	text: {
// 		fontWeight: "bold",
// 		fontSize: 30
// 	}
// })

export default App;
