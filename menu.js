import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { GoogleLogin } from "./googleLogin";
import * as Analytics from "expo-firebase-analytics";

import { Button, DataTable } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
// import AwesomeAlert from "react-native-awesome-alerts";
// import Modal from "modal-enhanced-react-native-web";
import { Overlay } from "react-native-elements";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getDataModel } from "./DataModel";

import moment, { min } from "moment";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    //   // this.loginDismiss = this.props.loginDismiss();
    //   // this.navUserCenter = this.props.navUserCenter();
  }

  navUserCenter = () => this.props.navUserCenter();
  render() {
    return (
      // <Overlay>
      <View
        style={{
          width: 1000,
          backgroundColor: PRIMARY_COLOR,
          margin: 5,
          borderRadius: 15,
          justifyContent: "space-between",
          justifyContent:"center",
          height: 80,
          marginBottom:50,

        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navIndex();
              }}
              style={{ margin: 0 }}
            >
              <Text style={{ margin: 15, fontWeight: "bold", fontSize: 35 }}>
                Taperology
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "50%",
              // backgroundColor: "red",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                this.props.navResource();
                // console.log("navResource");
                // await Analytics.logEvent("GoToResource", {
                //   name: "ChangeScreen",
                //   screen: "Menu",
                //   // purpose: "Opens the internal settings",
                // });
              }}
              style={{ margin: 10 }}
            >
              <View style={{ flex: 1, margin: 5 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Resources
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.props.navCal();
              }}
              style={{ margin: 10 }}
            >
              <View
                style={{
                  flex: 1,
                  // backgroundColor: SEC_COLOR,
                  margin: 5,
                  borderRadius: 5,
                  // padding: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Taper Scheduler
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.navigate("Calculator", {
                //   // needsUpdate: this.needsUpdate,
                // });
              }}
              style={{ margin: 10 }}
              disabled={true}
            >
              <View style={{ flex: 1, margin: 5 }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 20 }}
                  onPress={async () => {
                    // Linking.openURL(
                    //   "https://findtreatment.samhsa.gov/locator?sAddr=48103&submit=Go"
                    // );
                    // await Analytics.logEvent("ClickReferPatient", {
                    //   name: "ChangeScreen",
                    //   screen: "Menu",
                    //   // purpose: "Opens the internal settings",
                    // });
                    this.props.showReferPatientModal();
                  }}
                >
                  Refer Patient
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* <View style={{ marginTop: 20, marginLeft: 15 }}>
          <GoogleLogin />
        </View> */}
          <TouchableOpacity
            style={{ margin: 15, flexDirection:"row", alignItems:"center" }}
            onPress={() => {
              this.props.navUserCenter();
            }}
          >
            <FontAwesome name="user-circle-o" size={32} color="black" />
            <Text style={{ fontWeight: "bold", fontSize: 15, marginLeft:15 }}>
              User Center
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View>
          <Text style={{ margin: 15, fontSize: 10 }}>
            This website was created as part of a project funded by the National
            Institute on Drug Abuse (R01DA045705) to Donovan Maust, MD. {"\n"}
            {"\n"}For questions or comments, please contact{" "}
            <Text style={{ fontWeight: "bold" }}>
              Charity Hoffman, PhD, MSW
            </Text>
            {"\n"}(project coordinator; charityh@med.umich.edu).
          </Text>
        </View> */}
      </View>
      // </Overlay>
    );
  }
}
