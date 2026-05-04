// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// for messaging
import {getMessaging, getToken as getFCMTOken, onMessage} from "firebase/messaging"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr_gpTVwymWmPT0-Uhkd-no8RqaTo6nNE",
  authDomain: "medi-routines.firebaseapp.com",
  projectId: "medi-routines",
  storageBucket: "medi-routines.firebasestorage.app",
  messagingSenderId: "765745319502",
  appId: "1:765745319502:web:27ee85ccc032f0dea67d1f",
  measurementId: "G-WJSXXD2YXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let messagingInstance;
// check if messaging supported
if(typeof window !== 'undefined' && typeof window.navigator !== 'undefined')
{
    try
    {
        messagingInstance = getMessaging(app);
    }
    catch(err)
    {
        console.log("Failed to initialize firebase messaging for frontend: ", err);
    }
}
else
{
    console.warn("Firebase cannot be initialized, not in a browser environment");
}

export {
    app,
    messagingInstance,
    getFCMTOken,
    onMessage
};