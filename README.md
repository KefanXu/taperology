# Taperology

## Background

## Introduction to Taperology
This project is a website that aims to help clinicians reduce and or stop prescribing benzodiazepines (BZD) for some of their patients. The website adopts the taper methodology to achieve this goal. In this context, tapering refers to the patient's practice of gradually reducing the dosage of benzodiazepines and eventually withdrawing from using the drug.

The tapering process involves several challenges. A rapid tapering process may cause withdrawal symptoms, including headaches and sleep disturbances. Thus, a sufficient tapering process must adapt to the patient's personal condition and their needs. This website provides resources that address multiple aspects of the tapering process. Also, it offers a taper scheduler so the clinicians can generate taper schedules for their patients and adjust the schedule to match their patients' conditions and needs.

The website consists of the following sections:

1. **Homepage**
    - Introducing the website and explaining the functions of different sections. 
2. **Resource**
    - Resources for clicians and resources that clicians can offer to their patients to help guide their tapering process (e.g., resources on insomnia and anxiety).
3. **Taper Scheduler**
    - A taper scheduler that helps clicians generate taper schedules and allows clicians to customize them to meet patients' conditions.
4. **Refer Patient**
    - A link to the SAMHSA Behavioral Health Treatment Services Locator. 

## Tech

This website was developed using **React Native** under the [Expo](https://docs.expo.dev) platform. The reason for choosing React Native (Javascript) is that it's capable of building universal apps across different platforms, which means that the code can also be used to create iOS or Android apps with a few lines of code changes. Expo also provides great support for the [react-native-web](https://necolas.github.io/react-native-web/docs/) framework, which enables developing websites using React Native and its amazing third-party APIs.

The website also used Google as another service provider. The website is hosted by Google Firebase. In the previous versions, the website also used Firebase as the cloud database to store users' personal data, including their login emails and saved schedules. The website uses [Google Analytics](https://docs.expo.dev/versions/latest/sdk/firebase-analytics/) to track users' usage of different sections and functions. These tracking data will be displayed in the Firebase dashboard.

Below are the descriptions for usage of the project's files. For more details, please refer to the code comment inside the files.

**App.js**



## How to start
