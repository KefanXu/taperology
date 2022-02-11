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
import { Modal as NativeModal } from "react-native";
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
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Appbar,
  FAB,
} from "react-native-paper";
import * as Analytics from "expo-firebase-analytics";

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
      Just enter the patient's address or zip code to find mental health or
      substance use treatment facilities in their area.
      {"\n"}
      {"\n"}
      This locator is provided by SAMHSA (the Substance Abuse and Mental Health
      Services Administration).
    </Text>
    {/* {"\n"}
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
    </Text> */}
  </Text>
);

const BENZO_BASIC_CLINICIANS_DATA = [
  {
    title: "The Ashton Manual",
    trackID: "BENZO_BASIC_CLINICIANS_DATA_1",
    url: "https://drive.google.com/file/d/1UzmrSDUgja3SXrvf-q-_VGLsOZCIggFE/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Ashton_Manual.png",
    abstract:
      "The Ashton Manual was developed by Dr. Heather Ashton, Professor of Clinical Psychopharmacology in England. In 1999, she published a manual on safely and effectively  tapering off of BZDs, called “Benzodiazepines: How They Work And How To Withdraw,” which is now known as the Ashton Manual.",
    subtitle: (
      <Text>
        Tapering Guide for Benzodiazepines {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 58 pages</Text>
      </Text>
    ),
    test: <Text></Text>,
  },
  {
    title: "BZD Discussion Outline",
    trackID: "BENZO_BASIC_CLINICIANS_DATA_2",
    url: "https://drive.google.com/file/d/11Nim4jesfl3odnlrbPCcQWx-4fRKTPhP/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/BZD_discussion.png",
    abstract:
      "This one-pager from the VA Academic Detailing Service is a high-level overview of how to engage your patients about benzodiazepines and discuss a potential taper.",
    subtitle: (
      <Text>
        Discussing Benzodiazepine Discontinuation {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
    test: <Text></Text>,
  },

  {
    title: "Provider BZD Educational Guide",
    trackID: "BENZO_BASIC_CLINICIANS_DATA_4",
    url: "https://drive.google.com/file/d/1fAFHaEhaW5bO9E0lOoM6KtSEASEoOJAd/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Re-evaluating_Use.png?token=AJTYIQEQ4D5STWTHN7CYM3DBRLAES",
    abstract: (
      <Text>
        Re-evaluating the Use of Benzodiazepines is a guide developed by the
        VA’s Academic Detailing Service.
        {"\n"}
        {"\n"}It includes background information about prescribing trends in
        recent years, suggests evidence-based alternatives for those with
        anxiety disorders or insomnia, and specifically addresses risks among
        high-risk populations, including those with dementia, PTSD, and older
        adults. {"\n"}
        {"\n"}
        The full catalog of the VA’s Academic Detailing Resources is
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL(
              "https://www.pbm.va.gov/PBM/AcademicDetailingService/EducationalMaterialCatalog_Publicsite.pdf"
            );
          }}
        >
          {" "}
          here
        </Text>
        , covering additional topics such as alcohol use disorder, chronic
        obstructive pulmonary disease, and pain/opioid safety.
      </Text>
    ),
    subtitle: (
      <Text>
        VA Clinician's Guide {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 32 page</Text>
      </Text>
    ),
  },
  {
    title: "Bottom-line Prescribing Recommendations",
    trackID: "BENZO_BASIC_CLINICIANS_DATA_5",
    url: "https://drive.google.com/file/d/11NnjtDGlka---4IjnCWcz0xMVi2HGbTt/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/bottom_line.png",
    abstract:
      "These are bottom-line prescribing recommendations from the VA evidence synthesis presented in the Provider BZD Educational Guide, including alternatives for anxiety and insomnia and particular patient groups for whom to avoid prescribing.",
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
    test: <Text></Text>,
  },
];
const BENZO_BASIC_PATIENT_DATA = [
  {
    title: "BZD risk infographic",
    trackID: "BENZO_BASIC_PATIENT_DATA_1",
    url: "https://drive.google.com/file/d/11A2hCA2Tqheb6qwbmIbu-CMT2Brmk_5X/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/QuickStart.png?token=AJTYIQAGE4ZQZBGFGJNFOXLBRLAGS",
    abstract:
      "This is a brief, one-page infographic presenting potentially harms associated with prescription benzodiazepine use that may be useful in discussion with patients and family members.",
    subtitle: (
      <Text>
        1-page Infographic {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
  },
  {
    title: "Empower Brochure",
    trackID: "BENZO_BASIC_PATIENT_DATA_2",
    url: "https://drive.google.com/file/d/1-DmaNSdd4QxU4WDG98gJ3PBNT7U5A_-H/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/EMPOWER_brochure.png?token=AJTYIQG5NFPYDKPAEDH2J73BRLABW",
    abstract: (
      <Text>
        The EMPOWER brochure was developed by Dr. Cara Tannenbaum, a
        geriatrician in Montreal. When this information was sent to older adult,
        long-term benzodiazepine users, 27% discontinued benzodiazepine use by 6
        months later (compared to just 5% in the control group; paper
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL("https://pubmed.ncbi.nlm.nih.gov/24733354/");
          }}
        >
          {" "}
          here
        </Text>
        , brochure{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL(
              "https://www.deprescribingnetwork.ca/s/Sleeping-pills_anti-anxiety-meds_Sedative-hypnotics-1.pdf"
            );
          }}
        >
          here
        </Text>
        ).
      </Text>
    ),

    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 12 page</Text>
      </Text>
    ),
  },
  {
    title: "Patient Brochure",
    trackID: "BENZO_BASIC_PATIENT_DATA_3",
    url: "https://drive.google.com/file/d/12evJljCeRXKl1HjJcHr0-xqMNyozFIZ_/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Patient_Brochure.png",
    abstract:
      "This is an alternative to the EMPOWER brochure developed at the University of Michigan by a team including Dr. Maust. It also presents educational information to patients about potential risks and introduces the concept of a taper.",
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 10 page</Text>
      </Text>
    ),
  },
];
const INSOMNIA_DATA = [
  {
    title: "Insomnia Coach Sleep App",
    trackID: "INSOMNIA_DATA_1",
    url: "https://mobile.va.gov/app/insomnia-coach",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/InsomniaCoach.png?token=AJTYIQFW7QSJ5AGV5GM3RBDBRQHKW",
    subtitle: (
      <Text>
        Downloadable App for Help with Insomnia {"\n"}
        <Text style={{ fontWeight: "bold" }}>App</Text>
      </Text>
    ),
    abstract:
      "This app was developed by the VA to help manage insomnia and is based on CBT for insomnia. It includes a guided weekly training plan with tips for sleeping and person feedback. Available for free for Apple or Android.",
  },
  {
    title: "Sleepwell",
    trackID: "INSOMNIA_DATA_2",
    url: "http://Mysleepwell.ca",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Sleepwell.png?token=AJTYIQB7YFE6TFHK6KGLNOLBRLIJY",
    subtitle: (
      <Text>
        Website on Sleep Hygiene {"\n"}
        <Text style={{ fontWeight: "bold" }}>Website</Text>
      </Text>
    ),
    abstract: (
      <Text>
        Mysleepwell.ca is an excellent website with a wealth of information
        emphasizing reducing use of sleeping pills, promoting sleep hygiene, and
        introducing patients to CBT for insomnia.{"\n"}
        {"\n"}- A printable sleep hygiene checklist is{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL("https://mysleepwell.ca/cbti/hygiene-of-sleep/");
          }}
        >
          here
        </Text>
        .{"\n"}
        {"\n"}- A list of recommended books, websites, and apps is{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL(
              "https://mysleepwell.ca/cbti/sleepwell-recommends/"
            );
          }}
        >
          {" "}
          here
        </Text>
        .{"\n"}
      </Text>
    ),
  },
  {
    title: "Sleep Diary",
    trackID: "INSOMNIA_DATA_3",
    url: "https://drive.google.com/file/d/11Ouq1yKZNvZSiCJF21WpA3TGBL7YuBbE/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Sleep_diary.png",
    abstract:
      "While the Insomnia Coach app offers a sleep diary, patients who prefer pen-and-pencil can use this two-week sleep diary from the American Academy of Sleep Medicine to help understand their current sleep habits (or lack thereof).",
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
  },
  {
    title: "10 Tips to Beat Insomnia",
    trackID: "INSOMNIA_DATA_4",
    url: "https://drive.google.com/file/d/11ONYdmCxHMBhTRQcXI0q62YZ0MTF2WMb/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/10_tips.png",
    abstract:
      "These are sleep hygiene-related tips from Great Britain’s National Health Service.",
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 2 page</Text>
      </Text>
    ),
  },
  // {
  //   title: "BZD Deprescribing",
  //   trackID: "INSOMNIA_DATA_3",
  //   url: "https://drive.google.com/file/d/1-YIrbpLY-nsuV_R5WDLOz9emR8FQrs8a/view?usp=sharing",
  //   imgURL:
  //     "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_PDF.png?token=AJTYIQEOSAIW24SD62AGXO3BRGIYS",
  //   subtitle: "Pamphlet",
  //   abstract: (
  //     <Text>
  //       This 2-page pamphlet was created by{" "}
  //       <Text
  //         style={{ color: "blue" }}
  //         onPress={() => {
  //           Linking.openURL("https://deprescribing.org/resources/");
  //         }}
  //       >
  //         deprescribing.org
  //       </Text>
  //       , a group led by a Canadian pharmacist (Dr. Barbara Farrell) and
  //       geriatrician (Dr. Cara Tannenbaum) seeking to promote appropriate
  //       deprescribing. ( They have a variety of additional patient- and
  //       provider-facing resources, for a variety of different medications.)
  //     </Text>
  //   ),
  // },
];
const ANXIETY_DATA = [
  {
    title: "Breathing Retraining",
    trackID: "ANXIETY_DATA_1",
    url: "https://drive.google.com/file/d/1-Qg3l8bKq0P8Ouinx8FStjPXzA6E-4EQ/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Breathing.png?token=AJTYIQGNV3YW7IAC7YDDXPLBRGDGQ",
    subtitle: (
      <Text>
        Information Sheet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
    abstract:
      "This information sheet briefly discusses the role of breathing in anxiety  and guides you through a simple breathing retraining technique that uses breathing patterns to help deal with anxiety.",
  },
  {
    title: "Progressive Muscle Relaxation",
    trackID: "ANXIETY_DATA_2",
    url: "https://drive.google.com/file/d/1-TgIQLhkSCxrct_srB_NZLr7Tf5atolC/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_Relaxation.png?token=AJTYIQHROWM37XHJOQECLI3BRGDD6",
    subtitle: (
      <Text>
        Information Sheet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
    abstract:
      "Muscle tension is another way that the body can respond to stress. This 1-pager, also developed by the Center for Clinical Interventions, introduces Progressive Muscle Relaxation, to help guide the body through periods of heightened tension.",
  },
  {
    title: "5-4-3-2-1",
    trackID: "ANXIETY_DATA_3",
    url: "https://drive.google.com/file/d/102VxfQr2mgQLgi05EpwEZv8MnvzALTrV/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Noun_54321.png?token=AJTYIQCFFJRIUH3SZMGTCV3BRGCS4",
    subtitle: (
      <Text>
        Infographic {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
    abstract:
      "This is a simple infographic that may help patients through a moment of significant distress.",
  },
  {
    title: "Mindfulness Coach",
    trackID: "ANXIETY_DATA_4",
    url: "https://mobile.va.gov/app/mindfulness-coach",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/mindfulness-coach-app-icon.png?token=AJTYIQGJG2OAJ65HN4LBZGTBRQHHW",
    subtitle: (
      <Text>
        Downloadable App {"\n"}
        <Text style={{ fontWeight: "bold" }}>App</Text>
      </Text>
    ),
    abstract: (
      <Text>
        The VA developed this app, which “The app provides a gradual,
        self-guided training program designed to help you understand and adopt a
        simple mindfulness practice. Mindfulness Coach also offers{"\n"}
        {"\n"}- A library of information about mindfulness{"\n"}- 12
        audio-guided mindfulness exercises{"\n"}- A growing catalog of
        additional exercises available for free download{"\n"}- Goal-setting and
        tracking{"\n"}- A mindfulness mastery assessment to help you track your
        progress over time {"\n"}- Customizable reminders{"\n"}- Access to other
        support and crisis resources.
      </Text>
    ),
  },
  {
    title: "Benzodiazepines & PTSD",
    trackID: "ANXIETY_DATA_5",
    url: "https://drive.google.com/file/d/1nGDPgeWX7PNROEeWlt2YPlVeabf0zlEO/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/PTSD.png",
    abstract:
      "The VA and Department of Defense regularly update treatment guidelines for PTSD. These guidelines provide a “strong against” recommendation for prescribing benzodiazepines to patients with PTSD; this 8-page brochure engages patients on this issue.",
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 8 pages</Text>
      </Text>
    ),
  },
];
const TAPER_RESOURCE = [
  {
    title: "The Ashton Manual (Overview)",
    trackID: "TAPER_RESOURCE_1",
    url: "https://drive.google.com/file/d/10tB-5xFAdLDmiJn9sOIXc1ynGPgLFtvK/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Ashton_Manual_brief.png",
    abstract:
      "Drawn from the Ashton manual, this is a high-level overview of psychological and physiological withdrawal symptoms when someone tapers and/or stops their benzodiazepine (2pp). You should prescribe a slow taper in order to minimize these symptoms.",
    subtitle: (
      <Text>
        Tapering Guide for Benzodiazepines {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 2 pages</Text>
      </Text>
    ),
  },
  {
    title: "The Ashton Manual (Detailed)",
    trackID: "TAPER_RESOURCE_2",
    url: "https://drive.google.com/file/d/10lvnI43fGJiTebPCJ0qHxt0B3gqMAsg6/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/Ashton_Manual.png",
    abstract:
      "This is another section of the Ashton manual, providing a more detailed overview of specific potential symptoms of benzodiazepine withdrawal (7pp).  You should prescribe a slow taper in order to minimize these symptoms.",
    subtitle: (
      <Text>
        Tapering Guide for Benzodiazepines {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 7 pages</Text>
      </Text>
    ),
  },
  {
    title: "Empower Taper Schematic",
    trackID: "BENZO_BASIC_CLINICIANS_DATA_3",
    url: "https://drive.google.com/file/d/1NTLL5ZZYztivDkg5by5LpHtQ4nFoL7Lr/view?usp=sharing",
    imgURL:
      "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/EMPOWER_Taper.png",
    abstract: (
      <Text>
        The EMPOWER brochure was developed by Dr. Cara Tannenbaum, a
        geriatrician in Montreal. When this information was sent to older adult,
        long-term benzodiazepine users, 27% discontinued benzodiazepine use by 6
        months later (compared to just 5% in the control group; paper
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL("https://pubmed.ncbi.nlm.nih.gov/24733354/");
          }}
        >
          {" "}
          here
        </Text>
        , brochure{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            Linking.openURL(
              "https://www.deprescribingnetwork.ca/s/Sleeping-pills_anti-anxiety-meds_Sedative-hypnotics-1.pdf"
            );
          }}
        >
          here
        </Text>
        ).
      </Text>
    ),
    subtitle: (
      <Text>
        Educational Pamphlet {"\n"}
        <Text style={{ fontWeight: "bold" }}>PDF | 1 page</Text>
      </Text>
    ),
  },
  // {
  //   title: "Quick Start Guide",
  //   trackID: "BENZO_BASIC_DATA_4",
  //   url: "https://drive.google.com/file/d/1-MfFm832mP7hcv_ao5dhMQnkGkyecO0a/view?usp=sharing",
  //   imgURL:
  //     "https://raw.githubusercontent.com/KefanXu/taperologyIMG/main/QuickStart.png?token=AJTYIQAGE4ZQZBGFGJNFOXLBRLAGS",
  //   abstract:
  //     "This is a brief, one-page infographic presenting potentially harms associated with prescription benzodiazepine use that may be useful in discussion with patients and family members.",
  //   subtitle: "1-page Infographic",
  // },
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
      isReferPopupModal: false,
    };
    this.dataModel = getDataModel();
  }
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
          <Modal
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            isVisible={this.state.isReferPopupModal}
            onBackdropPress={() => this.setState({ isReferPopupModal: false })}
          >
            {this._renderReferModalPopup()}
          </Modal>
          <Modal
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            isVisible={this.state.isLoginVisibleModal}
            onBackdropPress={() =>
              this.setState({ isLoginVisibleModal: false })
            }
          >
            {this._renderModalLogin()}
          </Modal>
          <Modal
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
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
              width: Dimensions.get("window").width * 0.8,
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
                Resources
              </Text>
            </View>
            <View style={{ margin: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Benzo Basics for Clinicians ❹
                </Text>
                {this._renderListView(BENZO_BASIC_CLINICIANS_DATA)}
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Benzo Basics for Patients ❸
                </Text>
                {this._renderListView(BENZO_BASIC_PATIENT_DATA)}
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Resources on Insomnia ❹
                </Text>
                {this._renderListView(INSOMNIA_DATA)}
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Resources on Anxiety ❺
                </Text>
                {this._renderListView(ANXIETY_DATA)}
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontWeight: "bold", fontSize: 24 }}>
                  Resources on Tapering ❸
                </Text>
                {this._renderListView(TAPER_RESOURCE)}
              </View>
            </View>
          </View>
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
