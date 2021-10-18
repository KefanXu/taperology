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

import moment, { min } from "moment";
import { DataTable, ProgressBar, Colors } from "react-native-paper";
import { CircularSlider } from "react-native-elements-universe";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";

export class UserCenter extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();
    this.schedule = React.createRef();

    this.schedules = this.dataModel.plans;
    //console.log("this.schedules", this.schedules.length);
    this.state = {
      schedules: this.schedules,
      currentData: "",
      isScheduleVisibleModal: false,
      currentSchedule: [],
    };
  }
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
  _renderModalSchedule = () => {
    console.log("_renderModalSchedule");
    return (
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: 500,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Schedule
          ref={this.schedule}
          scheduleData={this.state.currentSchedule}
          data = {this.state.currentData}
        />

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
        </View>
      </View>
    );
  };
  _renderListView = (DATA) => (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={DATA}
        horizontal={true}
        renderItem={({ item }) => (
          <View
            style={{
              height: 300,
              width: 300,
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 20,
              marginRight: 10,
              padding: 10,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}
              onPress={() => Linking.openURL(item.url)}
            >
              {item.title}
            </Text>
            <ScrollView style={{ margin: 10 }}>
              <Text style={{ fontSize: 14 }}>{item.abstract}</Text>
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
  render() {
    return (
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
                  height: "100%",
                  width: 400,
                  borderRadius: 20,
                  borderColor: "black",
                  borderWidth: 3,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  // backgroundColor:"red"
                }}
              >
                <FlatList
                  style={{ width: 380, marginTop: 7, marginBottom: 7 }}
                  data={this.state.schedules}
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
                              width: "100%",
                              height: 100,
                              flexDirection: "row",
                              marginBottom: 10,
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
                              <Text>
                                <Text
                                  style={{ fontSize: 12, fontWeight: "bold" }}
                                >
                                  Current Dosage{" "}
                                </Text>
                                {currentDosage}
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
    );
  }
}
