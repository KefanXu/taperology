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
} from "react-native";
import { GoogleLogin } from "./googleLogin";

import { Button, DataTable } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
// import AwesomeAlert from "react-native-awesome-alerts";
import Modal from "modal-enhanced-react-native-web";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getDataModel } from "./DataModel";

import moment, { min } from "moment";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
export class Menu extends React.Component {
  // constructor(props) {
  //   // this.loginDismiss = this.props.loginDismiss();
  //   // this.navUserCenter = this.props.navUserCenter();
  // }
  navUserCenter = () => this.props.navUserCenter();
  render() {
    return (
      <View
        style={{
          width: 250,
          backgroundColor: PRIMARY_COLOR,
          margin: 5,
          borderRadius: 15,
          // height: Dimensions.get("window").height,
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
            style={{ margin: 10 }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 35, margin: 5 }}>
              Taperology
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navResource();
          }}
          style={{ margin: 10 }}
        >
          <View style={{ flex: 1, margin: 5 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Resources</Text>
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
              onPress={() =>
                Linking.openURL(
                  "https://findtreatment.samhsa.gov/locator?sAddr=48103&submit=Go"
                )
              }
            >
              Refer Patient
            </Text>
          </View>
        </TouchableOpacity>
        {/* <View style={{ marginTop: 20, marginLeft: 15 }}>
          <GoogleLogin />
        </View> */}
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={() => {
            this.props.navUserCenter();
          }}
        >
          <FontAwesome name="user-circle-o" size={32} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
}
