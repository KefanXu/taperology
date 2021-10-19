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
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import { GoogleLogin } from "./googleLogin";

import moment, { min } from "moment";
const PRIMARY_COLOR = "#D8D8D8";
export class Schedule extends React.Component {
  constructor(props) {
    super(props);
    // console.log(
    //   "scheduleData: this.props.scheduleData",
    //   this.props.scheduleData
    // );

    this.dataModel = getDataModel();
    this.state = {
      scheduleData: this.props.scheduleData,
      data: this.props.data,
      userKey: this.props.userKey,
      stepNum: this.props.data.totalStep,
      startingDose: this.props.data.startDose,
    };
  }
  resetSchedule = () => {
    this.setState({ scheduleData: this.props.scheduleData });
    this.setState({ data: this.props.data });
    this.setState({ userKey: this.props.userKey });
  };

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
  addStep = () => {
    // console.log("this.state.stepNum", this.props.data.stepNum);
    // console.log("this.state.scheduleData", this.state.scheduleData);
    let currentStepNum = this.props.data.stepNum;
    currentStepNum++;
    this.setState({ stepNum: currentStepNum });
    let duration = 14;
    let currentSchedule = this.state.scheduleData;
    let lastStep = currentSchedule[this.state.scheduleData.length - 1];
    // console.log("lastStep.dosage", lastStep.dosage);
    // console.log("this.state.startingDose", this.props.data.startDose);
    if (lastStep && lastStep.dosage > 0) {
      let recurrentDose =
        lastStep.dosage - parseInt(this.props.data.startDose) * 0.05;
      let step = {
        id: lastStep.id + 1,
        duration: duration,
        startDate: moment(moment(new Date(lastStep.startDate)).add(15, "d"))
          .format()
          .slice(0, 10),
        dosage: recurrentDose,
      };
      console.log("recurrentDose", recurrentDose);

      currentSchedule.push(step);
      this.setState({ scheduleData: currentSchedule });
      // this.setState({ confirmModalTxt: "One step added." });
    } else {
      // this.setState({ confirmModalTxt: "Can't add more steps" });
    }

    // this.setState({ isConfirmationVisibleModal: true });
    //console.log("step", step);
  };
  removeStep = () => {
    let lastStep = this.state.scheduleData[this.state.scheduleData.length - 1];
    if (lastStep.id > 1) {
      let currentSchedule = this.state.scheduleData;
      currentSchedule.pop();
      this.setState({ scheduleData: currentSchedule });
    }
  };
  updateSchedule = () => {
    // let newSchedule = this.state.scheduleData;
    let newScheduleProfile = this.props.data;
    newScheduleProfile.totalStep = newScheduleProfile.schedule.length;
    let userKey = this.state.userKey;
    let scheduleKey = newScheduleProfile.key;
    // console.log("newSchedule", newSchedule);
    console.log("newScheduleProfile", newScheduleProfile);
    this.dismiss();
    this.dataModel.updateSchedule(userKey, scheduleKey, newScheduleProfile);
  };
  dismiss = () => {
    this.props.dismiss();
  }
  render() {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ marginLeft: 20, flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: 150,
              //backgroundColor:"red"
            }}
            onPress={() => {
              this.addStep();
            }}
            disabled={this.state.isAddBtnDisable}
          >
            <Ionicons name="add-circle" size={32} color="black" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Add Step
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: 150,
              //backgroundColor:"red"
            }}
            onPress={() => {
              this.removeStep();
            }}
            disabled={this.state.isAddBtnDisable}
          >
            <Ionicons name="remove-circle" size={32} color="black" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Remove Step
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: 15,
              width: 200,
              //backgroundColor:"red"
            }}
            onPress={() => {
              this.updateSchedule();
            }}
            disabled={this.state.isAddBtnDisable}
          >
            <Entypo name="save" size={32} color="black" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Save Changes
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: 200,
              marginLeft: 20,
              //backgroundColor:"red"
            }}
            onPress={async () => {
              if (this.dataModel.isLogin) {
                this.saveSchedule();
              } else {
                this.setState({ isLoginVisibleModal: true });
                this.setState({ entry: "save" });
              }
            }}
            disabled={this.state.isAddBtnDisable}
          >
            <MaterialIcons name="note-add" size={32} color="black" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Save Schedule
            </Text>
          </TouchableOpacity> */}
        </View>
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
            renderItem={({ item }) => {
              let isNow = false;
              let todayDate = new Date();
              let firstStep = this.state.scheduleData[0];
              let firstStepStartDate = new Date(firstStep.startDate);
              let thisStep = this.state.scheduleData[parseInt(item.id) - 1];
              let thisStepStartDate = new Date(thisStep.startDate);
              if (todayDate >= firstStepStartDate) {
                if (this.state.scheduleData[parseInt(item.id)]) {
                  let nextStep = this.state.scheduleData[parseInt(item.id)];
                  // console.log("nextStep", nextStep);
                  let todayDate = new Date();
                  let nextStartDate = new Date(nextStep.startDate);
                  // console.log("nextStartDate", nextStartDate);
                  if (
                    todayDate < nextStartDate &&
                    todayDate >= thisStepStartDate
                  ) {
                    isNow = true;
                  }
                } else {
                  if (
                    todayDate <=
                      new Date(
                        new Date(thisStep.startDate).getTime() +
                          14 * 24 * 60 * 60 * 1000
                      ) &&
                    todayDate > thisStepStartDate
                  ) {
                    isNow = true;
                  }
                }
              }

              return (
                <View
                  style={{
                    padding: 20,
                    marginVertical: 8,
                    marginHorizontal: 16,
                    flex: 1,
                    flexDirection: "row",
                    borderBottomColor: "black",
                    borderBottomWidth: isNow ? 0 : 1,
                    borderRadius: isNow ? 20 : 0,
                    borderColor: isNow ? "black" : "none",
                    backgroundColor: isNow ? PRIMARY_COLOR : "none",
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
                      {(parseInt(item.dosage) /
                        parseInt(this.state.data.startDose)) *
                        100}
                      %
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.increaseDose(item.id)}
                    >
                      <AntDesign name="caretright" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}
