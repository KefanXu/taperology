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
  // Button,
  Animated,
  StyleSheet,
  Platform,
  Picker,
} from "react-native";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import moment, { min } from "moment";

import Datepicker from "react-native-web-ui-components/Datepicker";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";

export class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVis:false,
      datePickerButtonTxt: "Pick the start date"
    }
  }
  closeDatePicker = () => {
    this.setState({isDatePickerVis: false});
    console.log("close");
  }
  shoeDatePicker = () => {
    this.setState({isDatePickerVis: true})
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          //backgroundColor: "blue",
          margin: 5,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 0.2,
            backgroundColor: PRIMARY_COLOR,
            margin: 5,
            borderRadius: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Index", {
                // needsUpdate: this.needsUpdate,
              });
            }}
            style={{ margin: 10 }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 50, margin: 5 }}>
              Taperology
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Calculator", {
                // needsUpdate: this.needsUpdate,
              });
            }}
            style={{ margin: 10 }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: SEC_COLOR,
                margin: 5,
                borderRadius: 5,
                padding: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Tapper Schedular
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Resources", {
                // needsUpdate: this.needsUpdate,
              });
            }}
            style={{ margin: 10 }}
          >
            <View style={{ flex: 1, margin: 5, padding: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Resources
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Calculator", {
                // needsUpdate: this.needsUpdate,
              });
            }}
            style={{ margin: 10 }}
            disabled={true}
          >
            <View style={{ flex: 1, margin: 5, padding: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Refer Patient
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.8, backgroundColor: "", margin: 5 }}>
          <View style={{ flex: 0.1, margin: 10, backgroundColor: "blue" }}>
            <Text style={{ fontWeight: "bold", fontSize: 65 }}>
              Tapper Schedular
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              margin: 10,
              backgroundColor: "red",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.2, width: "60%", height: "100%" }}>
              <Text style={{ fontWeight: "bold" }}>#1 Benzodiazeoines</Text>
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
                  style={Platform.select({
                    web: {
                      outlineStyle: "none",
                      flex: 1,
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 20,
                    },
                  })}
                  maxLength={35}
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={this.state.reason}
                  onChangeText={(text) => {}}
                />
              </View>
            </View>
            {/* Pick the start date */}
            <View style={{ flex: 0.2, width: "60%", height: "100%" }}>
            
              <Text style={{ fontWeight: "bold" }}>#2 Start Date</Text>

              <DatePickerModal
                // locale={'en'} optional, default: automatic
                mode="single"
                visible={this.state.isDatePickerVis}
                onDismiss={this.closeDatePicker}
                date={new Date()}
                onConfirm={(date) => {
                  let selectedDate = moment(new Date(date.date)).format().slice(0,10)
                  console.log("selectedDate",selectedDate);
                  this.setState({datePickerButtonTxt:selectedDate});
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
                  alignItems:"center",
                  justifyContent:"center",
                  backgroundColor:"black"
                }}
                onPress={this.shoeDatePicker}
              >
                <Text style={{fontWeight:"bold", color:"white"}}>{this.state.datePickerButtonTxt}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.2, width: "60%", height: "100%" }}>
              <Text style={{ fontWeight: "bold" }}>#3 Total Steps</Text>
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
                  style={Platform.select({
                    web: {
                      outlineStyle: "none",
                      flex: 1,
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 20,
                    },
                  })}
                  maxLength={35}
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={this.state.reason}
                  onChangeText={(text) => {}}
                />
              </View>
            </View>
            <View style={{ flex: 0.2, width: "60%", height: "100%" }}>
              <Text style={{ fontWeight: "bold" }}>#4 Starting Dose</Text>
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
                  style={Platform.select({
                    web: {
                      outlineStyle: "none",
                      flex: 1,
                      marginLeft: 20,
                      marginRight: 20,
                      fontSize: 20,
                    },
                  })}
                  maxLength={35}
                  autoCapitalize="none"
                  autoCorrect={false}
                  // value={this.state.reason}
                  onChangeText={(text) => {}}
                />
              </View>
            </View>
            <View style={{ flex: 0.2, width: "60%", height: "100%" }}>
              <Text style={{ color: "white" }}>#1 Benzodiazeoines</Text>
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
                  console.log("generate");
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Generate Schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
