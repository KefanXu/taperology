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
const SEC_COLOR = "#848484";
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

  updateScheduleView = async () => {
    console.log("update schedule");
    // this.dataModel = getDataModel();
    let userKey = this.dataModel.key;
    await this.dataModel.loadUserSchedules(userKey);
    this.schedules = this.dataModel.plans;
    await this.setState({ schedules: this.schedules });
  };
  refreshSchedule = () => {
    this.schedule.current.resetSchedule();
  };
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
  navUserCenter = () => {
    if (this.dataModel.isLogin) {
      this.props.navigation.navigate("UserCenter", {
        // needsUpdate: this.needsUpdate,
      });
    } else {
      this.setState({ isLoginVisibleModal: true });
    }
  };
  loginDismiss = () => {
    this.setState({ isLoginVisibleModal: false });
  };
  schedulePopUpDismiss = () => {
    this.setState({ isScheduleVisibleModal: false });
  };
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
            // backgroundColor: "red",
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

        {/* <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            marginTop: 15,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View> */}
      </View>
    );
  };
  showReferPatientModal = () => {
    this.setState({ isReferPopupModal: true });
  };
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
          // let eventName = this.state.popupItem.trackID;
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
            <View style={{width:Dimensions.get("window").width}}>

      <View
        style={{
          flex: 1,

          //backgroundColor: "blue",
          margin: 5,
          flexDirection: "row",
          height: Dimensions.get("window").height,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isReferPopupModal}
          onBackdropPress={() => this.setState({ isReferPopupModal: false })}
        >
          {this._renderReferModalPopup()}
        </Modal>
        <Modal
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          isVisible={this.state.isScheduleVisibleModal}
          onBackdropPress={() =>
            this.setState({ isScheduleVisibleModal: false })
          }
        >
          {this._renderModalSchedule()}
        </Modal>
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
            //backgroundColor: "red",

            margin: 5,
          }}
        >
          <View
            style={{
              height: 100,
              margin: 10,
              // backgroundColor:"red",
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
              // backgroundColor: "red",
              height: 500,
            }}
          >
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Taper Schedules
              </Text>

              <View
                style={{
                  marginTop: 15,
                  marginRight: 15,
                  height: 400,
                  width: 1000,
                  // borderRadius: 20,
                  // borderColor: "black",
                  // borderWidth: 3,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  // backgroundColor:"red"
                }}
              >
                <FlatList
                  style={{ width: 1000, marginTop: 7, marginBottom: 7 }}
                  data={this.state.schedules}
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
                            // console.log(
                            //   "this.state.schedules",
                            //   this.state.schedules
                            // );

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
                                    style={{ fontSize: 12, fontWeight: "bold" }}
                                  >
                                    Starting Dosage {"\n"}
                                  </Text>
                                  {item.startDose} mg
                                </Text>
                                <Text>
                                  <Text
                                    style={{ fontSize: 12, fontWeight: "bold" }}
                                  >
                                    Current Target Dosage {"\n"}
                                  </Text>
                                  {currentDosage} mg
                                </Text>
                              </View>

                              {/* <CircularSlider maxAngle={90} /> */}
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  }}
                />
              </View>
            </View>
            {/* <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Saved Resource
              </Text>
              <View
                style={{
                  marginTop: 15,
                  marginRight: 15,
                  height: "100%",
                  width: 400,
                  borderRadius: 30,
                  borderColor: "black",
                  borderWidth: 3,
                }}
              ></View>
            </View> */}
          </View>
        </View>
      </View>
      </View>
    );
  }
}
