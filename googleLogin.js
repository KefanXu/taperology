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
  // Modal,
  LayoutAnimation,
  SectionList,
  // Button,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Picker,
  FlatList,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const config = {
  // expoClientId:
  //   "734078016442-rs8o5titja31ne113sl1s8nhsftfi1f9.apps.googleusercontent.com",
  webClientId:
    "734078016442-rs8o5titja31ne113sl1s8nhsftfi1f9.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/userinfo.email"],
};

export function GoogleLogin(props) {
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
      //console.log("auth",auth);
      // console.log("dataModel.isLogin",dataModel.isLogin);
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
      // if (requestFrom === "1") {
      //   // console.log("requestFrom",requestFrom);
      // }
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
    <View>
      {/* <TouchableOpacity
        disabled={!request}
        style={{
          backgroundColor: "black",
          borderRadius: 20,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          width: 200,

          // marginTop: 50,
          // marginLeft: 15,
        }}
        onPress={async () => {
          await promptAsync();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Login with Google
        </Text>
      </TouchableOpacity> */}
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

          // marginTop: 50,
          // marginLeft: 15,
        }}
        onPress={async () => {
          await setRequestFrom((requestFrom) => (requestFrom = "1"));
          // console.log("requestFrom",requestFrom);
          await promptAsync();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Sign in with Google
        </Text>
      </TouchableOpacity>{" "}
      {/* <TouchableOpacity
        disabled={!request}
        style={{
          backgroundColor: "black",
          borderRadius: 20,
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          width: "60%",
          marginTop: 50,
          marginLeft: 15,
        }}
        onPress={async () => {
          
          let isLogin = await AuthSession.dismiss();
          console.log("isLogin",isLogin);
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
