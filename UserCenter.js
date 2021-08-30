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
  Modal,
  LayoutAnimation,
  SectionList,
  Button,
  Dimensions,
  Animated,
  StyleSheet,
  Linking,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { FlatList } from "react-native-web";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import moment, { min } from "moment";
import { DataTable, ProgressBar, Colors } from "react-native-paper";
import { CircularSlider } from 'react-native-elements-universe';

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";

export class UserCenter extends React.Component {
  constructor(props) {
    super(props);
    this.dataModel = getDataModel();

    this.schedules = this.dataModel.plans;
    console.log("this.schedules", this.schedules.length);
    this.state = {
      schedules: this.schedules,
    };
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
        }}
      >
        <Menu
          navResource={this.navResource}
          navIndex={this.navIndex}
          navCal={this.navCal}
          navUserCenter={this.navUserCenter}
          loginDismiss={this.loginDismiss}
        />
        <View
          style={{
            width: 1500,
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
              height: 700,
            }}
          >
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Tapper Schedules
              </Text>
              <View
                style={{
                  marginTop: 15,
                  marginRight: 15,
                  height: "100%",
                  width: 600,
                  borderRadius: 30,
                  borderColor: "black",
                  borderWidth: 3,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <FlatList
                  style={{ width: 580, marginTop: 10 }}
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
                        if (startDate < today) {
                          currentStep++;
                          currentDosage = step.dosage;
                        }
                      }
                      return (
                        <View
                          style={{
                            width: "100%",
                            height: 100,
                            flexDirection: "row",
                            marginBottom: 10,
                            borderRadius: 20,
                            backgroundColor: PRIMARY_COLOR,
                          }}
                        >
                          <View>
                            <Text>Created on {item.createdDate}</Text>
                            <Text>Start Date {item.startDate}</Text>
                            <Text>Start Date {item.totalStep}</Text>
                          </View>
                          <View>
                            <Text>Current Step {currentStep}</Text>
                            <ProgressBar
                              progress={currentStep / item.totalStep}
                              color={"black"}
                            />
                            <Text>Current Dosage {currentDosage}</Text>
                            {/* <CircularSlider maxAngle={90} /> */}
                          </View>
                        </View>
                      );
                    }
                  }}
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Saved Resource
              </Text>
              <View
                style={{
                  marginTop: 15,
                  marginRight: 15,
                  height: "100%",
                  width: 600,
                  borderRadius: 30,
                  borderColor: "black",
                  borderWidth: 3,
                }}
              ></View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
