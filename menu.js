/*
This code refer to the menu bar on the top 
which contains navigation to different sections
*/
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
  LayoutAnimation,
  SectionList,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  Picker,
  FlatList,
  Modal,
} from "react-native";

//API to login with Google account
//It's not used in the current version but can be activated if there is a future need.
import { GoogleLogin } from "./googleLogin";
import * as Analytics from "expo-firebase-analytics";

import { Button, DataTable } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

import { Overlay } from "react-native-elements";

import { getDataModel } from "./DataModel";

import moment, { min } from "moment";

const PRIMARY_COLOR = "#D8D8D8";

export class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
  }

  navUserCenter = () => this.props.navUserCenter();
  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width * 0.8,
          shadowColor: "black",
          shadowOffset: 5,
          borderWidth: 1,
          borderBottomWidth: 6,
          borderColor: PRIMARY_COLOR,
          borderBottomColor: "purple",
          backgroundColor: "white",
          margin: 5,
          borderRadius: 15,
          justifyContent: "center",
          height: Dimensions.get("window").width > 1000 ? 80 : 150,
          marginBottom: 50,
        }}
      >
        {/* render the menu bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: Dimensions.get("window").width > 1000 ? 20 : 5,
          }}
        >
          {/* render "Taperology" text */}
          <View
            style={{
              justifyContent:
                Dimensions.get("window").width > 1000
                  ? "space-between"
                  : "center",
              flex: Dimensions.get("window").width > 1000 ? 0.3 : 0.7,
              alignItems: "center",
              borderColor: "rgba(0,0,0,0)",
              borderRightColor: PRIMARY_COLOR,
              borderWidth: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navIndex();
              }}
              style={{ margin: 0 }}
            >
              <Text
                style={{
                  margin: Dimensions.get("window").width > 1000 ? 15 : 2,
                  fontWeight: "bold",
                  fontSize: Dimensions.get("window").width > 1000 ? 35 : 35,
                }}
              >
                Taperology
              </Text>
            </TouchableOpacity>
          </View>
          {/* render the rest of navigation text */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flex: 0.7,
              padding: 30,
              flexDirection:
                Dimensions.get("window").width > 1000 ? "row" : "column",
            }}
          >
            {/* render "Resource" text */}
            <TouchableOpacity
              onPress={async () => {
                this.props.navResource();
                {
                  /* navigate to "Resource" section, Google analytics tracking function should be added here */
                }
              }}
              style={{ margin: 10 }}
            >
              <View style={{ flex: 1, margin: 5 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: Dimensions.get("window").width > 1000 ? 20 : 15,
                  }}
                >
                  Resources
                </Text>
              </View>
            </TouchableOpacity>
            {/* render "Taper Scheduler" text */}
            <TouchableOpacity
              onPress={() => {
                /* navigate to "Taper Scheduler" section, Google analytics tracking function should be added here */
                this.props.navCal();
              }}
              style={{ margin: 10 }}
            >
              <View
                style={{
                  flex: 1,
                  margin: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: Dimensions.get("window").width > 1000 ? 20 : 15,
                  }}
                >
                  Taper Scheduler
                </Text>
              </View>
            </TouchableOpacity>
            {/* render "Refer Patient" text */}
            <TouchableOpacity style={{ margin: 10 }} disabled={true}>
              <View style={{ flex: 1, margin: 5 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: Dimensions.get("window").width > 1000 ? 20 : 15,
                  }}
                  onPress={async () => {
                    /* popup refer patient popup, Google analytics tracking function should be added here */
                    this.props.showReferPatientModal();
                  }}
                >
                  Refer Patient
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
