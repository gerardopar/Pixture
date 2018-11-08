// importing modules
import { auth, database } from './firebase-config';
import moment from 'moment';

//importing functions
import { signOut } from './formsJS/form-functions';

const signOutBtn = $('#btn-signOut');

$(document).ready(() => {
    renderFavs();
});

//checks the state of the user
auth.onAuthStateChanged((user) => {

    user = auth.currentUser
    if(user) {
        console.log('logged in, favorites page');
    } else {
        localStorage.setItem('uid', null);
        console.log('not logged in');
        window.location.href = 'index.html';
    }
    
});

//function to render favorite images to the dom
const renderFavs = () => {
    let uid = localStorage.getItem('uid');
    let image_container = document.querySelector('.fav__container');
    //*reading the firebase favorites list
    database.ref(`users/${uid}/favorites`).on("value", (snapshot) => {
        snapshot.forEach((snap) => {

        //creating dom elements
        const imgContainer = document.createElement('div');
        const imgElement = document.createElement('img');
        const iconContainer = document.createElement('div');
        const iconBtnDownload = document.createElement('button');
        const iconBtnRemove = document.createElement('button');
        const iconDownload = document.createElement('i');
        const iconRemove = document.createElement('i');

        //adding classes to dom elements
        imgContainer.classList = 'dashboard__img--container';
        imgElement.classList = 'dashboard__img';
        iconContainer.classList = 'dashboard__img--icon--wrap';
        iconBtnDownload.classList.add('btn-small', 'blue-grey', 'lighten-1', 'waves-effect', 'waves-light', 'z-depth-0', 'btn__star--space');
        iconBtnRemove.classList.add('btn-small', 'blue-grey', 'lighten-1', 'waves-effect', 'waves-light', 'z-depth-0');
        iconDownload.classList.add('material-icons', 'white-text', 'dashboard__img--icon');
        iconRemove.classList.add('material-icons', 'white-text', 'dashboard__img--icon');

        //appending values
        iconRemove.textContent = 'delete';
        iconDownload.textContent = 'vertical_align_bottom';
        imgElement.src =  snap.val().image;
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(iconContainer);
        iconContainer.appendChild(iconBtnDownload);
        iconContainer.appendChild(iconBtnRemove);
        iconBtnRemove.appendChild(iconRemove);
        iconBtnDownload.appendChild(iconDownload);
        image_container.appendChild(imgContainer);

            const date = Date.now(); //creating a new date
            if(moment(date).format('MMMM Do YYYY, h:mm:ss a') > snap.val().dateToBeRemoved){                
                database.ref(`users/${uid}/favorites/${snap.key}`).remove();
            } else {
                console.log(`Item will exist until ${snap.val().dateToBeRemoved}`);
            }
        
        //event handler remove an individual image
        iconBtnRemove.addEventListener('click', (e) => {
            e.preventDefault();
            database.ref(`users/${uid}/favorites/${snap.key}`).remove();
            image_container.innerHTML = " ";
            renderFavs();
        });

        //event handler to download an individual image
        iconBtnDownload.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(snap.val().image, '_blank');
        });

        });
    });

};

signOut(signOutBtn);

