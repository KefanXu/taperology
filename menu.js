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
  Picker,
  FlatList,
} from "react-native";

import { Button, DataTable } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
// import AwesomeAlert from "react-native-awesome-alerts";
import Modal from "modal-enhanced-react-native-web";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import moment, { min } from "moment";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
export class Menu extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 0.2,
          backgroundColor: PRIMARY_COLOR,
          margin: 5,
          borderRadius: 15,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navIndex();
            }}
            style={{ margin: 10 }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 50, margin: 5 }}>
              Taperology
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 5 }}>
            <FontAwesome name="user-circle-o" size={32} color="black" />
          </TouchableOpacity>
        </View>

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
              padding: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>
              Tapper Schedular
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navResource();
          }}
          style={{ margin: 10 }}
        >
          <View style={{ flex: 1, margin: 5, padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>Resources</Text>
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
          <View style={{ flex: 1, margin: 5, padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>
              Refer Patient
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
