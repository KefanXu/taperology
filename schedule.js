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
export class Schedule extends React.Component {
  constructor(props) {
    super(props);
    // console.log(
    //   "scheduleData: this.props.scheduleData",
    //   this.props.scheduleData
    // );
    // console.log("height",Dimensions.get("window").height);
    this.dataModel = getDataModel();
    this.state = {
      scheduleData: this.props.scheduleData,
      data: this.props.data,
      userKey: this.props.userKey,
      stepNum: this.props.data.totalStep,
      startingDose: this.props.data.startDose,
      isDeleteWarningModalVis: false,
      // height: Dimensions.get("window").height
    };
  }
  showDeleteWarningModal = () => {
    this.setState({ isDeleteWarningModalVis: true });
  };
  resetSchedule = () => {
    // console.log("resetSchedule", this.props.data);
    this.setState({ scheduleData: this.props.scheduleData });

    this.setState({ data: this.props.data });
    this.setState({ userKey: this.props.userKey });
    this.setState({ stepNum: this.props.data.totalStep });
    this.setState({ startingDose: this.props.data.startDose });
  };
  generateSchedule = async () => {
    let initialDate = this.state.data.startDate;
    let currentSchedule = this.state.scheduleData;
    //console.log("initialDate", initialDate);
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
      let step = {
        id: id,
        duration: duration,
        startDate: recurrentDate,
        dosage: recurrentDose,
      };
      schedule.push(step);
      recurrentDate = moment(moment(new Date(recurrentDate)).add(15, "d"))
        .format()
        .slice(0, 10);
    }
    // reducedDose = startingInputDose * 0.05;
    let remainingDose = startingDose;
    reducedDose = remainingDose / (this.state.stepNum - 2);
    console.log("startingDose", startingDose);
    console.log("reducedDose", reducedDose);
    for (let i = 2; i < this.state.stepNum; i++) {
      let id = i + 1;
      let duration = 14;
      let recurrentDose = startingDose - reducedDose;
      startingDose = recurrentDose;
      if (recurrentDose < 1) {
        recurrentDose = 0;
      }
      let step = {
        id: id,
        duration: duration,
        startDate: recurrentDate,
        dosage: recurrentDose,
      };
      schedule.push(step);
      recurrentDate = moment(moment(new Date(recurrentDate)).add(15, "d"))
        .format()
        .slice(0, 10);
    }
    console.log("schedule", schedule);
    currentSchedule = schedule;
    await this.setState({ scheduleData: currentSchedule });
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
  addStep = async () => {
    // console.log("this.state.stepNum", this.props.data.stepNum);
    // console.log("this.state.scheduleData", this.state.scheduleData);
    let currentStepNum = this.state.stepNum;
    currentStepNum++;
    await this.setState({ stepNum: currentStepNum });
    this.generateSchedule();

    // let duration = 14;
    // let currentSchedule = this.state.scheduleData;
    // let lastStep = currentSchedule[this.state.scheduleData.length - 1];
    // // console.log("lastStep.dosage", lastStep.dosage);
    // // console.log("this.state.startingDose", this.props.data.startDose);
    // if (lastStep && lastStep.dosage > 0) {
    //   let recurrentDose =
    //     lastStep.dosage - parseInt(this.props.data.startDose) * 0.05;
    //   let step = {
    //     id: lastStep.id + 1,
    //     duration: duration,
    //     startDate: moment(moment(new Date(lastStep.startDate)).add(15, "d"))
    //       .format()
    //       .slice(0, 10),
    //     dosage: recurrentDose,
    //   };
    //   console.log("recurrentDose", recurrentDose);

    //   currentSchedule.push(step);
    //   this.setState({ scheduleData: currentSchedule });
    //   // this.setState({ confirmModalTxt: "One step added." });
    // } else {
    //   // this.setState({ confirmModalTxt: "Can't add more steps" });
    // }

    // this.setState({ isConfirmationVisibleModal: true });
    // console.log("step", step);
  };
  removeStep = async () => {
    let lastStep = this.state.scheduleData[this.state.scheduleData.length - 1];
    if (lastStep.id > 2) {
      // let currentSchedule = this.state.scheduleData;
      // currentSchedule.pop();
      // this.setState({ scheduleData: currentSchedule });
      let currentStepNum = this.state.stepNum;
      currentStepNum--;
      await this.setState({ stepNum: currentStepNum });
      this.generateSchedule();
    }
  };
  updateSchedule = async () => {
    // let newSchedule = this.state.scheduleData;
    let newScheduleProfile = this.props.data;
    newScheduleProfile.totalStep = this.state.scheduleData.length;
    newScheduleProfile.schedule = this.state.scheduleData;
    let userKey = this.state.userKey;
    let scheduleKey = newScheduleProfile.key;
    // console.log("newSchedule", newSchedule);
    console.log("newScheduleProfile", newScheduleProfile);
    this.dismiss();
    this.dataModel.updateSchedule(userKey, scheduleKey, newScheduleProfile);
    await Analytics.logEvent("saveScheduleChanges", {
      name: "saveScheduleChanges",
      screen: "UserCenter",
      // purpose: "Opens the internal settings",
    });
  };
  deleteSchedule = async () => {
    // let scheduleKey = this.props.data.key;
    // let userKey = this.state.userKey;
    await this.setState({ isDeleteWarningModalVis: true });

    // await this.dataModel.deleteSchedule(userKey, scheduleKey);
    // await this.dataModel.loadUserSchedules(this.state.userKey);
    // await this.update();
    // this.dismiss();
  };
  deleteScheduleCancel = async () => {
    await this.setState({ isDeleteWarningModalVis: false });
  };
  deleteScheduleConfirmed = async () => {
    let scheduleKey = this.props.data.key;
    let userKey = this.state.userKey;
    // await this.setState({isDeleteWarningModalVis: true});

    await this.dataModel.deleteSchedule(userKey, scheduleKey);
    await this.dataModel.loadUserSchedules(this.state.userKey);
    await this.update();
    await this.setState({ isDeleteWarningModalVis: false });
    this.dismiss();
    await Analytics.logEvent("deleteSchedule", {
      name: "deleteSchedule",
      screen: "UserCenter",
      // purpose: "Opens the internal settings",
    });
  };
  dismiss = () => {
    this.props.dismiss();
  };
  update = () => {
    this.props.update();
  };
  confirmDelete = () => {
    this.props.confirmDelete();
  };
  render() {
    return (
      <View style={{ width: "100%" }}>
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
              borderRadius: 20,
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


        <View
          style={{
            marginLeft: 20,
            marginTop: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 20,
            // backgroundColor:"blue"
            // borderBottomColor: PRIMARY_COLOR,
            // borderBottomWidth: 2,
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
              {this.state.data.startDose ? this.state.data.startDose : ""}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
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
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
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
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
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
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
              >
                Save Changes
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
                //backgroundColor:"red"
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
        <View
          style={{
            height: 500,
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
                      {item.dosage} |{" "}
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
