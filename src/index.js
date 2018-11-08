// importing modules
import { auth } from './firebase-config';

//importing functions
import { showSigninForm, showSignupForm, login, signUp, getImage } from './formsJS/form-functions.js';

$(document).ready(() => {
    getImage(); 
});

//checks if the user is logged in
auth.onAuthStateChanged((firebaseUser) => {
    if(firebaseUser) {
        console.log('logged in, index page');
        window.location.href = '/dashboard.html';
    } else {
        console.log('not logged in');
    }
});

showSignupForm();
showSigninForm();
login();
signUp();