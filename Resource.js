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
  Animated,
  StyleSheet,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";


export class Resources extends React.Component {
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
        <View style={{ flex: 0.2, backgroundColor: PRIMARY_COLOR, margin: 5, borderRadius:15 }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Index", {
                // needsUpdate: this.needsUpdate,
              });
            }}
            style={{margin:10}}
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
            style={{margin:10}}
          >
            <View style={{ flex: 1, margin: 5, padding:10 }}>
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
            style={{margin:10}}
          >
            <View style={{ flex: 1, backgroundColor: SEC_COLOR, margin: 5, padding:10, borderRadius:5 }}>
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
            style={{margin:10}}
            disabled={true}
          >
            <View style={{ flex: 1, margin: 5, padding:10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Refer Patient
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.8, 
        //backgroundColor: "red", 
        margin: 5 }}>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>Resources</Text>
        </View>
      </View>
    );
  }
}
