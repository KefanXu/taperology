import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { firebaseConfig } from "./secret";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
// import * as Google from "expo-google-app-auth";

class DataModel {
  constructor() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    this.isLogin = false;
    this.users = [];
    this.plans = [];
    this.usersRef = firebase.firestore().collection("users");
    this.currentUser = "";
    this.key = "";
    this.asyncInit();
  }

  asyncInit = async () => {
    this.usersRef = firebase.firestore().collection("users");
    this.users = [];
    this.plans = [];
    this.currentUser = "";
    // this.plans = [];
    this.key = "";
    // await this.askPermission();
    await this.loadUsers();
    // await this.loadUserSchedules(this.key);
    console.log("this.plans", this.plans);
  };

  loadUsers = async () => {
    let querySnap = await this.usersRef.get();
    querySnap.forEach(async (qDocSnap) => {
      let key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      let isUserExist = false;
      for (let user of this.users) {
        if (user.key === data.key) {
          isUserExist = true;
        }
      }
      if (!isUserExist) {
        this.users.push(data);
      }
    });
    console.log("this.users", this.users);
  };
  loadUserSchedules = async (key) => {
    this.plans = [];
    let userPlanCollection = await this.usersRef
      .doc(key)
      .collection("taper_schedules")
      .get();
    userPlanCollection.forEach(async (qDocSnap) => {
      let key = qDocSnap.id;
      let plan = qDocSnap.data();
      plan.key = key;
      this.plans.push(plan);
    });
    // console.log("this.plans",this.plans);
  };

  createNewUser = async (username) => {
    let newUser = {
      email: username,
    };
    let newUsersDocRef = await this.usersRef.add(newUser);
    let key = newUsersDocRef.id;
    await this.usersRef.doc(key).update({ id: key });
    let testColl = {
      test: 1,
    };
    let newUserColl = await newUsersDocRef.collection("taper_schedules");
    await newUserColl.add(testColl);
    this.currentUser = username;
    this.key = key;
  };
  createNewSchedule = async (key, newSchedule) => {
    let userPlanCollection = await this.usersRef
      .doc(key)
      .collection("taper_schedules")
      .add(newSchedule);
  };
  updateSchedule = async (userKey, scheduleKey, newSchedule) => {
    let scheduleRef = this.usersRef.doc(userKey).collection("taper_schedules").doc(scheduleKey);
    await scheduleRef.update(newSchedule);
  };

  // googleLogin = async () => {
  //   const [request, response, promptAsync] = Google.useAuthRequest(config);
  // };
}
let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
