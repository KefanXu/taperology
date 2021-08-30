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
import { Calculator } from "./Calculator";
import { Menu } from "./menu";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";

export class Index extends React.Component {
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
        <Menu
          // navResource={this.navResource}
          // navIndex={this.navIndex}
          // navCal={this.navCal}
          // navUserCenter={this.navUserCenter}
          // login={this.login}
        />

        <View
          style={{
            flex: 0.8,
            //backgroundColor: "red",
            margin: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>Index</Text>
        </View>
      </View>
    );
  }
}
