// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGvypWds4wB21gXvYF5z9CAedYYBF-qPM",
  authDomain: "myfitnessdiary-98de3.firebaseapp.com",
  databaseURL: "https://myfitnessdiary-98de3-default-rtdb.firebaseio.com",
  projectId: "myfitnessdiary-98de3",
  storageBucket: "myfitnessdiary-98de3.firebasestorage.app",
  messagingSenderId: "654598300156",
  appId: "1:654598300156:web:d185f121d6b680afcc1279"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const viewLoggedOut = document.getElementById("logged-out-section")
const viewLoggedIn = document.getElementById("logged-in-section")

const emailInputEL = document.getElementById("email");
const passwordInputEL = document.getElementById("password");

const loginBtnEL = document.getElementById("login-btn");
const signInBtnEL = document.getElementById("sign-in-btn");
const signOutBtnEL = document.getElementById("logout-btn");


signInBtnEL.addEventListener("click", authCreateAccountWithEmail);
loginBtnEL.addEventListener("click", authSignInWithEmail);
signOutBtnEL.addEventListener("click", authLogout);


//main code
onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView()
    } else {
        showLoggedOutView()
    }
})



//main code




//functions

function authCreateAccountWithEmail(e) {
    e.preventDefault()
    const email = emailInputEL.value
    const password = passwordInputEL.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
        })
        .catch((error) => {
            console.error(error.message) 
        })
}

function authSignInWithEmail(e) {
    e.preventDefault()
    const email = emailInputEL.value
    const password = passwordInputEL.value

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
        })
        .catch((error) => {
            console.error(error.message) 
        })
}  
function authLogout() {
    signOut(auth)
        .then(() => {
            clearAuthFields()
        })
        .catch((error) => {
            console.error(error.message) 
        })
}
function clearAuthFields() {
    emailInputEL.value = ""
    passwordInputEL.value = ""
}



function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
}

function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
}

function showView(view) {
    view.style.display = "flex" 
}

function hideView(view) {
    view.style.display = "none"
}