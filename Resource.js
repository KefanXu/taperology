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


const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
const BENZO_BASIC_DATA = [
  {
    title: "Benzodiazepines: How They Work & How to Withdraw",
    url: "https://drive.google.com/open?id=1UzmrSDUgja3SXrvf-q-_VGLsOZCIggFE&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "The Ashton Manual (Benzodiazepines: How They Work & How to Withdraw; https://www.benzo.org.uk/manual/) was published about 20 years ago by Dr. Heather Ashton, a physician and Professor of Clinical Psychopharmacology in the U.K. This document includes a wealth of accessible information about benzodiazepines, including basic pharmacology and a guide to helping long-term users withdraw from the medications.",
  },
  {
    title: "The EMPOWER brochure",
    url: "https://drive.google.com/open?id=1-DmaNSdd4QxU4WDG98gJ3PBNT7U5A_-H&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "The EMPOWER brochure was developed by Dr. Cara Tannenbaum, a geriatrician in Montreal. When this information was sent to older adult, long-term benzodiazepine users, 27% discontinued benzodiazepine use by 6 months later",
  },
  {
    title: "Re-evaluating the Use of Benzodiazepines",
    url: "https://drive.google.com/open?id=1fAFHaEhaW5bO9E0lOoM6KtSEASEoOJAd&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "Re-evaluating the Use of Benzodiazepines is a guide developed by the VA’s Academic Detailing Service. It includes background information about prescribing trends in recent years, suggests evidence-based alternatives for those with anxiety disorders or insomnia, and specifically addresses risks among high-risk populations, including those with dementia, PTSD, and older adults. The full catalog of the VA’s Academic Detailing Resources is here, covering additional topics such as alcohol use disorder, chronic obstructive pulmonary disease, and pain/opioid safety.",
  },
  {
    title: "VA BZD Patient_Quick Start Guide",
    url: "https://drive.google.com/open?id=1-MfFm832mP7hcv_ao5dhMQnkGkyecO0a&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "This is a brief, one-page infographic presenting potentially harms associated with prescription benzodiazepine use that may be useful in discussion with patients and family members.",
  },
];
const INSOMNIA_DATA = [
  {
    title: "BZRA deprescribing pamphlet",
    url: "https://drive.google.com/open?id=1-YIrbpLY-nsuV_R5WDLOz9emR8FQrs8a&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "This 2-page pamphlet was created by deprescribing.org, a group led by a Canadian pharmacist (Dr. Barbara Farrell) and geriatrician (Dr. Cara Tannenbaum) seeking to promote appropriate deprescribing. (They have a variety of additional patient- and provider-facing resources, for a variety of different medications.)",
  },
  {
    title: "Mysleepwell.ca",
    url: "http://Mysleepwell.ca",
    abstract:
      "Mysleepwell.ca is an excellent website with a wealth of information emphasizing reducing use of sleeping pills, promoting sleep hygiene, and introducing patients to CBT for insomnia. ",
  },
  {
    title: "Insomnia",
    url: "https://mobile.va.gov/app/insomnia-coach",
    abstract:
      "This app was developed by the VA to help manage insomnia and is based on CBT for insomnia. It includes a guided weekly training plan with tips for sleeping and person feedback. Available for free for Apple or Android.",
  },
];
const ANXIETY_DATA = [
  {
    title: "Breathing Retraining",
    url: "https://drive.google.com/open?id=1-Qg3l8bKq0P8Ouinx8FStjPXzA6E-4EQ&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "An elevated breathing rate may often accompany anxiety; the flip-side is that mindful breathing in a stressful situation may help reduce anxiety and panic. This 1-page information sheet was developed by the Center for Clinical Interventions in Australia; additional resources related to anxiety can be found here.",
  },
  {
    title: "Progressive Muscle Relaxation",
    url: "https://drive.google.com/open?id=1-TgIQLhkSCxrct_srB_NZLr7Tf5atolC&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "Muscle tension is another way that the body can respond to stress. This 1-pager, also developed by the Center for Clinical Interventions,  introduces Progressive Muscle Relaxation, to help guide the body through periods of heightened tension.",
  },
  {
    title: "Simple Grounding Technique",
    url: "https://drive.google.com/open?id=102VxfQr2mgQLgi05EpwEZv8MnvzALTrV&authuser=maustd%40umich.edu&usp=drive_fs",
    abstract:
      "This is a simple infographic that may help patients through a moment of significant distress.",
  },
  {
    title: "Mindfulness Coach",
    url: "https://mobile.va.gov/app/mindfulness-coach",
    abstract:
      "The VA developed this app, which “The app provides a gradual, self-guided training program designed to help you understand and adopt a simple mindfulness practice. Mindfulness Coach also offers a library of information about mindfulness, 12 audio-guided mindfulness exercises, a growing catalog of additional exercises available for free download, goal-setting and tracking, a mindfulness mastery assessment to help you track your progress over time, customizable reminders, and access to other support and crisis resources.” Available for free for Apple or Android.",
  },
];
const TAPERING_DATA = [
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
];

export class Resources extends React.Component {
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
          width: Dimensions.get("window").width,
        }}
      >
        <Menu
          navResource={this.navResource}
          navIndex={this.navIndex}
          navCal={this.navCal}
        />
        <View
          style={{
            flex: 0.8,
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
            <Text style={{ fontWeight: "bold", fontSize: 65 }}>Resources</Text>
          </View>
          <View style={{ margin: 10 }}>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Benzo Basics
              </Text>
              {this._renderListView(BENZO_BASIC_DATA)}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Resources on Tapering
              </Text>
              {this._renderListView(BENZO_BASIC_DATA)}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Resources on Insomnia
              </Text>
              {this._renderListView(INSOMNIA_DATA)}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Resources on Anxiety
              </Text>
              {this._renderListView(ANXIETY_DATA)}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
