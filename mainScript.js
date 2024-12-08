// ================================================ VARIABLES ==========================================================
let users = [];
let tasks = [];
let subtasksLoad = [];
let assignedContacts = [];
let id;
let timestampReset;
let black = "#000000";
let white = "#FFFFFF";
let orange = "#FF3D00";
let lightorange = "#FFA800";
let green = "#7AE229";  

/* ======================================================= INCLUDE HTML ========================================================== */
/**
 * Checks if a token is stored in the local storage. If not, the user is not logged in and is getting
 * redirected to the login page.
 */
async function checkForLoggedInUser() {
    if(localStorage.getItem("token")) {
        console.log("User is authenticated");
    } else {
        window.location.href = "./templates/login.html";
    } 
}

/**
 * This function adds the html template to the correct container.
 */
async function includeHTMLLogin() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * This function adds the html template to the correct container.
 */
//Source: https://developer-akademie.teachable.com/courses/902235/lectures/31232815
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    await loadData();
    counters();
}

// ================================================ INIT FUNCTION ==========================================================

//window.addEventListener('load', clearStorage);
/* function clearStorage() {
    let session = sessionStorage.getItem('register');
    if (session == null) {
    
        localStorage.removeItem('remove');
    }
    sessionStorage.setItem('register', 1);
} */

/**
 * This function accesses the database and fetches the data form the tasks, subtasks, assignedContacts, categories and contacts.
 */
async function loadData() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    try{
        response = await fetch('http://127.0.0.1:8000/data/', {
            method: 'GET',
            headers:{
                "X-CSRFToken": csrfToken,
                "Authorization": `Token ${token}`
            }
        });
        let data = await response.json();
        console.log(data);
        tasks = data['tasks'];
        //console.log("Tasks", tasks);
        subtasksLoad = data['subtasks'];
        //console.log("Subtasks", subtasksLoad);
        assignedContacts = data['assignedContacts'];
        //console.log("Assigned Contacts", assignedContacts);
        contacts = data['contacts'];
        //console.log("Contacts", contacts);

        if(data['categories'].length !== 0){
            categories = data['categories'];
            //console.log("Categories exist", categories);
        } else {
            //console.log("Categories not exist", categories);
            let categoriesAsString = JSON.stringify(categories);
            const csrfToken = getCookie("csrftoken");
            try {
                let response = await fetch('http://127.0.0.1:8000/data/set_categories/', {
                    method: 'POST',
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Accept":"application/json", 
                        "Content-Type":"application/json"
                    },
                    body: categoriesAsString
                });
                //let data = await response.json();
            } catch(error) {
                console.log('An error occured', error);
                enableFieldsSignUp(); 
            } 
        }
        console.log("Contacts", categories);   
    } catch {
        let error = 'Fehler beim Laden!';
        console.log(error);
    }
}

function setUserColor() {
    let userColor = localStorage.getItem('userColor');
    setTimeout(() => {
        document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
    }, 500);
}

// ================================================ GENERAL FUNCTIONS ==========================================================
function getFirstletter(i) {
    firstLetters = "";
    let x = contacts[i]['first_name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = contacts[i]['last_name'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLetters = x.toUpperCase() + y.toUpperCase();
    return firstLetters;
}

// ================================================ SIGN UP ==========================================================

function toggleValue() {
    let privacyCheck = document.getElementById('privacyCheck');
    if(privacyCheck.value == "on") {
        privacyCheck.value = "active";
    } else {
        privacyCheck.value = "on";
    }
    console.log(privacyCheck.value);
}

function togglePassword() {
    let password = document.getElementById('password');
    if(password.type == "password") {
        password.type = "text";
        document.getElementById("passwordEye1").src = "../img/eye.png"; 
    } else {
        password.type = "password";
        document.getElementById("passwordEye1").src = "../img/hidden.png"; 
    }
}

function togglePasswordConfirm() {
    let password = document.getElementById('passwordConfirm');
    if(password.type == "password") {
        password.type = "text";
        document.getElementById("passwordEye2").src = "../img/eye.png"; 
    } else {
        password.type = "password";
        document.getElementById("passwordEye2").src = "../img/hidden.png"; 
    }
}

/**
 * This function adds a new user to the users array and saves it on the ftp server.
 */
async function addUser() {
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let passwordConfirm = document.getElementById('passwordConfirm');
    let color = document.getElementById('userColor');
    let colorValue = color.options[color.selectedIndex].value;
    let userData = {first_name: name.value, last_name: surname.value, email: email.value, password: password.value, phone: '-', color: colorValue};

    if(password == passwordConfirm) {
        validateSignup(userData);
    } else {
        displaySnackbar('passwordsNotIdentical');
    }
}

/**
 * This function generates the user id.
 */
function generateUserId() {
    id = Math.floor((Math.random() * 1000000) + 1);
    for (let i = 0; i < users.length; i++) {
        if (users[i]['userId'].includes === id || contacts[i]['contactId'].includes === id) {
            id = Math.floor((Math.random() * 1000000) + 1);
        }
    }
}

/**
 * This function validates the sign up form and throws an error if necessary.
 * @param {array} userData - array with all the user data
 * @param {array} contactData - array with all the user data for the contacts
 * @param {string} name - the name of the user
 * @param {string} surname - the surname of the user
 * @param {string} email - the email address of the user
 * @param {string} password - the passowrd of the user
 */
async function validateSignup(userData) {
    document.getElementById('signUpScreenLoading').style.display = 'flex';
    disableFieldsSignUp();
    const csrfToken = getCookie("csrftoken");
    let userDataString = JSON.stringify(userData);

    try {
        let response = await fetch('http://127.0.0.1:8000/user/sign_up/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json"
            },
            body: userDataString
        });
        //localStorage.setItem('token', response['token']);
        let data = await response.json();
        if(data.status == 1) {
            displaySnackbar('alreadySignedUp');
            document.getElementById('name').value = '';
            document.getElementById('surname').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('userColor').value = '';
        } else {
            displaySnackbar('successfullySignedUp');
            setInterval(backToLoginScreen, 1200);
        }
    } catch(error) {
        console.log('An error occured', error);
        enableFieldsSignUp(); 
    }  
    //document.getElementById('signUpScreenLoading').style.display = 'none';
}

/**
 * Disables the form fields.
 */
function disableFieldsSignUp() {
    document.getElementById('name').disabled = true;
    document.getElementById('surname').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('password').disabled = true;
    document.getElementById('userColor').disabled = true;
}

/**
 * Enables the form fields.
 */
function enableFieldsSignUp() {
    document.getElementById('name').disabled = false;
    document.getElementById('surname').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('password').disabled = false;
    document.getElementById('userColor').disabled = false;
}

 /**
  * This function brings you back to the main login.html.
  */
function backToLoginScreen() {
    window.location.href = 'login.html';
}

/**
 * This function exits the legal notice page.
 */
function exitLegalNoticePage() {
    document.querySelector('.mainLegalNoticeContainerDisplay').style.display = "none";

    if (document.getElementById("legalNoticeTopTab") !== null) {
        document.getElementById("legalNoticeTopTab").classList.remove('acitveHelpPage');
    }
    if (document.getElementById("legalNoticeTab") !== null) {
        document.getElementById("legalNoticeTab").classList.remove('activeLegalNoticeTab');
    }
}

/**
 * This function exits the help page.
 */
function exitHelpPage(){
    document.querySelector('.mainhelpContainerDisplay').style.display = "none";
    document.getElementById('pageHelpTab').classList.remove('acitveHelpPage');
}

/**
 * This function saves the user data in the users array on the ftp server.
 */
async function saveUsers() {
    let usersAsString = JSON.stringify(users);
    await backend.setItem('users', usersAsString);
}

// ================================================ LOGIN ==========================================================
/**
 * This event listener lets you lets you login with the enter key.
 */
window.addEventListener('keydown', (event) => {
    if(window.location.href === 'login.html') { // => IMMER ANPASSEN!!!
        if(event.keyCode == 13) {
            login();
        }
    }
});

/**
 * This function navigates you to the sign up screen.
 */
function goToSignup() {
    window.location.href = 'signup.html';
}

/**
 * This function logs you into an existing user account.
 */
async function login() {
    document.getElementById('loginScreenLoading').style.display = 'flex';
    disableFields();
    let emailLog = document.getElementById('emailLog');
    let passwordLog = document.getElementById('passwordLog');
    const csrfToken = getCookie("csrftoken");
    let fd = new FormData();
    fd.append('email', emailLog.value);
    fd.append('password', passwordLog.value);
    fd.append('csrfmiddlewaretoken', csrfToken);
    if(emailLog.value == '' || passwordLog.value == '') {
        displaySnackbar('missingSignedUp');
    } else {
        try {
            let response = await fetch('http://127.0.0.1:8000/user/login/', {
              method: 'POST',
              headers: {"X-CSRFToken": csrfToken},
              body: fd
            });
            let data = await response.json();
            if(data.status == 1) {
              displaySnackbar('pwEmailIncorrect');
            } else if(data.status == 2) {
                displaySnackbar('userDoesNotExist');
            } else {
                localStorage.setItem('userColor', data.userColor);
                localStorage.setItem('userName', data.firstname);
                localStorage.setItem('token', data.token);
                window.location.href = "http://127.0.0.1:5500/index.html";
            }
            enableFields();  
          } catch(error) {
            console.log('An error occured', error);
            enableFields(); 
          }    
    }
    document.getElementById('loginScreenLoading').style.display = 'none';
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * Disables the form fields.
 */
function disableFields() {
    document.getElementById('emailLog').disabled = true;
    document.getElementById('passwordLog').disabled = true;
    document.getElementById('loginButton').disabled = true;
}

/**
 * Enables the form fields.
 */
function enableFields() {
    document.getElementById('emailLog').disabled = false;
    document.getElementById('passwordLog').disabled = false;
    document.getElementById('loginButton').disabled = false;  
}


/**
 * This function saves the name of the user in the local storage of the browser that is login in 
 * @param {array} user - uses array
 */
function setUserName(user) {
    let userName = user.name;
    localStorage.setItem('userName', userName);
    let userIdLogin = user.userid;
    localStorage.setItem('userIdLogin', userIdLogin);
}

/**
 * This function logs the user in as a guest (without email or password).
 */
/* function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    localStorage.setItem('userColor', '#29abe2');
    window.location.href = 'index.html';
    //let userIdLogin = '';
    //localStorage.setItem('userIdLogin', userIdLogin);
} */

async function guestLogin() {
    document.getElementById('loginScreenLoading').style.display = 'flex';
    disableFields();
    const csrfToken = getCookie("csrftoken");
        let guestUserData = {
        first_name: 'Guest', 
        last_name: 'Guest', 
        email: 'guest@guest.com', 
        password: 'Hallo_123', 
        phone: '-', 
        color: 'rgb(0, 128, 0)'
    };
    let guestUserDataString = JSON.stringify(guestUserData);

    try {
        let response = await fetch('http://127.0.0.1:8000/user/guest_login/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json"
            },
            body: guestUserDataString
        });
        let data = await response.json();
        localStorage.setItem('userColor', data.userColor);
        localStorage.setItem('userName', data.firstname);
        localStorage.setItem('token', data.token);
        window.location.href = "http://127.0.0.1:5500/index.html";
        enableFields();  
    } catch(error) {
        console.log('An error occured', error);
        enableFields(); 
    }
}


/* ================================================================= FORGOT PASSWORD ================================================================= */
/**
 * This function validates the forgot password form and throws an error if necessary.
 */
async function checkForCorrectEmail() {
    document.getElementById('sendEmailToResetPw').disabled = true;
    document.getElementById('submitButton').disabled = true;
    document.getElementById('submitButton').style.cursor = 'default';
    let userEmail = document.getElementById('sendEmailToResetPw');
    const csrfToken = getCookie("csrftoken");
    let fd = new FormData();
    fd.append('email', userEmail.value);
    fd.append('csrfmiddlewaretoken', csrfToken);

    try {
        let response = await fetch('http://127.0.0.1:8000/user/reset_password/', {
            method: 'POST',
            headers: {
               "X-CSRFToken": csrfToken
            },
            body: fd
        });
        let data = await response.json();        
        if(data.status == 1) {
            displaySnackbar('userDoesNotExist2');
        } else if(data.status == 2) {
            displaySnackbar('sendingMailNotPossible');
        } else {
            displaySnackbar("sendEmail");
            setTimeout(() => {
                window.location.href = "http://127.0.0.1:5500/templates/login.html";
            }, 1500);
        }
    } catch(error) {
        console.log('An error occured', error);
    } 
}

/* ================================================================= RESET PASSWORD ================================================================= */

async function checkValidLink() {
    let urlParams = new URLSearchParams(window.location.search);
    let urlTimestamp = urlParams.get('ts');
    let userId = urlParams.get('ikey');
    let currentTimestamp = new Date();
    let unixTimestamp = Math.floor(currentTimestamp.getTime()/1000);
    //let token = localStorage.getItem('token', data.token);
    if((unixTimestamp - urlTimestamp) > 900) {
        document.getElementById('newPassword').disabled = true;
        document.getElementById('confirmPassword').disabled = true;
        document.getElementById('resetPwButton').disabled = true;
        displaySnackbar('linkExpired');
        setTimeout(() => {
           window.location.href = "http://127.0.0.1:5500/templates/login.html";
        }, 2500);
        //document.getElementById('pwAlreadyReset').disabled = false;
        //document.getElementById('confirmPassword').disabled = false;
        //document.getElementById('resetPwButton').disabled = false;
    } else {
        const csrfToken = getCookie("csrftoken");
        try{
            response = await fetch(`http://127.0.0.1:8000/user/get_timestamp/${userId}/`, {
                method: 'GET',
                headers:{
                    "X-CSRFToken": csrfToken,
                    //"Authorization": `Token ${token}`
                }
            });
            let data = await response.json();
            timestampReset = data['timestamp'];
            console.log("Timestamp", timestampReset);
        } catch {
            let error = 'Fehler beim Laden!';
            console.log(error);
        }    
    }
}

/**
 * This function validates the reset password form and throws an error if necessary.
 */
async function resetPassword() {
    document.getElementById('newPassword').disabled = true;
    document.getElementById('confirmPassword').disabled = true;
    document.getElementById('resetPwButton').disabled = true;
    document.getElementById('resetPwButton').style.cursor = 'default';

    let urlParams = new URLSearchParams(window.location.search); 
    let ikey = urlParams.get('ikey');
    let tkey = urlParams.get('tkey');
    let urlTimestamp = urlParams.get('ts');
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    if(timestampReset != urlTimestamp) {
        await validatePassword(newPassword, confirmPassword, ikey, tkey);
        timestampReset = urlParams.get('ts');
        let timestampResetJson = {'user_id': ikey, 'timestamp': urlParams.get('ts')};
        let timestampResetJsonAsString = JSON.stringify(timestampResetJson);
        await saveTimestamp(ikey, timestampResetJsonAsString);
    } else {
        displaySnackbar('pwAlreadyReset');
    }
}

async function saveTimestamp(ikey, timestampResetJsonAsString) {
    const csrfToken = getCookie("csrftoken");
    try{
        response = await fetch(`http://127.0.0.1:8000/user/set_timestamp/`, {
            method: 'POST',
            headers:{
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json",
                //"Authorization": `Token ${token}`
            },
            body: timestampResetJsonAsString
        });
        let data = await response.json();
        console.log('OK');

    } catch {
        let error = 'Fehler beim Laden!';
        console.log(error);
    }
}

/**
 * This function validates the new password and throws an error if necessary.
 * @param {*} newPassword - input of the new passoword
 * @param {*} confirmPassword - input of the new confirmed password
 * @param {*} existingEmail - email adress of an existing user
 * @param {*} currentUser - index of the current user
 */
async function validatePassword(newPassword, confirmPassword, ikey, tkey) {
    if (newPassword == confirmPassword) {
        let token = tkey;
        const csrfToken = getCookie("csrftoken");
        let fd = new FormData();
        fd.append('newPw', newPassword);
        fd.append('uid', ikey);

        try {
            let response = await fetch('http://127.0.0.1:8000/user/set_new_password/', {
                method: 'POST',
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Authorization": `Token ${token}`
                },
                body: fd
            });
            let data = await response.json();
            if(data.status == 1) {
                displaySnackbar('passwordReset');
                setTimeout(() => {
                    window.location.href = "http://127.0.0.1:5500/templates/login.html";
                }, 1500);
            }
        } catch (e) {
            console.log('An error occured', error);
        }
    } else {
        displaySnackbar('passwordsNotIdentical');
    }
}

/* ================================================================= TOP BAR FUNCTIONS ================================================================= */
/**
 * This function shows and hides the logout button.
 */
function toggleLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    if (logoutButton.style.display == "flex") {
        logoutButton.style.display = "none";
    } else {
        logoutButton.style.display = "flex";
    }
}

function hideLogoutButton() {
    let logoutButton = document.getElementById('logoutButton');
    logoutButton.style.display = "none";
}

/**
 * This function removes the variables in the local storage and forwards the user to the login screen.
 */
async function logout(){
    localStorage.removeItem("userName");
    localStorage.removeItem("userColor");
    localStorage.removeItem("token");
    window.location.href = './templates/login.html';
}
/* ================================================================= SIDE BAR FUNCTIONS ================================================================= */
/**
 * 
 * @param {*} func 
 * @param {*} delay 
 * @returns 
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * This function displays the html templates.
 * @param {string} pageId - id of the of the html template that needs to be displayed
 */
function displayPage(pageId) {
    document.getElementById("mainSummaryContainerDisplay").style.display = "none";
    document.getElementById("mainBoardContainerDisplay").style.display = "none";
    document.getElementById("mainAddTaskContainerDisplay").style.display = "none";
    document.getElementById("mainContactsContainerDisplay").style.display = "none";
    document.getElementById("mainLegalNoticeContainerDisplay").style.display = "none";
    document.getElementById("mainhelpContainerDisplay").style.display = "none";
    document.getElementById(pageId).style.display = "block";
}

/**
 * This function displays the legal notice page.
 */
function displayPageLegalNotice() {
    document.querySelector('.mainLegalNoticeContainerDisplay').style.display = "flex";
}

/**
 * This function displays the help page.
 */
function displayPageHelp() {
    document.querySelector('.mainhelpContainerDisplay').style.display = "flex";
}

/* ================================================================== SNACKBAR ================================================================= */
/**
 * This funktion displays the snackbars.
 * @param {string} popupId - id of the snackbar
 */
function displaySnackbar(popupId) {
    // Get the snackbar DIV
    var x = document.getElementById(popupId);
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

/* ================================================================= ACTIVE TAB ================================================================= */
/**
 * This functoon highlights the active tab on the side nav bar.
 */
function activeTab(tab) {
    let currentElement = document.getElementById(tab + "Tab");
    let allTabs = document.querySelectorAll('.tab');

    allTabs.forEach((element) => {
        element.classList.remove('activeTab');
    })
    if(currentElement !== null) {
        currentElement.classList.add('activeTab');
    }

    if (document.getElementById('pageHelpTab') !== null) {
        document.getElementById('pageHelpTab').classList.remove('acitveHelpPage');
    }
    if (document.getElementById('legalNoticeTab') !== null) {
        document.getElementById('legalNoticeTab').classList.remove('activeLegalNoticeTab');
    }
}

/**
 * This function highlights the icon of the legal notice pagea.
 */
function activeLegalNotice() {
    let legalNoticeTab = document.getElementById('legalNoticeTab');
    legalNoticeTab.classList.add('activeLegalNoticeTab');
}

/**
 * This function highlights the icon of the help page.
 */
function activeHelp(id) {
    let pageHelpTab = document.getElementById(id);
    pageHelpTab.classList.add('acitveHelpPage');
}

// ================================================ DATEN SPEICHERN ==========================================================
// IM LOCAL STORAGE
/* 
    allTasks.push(task);                                        => JSON mit Daten wird ins Array allTasks gepushed

    let allTasksAsString = JSON.stringify(allTasks);            => das Array allTasks wird in einen String umgewandelt
    localStorage.setItem('allTasks', allTasksAsString)          => Die Daten werden im Local Storage gespeichert / 'allTasks' ist der key und allTasksAsString ist der Wert der gespeichert wird 
*/

// AUF DEM SERVER
/* 
    let allTasksAsString = JSON.stringify(allTasks);
    backend.setItem('allTasks', allTasksAsString)
*/


// ================================================ DATEN LADEN ==========================================================
// VOM LOCAL STORAGE
/* 
    let allTasksAsString = localStorage.getItem('allTasks');    => Zugriff auf die Werte die unter dem key 'allTasks' gespeichert sind 
    allTasks = JSON.parse(allTasksAsString);                    => Die Werte werden wider von einem String in ein Array umgewandelt + Array allTasks wird überschrieben und die Werte eingefügt
*/

// VOM SERVER
/* 
    backend.setItem('users')    => Mehr Parameter nötig????
*/



