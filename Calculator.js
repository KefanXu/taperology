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
  Linking,
  Clipboard,
} from "react-native";

import { DatePickerModal } from "react-native-paper-dates";
import Modal from "modal-enhanced-react-native-web";
import * as Analytics from "expo-firebase-analytics";

import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
// import { GoogleLogin } from "./googleLogin";

import moment, { min } from "moment";
import stringTable from "string-table";
//Benzo type to choose when users click the "Select the benzo type" button
const BENZO_TYPE_DATA = [
  { title: "Alprazolam", id: "Alprazolam", strength: "3, 2, 1, 0.5, 0.25" },
  { title: "Lorazepam", id: "Lorazepam", strength: "2, 1, 0.5" },
  { title: "Clonazepam", id: "Clonazepam", strength: "2, 1, 0.5, 0.25, 0.125" },
  { title: "Diazepam", id: "Diazepam", strength: "10, 5, 2" },
  { title: "Temazepam", id: "Temazepam", strength: "30, 22.5, 15, 7.5" },
];
const STRENGTHS = {
  Alprazolam: 0.125,
  Lorazepam: 0.25,
  Clonazepam: 0.0625,
  Diazepam: 1,
  Temazepam: 3.75,
};
const TIP_DATA = [
  {
    num: "❶",
    title:
      "During the taper, the patient is relearning that they can function without this medication. Appeal to patients’ wish for MASTERY and CONTROL over their situation.",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>This means{" "}
        <Text style={{ fontWeight: "bold" }}>no rescue (prn)</Text> benzo doses!
      </Text>
    ),
  },
  {
    num: "❷",
    title: "Stick with the patient’s current benzo:",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>The simplest option is
        to taper using the currently-prescribed benzo rather than switching to a
        long-acting benzo.
      </Text>
    ),
  },
  {
    num: "❸",
    title: "Go slowly!",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>No faster than 4 months
        {"\n"}
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Might take over a
        year--and that’s fine!
      </Text>
    ),
  },
  {
    num: "❹",
    title: "Skip the add-ons:",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>There is minimal
        evidence to suggest that adding another medication will help with the
        taper.
      </Text>
    ),
  },
  {
    num: "❺",
    title: "Hold off on adding medications to replace the benzo:",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Your patient may have
        been on their benzo for decade and it may not be clear if the symptoms
        that led to starting the benzo are even present anymore. {"\n"}
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Have a look at the other
        resources for anxiety and insomnia.
      </Text>
    ),
  },
  {
    num: "❻",
    title:
      "The taper may lead to a lower dose as opposed to a complete stop--and that’s okay!",
    subtitle: (
      <Text>
        <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Lower dose = lower risk.
      </Text>
    ),
  },
];
const REFER_PATIENT_TXT = (
  <Text style={{ margin: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
      Refer a Patient using the Behavioral Health Treatment Services Locator
    </Text>
    {"\n"}
    {"\n"}
    <Text style={{ fontSize: 14 }}>
      Just enter the patient's address or zip code to find mental health or
      substance use treatment facilities in their area. {"\n"}
      {"\n"}This locator is provided by SAMHSA (the Substance Abuse and Mental
      Health Services Administration).
    </Text>
  </Text>
);

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
      visibleModal: false,
      isAlertVisibleModal: false,
      isConfirmationVisibleModal: false,
      isLoginVisibleModal: false,
      isReferPopupModal: false,
      listOpacity: "none",
      scheduleData: [],
      stepNum: 12,
      startingDose: "",
      alertTxt: "",
      confirmModalTxt: "",
      isAddBtnDisable: true,
      entry: "menu",
      currentStd: "",
      isTipVis: "flex",
    };
    this.startDoseInput = React.createRef();
    this.dataModel = getDataModel();
  }
  // This function is used to alert users when they try to save the generated schedule
  // It was REMOVED in the current version, but can be activated in the future
  alertSignIn = () => {
    this.setState({ alertTxt: "Please Sign Up First" });

    this.setState({ isAlertVisibleModal: true });
  };

  //Function to navigate to the Resource Section.
  //Passed into the menu (menu.js) component.
  //Write Google Analytics functions here if this is the user behavior to track.
  navResource = () => {
    this.props.navigation.navigate("Resources", {});
  };

  //Function to navigate to the Index page.
  //Passed into the menu (menu.js) component.
  //Write Google Analytics functions here if this is the user behavior to track.
  navIndex = () => {
    this.props.navigation.navigate("Index", {});
  };

  //Function to navigate to the Calculator page.
  //Passed into the menu (menu.js) component.
  //Write Google Analytics functions here if this is the user behavior to track.
  navCal = () => {
    this.props.navigation.navigate("Calculator", {});
  };
  //Function to show the refer patient popup.
  //Passed into the menu (menu.js) component.
  //Write Google Analytics functions here if this is the user behavior to track.
  showReferPatientModal = () => {
    this.setState({ isReferPopupModal: true });
  };
  //Login function for logging in with Google account
  //It was REMOVED in the current version, but can be activated in the future
  login = () => {
    if (this.dataModel.isLogin) {
      console.log("allow login");
    }
  };
  //Function to navigate to user center
  //It was REMOVED in the current version, but can be activated in the future
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
  //Function to directly navigate to user center when the user has already logged in
  //It was REMOVED in the current version, but can be activated in the future
  navUserCenterDir = () => {
    this.props.navigation.navigate("UserCenter", {});
  };
  //Function to close the date picker
  closeDatePicker = () => {
    this.setState({ isDatePickerVis: false });
  };
  //Function to show the date picker
  showDatePicker = () => {
    this.setState({ isDatePickerVis: true });
  };
  //Render the refer patient popup
  _renderReferModalPopup = () => (
    <View
      style={{
        height: Dimensions.get("window").width > 1000 ? 300 : 350,
        width: 400,
        backgroundColor: "white",
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <View>{REFER_PATIENT_TXT}</View>
      <TouchableOpacity
        onPress={async () => {
          //Write the Google Analytics function here
          await Analytics.logEvent("ReferPatient", {
            name: "ReferPatient",
            screen: "Calculator",
          });
          Linking.openURL(
            "https://findtreatment.samhsa.gov/locator?sAddr=48103&submit=Go"
          );
          this.setState({ isReferPopupModal: false });
        }}
      >
        <View
          style={{
            backgroundColor: "purple",
            borderRadius: 20,
            margin: 10,
            width: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", margin: 10 }}>
            Go to the site
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  //Render the alert popup (popup when users enter the invalid data)
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
    </View>
  );
  //Render the confirmation popup (popup when users save the schedule)
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
  //This renders the login popup.
  //It's not used in the current version but can be activated if there is a future need.
  // _renderModalLogin = () => (
  //   <View
  //     style={{
  //       backgroundColor: "white",
  //       width: 300,
  //       padding: 20,
  //       justifyContent: "center",
  //       alignItems: "center",
  //       borderRadius: 20,
  //       borderColor: "rgba(0, 0, 0, 0.1)",
  //     }}
  //   >
  //     <FontAwesome name="user-circle-o" size={32} color="black" />

  //     <View
  //       style={{
  //         flex: 1,
  //         marginTop: 15,
  //         width: "100%",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <GoogleLogin
  //         navUserCenter={this.navUserCenterDir}
  //         dismissLoginModal={this.dismissLoginModal}
  //         entry={this.state.entry}
  //         saveSchedule={this.saveSchedule}
  //         alertSignIn={this.alertSignIn}
  //       />
  //     </View>
  //   </View>
  // );


  //This closes the login popup.
  //It's not used in the current version but can be activated if there is a future need.
  dismissLoginModal = () => {
    this.setState({ isLoginVisibleModal: false });
  };
  //Render the popup window when users click "Select the benzo type"
  _renderModalContentBenzoType = () => (
    <View
      style={{
        backgroundColor: "white",
        width: 350,
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <FlatList
        style={{ width: "90%" }}
        data={BENZO_TYPE_DATA}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "purple",
              padding: 10,
              marginVertical: 8,
              marginHorizontal: 16,
              flex: 1,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              await this.setState({ benzoType: item.title });
              await this.setState({ currentStd: STRENGTHS[item.title] });
              this.setState({ visibleModal: false });
              this.generateSchedule(true);
            }}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
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
  //Generate the taper schedule (used in "Generate Schedule", "Add Steps", "Remove Steps", ).
  generateSchedule = (isGenerateFromAddRemove) => {
    let initialDate = this.state.datePickerButtonTxt;
    let currentSchedule = this.state.scheduleData;
    let currentScheduleLength = currentSchedule.length;
    let schedule = [];
    let startingInputDose = parseInt(this.state.startingDose);
    let startingDose = startingInputDose;
    let reducedDose = startingInputDose * 0.25;
    let recurrentDate = initialDate;
    let duration;
    //If the user is adding or removing a step, keep the changed value from being modified
    //For the first two stages, reduce the dosage to 50%
    for (let i = 0; i < 2; i++) {
      let id = i + 1;
      if (isGenerateFromAddRemove && i < currentScheduleLength) {
        duration = currentSchedule[i].duration;
      } else {
        duration = 14;
      }

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
      if (isGenerateFromAddRemove && i < currentScheduleLength) {
        duration = currentSchedule[i].duration;
      } else {
        duration = 14;
      }
      recurrentDate = moment(
        moment(new Date(recurrentDate)).add(duration + 1, "d")
      )
        .format()
        .slice(0, 10);
    }
    let remainingDose = startingDose;
    //The rest stages will reduce the dosage to 0mg
    reducedDose = remainingDose / (this.state.stepNum - 2);
    let ifAdd = true;
    for (let i = 2; i < this.state.stepNum; i++) {
      let id = i + 1;
      if (isGenerateFromAddRemove && i < currentScheduleLength) {
        duration = currentSchedule[i].duration;
      } else {
        duration = 14;
      }
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
      recurrentDate = moment(
        moment(new Date(recurrentDate)).add(duration + 1, "d")
      )
        .format()
        .slice(0, 10);
    }
    this.setState({ scheduleData: schedule });
  };
  //Reset the calculator
  reset = async () => {
    this.setState({ benzoType: "Select the benzo type" });
    this.setState({ datePickerButtonTxt: "Pick the start date" });
    this.setState({ stepNum: 12 });
    this.setState({ startingDose: "" });
    this.setState({ listOpacity: "none" });
    this.setState({ generateBtnTxt: "Generate Schedule" });
    this.setState({ isAddBtnDisable: true });
    this.startDoseInput.current.clear();
  };
  //This function is fired when the user click the "Generate Schedule"
  //It will click if users enter valid data
  calculateTapperSchedule = async () => {
    if (this.state.generateBtnTxt === "Reset") {
      await Analytics.logEvent("resetButtonTapped", {
        name: "ChangeScreen",
        screen: "Calculator",
        purpose: "Opens the internal settings",
      });
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
      if (
        this.state.startingDose === "" ||
        !/^\d+$/.test(this.state.startingDose)
      ) {
        this.setState({ isAlertVisibleModal: true });
        this.setState({ alertTxt: "Starting dose has to be a valid number" });
        return;
      }
      this.generateSchedule();
      this.setState({ generateBtnTxt: "Reset" });
      this.setState({ listOpacity: "flex" });
      this.setState({ confirmModalTxt: "New taper schedule created!" });
      this.setState({ isAddBtnDisable: false });
    }
    await Analytics.logEvent("GenerateSchedule", {
      name: "ChangeScreen",
      screen: "Calculator",
      purpose: "Opens the internal settings",
    });
    this.setState({ isTipVis: "none" });
  };
  //Fired when the user clicks "Add Step"
  addStep = async () => {
    let currentStepNum = this.state.stepNum;
    currentStepNum++;
    await this.setState({ stepNum: currentStepNum });
    this.generateSchedule(true);
  };
  //Fired when the user clicks "Remove Step"
  removeStep = async () => {
    let currentStepNum = this.state.stepNum;
    currentStepNum--;
    await this.setState({ stepNum: currentStepNum });
    this.generateSchedule(true);
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
  //Manually set duration in the text input field
  setDuration = (id, num) => {
    let currentSchedule = this.state.scheduleData;
    let toIncrease;
    let numToUpdate;
    for (let step of currentSchedule) {
      if (step.id === id) {
        if (num > step.duration) {
          toIncrease = true;
          numToUpdate = num - step.duration;
        } else if (num < step.duration) {
          toIncrease = false;
          numToUpdate = step.duration - num;
        }
        step.duration = num;
      }

      if (step.id > id) {
        if (toIncrease) {
          step.startDate = moment(
            moment(new Date(step.startDate)).add(1 + numToUpdate, "d")
          )
            .format()
            .slice(0, 10);
        } else {
          step.startDate = moment(
            moment(new Date(step.startDate)).subtract(numToUpdate - 1, "d")
          )
            .format()
            .slice(0, 10);
        }
      }
    }
    this.setState({ schedule: currentSchedule });
  };
  //This function is used to save user-generated schedule to the user center that's linked to their Google account
  //It was REMOVED in the current version but can be activated in the future
  saveSchedule = async () => {
    let scheduleToSave = this.state.scheduleData;
    let newSchedule = {
      startDate: scheduleToSave[0].startDate,
      startDose: this.state.startingDose,
      bezo: this.state.benzoType,
      createdDate: moment(new Date()).format(),
      totalStep: scheduleToSave.length,
      schedule: scheduleToSave,
    };
    await this.dataModel.createNewSchedule(this.dataModel.key, newSchedule);
    this.reset();
    this.setState({
      confirmModalTxt: "New taper schedule saved to user center!",
    });
    this.setState({ isConfirmationVisibleModal: true });
    await Analytics.logEvent("saveSchedule", {
      name: "ChangeScreen",
      screen: "Calculator",
      purpose: "Opens the internal settings",
    });
  };
  //Check if the user input is valid
  //Used in the duration text field input
  isPositiveInteger = (str) => {
    if (typeof str !== "string") {
      return false;
    }
    const num = Number(str);
    if (Number.isInteger(num) && num > 0) {
      return true;
    }
    return false;
  };
  //Copy the generated schedule to users' clipboard
  copyTo = () => {
    console.log("this.state.scheduleData", this.state.scheduleData);
    let scheduleToSave = this.state.scheduleData;
    let scheduleBasicInfo =
      "Start Date: " +
      scheduleToSave[0].startDate +
      "\n" +
      "Start Dose: " +
      this.state.startingDose +
      "\n" +
      "Bezo Type: " +
      this.state.benzoType +
      "\n" +
      "Created Date: " +
      moment(new Date()).format().slice(0, 19) +
      "\n" +
      "Total Step: " +
      scheduleToSave.length +
      "\n" +
      "\n" +
      "\n" +
      "Step" +
      "          " +
      "Duration" +
      "          " +
      "Start Date" +
      "          " +
      "Target Dosage / Starting Dosage" +
      "\n" +
      "========================================================" +
      "\n";
    let scheduleDetail = "";
    for (let step of scheduleToSave) {
      let space;
      if (step.id >= 10) {
        space = "        ";
      } else {
        space = "          ";
      }

      scheduleDetail +=
        "Step" +
        step.id +
        space +
        step.duration +
        " days" +
        "          " +
        step.startDate +
        "          " +
        step.dosage +
        "mg | " +
        parseInt((step.dosage / this.state.startingDose) * 100) +
        "%" +
        "\n";
    }
    let scheduleToCopy = scheduleBasicInfo + scheduleDetail;
    console.log(stringTable.create(this.state.scheduleData));
    Clipboard.setString(scheduleToCopy);
    this.setState({
      confirmModalTxt: (
        <Text>
          New taper schedule saved to clipboard!{"\n"}
          {"\n"}
          <Text style={{ fontWeight: "300", fontSize: 12 }}>
            Now use ctrl+V (or ⌘+V on a Mac) to paste the taper schedule into
            your note
          </Text>
        </Text>
      ),
    });
    this.setState({ isConfirmationVisibleModal: true });
  };
  //Render the text in the "Tips for tapering"
  _renderListView = (DATA) => (
    <View
      style={{ marginTop: 20, marginLeft: 10, display: this.state.isTipVis }}
    >
      <FlatList
        data={DATA}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        renderItem={({ item }) => (
          <ScrollView
            style={{
              height: 200,
              width: 300,
              borderRadius: 20,
              marginRight: 10,
              padding: 15,
              backgroundColor: "white",
            }}
            showsVerticalScrollIndicator={true}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 27,
                marginBottom: 5,
                color: "purple",
              }}
            >
              {item.num}
            </Text>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              {item.title}
            </Text>
            <Text style={{ marginLeft: 10 }}>{item.subtitle}</Text>
          </ScrollView>
        )}
      />
    </View>
  );

  render() {
    //Render the tip view on the top ("Common Dose Strength")
    let tipView = (
      <View
        style={{
          height: Dimensions.get("window").width > 1000 ? "100%" : 200,
          width: 400,
          padding: 10,
          backgroundColor:
            Dimensions.get("window").width > 1000 ? "white" : "none",
          borderColor:
            Dimensions.get("window").width > 1000 ? "purple" : "none",
          borderWidth: 2,
          borderRadius: 20,
          marginRight: Dimensions.get("window").width > 1000 ? 50 : 0,
          marginTop: Dimensions.get("window").width > 1000 ? 0 : 50,
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
    );
    //Render the buttons which appear after schedule generated ("Add Step", "Remove Step", "Copy Schedule")
    let scheduleBtnView = (
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginBottom: 5,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 20,
          width: 500,
        }}
      >
        <View style={{ marginLeft: 30, flexDirection: "row" }}>
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
            <Ionicons name="add-circle" size={32} color="purple" />
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
            <Ionicons name="remove-circle" size={32} color="purple" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
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
              this.copyTo();
            }}
            disabled={this.state.isAddBtnDisable}
          >
            <MaterialIcons name="note-add" size={32} color="purple" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Copy Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return (
      <View style={{ justifyContent: "center" }}>
        <View
          style={{
            flex: 1,
            margin: 5,
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Render refer patient popup */}
          <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isReferPopupModal}
            onBackdropPress={() => this.setState({ isReferPopupModal: false })}
          >
            {this._renderReferModalPopup()}
          </Modal>
          {/* Render alert popup */}
          <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isAlertVisibleModal}
            onBackdropPress={() =>
              this.setState({ isAlertVisibleModal: false })
            }
          >
            {this._renderModalContent()}
          </Modal>
          {/* Render confirmation schedule (popup when users copy schedule)  */}
          <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isConfirmationVisibleModal}
            onBackdropPress={() =>
              this.setState({ isConfirmationVisibleModal: false })
            }
          >
            {this._renderModalContentConfirmation()}
          </Modal>
          {/* Render the login popup, REMOVED in this version  */}
          {/* <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isLoginVisibleModal}
            onBackdropPress={() =>
              this.setState({ isLoginVisibleModal: false })
            }
          >
            {this._renderModalLogin()}
          </Modal> */}
          
          {/* Render the bezo selection list popup */}
          <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.visibleModal}
            onBackdropPress={() => this.setState({ visibleModal: false })}
          >
            {this._renderModalContentBenzoType()}
          </Modal>
          {/* Render the menu */}
          <Menu
            navResource={this.navResource}
            navIndex={this.navIndex}
            navCal={this.navCal}
            navUserCenter={this.navUserCenter}
            showReferPatientModal={this.showReferPatientModal}
          />
          <View
            style={{
              width: Dimensions.get("window").width * 0.8,
              backgroundColor: "",
              margin: 5,
            }}
          >
            {/* Render title + buttons  */}
            <View
              style={{
                height: Dimensions.get("window").width > 1000 ? 280 : 600,
                margin: 10,
                flexDirection: "row",
              }}
            >
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    flexDirection:
                      Dimensions.get("window").width > 1000 ? "row" : "column",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 65,
                        color: "purple",
                      }}
                    >
                      Taper Scheduler
                    </Text>
                  </View>
                  {tipView}
                </View>
                {/* Input field */}
                <View
                  style={{
                    height: Dimensions.get("window").width > 1000 ? 80 : 250,
                    marginTop: Dimensions.get("window").width > 1000 ? 10 : 40,
                    flexDirection:
                      Dimensions.get("window").width > 1000 ? "row" : "column",
                    justifyContent:
                      Dimensions.get("window").width > 1000
                        ? "flex-start"
                        : "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 0.25, height: "80%", width: "100%" }}>
                    <Text style={{ fontWeight: "bold" }}>
                      #1 Benzodiazepine
                    </Text>
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        marginRight: 50,
                        marginTop: 10,
                        borderWidth: 2,
                        borderRadius: 30,
                        borderColor: "purple",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "purple",
                      }}
                      // disabled={false}
                      onPress={() => {
                        this.setState({ visibleModal: true });
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {this.state.benzoType}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Pick the start date */}
                  <View style={{ flex: 0.25, height: "80%", width: "100%" }}>
                    <Text style={{ fontWeight: "bold" }}>#2 Start Date</Text>
                    <DatePickerModal
                      mode="single"
                      visible={this.state.isDatePickerVis}
                      onDismiss={this.closeDatePicker}
                      date={new Date()}
                      onConfirm={async (date) => {
                        let selectedDate = moment(new Date(date.date))
                          .format()
                          .slice(0, 10);
                        await this.setState({
                          datePickerButtonTxt: selectedDate,
                        });
                        this.generateSchedule(true);
                        this.closeDatePicker();
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        flex: 1,

                        marginRight: 50,
                        marginTop: 10,
                        borderWidth: 2,
                        borderRadius: 30,
                        borderColor: "purple",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "purple",
                      }}
                      onPress={this.showDatePicker}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {this.state.datePickerButtonTxt}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Specify starting dosage */}
                  <View style={{ flex: 0.25, height: "80%", width: "100%" }}>
                    <Text style={{ fontWeight: "bold" }}>#3 Starting Dose</Text>
                    <View
                      style={{
                        flex: 1,

                        marginRight: 50,
                        marginTop: 10,
                        borderWidth: 3,
                        borderRadius: 30,
                        borderColor: "purple",
                      }}
                    >
                      <TextInput
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
                        onChangeText={async (text) => {
                          await this.setState({ startingDose: text });
                          // if

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
                            this.state.datePickerButtonTxt ===
                              "Pick the start date"
                          ) {
                            this.setState({ isAlertVisibleModal: true });
                            this.setState({
                              alertTxt: "Please specify the start date",
                            });
                            return;
                          }
                          if (
                            this.state.startingDose === "" ||
                            !/^\d+$/.test(this.state.startingDose)
                          ) {
                            this.setState({ isAlertVisibleModal: true });
                            this.setState({
                              alertTxt:
                                "Starting dose has to be a valid number",
                            });
                            return;
                          }
                          this.generateSchedule(true);
                        }}
                      />
                    </View>
                  </View>
                  {/* Render "Generate Schedule Button" */}
                  <View style={{ flex: 0.25, height: "80%", width: "100%" }}>
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
                        borderColor: "purple",
                        backgroundColor: "purple",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        this.calculateTapperSchedule();
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        {this.state.generateBtnTxt}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* Render "Tips for tapering"  */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: Dimensions.get("window").width > 1000 ? 0 : 100,
              }}
            >
              <View style={{ marginRight: 50 }}>
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, marginLeft: 10 }}
                >
                  Tips for tapering
                </Text>
                <Text style={{ fontSize: 12, marginLeft: 10, marginTop: 5 }}>
                  Adapted from the Ashton Manual
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  display: this.state.isTipVis === "flex" ? "none" : "flex",
                }}
                disabled={this.state.isTipVis === "flex" ? true : false}
                onPress={() => this.setState({ isTipVis: "flex" })}
              >
                <AntDesign name="downcircle" size={24} color="purple" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: this.state.isTipVis === "flex" ? "flex" : "none",
                }}
                disabled={this.state.isTipVis === "flex" ? false : true}
                onPress={() => this.setState({ isTipVis: "none" })}
              >
                <AntDesign name="upcircle" size={24} color="purple" />
              </TouchableOpacity>
            </View>

            {this._renderListView(TIP_DATA)}
            {/* Render the generated schedule */}
            <View
              style={{
                height: 1200,
                marginLeft: 10,
                marginRight: 60,
                marginTop: 10,
                flexDirection: "column",
                justifyContent: "center",
                display: this.state.listOpacity,
                borderRadius: 20,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {scheduleBtnView}
              </View>
              {/* Render the header of the form */}
              <View
                style={{
                  padding: 1,
                  marginVertical: 1,
                  marginHorizontal: 1,

                  height: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomColor: "black",
                  borderBottomWidth: 2,
                  marginHorizontal: 32,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width > 1000 ? 12 : 10,
                      fontWeight: "bold",
                    }}
                  >
                    Step
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width > 1000 ? 12 : 10,
                      fontWeight: "bold",
                    }}
                  >
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
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width > 1000 ? 12 : 10,
                      fontWeight: "bold",
                    }}
                  >
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
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width > 1000 ? 12 : 10,
                      fontWeight: "bold",
                    }}
                  >
                    Target Dosage / Starting Dosage
                  </Text>
                </View>
              </View>
              {/* Render the body of the form */}
              <FlatList
                data={this.state.scheduleData}
                renderItem={({ item }) => (
                  <View
                    style={{
                      padding: 15,
                      marginVertical: 8,
                      marginHorizontal: 16,
                      flex: 1,
                      flexDirection: "row",
                      borderBottomColor: "black",
                      borderBottomWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize:
                            Dimensions.get("window").width > 1000 ? 12 : 10,
                        }}
                      >
                        Step {item.id}
                      </Text>
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
                        <AntDesign name="caretleft" size={24} color="purple" />
                      </TouchableOpacity>

                      <TextInput
                        onChangeText={async (text) => {
                          if (this.isPositiveInteger(text)) {
                            console.log(text);
                            let parseToInt = parseInt(text);
                            this.setDuration(item.id, parseToInt);
                          }
                        }}
                        style={{
                          width: 40,
                          textAlign: "center",
                          borderRadius: 20,
                          borderColor: "purple",
                          borderWidth: 2,
                          fontWeight: "bold",
                          marginRight: 5,
                        }}
                        value={item.duration}
                        placeholder="useless placeholder"
                        keyboardType="numeric"
                      />
                      <Text
                        style={{
                          fontSize:
                            Dimensions.get("window").width > 1000 ? 12 : 10,
                        }}
                      >
                        days
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.increaseDuration(item.id)}
                      >
                        <AntDesign name="caretright" size={24} color="purple" />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize:
                            Dimensions.get("window").width > 1000 ? 12 : 10,
                        }}
                      >
                        {item.startDate}
                      </Text>
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
                        <AntDesign name="caretleft" size={24} color="purple" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize:
                            Dimensions.get("window").width > 1000 ? 12 : 10,
                        }}
                      >
                        {item.dosage} mg |{" "}
                        {parseInt(
                          (item.dosage / this.state.startingDose) * 100
                        )}
                        %
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.increaseDose(item.id)}
                      >
                        <AntDesign name="caretright" size={24} color="purple" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
          {/* Render the bottom disclaimer */}
          <View>
            <Text style={{ margin: 15, fontSize: 10, textAlign: "center" }}>
              This website was created as part of a project funded by the
              National Institute on Drug Abuse (R01DA045705) to Donovan Maust,
              MD. {"\n"}
              {"\n"}For questions or comments, please contact{" "}
              <Text style={{ fontWeight: "bold" }}>
                Charity Hoffman, PhD, MSW
              </Text>
              {"\n"}(project coordinator; charityh@med.umich.edu).
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
