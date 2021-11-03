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

import { FlatList } from "react-native-web";
import { Menu } from "./menu";
import { getDataModel } from "./DataModel";
import Modal from "modal-enhanced-react-native-web";
import { GoogleLogin } from "./googleLogin";

const PRIMARY_COLOR = "#D8D8D8";
const SEC_COLOR = "#848484";
const BENZO_BASIC_DATA = [
  {
    title: "The Ashton Manual",
    trackID: "BENZO_BASIC_DATA_1",
    url: "https://drive.google.com/file/d/1UzmrSDUgja3SXrvf-q-_VGLsOZCIggFE/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Manual.png?token=AJTYIQGFWCRHS3U3LCUJ3FTBRGIA2",
    abstract:
      "The Ashton Manual was developed by Dr. Heather Ashton, Professor of Clinical Psychopharmacology in England. In 1999, she published a manual on safely and effectively  tapering off of BZDs, called “Benzodiazepines: How They Work And How To Withdraw,” which is now known as the Ashton Manual.",
    subtitle: "Tapering Guide for Benzodiazepines",
    test: <Text></Text>,
  },
  {
    title: "Empower Brochure",
    trackID: "BENZO_BASIC_DATA_2",
    url: "https://drive.google.com/file/d/1-DmaNSdd4QxU4WDG98gJ3PBNT7U5A_-H/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/EMPOWER_brochure.png?token=AJTYIQG5NFPYDKPAEDH2J73BRLABW",
    abstract:
      <Text>The EMPOWER brochure was developed by Dr. Cara Tannenbaum, 
      a geriatrician in Montreal. When this information was sent to older adult, 
      long-term benzodiazepine users, 27% discontinued benzodiazepine use by 6 months later 
      (compared to just 5% in the control group; paper 
      <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://pubmed.ncbi.nlm.nih.gov/24733354/");}}> here</Text>
      , brochure <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://www.deprescribingnetwork.ca/s/Sleeping-pills_anti-anxiety-meds_Sedative-hypnotics-1.pdf");}}>here</Text>).</Text>,
    subtitle: "Educational Pamphlet",
  },
  {
    title: "Re-evaluating Use",
    trackID: "BENZO_BASIC_DATA_3",
    url: "https://drive.google.com/file/d/1fAFHaEhaW5bO9E0lOoM6KtSEASEoOJAd/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Re-evaluating_Use.png?token=AJTYIQEQ4D5STWTHN7CYM3DBRLAES",
    abstract:
      <Text>Re-evaluating the Use of Benzodiazepines is a guide developed by the VA’s Academic Detailing Service. 
      {"\n"} 
      {"\n"}It includes background information about prescribing trends in recent years, 
      suggests evidence-based alternatives for those with anxiety disorders or insomnia, 
      and specifically addresses risks among high-risk populations, including those with dementia, 
      PTSD, and older adults. {"\n"}
      {"\n"} 
      The full catalog of the VA’s Academic Detailing Resources is 
      <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://www.pbm.va.gov/PBM/AcademicDetailingService/EducationalMaterialCatalog_Publicsite.pdf");}}> here</Text>, 
      covering additional topics such as alcohol use disorder, 
      chronic obstructive pulmonary disease, and pain/opioid safety.</Text>,
    subtitle: "VA Clinician's Guide",
  },
  {
    title: "Quick Start Guide",
    trackID: "BENZO_BASIC_DATA_4",
    url: "https://drive.google.com/file/d/1-MfFm832mP7hcv_ao5dhMQnkGkyecO0a/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/QuickStart.png?token=AJTYIQAGE4ZQZBGFGJNFOXLBRLAGS",
    abstract:
      "This is a brief, one-page infographic presenting potentially harms associated with prescription benzodiazepine use that may be useful in discussion with patients and family members.",
    subtitle: "1-page Infographic",
  },
];
const INSOMNIA_DATA = [
  {
    title: "Insomnia Coach Sleep App",
    trackID: "INSOMNIA_DATA_1",
    url: "https://mobile.va.gov/app/insomnia-coach",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/InsomniaCoach.png?token=AJTYIQFW7QSJ5AGV5GM3RBDBRQHKW",
    subtitle: "Downloadable App for Help with Insomnia",
    abstract:
      "This app was developed by the VA to help manage insomnia and is based on CBT for insomnia. It includes a guided weekly training plan with tips for sleeping and person feedback. Available for free for Apple or Android.",
  },
  {
    title: "Sleepwell",
    trackID: "INSOMNIA_DATA_2",
    url: "http://Mysleepwell.ca",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Sleepwell.png?token=AJTYIQB7YFE6TFHK6KGLNOLBRLIJY",
    subtitle: "Website on Sleep Hygiene",
    abstract:
      <Text>Mysleepwell.ca is an excellent website with a wealth of information emphasizing reducing use of sleeping pills, promoting sleep hygiene, and introducing patients to CBT for insomnia.{"\n"}
      {"\n"} 
      - A printable sleep hygiene checklist is <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://mysleepwell.ca/cbti/hygiene-of-sleep/");}}>here</Text>.{"\n"} 
      {"\n"} 
      - A list of recommended books, websites, and apps is <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://mysleepwell.ca/cbti/sleepwell-recommends/");}}> here</Text>.{"\n"} 
      </Text>,
  },
  {
    title: "BZD Deprescribing",
    trackID: "INSOMNIA_DATA_3",
    url: "https://drive.google.com/file/d/1-YIrbpLY-nsuV_R5WDLOz9emR8FQrs8a/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_PDF.png?token=AJTYIQEOSAIW24SD62AGXO3BRGIYS",
    subtitle: "Pamphlet",
    abstract:
      <Text>This 2-page pamphlet was created by <Text style={{color:"blue"}} onPress={() => {Linking.openURL("https://deprescribing.org/resources/");}}>deprescribing.org</Text>, 
      a group led by a Canadian pharmacist (Dr. Barbara Farrell) and geriatrician (Dr. Cara Tannenbaum) seeking to promote appropriate deprescribing. (
        They have a variety of additional patient- and provider-facing resources, for a variety of different medications.)</Text>,
  },
];
const ANXIETY_DATA = [
  {
    title: "Breathing Retraining",
    trackID: "ANXIETY_DATA_1",
    url: "https://drive.google.com/file/d/1-Qg3l8bKq0P8Ouinx8FStjPXzA6E-4EQ/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Breathing.png?token=AJTYIQGNV3YW7IAC7YDDXPLBRGDGQ",
    subtitle: "Information Sheet",
    abstract:
      "This information sheet briefly discusses the role of breathing in anxiety  and guides you through a simple breathing retraining technique that uses breathing patterns to help deal with anxiety.",
  },
  {
    title: "Progressive Muscle Relaxation",
    trackID: "ANXIETY_DATA_2",
    url: "https://drive.google.com/file/d/1-TgIQLhkSCxrct_srB_NZLr7Tf5atolC/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Relaxation.png?token=AJTYIQHROWM37XHJOQECLI3BRGDD6",
    subtitle: "Information Sheet",
    abstract:
      "Muscle tension is another way that the body can respond to stress. This 1-pager, also developed by the Center for Clinical Interventions, introduces Progressive Muscle Relaxation, to help guide the body through periods of heightened tension.",
  },
  {
    title: "5-4-3-2-1",
    trackID: "ANXIETY_DATA_3",
    url: "https://drive.google.com/file/d/102VxfQr2mgQLgi05EpwEZv8MnvzALTrV/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_54321.png?token=AJTYIQCFFJRIUH3SZMGTCV3BRGCS4",
    subtitle: "Infographic",
    abstract:
      "This is a simple infographic that may help patients through a moment of significant distress.",
  },
  {
    title: "Mindfulness Coach",
    trackID: "ANXIETY_DATA_4",
    url: "https://mobile.va.gov/app/mindfulness-coach",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/mindfulness-coach-app-icon.png?token=AJTYIQGJG2OAJ65HN4LBZGTBRQHHW",
    subtitle: "Downloadable App",
    abstract:
      <Text>The VA developed this app, which “The app provides a gradual, self-guided training program designed to help you understand and adopt a simple mindfulness practice. Mindfulness Coach also offers{"\n"} 
      {"\n"} 
      - A library of information about mindfulness{"\n"} 
      - 12 audio-guided mindfulness exercises{"\n"} 
      - A growing catalog of additional exercises available for free download{"\n"} 
      - Goal-setting and tracking{"\n"} 
      - A mindfulness mastery assessment to help you track your progress over time {"\n"}
      - Customizable reminders{"\n"} 
      - Access to other support and crisis resources.</Text>,
  },
];
const TAPER_RESOURCE = [
  {
    title: "The Ashton Manual",
    trackID: "BENZO_BASIC_DATA_1",
    url: "https://drive.google.com/file/d/1UzmrSDUgja3SXrvf-q-_VGLsOZCIggFE/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Manual.png?token=AJTYIQGFWCRHS3U3LCUJ3FTBRGIA2",
    abstract: "The Ashton Manual was developed by Dr. Heather Ashton, Professor of Clinical Psychopharmacology in England. In 1999, she published a manual on safely and effectively  tapering off of BZDs, called “Benzodiazepines: How They Work And How To Withdraw,” which is now known as the Ashton Manual.",
    subtitle: "Tapering Guide for Benzodiazepines",
  },
  {
    title: "Quick Start Guide",
    trackID: "BENZO_BASIC_DATA_4",
    url: "https://drive.google.com/file/d/1-MfFm832mP7hcv_ao5dhMQnkGkyecO0a/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/QuickStart.png?token=AJTYIQAGE4ZQZBGFGJNFOXLBRLAGS",
    abstract:
      "This is a brief, one-page infographic presenting potentially harms associated with prescription benzodiazepine use that may be useful in discussion with patients and family members.",
    subtitle: "1-page Infographic",
  },
];
const TAPERING_DATA = [
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
  { title: "Mysl", url: "", abstract: "" },
];

export class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupItem: { url: "", title: "", abstract: "" },
      isLoginVisibleModal: false,
      isPopupModal: false,
    };
    this.dataModel = getDataModel();
  }
  _renderModalPopup = () => (
    <View
      style={{
        height: 400,
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
          Linking.openURL(this.state.popupItem.url);
        }}
      >
        <View
          style={{ backgroundColor: "black", borderRadius: 20, margin: 10, width:150, justifyContent:"center", alignItems:"center" }}
        >
          <Text style={{ color: "white", fontWeight: "bold", margin: 10, }}>
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
              height: 300,
              width: 300,
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
          isVisible={this.state.isLoginVisibleModal}
          onBackdropPress={() => this.setState({ isLoginVisibleModal: false })}
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
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                Resources on Tapering
              </Text>
              {this._renderListView(TAPER_RESOURCE)}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
