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
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import { GoogleLogin } from "./googleLogin";

import moment, { min } from "moment";
export class Schedule extends React.Component {
  constructor(props) {
    super(props);
    console.log("scheduleData: this.props.scheduleData",this.props.scheduleData);
    this.state = {
      scheduleData: this.props.scheduleData,
      data: this.props.data,
    };
  }
  resetSchedule = () => {
    this.setState({scheduleData: this.props.scheduleData});
    this.setState({data: this.props.data});
  }
  
  reduceDose = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.dosage === 0) {
          return;
        } else {
          step.dosage--;
        }
      }
    }
    this.setState({ scheduleData: currentSchedule });
  };
  increaseDose = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.dosage >= this.state.startingDose) {
          return;
        } else {
          step.dosage++;
        }
      }
    }
    this.setState({ scheduleData: currentSchedule });
  };
  reduceDuration = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.duration === 1) {
          return;
        } else {
          step.duration--;
          // step.startDate = moment(
          //   moment(new Date(step.startDate)).subtract(0, "d")
          // )
          //   .format()
          //   .slice(0, 10);
        }
      }
      if (step.id > id) {
        step.startDate = moment(
          moment(new Date(step.startDate)).subtract(0, "d")
        )
          .format()
          .slice(0, 10);
      }
    }
    this.setState({ schedule: currentSchedule });
  };
  increaseDuration = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        step.duration++;
        // step.startDate = moment(moment(new Date(step.startDate)).add(2, "d"))
        //   .format()
        //   .slice(0, 10);
      }
      if (step.id > id) {
        step.startDate = moment(moment(new Date(step.startDate)).add(2, "d"))
          .format()
          .slice(0, 10);
      }
    }
    this.setState({ schedule: currentSchedule });
  };
  render() {
    return (
      <View style={{width:"100%"}}>
        <View
          style={{
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderBottomColor: "black",
            borderBottomWidth: 2,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Step</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Duration</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Start Date</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Target Dosage / Starting Dosage
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 300,
            margin: 10,
            flexDirection: "row",
            justifyContent: "center",
            opacity: this.state.listOpacity,

            //alignItems: "center",
          }}
        >
          <FlatList
            data={this.state.scheduleData}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 20,
                  marginVertical: 8,
                  marginHorizontal: 16,
                  flex: 1,
                  flexDirection: "row",
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>Step {item.id}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.reduceDuration(item.id);
                    }}
                  >
                    <AntDesign name="caretleft" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14 }}>{item.duration} days</Text>
                  <TouchableOpacity
                    onPress={() => this.increaseDuration(item.id)}
                  >
                    <AntDesign name="caretright" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{item.startDate}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.reduceDose(item.id);
                    }}
                  >
                    <AntDesign name="caretleft" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14 }}>
                    {parseInt(item.dosage)} |{" "}
                    {parseInt(item.dosage) / parseInt(this.state.data.startDose) * 100}%
                  </Text>
                  <TouchableOpacity onPress={() => this.increaseDose(item.id)}>
                    <AntDesign name="caretright" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
