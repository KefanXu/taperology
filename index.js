/*
This code refer to the website index page 
which contains a welcome info 
and links to each sections
*/
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import * as Analytics from "expo-firebase-analytics";
import { Hoverable } from "react-native-web-hover";

import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import Modal from "modal-enhanced-react-native-web";

//This imports the Google Login component.
//It's not used in the current version but can be activated if there is a future need.
import { GoogleLogin } from "./googleLogin";

const PRIMARY_COLOR = "#D8D8D8";

//Text used in the refer patient popup
const REFER_PATIENT_TXT = (
  <Text style={{ margin: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
      Refer a Patient using the Behavioral Health Treatment Services Locator
    </Text>
    {"\n"}
    {"\n"}
    <Text style={{ fontSize: 14 }}>
      Just enter the patient's address or zip code to find mental health or
      substance use treatment facilities in their area.
      {"\n"}
      {"\n"}
      This locator is provided by SAMHSA (the Substance Abuse and Mental Health
      Services Administration).
    </Text>
  </Text>
);

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupItem: { url: "", title: "", abstract: "" },
      isLoginVisibleModal: false,
      isPopupModal: false,
      isReferPopupModal: false,
      windowWidth: Dimensions.get("window").width,
    };
    // This is used to load users' personal data
    // REMOVED FROM THE CURRENT VERSION
    // this.dataModel = getDataModel();
  }

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
          //Use this Google Analytics API to track if user click the refer patient link
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
  //This renders the login popup.
  //It's not used in the current version but can be activated if there is a future need.
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

  //This navigation function navigate users to the user center after they logged in.
  //It's not used in the current version but can be activated if there is a future need.
  navUserCenterDir = () => {
    this.props.navigation.navigate("UserCenter", {});
  };

  //Function to close the login popup
  //It's not used in the current version but can be activated if there is a future need.
  dismissLoginModal = () => {
    this.setState({ isLoginVisibleModal: false });
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

  //Function to navigate to the user center and load users' saved schedules.
  //Passed into the googleLogin (googleLogin.js) component.
  //It's not used in the current version but can be activated if there is a future need.
  navUserCenter = async () => {
    if (this.dataModel.isLogin) {
      await this.dataModel.loadUserSchedules(this.dataModel.key);
      this.props.navigation.navigate("UserCenter", {});
    } else {
      this.setState({ entry: "menu" });
      this.setState({ isLoginVisibleModal: true });
    }
  };

  render() {
    return (
      //Render the top level view
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
          {/* Render the refer patient popup (pop up when users click either the menu and Refer Patient block) */}
          <Modal
            style={{ justifyContent: "center", alignItems: "center" }}
            isVisible={this.state.isReferPopupModal}
            onBackdropPress={() => this.setState({ isReferPopupModal: false })}
          >
            {this._renderReferModalPopup()}
          </Modal>
          {/* Render the imported menu component and pass patient functions */}
          <Menu
            navResource={this.navResource}
            navIndex={this.navIndex}
            navCal={this.navCal}
            navUserCenter={this.navUserCenter}
            showReferPatientModal={this.showReferPatientModal}
          />
          {/* Render the whole text section (including title and blocks underneath) */}
          <View
            style={{
              width: this.state.windowWidth * 0.8,
              margin: 5,
            }}
          >
            {/* Render the title and text underneath */}
            <View
              style={{
                height: Dimensions.get("window").width > 1000 ? 160 : 320,
                margin: 10,
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 65, color: "purple" }}
              >
                Welcome to Benzo Basics!
              </Text>
              <Text style={{}}>
                Clinicians may wish to reduce and or stop prescribing
                benzodiazepines (BZD) for some of their patients. However,
                especially for patients who have been prescribed a BZD for
                years, this can seem a daunting task for both clinicians and
                patients. Think of this resource as a BZD resource clearinghouse
                that pulls together information from a variety of sources to
                help make these conversations slightly easier, organized into
                the three following sections:
              </Text>
            </View>
            {/* Render the first row of the hoverable blocks */}
            <View
              style={{
                margin: 0,
                flexDirection:
                  Dimensions.get("window").width > 1000 ? "row" : "column",
              }}
            >
              {/* Hoverable block of Resources */}

              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: Dimensions.get("window").width > 1000 ? 500 : 400,
                      marginTop: 10,
                      marginLeft: -10,
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
                        backgroundColor: "purple",
                        borderRadius: 10,
                      }}
                    ></View>
                    <Text style={{ marginTop: 20 }}>
                      This section covers: BZD basics for both clinicians and
                      patients; information about alternative strategies for
                      insomnia and anxiety (the most common indications for
                      BZD); and information about tapering.
                    </Text>
                  </TouchableOpacity>
                )}
              </Hoverable>
              {/* Hoverable block of Taper Scheduler */}
              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: Dimensions.get("window").width > 1000 ? 500 : 400,
                      marginTop: 10,
                      marginLeft:
                        Dimensions.get("window").width > 1000 ? 0 : -10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("Calculator", {});
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
                        backgroundColor: "purple",
                        borderRadius: 10,
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
            {/* Render the second row of the hoverable blocks */}

            <View style={{ margin: 0, flexDirection: "row" }}>
              {/* Hoverable block of Refer Patient */}

              <Hoverable>
                {({ hovered }) => (
                  <TouchableOpacity
                    style={{
                      height: 200,
                      width: Dimensions.get("window").width > 1000 ? 500 : 400,
                      marginTop: 10,
                      marginLeft: -10,
                      padding: 20,
                      borderRadius: 20,
                      backgroundColor: hovered ? PRIMARY_COLOR : "#F2F2F2",
                    }}
                    onPress={() => this.showReferPatientModal()}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                      Refer Patient
                    </Text>
                    <View
                      style={{
                        height: 10,
                        width: 100,
                        marginTop: 10,
                        backgroundColor: "purple",
                        borderRadius: 10,
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
