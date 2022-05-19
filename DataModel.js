// DataModel.js contains functions that used to manipulate users' personal data
// including accounts and their saved schedules
// The current version doesn't have any user-related functions so this file is not in use.

import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
// Import Firebase Configuration file here from a secret.js file
import { firebaseConfig } from "./secret";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

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
  // Initiate firebase
  asyncInit = async () => {
    this.usersRef = firebase.firestore().collection("users");
    this.users = [];
    this.plans = [];
    this.currentUser = "";
    this.key = "";
    await this.loadUsers();
    console.log("this.plans", this.plans);
  };
  // Load user list
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
  // Load user's saved schedule
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
  };
  // When a new user sign up, add the new user to Firebase
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
  // Add a new schedule to the user's profile
  createNewSchedule = async (key, newSchedule) => {
    let userPlanCollection = await this.usersRef
      .doc(key)
      .collection("taper_schedules")
      .add(newSchedule);
  };
  // Update an existing schedule
  updateSchedule = async (userKey, scheduleKey, newSchedule) => {
    let scheduleRef = this.usersRef
      .doc(userKey)
      .collection("taper_schedules")
      .doc(scheduleKey);
    await scheduleRef.update(newSchedule);
  };
  // Delete a schedule
  deleteSchedule = async (userKey, scheduleKey) => {
    console.log("scheduleKey", scheduleKey);
    console.log("userKey", userKey);
    let scheduleRef = this.usersRef
      .doc(userKey)
      .collection("taper_schedules")
      .doc(scheduleKey);
    await scheduleRef.delete();
  };
}
let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
