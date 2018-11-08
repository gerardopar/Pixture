// importing modules
import { database } from '../firebase-config';

//function to set the users bio into firebase
const updateBio = (element, username, firstname, lastname, city, country) => {

    element.addEventListener('click', (e) => {
    e.preventDefault();

    const uName = username.value;
    const fName = firstname.value;
    const lName = lastname.value;
    const cityName = city.value;
    const countryName = country.value;
    const uid = localStorage.getItem('uid');

    database.ref(`users/${uid}/details`).set({
    username: uName,
    firstName: fName,
    lastName: lName,
    city: cityName,
    country: countryName
    });

});

};

//function to read data from firebase onto the dom
const renderBio = (username, firstname, lastName, city, country) => {
    const uid = localStorage.getItem('uid');

    //reading from the database to the dom
    database.ref(`users/${uid}/details`).on("value", (snapshot) => {
        username.value = snapshot.val().username.length > 0 ? snapshot.val().username : '';
        firstname.value = snapshot.val().firstName.length > 0 ? snapshot.val().firstName : '';
        lastName.value = snapshot.val().lastName.length > 0 ? snapshot.val().lastName : '';
        city.value = snapshot.val().city.length > 0 ? snapshot.val().city : '';
        country.value = snapshot.val().country.length > 0 ? snapshot.val().country : '';
    });
}

export { updateBio, renderBio };