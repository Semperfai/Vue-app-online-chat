
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
	apiKey: "AIzaSyCKbjK-xaH-MHvM7LduU3OCH18tJiZWmBI",
	authDomain: "uatruthchat.firebaseapp.com",
	projectId: "uatruthchat",
	storageBucket: "uatruthchat.appspot.com",
	messagingSenderId: "493221390082",
	appId: "1:493221390082:web:cc2c8b9aca9de95384c41b",
	measurementId: "G-2BT449NF33"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebase);





