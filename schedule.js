// This file provide ways to manipulate the schedule in user center
// Since the User Center has been removed in the current version, this file is not in use
// *TO BE NOTICE: This file copied codes from the Calculator.js file but didn't update simultaneously
// *Thus lots of functions in this field need to be adjusted to match the current mechanism used in Calculator.js
// *If there is a need to activate this function in the future, I would recommend to rewrite this part by referring to the current Calculator.js and this file
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
  Picker,
  FlatList,
} from "react-native";

import { Button, DataTable } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import Modal from "modal-enhanced-react-native-web";
import * as Analytics from "expo-firebase-analytics";

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
const WARN_RED = "#FE2E2E";
const STRENGTHS = {
  Alprazolam: 0.125,
  Lorazepam: 0.25,
  Clonazepam: 0.0625,
  Diazepam: 1,
  Temazepam: 3.75,
};

export class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.state = {
      scheduleData: this.props.scheduleData,
      data: this.props.data,
      userKey: this.props.userKey,
      stepNum: this.props.data.totalStep,
      startingDose: this.props.data.startDose,
      isDeleteWarningModalVis: false,
      currentStd: "",
      isDatePickerVis: false,
      datePickerDate: "",
    };
  }
  // When the user wants to delete a schedule, show the warning popup
  showDeleteWarningModal = () => {
    this.setState({ isDeleteWarningModalVis: true });
  };
  //Round the calculated dosage to match with the its strength (so can be fully divided)
  roundTo = (val, std) => {
    let init = 0;
    do {
      init = init + std;
    } while (init < val);
    let roundResult = init - std;
    let result;
    if (init === val) {
      result = init;
    } else {
      result = roundResult;
    }
    return result;
  };
  //Generate the taper schedule (used in "Add Steps", "Remove Steps", and "Save as new schedule").
  generateSchedule = async () => {
    let initialDate;
    if (this.state.isDatePickerVis) {
      initialDate = this.state.datePickerDate;
    } else {
      initialDate = this.state.data.startDate;
    }

    let currentSchedule = this.state.scheduleData;
    let schedule = [];
    let startingInputDose = parseInt(this.state.startingDose);
    let startingDose = startingInputDose;
    let reducedDose = startingInputDose * 0.25;
    let recurrentDate = initialDate;
    for (let i = 0; i < 2; i++) {
      let id = i + 1;
      let duration = 14;
      let recurrentDose = startingDose - reducedDose;
      startingDose = recurrentDose;
      let roundedDose = this.roundTo(recurrentDose, this.state.currentStd);

      let step = {
        id: id,
        duration: duration,
        startDate: recurrentDate,
        dosage: roundedDose,
      };
      schedule.push(step);
      recurrentDate = moment(moment(new Date(recurrentDate)).add(15, "d"))
        .format()
        .slice(0, 10);
    }
    let remainingDose = startingDose;
    reducedDose = remainingDose / (this.state.stepNum - 2);
    console.log("startingDose", startingDose);
    console.log("reducedDose", reducedDose);
    let ifAdd = true;

    for (let i = 2; i < this.state.stepNum; i++) {
      let id = i + 1;
      let duration = 14;
      let recurrentDose = startingDose - reducedDose;
      startingDose = recurrentDose;
      if (recurrentDose < this.state.currentStd) {
        recurrentDose = 0;
      }
      let roundedDose = this.roundTo(recurrentDose, this.state.currentStd);

      let step = {
        id: id,
        duration: duration,
        startDate: recurrentDate,
        dosage: roundedDose,
      };
      if (ifAdd) {
        schedule.push(step);
      }

      if (roundedDose === 0) {
        ifAdd = false;
      }
      // schedule.push(step);
      recurrentDate = moment(moment(new Date(recurrentDate)).add(15, "d"))
        .format()
        .slice(0, 10);
    }
    console.log("schedule", schedule);
    currentSchedule = schedule;
    if (this.state.isDatePickerVis) {
      await this.saveSchedule(currentSchedule);
    } else {
      await this.setState({ scheduleData: currentSchedule });
    }
  };
  //Save a new schedule and update it on Firebase
  saveSchedule = async (scheduleToSave) => {
    let newScheduleProfile = Object.assign({}, this.props.data);
    newScheduleProfile.startDate = this.state.datePickerDate;
    newScheduleProfile.createdDate = moment(new Date()).format();
    newScheduleProfile.schedule = scheduleToSave;

    await this.dataModel.createNewSchedule(
      this.dataModel.key,
      newScheduleProfile
    );

    await this.update();
    await Analytics.logEvent("saveAsNewSchedule", {
      screen: "UserCenter",
      purpose: "Opens the internal settings",
    });
  };
  //Fired when the user clicks the left arrow on "Target Dosage"
  reduceDose = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.dosage === 0) {
          return;
        } else {
          step.dosage = step.dosage - this.state.currentStd;
        }
      }
    }
    this.setState({ scheduleData: currentSchedule });
  };
  //Fired when the user clicks the right arrow on "Target Dosage"
  increaseDose = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.dosage >= this.state.startingDose) {
          return;
        } else {
          step.dosage = step.dosage + this.state.currentStd;
        }
      }
    }
    this.setState({ scheduleData: currentSchedule });
  };
  //Fired when the user clicks the left arrow on "Duration"
  reduceDuration = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (step.duration === 1) {
          return;
        } else {
          step.duration--;
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
  //Fired when the user clicks the right arrow on "Duration"
  increaseDuration = (id) => {
    let currentSchedule = this.state.scheduleData;
    for (let step of currentSchedule) {
      if (step.id === id) {
        step.duration++;
      }
      if (step.id > id) {
        step.startDate = moment(moment(new Date(step.startDate)).add(2, "d"))
          .format()
          .slice(0, 10);
      }
    }
    this.setState({ schedule: currentSchedule });
  };
  //Fired when the user clicks "Add Step"
  addStep = async () => {
    let currentStepNum = this.state.stepNum;
    currentStepNum++;
    await this.setState({ stepNum: currentStepNum });
    this.generateSchedule();
  };
  //Fired when the user clicks "Remove Step"
  removeStep = async () => {
    let lastStep = this.state.scheduleData[this.state.scheduleData.length - 1];
    if (lastStep.id > 2) {
      let currentStepNum = this.state.stepNum;
      currentStepNum--;
      await this.setState({ stepNum: currentStepNum });
      this.generateSchedule();
    }
  };
  //Update an existing schedule and update it on Firebase
  updateSchedule = async () => {
    let newScheduleProfile = this.props.data;
    newScheduleProfile.totalStep = this.state.scheduleData.length;
    newScheduleProfile.schedule = this.state.scheduleData;
    let userKey = this.state.userKey;
    let scheduleKey = newScheduleProfile.key;
    console.log("newScheduleProfile", newScheduleProfile);
    this.dismiss();
    this.dataModel.updateSchedule(userKey, scheduleKey, newScheduleProfile);
    await Analytics.logEvent("saveScheduleChanges", {
      name: "saveScheduleChanges",
      screen: "UserCenter",
    });
  };
  //Fired when the user clicks the delete button, then popup the alert window
  deleteSchedule = async () => {
    await this.setState({ isDeleteWarningModalVis: true });
  };
  //Close the delete alert window
  deleteScheduleCancel = async () => {
    await this.setState({ isDeleteWarningModalVis: false });
  };
  //Delete a schedule once the user confirms, update it on the Firebase
  deleteScheduleConfirmed = async () => {
    let scheduleKey = this.props.data.key;
    let userKey = this.state.userKey;

    await this.dataModel.deleteSchedule(userKey, scheduleKey);
    await this.dataModel.loadUserSchedules(this.state.userKey);
    await this.update();
    await this.setState({ isDeleteWarningModalVis: false });
    this.dismiss();
    await Analytics.logEvent("deleteSchedule", {
      name: "deleteSchedule",
      screen: "UserCenter",
    });
  };
  //Close the schedule, passed from UserCenter.js
  dismiss = () => {
    this.props.dismiss();
  };
  //Update schedule with changes, passed from UserCenter.js
  update = () => {
    this.props.update();
  };
  //Close the Date Picker popup
  closeDatePicker = () => {
    this.setState({ isDatePickerVis: false });
  };
  //Fired when the user click "Save as"
  saveAsNew = () => {
    this.generateSchedule();
  };

  render() {
    return (
      <View style={{ width: "100%" }}>
        {/* Render the date picker */}
        <DatePickerModal
          label="Select Start Date"
          mode="single"
          visible={this.state.isDatePickerVis}
          onDismiss={this.closeDatePicker}
          date={new Date()}
          onConfirm={async (date) => {
            let selectedDate = moment(new Date(date.date))
              .format()
              .slice(0, 10);
            await this.setState({
              datePickerDate: selectedDate,
            });
            this.saveAsNew();
            this.closeDatePicker();
          }}
        />
        {/* Render the Delete Alert Popup */}
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isDeleteWarningModalVis}
          onBackdropPress={() =>
            this.setState({ isDeleteWarningModalVis: false })
          }
        >
          <View
            style={{
              backgroundColor: "white",
              width: "20%",
              padding: 22,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 80,
              borderColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text
              style={{
                flex: 0.5,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Are you sure?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "80%",
              }}
            >
              <TouchableOpacity onPress={() => this.deleteScheduleCancel()}>
                <AntDesign name="closecircle" size={32} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.deleteScheduleConfirmed()}>
                <AntDesign name="checkcircle" size={32} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Render the button block and basic info */}
        <View
          style={{
            marginLeft: 20,
            marginTop: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Created date:
            </Text>
            <Text>
              {this.state.data.createdDate
                ? this.state.data.createdDate.slice(0, 16)
                : ""}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Benzo Type:</Text>
              {this.state.data.bezo ? this.state.data.bezo : ""}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Start Date </Text>
              {this.state.data.startDate ? this.state.data.startDate : ""}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 5 }}>
              <Text style={{ fontWeight: "bold" }}>Starting Dose </Text>
              {this.state.data.startDose ? this.state.data.startDose : ""} mg
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 150,
                flex: 1,
              }}
              onPress={() => {
                this.addStep();
              }}
              disabled={this.state.isAddBtnDisable}
            >
              <Ionicons name="add-circle" size={32} color="black" />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
                Add Step
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 150,
                flex: 1,
                //backgroundColor:"red"
              }}
              onPress={() => {
                this.removeStep();
              }}
              disabled={this.state.isAddBtnDisable}
            >
              <Ionicons name="remove-circle" size={32} color="black" />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
                Remove Step
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 15,
                width: 180,
                flex: 1,
              }}
              onPress={() => {
                this.updateSchedule();
              }}
              disabled={this.state.isAddBtnDisable}
            >
              <Entypo name="save" size={32} color="black" />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 0,
                width: 150,
                flex: 1,
              }}
              onPress={() => {
                console.log("this.props.data", this.props.data);
                this.setState({ isDatePickerVis: true });
                this.dismiss();
              }}
              disabled={this.state.isAddBtnDisable}
            >
              <Ionicons name="duplicate" size={32} color="black" />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
                Save as
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 150,
              }}
              onPress={() => {
                this.deleteSchedule();
              }}
              disabled={this.state.isAddBtnDisable}
            >
              <MaterialIcons name="delete" size={32} color={WARN_RED} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: WARN_RED,
                }}
              >
                Delete Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Render the header of the schedule */}
        <View
          style={{
            padding: 20,
            marginTop: 20,
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
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Step</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Duration</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Start Date</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              Target Dosage / Starting Dosage
            </Text>
          </View>
        </View>
        {/* Render the body of the schedule */}
        <View
          style={{
            height: 500,
            margin: 10,
            flexDirection: "row",
            justifyContent: "center",
            opacity: this.state.listOpacity,
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
              // Hight the current stage
              if (todayDate >= firstStepStartDate) {
                if (this.state.scheduleData[parseInt(item.id)]) {
                  let nextStep = this.state.scheduleData[parseInt(item.id)];
                  let todayDate = new Date();
                  let nextStartDate = new Date(nextStep.startDate);
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
                  {/* Step Column */}
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>Step {item.id}</Text>
                  </View>
                  {/* Duration Column */}
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
                  {/* Start Date Column */}
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{item.startDate}</Text>
                  </View>
                  {/* Dosage Column */}
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
                      {item.dosage} mg |{" "}
                      {parseInt(
                        (parseInt(item.dosage) /
                          parseInt(this.state.data.startDose)) *
                          100
                      )}
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
