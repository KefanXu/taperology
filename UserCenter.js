// This field is used to render the User Center section
// It was REMOVED from the current version but can be activated in the future
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
  Button,
  Dimensions,
  Animated,
  StyleSheet,
  Linking,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { FlatList } from "react-native-web";
import Modal from "modal-enhanced-react-native-web";

import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import { Schedule } from "./schedule";
import * as Analytics from "expo-firebase-analytics";

import moment, { min } from "moment";
import { DataTable, ProgressBar, Colors } from "react-native-paper";
import { CircularSlider } from "react-native-elements-universe";

const PRIMARY_COLOR = "#D8D8D8";

//Text in the refer patient popup
const REFER_PATIENT_TXT = (
  <Text style={{ margin: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
      Refer a Patient using the Behavioral Health Treatment Services Locator
    </Text>
    {"\n"}
    {"\n"}
    <Text style={{ fontSize: 14 }}>
      This locator is provided by SAMHSA (the Substance Abuse and Mental Health
      Services Administration).
    </Text>
    {"\n"}
    {"\n"}
    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
      Eligible mental health treatment facilities include:
    </Text>
    {"\n"}
    <Text style={{ fontSize: 14 }}>
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Facilities that provide
      mental health treatment services and are funded by the state mental health
      agency (SMHA) or other state agency or department{"\n"}
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Mental health treatment
      facilities administered by the U.S. Department of Veterans Affairs{"\n"}
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Private for-profit and
      non-profit facilities that are licensed by a state agency to provide
      mental health treatment services, or that are accredited by a national
      treatment accreditation organization (e.g., The Joint Commission, NCQA,
      etc.){"\n"}
    </Text>
    {"\n"}
    {"\n"}
    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
      Eligible substance use and addiction treatment facilities must meet at
      least one of the criteria below:
    </Text>
    {"\n"}
    <Text style={{ fontSize: 14 }}>
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>
      Licensure/accreditation/approval to provide substance use treatment from
      the state substance use agency (SSA) or a national treatment accreditation
      organization (e.g., The Joint Commission, CARF, NCQA, etc.)
      {"\n"}
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Staff who hold specialized
      credentials to provide substance use treatment services
      {"\n"}
      <Text style={{ fontSize: 20 }}>{"\u2022"}</Text>Authorization to bill
      third-party payers for substance use treatment services using an alcohol
      or drug client diagnosis
      {"\n"}
    </Text>
  </Text>
);

export class UserCenter extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.schedule = React.createRef();

    this.schedules = this.dataModel.plans;
    console.log("this.dataModel", this.dataModel);
    this.state = {
      schedules: this.schedules,
      currentData: "",
      isScheduleVisibleModal: false,
      currentSchedule: [],
      isReferPopupModal: false,
    };
  }
  // Load the schedule view with users' saved schedules in Google Firebase
  updateScheduleView = async () => {
    console.log("update schedule");
    let userKey = this.dataModel.key;
    await this.dataModel.loadUserSchedules(userKey);
    this.schedules = this.dataModel.plans;
    await this.setState({ schedules: this.schedules });
  };

  refreshSchedule = () => {
    this.schedule.current.resetSchedule();
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

  //Function to navigate to user center
  navUserCenter = () => {
    if (this.dataModel.isLogin) {
      this.props.navigation.navigate("UserCenter", {
        // needsUpdate: this.needsUpdate,
      });
    } else {
      this.setState({ isLoginVisibleModal: true });
    }
  };
  //Close the login popup window
  loginDismiss = () => {
    this.setState({ isLoginVisibleModal: false });
  };
  //Close the schedule popup window
  schedulePopUpDismiss = () => {
    this.setState({ isScheduleVisibleModal: false });
  };
  //Render the popup window that contains the schedule view
  _renderModalSchedule = () => {
    console.log("_renderModalSchedule");
    return (
      <View
        style={{
          backgroundColor: "white",
          width: 1000,
          height: 800,
          padding: 5,
          justifyContent: "flex-start",
          alignItems: "center",
          borderRadius: 20,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 34,
            marginTop: 0,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Ionicons
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
            name="md-close-circle"
            size={32}
            color="black"
            onPress={() => this.schedulePopUpDismiss()}
          />
        </View>
        <Schedule
          ref={this.schedule}
          scheduleData={this.state.currentSchedule}
          data={this.state.currentData}
          userKey={this.dataModel.key}
          dismiss={this.schedulePopUpDismiss}
          update={this.updateScheduleView}
        />
      </View>
    );
  };
  //Function that shows the refer patient popup
  showReferPatientModal = () => {
    this.setState({ isReferPopupModal: true });
  };
  //Render the refer patient popup window
  _renderReferModalPopup = () => (
    <View
      style={{
        height: 600,
        width: 600,
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
            backgroundColor: "black",
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

  render() {
    return (
      <View style={{ justifyContent: "center" }}>
        <View
          style={{
            flex: 1,
            margin: 5,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Render the refer patient popup window */}
          <Modal
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isReferPopupModal}
            onBackdropPress={() => this.setState({ isReferPopupModal: false })}
          >
            {this._renderReferModalPopup()}
          </Modal>
          {/* Render the schedule popup window  */}
          <Modal
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isScheduleVisibleModal}
            onBackdropPress={() =>
              this.setState({ isScheduleVisibleModal: false })
            }
          >
            {this._renderModalSchedule()}
          </Modal>
          {/* Render the menu and pass in functions */}
          <Menu
            navResource={this.navResource}
            navIndex={this.navIndex}
            navCal={this.navCal}
            navUserCenter={this.navUserCenter}
            showReferPatientModal={this.showReferPatientModal}
            loginDismiss={this.loginDismiss}
          />
          <View
            style={{
              width: 1000,
              margin: 5,
            }}
          >
            {/* Render the top title */}
            <View
              style={{
                height: 100,
                margin: 10,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 65 }}>
                User Center
              </Text>
            </View>
            <View
              style={{
                margin: 10,
                flexDirection: "row",
                height: 500,
              }}
            >
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Taper Schedules
                </Text>
                {/* Render the list of users' saved schedules */}
                <View
                  style={{
                    marginTop: 15,
                    marginRight: 15,
                    height: 400,
                    width: 1000,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <FlatList
                    style={{ width: 1000, marginTop: 7, marginBottom: 7 }}
                    data={this.state.schedules}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    numColumns={2}
                    renderItem={({ item }) => {
                      if (item.createdDate) {
                        let currentStep = 0;
                        let currentDosage;
                        for (let step of item.schedule) {
                          let startDate = new Date(step.startDate);
                          let today = new Date(
                            moment(new Date()).format("YYYY-MM-DD")
                          );
                          if (startDate <= today) {
                            currentStep++;
                            currentDosage = step.dosage;
                          }
                        }
                        return (
                          <TouchableOpacity
                            onPress={async () => {
                              console.log("item", item);
                              await this.setState({
                                currentSchedule: item.schedule,
                                currentData: item,
                              });
                              this.refreshSchedule();

                              this.setState({ isScheduleVisibleModal: true });
                            }}
                          >
                            <View
                              style={{
                                width: 350,
                                height: 120,
                                flexDirection: "row",
                                marginBottom: 10,
                                marginRight: 10,
                                borderRadius: 15,
                                backgroundColor: PRIMARY_COLOR,
                              }}
                            >
                              <View style={{ margin: 10 }}>
                                <Text
                                  style={{ fontSize: 15, fontWeight: "bold" }}
                                >
                                  Created date:
                                </Text>
                                <Text>{item.createdDate.slice(0, 16)}</Text>
                                <Text style={{ fontSize: 12, marginTop: 5 }}>
                                  <Text style={{ fontWeight: "bold" }}>
                                    Benzo Type:
                                  </Text>
                                  {item.bezo}
                                </Text>
                                <Text style={{ fontSize: 12, marginTop: 5 }}>
                                  <Text style={{ fontWeight: "bold" }}>
                                    Start Date{" "}
                                  </Text>
                                  {item.startDate}
                                </Text>
                                <Text style={{ fontSize: 12, marginTop: 5 }}>
                                  <Text style={{ fontWeight: "bold" }}>
                                    Total Steps{" "}
                                  </Text>
                                  {item.totalStep}
                                </Text>
                              </View>
                              <View style={{ marginTop: 5, marginLeft: 25 }}>
                                <Text>
                                  <Text
                                    style={{ fontSize: 12, fontWeight: "bold" }}
                                  >
                                    Current Step{" "}
                                  </Text>
                                  {currentStep}
                                </Text>
                                <ProgressBar
                                  progress={currentStep / item.totalStep}
                                  color={"black"}
                                />
                                <View style={{ marginTop: 10 }}>
                                  <Text>
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Starting Dosage {"\n"}
                                    </Text>
                                    {item.startDose} mg
                                  </Text>
                                  <Text>
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Current Target Dosage {"\n"}
                                    </Text>
                                    {currentDosage} mg
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
