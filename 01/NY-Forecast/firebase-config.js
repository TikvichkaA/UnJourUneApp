// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDojuVBjJ0Ffh_3r8ARXdexG1a23gxzjXY",
    authDomain: "cc-forecast-88580.firebaseapp.com",
    projectId: "cc-forecast-88580",
    storageBucket: "cc-forecast-88580.firebasestorage.app",
    messagingSenderId: "1016113149902",
    appId: "1:1016113149902:web:6d15bb6b8b87b830c89d9f"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
