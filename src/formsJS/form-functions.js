// importing modules
import { auth } from '../firebase-config';
import validator from 'validator';

//show signin form function
const showSigninForm = () => {
    const signin_btn = $('#show-signin');
    const signin_form = $('#signin-wrap');
    const signup_form = $('#signup-wrap');

    signin_btn.click(() => {
        signup_form.fadeOut();
        signin_form.fadeIn();
    });
};

//show signup form function
const showSignupForm = () => {
    const signup_btn = $('#show-signup');
    const signup_form = $('#signup-wrap');
    const signin_form = $('#signin-wrap');

    signup_btn.click(() => {
        signup_form.fadeIn();
        signin_form.fadeOut();
    });
};

//sign out pure function
const signOut = (element) => {
    element.click(() => {
        auth.signOut();
    });
}

//login function
const login = () => {
    const formLogin__btn = document.querySelector('#formLogin-btn');
    const email__signin = document.querySelector('#email-signin');
    const password__signin = document.querySelector('#password-signin');

    //login event handler
    formLogin__btn.addEventListener('click', (e) => {
    e.preventDefault();

    let emailVal = email__signin.value;
    let passwordVal = password__signin.value;

    if(validator.isEmpty(emailVal)){
        document.querySelector('#error-email').textContent = 'Please enter a valid Email';
    }
    if(validator.isEmpty(passwordVal)){
        document.querySelector('#error-password').textContent = 'Please enter a valid Password';
    }
    if(!validator.isEmpty(emailVal)){
        document.querySelector('#error-email').innerHTML = '';
    }
    if(!validator.isEmpty(passwordVal)){
        document.querySelector('#error-password').innerHTML = '';
    }

    //logging the user in
    const loginUser = auth.signInWithEmailAndPassword(emailVal, passwordVal);

    loginUser
    .then((user) => {
        // console.log(user)
    })
    .catch((e) => {
        // console.log(e.message);
    })

});
};

//signup function
const signUp = () => {

    const formRegister__btn = document.querySelector('#formRegister-btn');
    const email__signup = document.querySelector('#email-signup');
    const password__signup = document.querySelector('#password-signup');

    //signup event handler
    formRegister__btn.addEventListener('click', (e) => {
    e.preventDefault();

    let emailVal = email__signup.value;
    let passwordVal = password__signup.value;

    if(validator.isEmpty(emailVal)) {
        document.querySelector('#error-email2').textContent = 'Email is required';
    }
    if(validator.isEmpty(passwordVal) || passwordVal < 4) {
        document.querySelector('#error-password2').textContent = 'Password must be greater than 4 characters';
    }
    if(!validator.isEmpty(emailVal)) {
        document.querySelector('#error-email2').innerHTML = '';
    }
    if(!validator.isEmpty(passwordVal) || passwordVal > 4) {
        document.querySelector('#error-password2').innerHTML = '';
    }
    
    //logging the user in
    const signUpUser = auth.createUserWithEmailAndPassword(emailVal, passwordVal)
    signUpUser
    .then((user) => {
        // console.log(user)
    })
    .catch((e) => {
        // console.log(e.message);
    })
});
};

//function to get a unique background for the index
const getImage = async () => {
    // const randomImage_container = document.querySelector('.main'); //image container
    const randomImage_container = $('.main');
    const categories = ['people', 'nature', 'ocean', 'galaxy']; //random category list
    const randSelection = categories[Math.floor(Math.random() * categories.length)]; //random category chosen
    const response = await fetch(`https://pixabay.com/api/?key=10290131-c9a153b5621eae7fef3c0d2dd&q=${randSelection}&image_type=photo&pretty=true&editors_choice=true`); //fetching the random image
        
    if(response.status === 200){
        let data = await response.json();
        const randNum = Math.floor((Math.random() * 19) + 1); //setting a random number
        const imageSrc = data.hits[randNum].largeImageURL;
        // randomImage_container.style.backgroundImage =  `url( ${imageSrc} )`;
        randomImage_container.css("background-image", `url( ${imageSrc} )`);
    } else {
        throw new Error('Unable to fetch location');
    }
};

//exporting form functions
export { showSigninForm, showSignupForm, signOut, login, signUp, getImage };