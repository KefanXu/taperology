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

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
const BENZO_TYPE_DATA = [
  { title: "Alprazolam", id: "Alprazolam", strength: "3, 2, 1, 0.5, 0.25" },
  { title: "Lorazepam", id: "Lorazepam", strength: "2, 1, 0.5" },
  { title: "Clonazepam", id: "Clonazepam", strength: "2, 1, 0.5, 0.25, 0.125" },
  { title: "Diazepam", id: "Diazepam", strength: "10, 5, 2" },
  { title: "Temazepam", id: "Temazepam", strength: "30, 22.5, 15, 7.5" },
];
// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );
// const styles = StyleSheet.create({
//   container: {
//     // marginTop: StatusBar.currentHeight || 0,
//   },
//   item: {
//     flex:1,
//     backgroundColor: "#f9c2ff",
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   title: {
//     fontSize: 32,
//   },
// });
export class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVis: false,
      datePickerButtonTxt: "Pick the start date",
      benzoType: "Select the benzo type",
      generateBtnTxt: "Generate Schedule",
      page: 0,
      optionsPerPage: [2, 3, 4],
      itemsPerPage: [2, 3, 4],
      // slowAlert: false,
      visibleModal: false,
      isAlertVisibleModal: false,
      isConfirmationVisibleModal: false,
      isLoginVisibleModal: false,
      listOpacity: 0,
      scheduleData: [],
      stepNum: 12,
      startingDose: "",
      alertTxt: "",
      confirmModalTxt: "",
      isAddBtnDisable: true,
      entry: "menu",
    };
    //this.stepInput = React.createRef();
    this.startDoseInput = React.createRef();
    this.dataModel = getDataModel();
  }
  navResource = () => {
    this.props.navigation.navigate("Resources", {
      // needsUpdate: this.needsUpdate,
    });
  };
  navIndex = () => {
    this.props.navigation.navigate("Index", {
      // needsUpdate: this.needsUpdate,
    });
  };
  navCal = () => {
    this.props.navigation.navigate("Calculator", {
      // needsUpdate: this.needsUpdate,
    });
  };
  login = () => {
    if (this.dataModel.isLogin) {
      console.log("allow login");
    }
  };
  navUserCenter = async () => {
    if (this.dataModel.isLogin) {
      await this.dataModel.loadUserSchedules(this.dataModel.key);
      this.props.navigation.navigate("UserCenter", {
        // needsUpdate: this.needsUpdate,
      });
    } else {
      this.setState({ entry: "menu" });
      this.setState({ isLoginVisibleModal: true });
    }
  };
  navUserCenterDir = () => {
    this.props.navigation.navigate("UserCenter", {
      // needsUpdate: this.needsUpdate,
    });
  };
  closeDatePicker = () => {
    this.setState({ isDatePickerVis: false });
    // console.log("close");
  };
  showDatePicker = () => {
    this.setState({ isDatePickerVis: true });
  };
  _renderButton = (text, onPress) => (
    <TouchableOpacity style={{ flex: 0.5 }} onPress={onPress}>
      <View
        style={{
          backgroundColor: "black",
          padding: 12,
          margin: 16,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "white" }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  _renderModalContent = () => (
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
        }}
      >
        {this.state.alertTxt}
      </Text>
      {this._renderButton("Close", () =>
        this.setState({ isAlertVisibleModal: null })
      )}
    </View>
  );
  _renderModalContentConfirmation = () => (
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
        {this.state.confirmModalTxt}
      </Text>
      <Ionicons name="checkmark-circle" size={34} color="black" />
    </View>
  );
  _renderModalLogin = () => (
    <View
      style={{
        backgroundColor: "white",
        width: "20%",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <FontAwesome name="user-circle-o" size={32} color="black" />

      <View
        style={{
          flex: 1,
          // backgroundColor: "red",
          marginTop: 15,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoogleLogin
          navUserCenter={this.navUserCenterDir}
          dismissLoginModal={this.dismissLoginModal}
          entry={this.state.entry}
          saveSchedule={this.saveSchedule}
        />
      </View>
    </View>
  );
  dismissLoginModal = () => {
    this.setState({ isLoginVisibleModal: false });
  };

  _renderModalContentBenzoType = () => (
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
      {/* <Text>Hi!</Text>
      {this._renderButton("Close", () => this.setState({ visibleModal: null }))} */}
      <FlatList
        style={{ width: "90%" }}
        data={BENZO_TYPE_DATA}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              padding: 10,
              marginVertical: 8,
              marginHorizontal: 16,
              flex: 1,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              this.setState({ benzoType: item.title });
              this.setState({ visibleModal: false });
            }}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 10, color: "white", fontWeight: "bold" }}>
              Strength / mg: {item.strength}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
  reset = () => {
    this.setState({ benzoType: "Select the benzo type" });
    this.setState({ datePickerButtonTxt: "Pick the start date" });
    this.setState({ stepNum: 12 });
    this.setState({ startingDose: "" });
    this.setState({ listOpacity: 0 });
    this.setState({ generateBtnTxt: "Generate Schedule" });
    this.setState({ isAddBtnDisable: true });
    //this.stepInput.current.clear();
    this.startDoseInput.current.clear();
  };

  calculateTapperSchedule = () => {
    if (this.state.generateBtnTxt === "Reset") {
      this.reset();
    } else {
      if (
        this.state.benzoType === "" ||
        this.state.benzoType === "Select the benzo type"
      ) {
        this.setState({ isAlertVisibleModal: true });
        this.setState({ alertTxt: "Benzo type missing" });
        return;
      }
      if (
        this.state.datePickerButtonTxt === "" ||
        this.state.datePickerButtonTxt === "Pick the start date"
      ) {
        this.setState({ isAlertVisibleModal: true });
        this.setState({ alertTxt: "Please specify the start date" });
        return;
      }
      // if (this.state.stepNum === "" || !/^\d+$/.test(this.state.stepNum)) {
      //   this.setState({ isAlertVisibleModal: true });
      //   this.setState({ alertTxt: "Total Step has to be a valid number" });
      //   return;
      // }
      if (
        this.state.startingDose === "" ||
        !/^\d+$/.test(this.state.startingDose)
      ) {
        this.setState({ isAlertVisibleModal: true });
        this.setState({ alertTxt: "Starting dose has to be a valid number" });
        return;
      }

      this.setState({ generateBtnTxt: "Reset" });

      let initialDate = this.state.datePickerButtonTxt;

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
      reducedDose = startingInputDose * 0.05;
      for (let i = 2; i < this.state.stepNum; i++) {
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
      console.log("schedule", schedule);
      this.setState({ scheduleData: schedule });
      this.setState({ listOpacity: 100 });
      this.setState({ confirmModalTxt: "New taper schedule created!" });
      this.setState({ isConfirmationVisibleModal: true });
      this.setState({ isAddBtnDisable: false });
    }
  };
  addStep = () => {
    let currentStepNum = this.state.stepNum;
    currentStepNum++;
    this.setState({ stepNum: currentStepNum });
    let duration = 14;
    let currentSchedule = this.state.scheduleData;
    let lastStep = currentSchedule[this.state.scheduleData.length - 1];
    if (lastStep) {
      let recurrentDose =
        lastStep.dosage - parseInt(this.state.startingDose) * 0.05;
      let step = {
        id: lastStep.id + 1,
        duration: duration,
        startDate: moment(moment(new Date(lastStep.startDate)).add(15, "d"))
          .format()
          .slice(0, 10),
        dosage: recurrentDose,
      };
      currentSchedule.push(step);
      this.setState({ scheduleData: currentSchedule });
      this.setState({ confirmModalTxt: "One step added." });
    } else {
      this.setState({ confirmModalTxt: "Please create a new schedule" });
    }

    this.setState({ isConfirmationVisibleModal: true });
    //console.log("step", step);
  };
  removeStep = () => {
    let currentSchedule = this.state.scheduleData;
    currentSchedule.pop();
    this.setState({ scheduleData: currentSchedule });
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
    this.setState({ schedule: currentSchedule });
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
    this.setState({ schedule: currentSchedule });
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
  saveSchedule = async () => {
    let scheduleToSave = this.state.scheduleData;
    let newSchedule = {
      startDate: scheduleToSave[0].startDate,
      bezo: this.state.benzoType,
      createdDate: moment(new Date()).format(),
      totalStep: scheduleToSave.length,
      schedule: scheduleToSave,
    };
    await this.dataModel.createNewSchedule(this.dataModel.key, newSchedule);
    this.reset();
    this.setState({
      confirmModalTxt: "New taper schedule saved!",
    });
    this.setState({ isConfirmationVisibleModal: true });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          //backgroundColor: "blue",
          margin: 5,
          flexDirection: "row",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          // alignItems:"center"
        }}
      >
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isAlertVisibleModal}
          onBackdropPress={() => this.setState({ isAlertVisibleModal: false })}
        >
          {this._renderModalContent()}
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isConfirmationVisibleModal}
          onBackdropPress={() =>
            this.setState({ isConfirmationVisibleModal: false })
          }
        >
          {this._renderModalContentConfirmation()}
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isLoginVisibleModal}
          onBackdropPress={() => this.setState({ isLoginVisibleModal: false })}
        >
          {this._renderModalLogin()}
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.visibleModal}
          onBackdropPress={() => this.setState({ visibleModal: false })}
        >
          {this._renderModalContentBenzoType()}
        </Modal>
        <Menu
          navResource={this.navResource}
          navIndex={this.navIndex}
          navCal={this.navCal}
          navUserCenter={this.navUserCenter}
          // login={this.login}
        />
        <View style={{ width: 1000, backgroundColor: "", margin: 5 }}>
          <View
            style={{
              height: 280,
              margin: 10,

              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 65 }}>
                  Taper Scheduler
                </Text>
                <View
                  style={{
                    height: "100%",
                    width: 400,
                    padding: 10,
                    backgroundColor: PRIMARY_COLOR,
                    borderRadius: 20,
                    marginRight: 50,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Common Dose Strengths
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <View style={{ flex: 1, marginRight: 15 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Alprazolam
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 2 }}>
                        Strength (mg): 3, 2, 1, 0.5, 0.25
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Lorazepam
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 2 }}>
                        Strength (mg): 2, 1, 0.5
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Clonazepam
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 2 }}>
                        Strength (mg): 2, 1, 0.5, 0.25, 0.125
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Diazepam
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 2 }}>
                        Strength (mg): 10, 5, 2
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Temazepam
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 2 }}>
                        Strength (mg): 30, 22.5, 15, 7.5
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Input field */}
              <View
                style={{
                  // flex: 0.06,
                  height: 60,
                  flex: 1,
                  marginTop: 30,
                  //backgroundColor: "red",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 0.25, height: "80%" }}>
                  <Text style={{ fontWeight: "bold" }}>#1 Benzodiazeoines</Text>
                  <TouchableOpacity
                    style={{
                      flex: 1,

                      marginRight: 50,
                      marginTop: 10,
                      borderWidth: 2,
                      borderRadius: 30,
                      borderColor: "black",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "black",
                    }}
                    onPress={() => {
                      this.setState({ visibleModal: true });
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      {this.state.benzoType}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Pick the start date */}
                <View style={{ flex: 0.25, height: "80%" }}>
                  <Text style={{ fontWeight: "bold" }}>#2 Start Date</Text>

                  <DatePickerModal
                    // locale={'en'} optional, default: automatic
                    mode="single"
                    visible={this.state.isDatePickerVis}
                    onDismiss={this.closeDatePicker}
                    date={new Date()}
                    onConfirm={(date) => {
                      let selectedDate = moment(new Date(date.date))
                        .format()
                        .slice(0, 10);
                      console.log("selectedDate", selectedDate);
                      this.setState({ datePickerButtonTxt: selectedDate });
                      this.closeDatePicker();
                    }}
                    // validRange={{
                    //   startDate: new Date(2021, 1, 2),  // optional
                    //   endDate: new Date(), // optional
                    // }}
                    // onChange={} // same props as onConfirm but triggered without confirmed by user
                    // saveLabel="Save" // optional
                    // label="Select date" // optional
                    // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
                  />
                  <TouchableOpacity
                    style={{
                      flex: 1,

                      marginRight: 50,
                      marginTop: 10,
                      borderWidth: 2,
                      borderRadius: 30,
                      borderColor: "black",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "black",
                    }}
                    onPress={this.showDatePicker}
                  >
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      {this.state.datePickerButtonTxt}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 0.25, height: "80%" }}>
                  <Text style={{ fontWeight: "bold" }}>#3 Starting Dose</Text>
                  <View
                    style={{
                      flex: 1,

                      marginRight: 50,
                      marginTop: 10,
                      borderWidth: 2,
                      borderRadius: 30,
                      borderColor: "black",
                    }}
                  >
                    <TextInput
                      // secureTextEntry={true}
                      ref={this.startDoseInput}
                      placeholder="e.g., 100, 120 (mg)"
                      style={Platform.select({
                        web: {
                          outlineStyle: "none",
                          flex: 1,
                          marginLeft: 20,
                          marginRight: 20,
                          fontSize: 16,
                        },
                      })}
                      maxLength={35}
                      autoCapitalize="none"
                      autoCorrect={false}
                      // value={this.state.reason}
                      onChangeText={(text) => {
                        this.setState({ startingDose: text });
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 0.25, height: "80%" }}>
                  <Text style={{ color: "white", opacity: 0 }}>
                    {this.state.generateBtnTxt}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flex: 1,

                      marginRight: 50,
                      marginTop: 10,
                      borderWidth: 2,
                      borderRadius: 30,
                      borderColor: "black",
                      backgroundColor: "black",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      this.calculateTapperSchedule();
                      // this.setState({ generateBtnTxt: "Reset" });
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      {this.state.generateBtnTxt}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
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
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}
                >
                  Save Schedule
                </Text>
              </TouchableOpacity>
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
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Duration
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Start Date
                </Text>
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
                      {parseInt((item.dosage / this.state.startingDose) * 100)}%
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.increaseDose(item.id)}
                    >
                      <AntDesign name="caretright" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}
