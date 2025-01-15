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
    if(localStorage.getItem("token") == null) {
        window.location.href = "./templates/login.html";
        enableFieldsSignUp(); 
    } else {
        let tokenCheck = {'token': localStorage.getItem("token")};
        let tokenCheckAsString = JSON.stringify(tokenCheck);
        const csrfToken = getCookie("csrftoken");
        try {
            let path = 'user/token_check';
            let response = await fetchApiHelper(path, tokenCheckAsString);
            let data = await response.json();
            if(localStorage.getItem("token") && data.status != 1) {
                window.location.href = "./templates/login.html";
            }
        } catch(error) {
            console.log('An error occured', error);
        }
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

/**
 * This function accesses the database and fetches the data form the tasks, subtasks, assignedContacts, categories and contacts.
 */
async function loadData() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    try{
        response = await fetch('http://127.0.0.1:8000/board/data/', {
            method: 'GET',
            headers:{
                "X-CSRFToken": csrfToken,
                "Authorization": `Token ${token}`
            }
        });
        let data = await response.json();
        tasks = data['tasks'];
        subtasksLoad = data['subtasks'];
        assignedContacts = data['assignedContacts'];
        contacts = data['contacts'];
        setCategories(data);
    } catch {
        let error = 'Fehler beim Laden!';
        console.log(error);
    }
}

/**
 * Checks if the task categories already exist in the data json array. If yes, the categories array the categories array is filled 
 * with the category data from the data json array. If not, the task categories are saved in the database on the server.  
 * @param {*} data - json array whith all task, subtask, contact, categories data
 */
function setCategories(data) {
    if(data['categories'].length !== 0){
        categories = data['categories'];
    } else {
        let categoriesAsString = JSON.stringify(categories);
        try {
            let path = 'board/data/set_categories';
            let response = fetchApiHelper(path, categoriesAsString);
        } catch(error) {
            console.log('An error occured', error);
            enableFieldsSignUp(); 
        } 
    }
}

/**
 * This function gets the user color from the local storage.
 */
function setUserColor() {
    let userColor = localStorage.getItem('userColor');
    setTimeout(() => {
        document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
    }, 500);
}

// ================================================ GENERAL FUNCTIONS ==========================================================

/**
 * Helper function for the fetch request to reduce redundant code.
 * @param {*} path 
 * @param {*} body 
 * @returns 
 */
async function fetchApiHelper(path, body) {
    const csrfToken = getCookie("csrftoken");
    let token = localStorage.getItem('token', data.token);
    return await fetch(`http://127.0.0.1:8000/${path}/`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrfToken,
            "Accept":"application/json", 
            "Content-Type":"application/json",
            "Authorization": `Token ${token}`
        },
        body: body
    });
}

/**
 * Helper function for the fetch request to reduce redundant code.
 * @param {*} path 
 * @param {*} body 
 * @returns 
 */
async function fetchApiHelperNoToken(path, body) {
    const csrfToken = getCookie("csrftoken");
    return await fetch(`http://127.0.0.1:8000/${path}/`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrfToken,
            "Accept":"application/json", 
            "Content-Type":"application/json",
        },
        body: body
    });
}

/**
 * Helper function for the fetch request to reduce redundant code.
 * @param {*} path 
 * @param {*} body 
 * @returns 
 */
async function fetchApiHelperFormData(path, body) {
    const csrfToken = getCookie("csrftoken");
    return await fetch(`http://127.0.0.1:8000/${path}/`, {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: body
    });
}

/**
 * This function provides the first letters of the name and surname of a contact.
 * @param {index} i - index of the needed contact
 * @returns 
 */
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
/**
 * This function toggles the value of the privacy checkbox. 
 */
function toggleValue() {
    let privacyCheck = document.getElementById('privacyCheck');
    if(privacyCheck.value == "on") {
        privacyCheck.value = "active";
    } else {
        privacyCheck.value = "on";
    }
}

/**
 * This function toggles the passowrd input to be visible.
 */
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

/**
 * This function toggles the passowrd confirm input to be visible.
 */
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
    let bgColorArray = getColorArray(colorValue);
    let textColorValue = checkBrightnessSignup(bgColorArray);
    let userData = {first_name: name.value, last_name: surname.value, email: email.value, password: password.value, phone: '-', color: colorValue, text_color: textColorValue};

    if(password.value != passwordConfirm.value) {
        displaySnackbar('passwordsNotIdentical');
    } else {
        await validateSignup(userData);
    }
}

/**
 * This function gets each rgb value of the selected color.
 * @param {*} colorValue 
 * @returns 
 */
function getColorArray(colorValue) {
    let colorValue1 = colorValue.split(',')[0];
    let colorValue2 = colorValue.split(',')[1];
    let colorValue3 = colorValue.split(',')[2];
    colorValue1 = colorValue1.substring(4);
    colorValue3 = colorValue3.substring(0, colorValue3.length - 1);
    return [colorValue1, colorValue2, colorValue3];
}

/**
 * This function checks if the generated backgroundcolor needs a white or black text.
 * @param {*} bgColorArray - Array with every rgb color value
 */
function checkBrightnessSignup(bgColorArray){
    const brightness = Math.round(((parseInt(bgColorArray[0]) * 299) + (parseInt(bgColorArray[1]) * 587) + (parseInt(bgColorArray[2]) * 114)) / 1000);
    if(brightness < 150){
        return 'rgb(255, 255, 255)';
    } else {
        return "rgb(0, 0, 0)";
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
    let userDataString = JSON.stringify(userData);
    try {
        let path = 'user/sign_up';
        let response = await fetchApiHelperNoToken(path, userDataString);
        let data = await response.json();
        if(data.status == 1) {
            displaySnackbar('alreadySignedUp');
            clearAllSignupInputs();
            enableFieldsSignUp(); 
            document.getElementById('signUpScreenLoading').style.display = 'none';
        } else {
            displaySnackbar('successfullySignedUp');
            setInterval(backToLoginScreen, 1200);
        }
    } catch(error) {
        console.log('An error occured', error);
        enableFieldsSignUp(); 
    }  
}

/**
 * Disables the form fields.
 */
function disableFieldsSignUp() {
    document.getElementById('name').disabled = true;
    document.getElementById('surname').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('password').disabled = true;
    document.getElementById('passwordConfirm').disabled = true;
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
    document.getElementById('passwordConfirm').disabled = false;
    document.getElementById('userColor').disabled = false;
}

/**
 * This function clears all input fields.
 */
function clearAllSignupInputs() {
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
    document.getElementById('userColor').value = '';
    document.getElementById('privacyCheck').value = "on";
    document.getElementById('privacyCheck').checked = false;
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
 * This function clears all input fields.
 */
function clearAllLoginInputs() {
    document.getElementById('emailLog').value = '';
    document.getElementById('passwordLog').value = '';
}

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
            let path = 'user/login';
            let response = await fetchApiHelperFormData(path, fd);
            let data = await response.json();
            if(data.status == 1) {
                displaySnackbar('pwEmailIncorrect');
            } else if(data.status == 2) {
                displaySnackbar('userDoesNotExist');
            } else {
                setLoclStorageData(data);
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

/**
 * This function saves necessary data in the local storage.
 * @param {json} data - user data
 */
function setLoclStorageData(data) {
    localStorage.setItem('userColor', data.userColor);
    localStorage.setItem('userName', data.firstname);
    localStorage.setItem('token', data.token);
}

/**
 * This function greates a cookie value.
 * @param {*} name 
 * @returns 
 */
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
 * This function logs you in as a guest user. If the guest user does not already exist, it creates one.
 */
async function guestLogin() {
    document.getElementById('loginScreenLoading').style.display = 'flex';
    disableFields();
    let guestUserData = {
        first_name: 'Guest', 
        last_name: ' ', 
        email: 'guest@guest.com', 
        password: 'Hallo_123', 
        phone: '-', 
        color: 'rgb(0, 128, 0)',
        text_color: 'rgb(255, 255, 255)'
    };
    let guestUserDataString = JSON.stringify(guestUserData);
    try {
        let path = 'user/guest_login';
        let response = await fetchApiHelperNoToken(path, guestUserDataString);
        let data = await response.json();
        setLoclStorageData(data);
        window.location.href = "http://127.0.0.1:5500/index.html";
        enableFields();  
    } catch(error) {
        console.log('An error occured', error);
        enableFields(); 
    }
}


/* ================================================================= FORGOT PASSWORD ================================================================= */
/**
 * This function validates the user email and returns the status 1(user does not exist) or 2(sending mail not possible) 
 * or sends the email to reset the password.
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
        let path = 'user/reset_password';
        let response = await fetchApiHelperFormData(path, fd);
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

/**
 * This function checks if the password reset link is still valid. The link only is valid for a cerain time.
 */
async function checkValidLink() {
    let urlParams = new URLSearchParams(window.location.search);
    let urlTimestamp = urlParams.get('ts');
    let userId = urlParams.get('ikey');
    let currentTimestamp = new Date();
    let unixTimestamp = Math.floor(currentTimestamp.getTime()/1000);
    if((unixTimestamp - urlTimestamp) > 900) {
        document.getElementById('newPassword').disabled = true;
        document.getElementById('confirmPassword').disabled = true;
        document.getElementById('resetPwButton').disabled = true;
        displaySnackbar('linkExpired');
        setTimeout(() => {
           window.location.href = "http://127.0.0.1:5500/templates/login.html";
        }, 2500);
    } else {
        const csrfToken = getCookie("csrftoken");
        try{
            response = await fetch(`http://127.0.0.1:8000/user/get_timestamp/${userId}/`, {
                method: 'GET',
                headers:{
                    "X-CSRFToken": csrfToken,
                }
            });
            let data = await response.json();
            timestampReset = data['timestamp'];
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

/**
 * This function saves the timestamp to evaluate the validity of the password reset link. 
 * @param {*} ikey 
 * @param {*} timestampResetJsonAsString 
 */
async function saveTimestamp(ikey, timestampResetJsonAsString) {
    try{
        let path = 'user/set_timestamp';
        let response = await fetchApiHelper(path, timestampResetJsonAsString);
        let data = await response.json();
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
            let path = 'user/set_new_password';
            let response = await fetchApiHelperFormData(path, fd);
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

/**
 * This function hides the logout button.
 */
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



