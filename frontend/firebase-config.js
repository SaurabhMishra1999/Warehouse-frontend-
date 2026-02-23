// Firebase Configuration
// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "saipooja-warehouse.firebaseapp.com",
  projectId: "saipooja-warehouse",
  storageBucket: "saipooja-warehouse.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.warn("⚠️ Firebase initialization warning:", error.message);
}

// Get Firebase services
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence for Firestore
firestore.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence disabled");
    } else if (err.code == 'unimplemented') {
      console.warn("Browser doesn't support persistence");
    }
  });

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { auth, firestore, storage };
}
