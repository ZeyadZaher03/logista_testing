// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCX54Ej_pzEV3lwwK9QNmpcbMUmc-mAxug",
    authDomain: "logista-282218.firebaseapp.com",
    databaseURL: "https://logista-282218.firebaseio.com",
    projectId: "logista-282218",
    appId: "1:747873953165:web:ff0d3b01fa6dd2671c89c4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// make auth and firestore references
const auth = firebase.auth();
// const db = firebase.firestore();
const db = firebase.database();