// importing modules
import { auth, database } from './firebase-config';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

//importing functions
import { signOut } from './formsJS/form-functions';

$(document).ready(() => {
    getBK();
});

//selecting elements
const signOutBtn = $('#btn-signOut');
const usernameDOM = $('#username');
const emailDOM = $('#userEmail');
const search_input = document.querySelector('#search-input'); //search input
const search_btn = document.querySelector('#search-btn'); //search btn
const parent_dashboard = document.querySelector('#dashboard'); //dashboard parent container

//checks the state of the user
auth.onAuthStateChanged((user) => {

    user = auth.currentUser

    if(user) {
        localStorage.setItem('uid', user.uid);
        //reading from the database to the dom
        database.ref(`users/${user.uid}/details`).on("value", (snapshot) => {
        usernameDOM.text(snapshot.val().username);
        emailDOM.text(snapshot.val().email);
});
        console.log('logged in, dashboard page')

    } else {
        localStorage.setItem('uid', null);
        console.log('not logged in');
        window.location.href = 'index.html';

    }
});

//function to render images to the DOM
const renderImagesToDOM = (images, parent_container) => {

    images.forEach((image) => {
        //creating img elements
        const imgContainer = document.createElement('div');
        const imgElement = document.createElement('img');
        const iconContainer = document.createElement('div');
        const iconBtnStar = document.createElement('button');
        const iconBtnAdd = document.createElement('button');
        const iconStar = document.createElement('i');
        const iconAdd = document.createElement('i');
        // inner image text elements
        const img__add__text__container = document.createElement('div');
        const img__add__text = document.createElement('p');
        // modal elements
        const modal = document.querySelector('#myModal');
        const modalImg = document.querySelector('#modalImg');
        const closeBtn = document.querySelector('#close-btn');

        //adding classes to dom elements
        imgContainer.classList = 'dashboard__img--container';
        imgElement.classList = 'dashboard__img';
        iconContainer.classList = 'dashboard__img--icon--wrap';
        iconBtnStar.classList.add('btn-small', 'blue-grey', 'lighten-1', 'waves-effect', 'waves-light', 'z-depth-0', 'btn__star--space');
        iconBtnAdd.classList.add('btn-small', 'blue-grey', 'lighten-1', 'waves-effect', 'waves-light', 'z-depth-0');
        iconStar.classList.add('material-icons', 'dashboard__img--icon', 'white-text');
        iconAdd.classList.add('material-icons', 'white-text', 'dashboard__img--icon');

        img__add__text.classList.add('dashboard__img--add--text');
        
        //appending values
        iconAdd.textContent = 'add';
        iconStar.textContent = 'star';
        imgElement.src = image.webformatURL;
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(iconContainer);
        iconContainer.appendChild(iconBtnStar);
        iconContainer.appendChild(iconBtnAdd);
        iconBtnAdd.appendChild(iconAdd);
        iconBtnStar.appendChild(iconStar);
        parent_container.appendChild(imgContainer);

        //* event handler to show image inside a modal onClick
        imgElement.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            modalImg.src = imgElement.src;
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'none';
            });
        });

        //* event handler to save images to fav list/database onClick
        iconBtnAdd.addEventListener('click', (e) => { 
            e.preventDefault();
            const url = image.largeImageURL; //setting the image url onClick
            const uid = localStorage.getItem('uid');
            const date = Date.now();
            const dateAdded = moment(date).format('MMMM Do YYYY, h:mm:ss a');
            const dateAhead = moment(date).add(1, 'd');
            const dateToBeRemoved = moment(dateAhead._d).format('MMMM Do YYYY, h:mm:ss a');

            iconStar.classList.remove('white-text');
            iconStar.classList.add('yellow-text', 'accent-3');
            
            img__add__text.textContent = "Added to Favorites!"
            img__add__text__container.appendChild(img__add__text);
            imgContainer.appendChild(img__add__text__container);

            const imageToSave = { //setting the image object
                id: uuidv4(), //unique id to identify image
                image: url, //unique image url
                dateAdded: dateAdded, //date added
                dateToBeRemoved: dateToBeRemoved //date to be removed
            }

            //* firebase storage
            database.ref(`users/${uid}/favorites`).push(imageToSave).then((ref) => {
                console.log('image saved to firebase!');
            });

        });

    });
};

//function to request images from the api
const getImages = async (query) => {
    const response = await fetch(`https://pixabay.com/api/?key=10290131-c9a153b5621eae7fef3c0d2dd&q=${query}&image_type=photo&pretty=true`);
        
    if(response.status === 200){
        let data = await response.json();
        return data.hits;
    } else {
        throw new Error('Unable to fetch location');
    }
};

//function to request images from the api based on a page
const getImagesViaPage = async (query, pageNumber) => {
    const response = await fetch(`https://pixabay.com/api/?key=10290131-c9a153b5621eae7fef3c0d2dd&q=${query}&image_type=photo&pretty=true&page=${pageNumber}`);
        
    if(response.status === 200){
        let data = await response.json();
        return data.hits;
    } else {
        throw new Error('Unable to fetch location');
    }
};

//function to get a unique background
const getBK = async () => {
    const randomImage_container = document.querySelector('.search__container'); //image container
    const categories = ['people', 'nature', 'ocean', 'galaxy']; //random category list
    const randSelection = categories[Math.floor(Math.random() * categories.length)]; //random category chosen
    const response = await fetch(`https://pixabay.com/api/?key=10290131-c9a153b5621eae7fef3c0d2dd&q=${randSelection}&image_type=photo&pretty=true&editors_choice=true`); //fetching the random image
        
    if(response.status === 200){
        let data = await response.json();
        const randNum = Math.floor((Math.random() * 20) + 1); //setting a random number
        const imageSrc = data.hits[randNum].largeImageURL;
        randomImage_container.style.backgroundImage =  `url( ${imageSrc} )`;
    } else {
        throw new Error('Unable to fetch location');
    }
};

//event handler to search for images
search_btn.addEventListener('click', (e) => {
    e.preventDefault(); //prevent the page from reloading
    parent_dashboard.innerHTML = ''; //clear the parent element before rendering images
    let search_query = search_input.value;

    const pagination__icons = document.querySelector('#pagination'); //pagination block
    const page1 = document.querySelector('#page1');
    const page2 = document.querySelector('#page2');
    const page3 = document.querySelector('#page3');
    const page4 = document.querySelector('#page4');

    pagination__icons.style.display = 'block'; //displays the pagination block

    getImages(search_query).then((data) => { //fire function request images from the api
        renderImagesToDOM(data, parent_dashboard);
    });

    page1.addEventListener('click', (e) => {
        e.preventDefault();
        parent_dashboard.innerHTML = '';
        getImages(search_query).then((data) => {
            parent_dashboard.innerHTML = '';

            const pagination_parent = document.querySelector('#pagination-parent');
            const pagination__children = pagination_parent.childNodes;

            pagination__children.forEach((child) => {
                child.className = '';
            });
            page1.classList.add('active');

            renderImagesToDOM(data, parent_dashboard);
        });
    });

    page2.addEventListener('click', (e) => {
        e.preventDefault();
        parent_dashboard.innerHTML = '';
        getImagesViaPage(search_query, 2).then((data) => {
            parent_dashboard.innerHTML = '';

            const pagination_parent = document.querySelector('#pagination-parent');
            const pagination__children = pagination_parent.childNodes;
            
            pagination__children.forEach((child) => {
                child.className = '';
            });
            page2.classList.add('active');

            renderImagesToDOM(data, parent_dashboard);
        });
    });

    page3.addEventListener('click', (e) => {
        e.preventDefault();
        parent_dashboard.innerHTML = '';
        getImagesViaPage(search_query, 3).then((data) => {
            parent_dashboard.innerHTML = '';

            const pagination_parent = document.querySelector('#pagination-parent');
            const pagination__children = pagination_parent.childNodes;
            
            pagination__children.forEach((child) => {
                child.className = '';
            });
            page3.classList.add('active');

            renderImagesToDOM(data, parent_dashboard);
        });
    });

    page4.addEventListener('click', (e) => {
        e.preventDefault();
        parent_dashboard.innerHTML = '';
        getImagesViaPage(search_query, 4).then((data) => {
            parent_dashboard.innerHTML = '';

            const pagination_parent = document.querySelector('#pagination-parent');
            const pagination__children = pagination_parent.childNodes;
        
            pagination__children.forEach((child) => {
                child.className = '';
            });
            page4.classList.add('active');

            renderImagesToDOM(data, parent_dashboard);
        });
    });


    page5.addEventListener('click', (e) => {
        e.preventDefault();
        parent_dashboard.innerHTML = '';
        getImagesViaPage(search_query, 5).then((data) => {
            parent_dashboard.innerHTML = '';

            const pagination_parent = document.querySelector('#pagination-parent');
            const pagination__children = pagination_parent.childNodes;
            
            pagination__children.forEach((child) => {
                child.className = '';
            });
            page5.classList.add('active');

            renderImagesToDOM(data, parent_dashboard);
        });
    });

    search_input.value='';
});

signOut(signOutBtn);