// importing modules
import { auth, database } from './firebase-config';
//importing functions
import { signOut } from './formsJS/form-functions';
import { updateBio, renderBio } from './databaseJS/database-functions';

const username = document.querySelector('#username');
const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const city = document.querySelector('#city');
const country = document.querySelector('#country');
const profile__submit__btn = document.querySelector('#profile__submit'); 
const profile__delete__btn = document.querySelector('#profile__delete'); 
const signOutBtn = $('#btn-signOut');

//checks the state of the user
auth.onAuthStateChanged((user) => {

    user = auth.currentUser
    if(user) {
        console.log('logged in, profile page');
    } else {
        localStorage.setItem('uid', null);
        console.log('not logged in');
        window.location.href = 'index.html';
    }

    //event handler to remove the user
    profile__delete__btn.addEventListener('click', (e) => {
        e.preventDefault();

        user.delete().then(() => {
            localStorage.setItem('uid', null);
            console.log('not logged in');
            window.location.href = 'index.html';
        });

        database.ref(`users/${user.uid}`).remove();

    });
});

updateBio(profile__submit__btn, username, firstname, lastname, city, country);
renderBio(username, firstname, lastname, city, country);
signOut(signOutBtn);