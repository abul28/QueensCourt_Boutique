// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const firebaseConfig = {
    apiKey: "AIzaSyDXDnCwdsR9u1TmPm7XE7SvXyOA6fvroHs",
    authDomain: "queenscourtboutique-87f3d.firebaseapp.com",
    projectId: "queenscourtboutique-87f3d",
    storageBucket: "queenscourtboutique-87f3d.firebasestorage.app",
    messagingSenderId: "286803217520",
    appId: "1:286803217520:web:bc8dfde4118d1f1774f8b5",
    measurementId: "G-TNH4S9SMYG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const firestore = getFirestore(app);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Ask for permission and get FCM token
export const requestFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BO2BBuc0CZqxuNgEVaOtvkUtpadOKUBqDw_uYtM97br0lNWrf_gqn_F0QVjEv5FuMcPiDeBqZCgqEdVODONvKcw"
    });
    if (token) {
      console.log("✅ FCM Token:", token);
      // You can save this token in Firestore or use it to test FCM
    } else {
      console.log("⚠️ No registration token available.");
    }
  } catch (err) {
    console.error("❌ Error getting FCM token:", err);
  }
};

export { firestore, };