//firebase imported
import firebase from 'firebase/app'
import 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyA5Z1PMo5KC6sxeB9DWo4hplM5KtPB46G0",
    authDomain: "test-project-6ee79.firebaseapp.com",
    databaseURL: "https://test-project-6ee79.firebaseio.com",
    projectId: "test-project-6ee79",
    storageBucket: "test-project-6ee79.appspot.com",
    messagingSenderId: "826491351219"
  };
  firebase.initializeApp(config);

  
  const database = firebase.database();
  const auth = firebase.auth();

  //exporting firebase and googleAuthProvider
  export { firebase, database, auth };
