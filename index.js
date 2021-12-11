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
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  Ionicons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import * as Analytics from "expo-firebase-analytics";
import { Hoverable, Pressable } from "react-native-web-hover";

import { FlatList } from "react-native-web";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import Modal from "modal-enhanced-react-native-web";
import { GoogleLogin } from "./googleLogin";

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

const TAPERING_DATA = [
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
];

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupItem: { url: "", title: "", abstract: "" },
      isLoginVisibleModal: false,
      isPopupModal: false,
      isReferPopupModal: false,
    };
    this.dataModel = getDataModel();
  }
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
  _renderModalPopup = () => (
    <View
      style={{
        height: 500,
        width: 400,
        backgroundColor: "white",
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ fontSize: 32, fontWeight: "bold", margin: 10 }}>
          {this.state.popupItem.title}
        </Text>
        <ScrollView style={{ margin: 10 }}>
          <Text style={{ fontSize: 14 }}>{this.state.popupItem.abstract}</Text>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={async () => {
          let eventName = this.state.popupItem.trackID;
          await Analytics.logEvent(eventName, {
            name: "ResourceClicked",
            screen: "Resource",
          });
          this.setState({ isPopupModal: false });
          Linking.openURL(this.state.popupItem.url);
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
            Go to resource
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  _renderModalLogin = () => (
    <View
      style={{
        backgroundColor: "white",
        width: 300,
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
  navUserCenterDir = () => {
    this.props.navigation.navigate("UserCenter", {
      // needsUpdate: this.needsUpdate,
    });
  };
  dismissLoginModal = () => {
    this.setState({ isLoginVisibleModal: false });
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
  showReferPatientModal = () => {
    this.setState({ isReferPopupModal: true });
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
  _renderListView = (DATA) => (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={DATA}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              height: 350,
              width: 350,
              borderRadius: 20,
              marginRight: 10,
              padding: 10,
            }}
            onPress={() => {
              // console.log("item",item);
              this.setState({ popupItem: item });
              // console.log("this.state.popupItem",this.state.popupItem);
              this.setState({ isPopupModal: true });
            }}
          >
            <Card mode="elevated" style={{ borderRadius: 20 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    width: 200,
                    height: 200,
                    resizeMode: "stretch",
                    borderRadius: 20,
                  }}
                  source={{ uri: item.imgURL }}
                />
              </View>
              <Card.Title
                style={{ margin: 10, fontSize: 15 }}
                title={item.title}
                subtitle={item.subtitle}
                // left={LeftContent}
              />

              {/* <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content> */}

              {/* <Card.Actions>
                <Button>Cancel</Button>
                <Button>Ok</Button>
              </Card.Actions> */}
            </Card>
            {/* <Text
              style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}
              onPress={() => Linking.openURL(item.url)}
            >
              {item.title}
            </Text> */}
            {/* <ScrollView style={{ margin: 10 }}>
              <Text style={{ fontSize: 14 }}>{item.abstract}</Text>
            </ScrollView> */}
            {/* <View style={{ justifyContent: "center", alignContent: "center" }}>
              <FontAwesome name="book" size={128} color="black" />
            </View> */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
  render() {
    return (
      <View style={{ width: Dimensions.get("window").width }}>
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
            isVisible={this.state.isLoginVisibleModal}
            onBackdropPress={() =>
              this.setState({ isLoginVisibleModal: false })
            }
          >
            {this._renderModalLogin()}
          </Modal>
          <Modal
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isPopupModal}
            onBackdropPress={() => this.setState({ isPopupModal: false })}
          >
            {this._renderModalPopup()}
          </Modal>
          <Menu
            navResource={this.navResource}
            navIndex={this.navIndex}
            navCal={this.navCal}
            navUserCenter={this.navUserCenter}
            showReferPatientModal={this.showReferPatientModal}
          />
          <View
            style={{
              width: 1000,
              // backgroundColor: "red",
              margin: 5,
            }}
          >
            <View
              style={{
                height: 160,
                margin: 30,
                // backgroundColor:"red",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 65 }}>
                About Taperology
              </Text>
              <Text style={{}}>
                Welcome to Taperology! Clinicians may wish to reduce and or stop
                prescribing benzodiazepines (BZD) for some of their patients.
                However, especially for patients who have been prescribed a BZD
                for years, this can seem a daunting task for both clinicians and
                patients. Think of this resource as a BZD resource clearinghouse
                that pulls together information from a variety of sources to
                help make these conversations slightly easier, organized into
                the four following sections:
              </Text>
            </View>
            <View style={{ margin: 10, flexDirection: "row" }}>
              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: 500,
                      marginTop: 10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Resources", {});
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                      Resources
                    </Text>
                    <View
                      style={{
                        height: 10,
                        width: 100,
                        marginTop: 10,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <Text style={{ marginTop: 20 }}>
                      This section covers: BZD basics for both clinicians and
                      clinicians; information about alternative strategies for
                      insomnia and anxiety (the most common indications for
                      BZD); and information about tapering.
                    </Text>
                  </TouchableOpacity>
                )}
              </Hoverable>
              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: 500,
                      marginTop: 10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Calculator", {
                      });
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                      Taper Scheduler
                    </Text>
                    <View
                      style={{
                        height: 10,
                        width: 100,
                        marginTop: 10,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <Text style={{ marginTop: 20 }}>
                      Doing all the math involved in a potential taper can be
                      challenging during a brief return visit. This taper
                      scheduler begins by generating a 12 step taper over 24
                      weeks, which you can then customize for your patient.
                    </Text>
                  </TouchableOpacity>
                )}
              </Hoverable>
            </View>
            <View style={{ margin: 10, flexDirection: "row" }}>
              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: 500,
                      marginTop: 10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress = {() => this.showReferPatientModal()}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                      Refer Patient
                    </Text>
                    <View
                      style={{
                        height: 10,
                        width: 100,
                        marginTop: 10,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <Text style={{ marginTop: 20 }}>
                      For patients that you think may benefit from referral to
                      specialty mental health care, this takes you to the SAMHSA
                      Behavioral Health Treatment Services Locator.
                    </Text>
                  </TouchableOpacity>
                )}
              </Hoverable>
              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: 500,
                      marginTop: 10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress = {() => this.navUserCenter()}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                      User Center
                    </Text>
                    <View
                      style={{
                        height: 10,
                        width: 100,
                        marginTop: 10,
                        backgroundColor: "black",
                      }}
                    ></View>
                    <Text style={{ marginTop: 20 }}>
                      If you would like to save the taper schedules that you
                      generate, you can logon using your Google account and save
                      them here.
                    </Text>
                  </TouchableOpacity>
                )}
              </Hoverable>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
