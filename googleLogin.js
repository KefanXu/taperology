// This file returns a Google login button
// Users can login with their Google account and receive personal data (saved schedules)
// Since the current version doesn't have any user-related feature 
// This file is left for any future use
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { Button } from "react-native";
import * as Analytics from "expo-firebase-analytics";

import { getDataModel } from "./DataModel";
import {
  TextInput,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  LayoutAnimation,
  SectionList,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Picker,
  FlatList,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

//Add config here to initiate Google login service 
const config = {

};

export function GoogleLogin(props) {
  // Using Expo's Authentication API:
  // https://docs.expo.dev/guides/authentication/#google
  const [request, response, promptAsync] = Google.useAuthRequest(config);
  let auth;
  let dataModel = getDataModel();
  const { navUserCenter, dismissLoginModal, saveSchedule, entry, alertSignIn } =
    props;
  const [requestFrom, setRequestFrom] = React.useState("");

  React.useEffect(async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      auth = authentication;

      let accessToken = auth.accessToken;

      let userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      let userInfoResponseJSON = await userInfoResponse.json();
      let userEmail = userInfoResponseJSON.email;
      let userList = dataModel.users;
      let isUserExist = false;
      for (let user of userList) {
        if (user.email) {
          if (user.email === userEmail) {
            isUserExist = true;
            Analytics.setUserId(userEmail);
            dataModel.currentUser = userEmail;
            dataModel.key = user.key;
            await dataModel.loadUserSchedules(dataModel.key);
            console.log("dataModel.plans", dataModel.plans);
          }
        }
      }

      if (!isUserExist) {
        if (requestFrom === "1") {
          dataModel.createNewUser(userEmail);
          // Analytics.setUserId(userEmail);
        } else {
          alertSignIn();
          dismissLoginModal();
          return;
        }
      }
      dataModel.isLogin = true;
      // User can login by clicking on the button in the menu bar 
      // Or they will be asked to log in when they want to save a schedule
      if (entry === "menu") {
        navUserCenter();
        dismissLoginModal();
      } else {
        await dismissLoginModal();
        saveSchedule();
      }
    }
  }, [response]);

  return (
    // Render a clickable button 
    <View>
      <TouchableOpacity
        disabled={!request}
        style={{
          backgroundColor: "black",
          borderRadius: 20,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          width: 200,
          marginTop: 10,
        }}
        onPress={async () => {
          await setRequestFrom((requestFrom) => (requestFrom = "1"));
          await promptAsync();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Sign in with Google
        </Text>
      </TouchableOpacity>{" "}
    </View>
  );
}
