// ================================================ VARIABLES ==========================================================
let users = [];
let tasks = [];
let subtasksLoad = [];
let assignedContacts = [];
let id;
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
        window.location.href = "login.html";
    }

    /*document.getElementById('isUserAuthenticatedContainer').classList.display = 'flex';
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    try {
        let response = await fetch('http://127.0.0.1:8000/isLoggedIn/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json",
                "Authorization": `Token ${token}`
            }
        });
        let data = await response.json();
        if(data.status == 1) {
            console.log("OK - user ist authenticated");
            document.getElementById('isUserAuthenticatedContainer').classList.display = 'none';
        } else {
            document.getElementById('isUserAuthenticatedContainer').classList.display = 'none';
            window.location.href = "http://127.0.0.1:5500/login.html";
        }
    } catch(error) {
        console.log('An error occured', error);
        document.getElementById('isUserAuthenticatedContainer').classList.display = 'none';
    } */  
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
    await init();
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
 * This function accesses the database and fetches the data form the tasks, subtasks, assignedContacts, Categories and contacts.
 */
 async function init() {
    try {
        tasks = await loadTasks();
        console.log("Tasks", tasks);
        subtasksLoad = await loadSubtasks();
        console.log("Subtasks", subtasksLoad);
        assignedContacts = await loadAssignedContacts();
        console.log("Assigned Contacts", assignedContacts);
        categories = await loadCategories();
        console.log("Categories", categories);
        contacts = await loadContacts();
        console.log("Contacts", contacts);
    } catch(e) {
        let error = 'Fehler beim Laden!';
        console.log(error);
    }
}

async function loadTasks() {
    let token = localStorage.getItem('token', data.token);
    console.log(token);
    debugger;
    const csrfToken = getCookie("csrftoken");
    const url = 'http://127.0.0.1:8000/tasks/';
    response = await fetch(url, {
        method: 'GET',
        headers:{
            "X-CSRFToken": csrfToken,
            "Authorization": `Token ${token}`
        }
    });
    let data = await response.json();
    return data;
}

async function loadSubtasks() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    const url = 'http://127.0.0.1:8000/subtasks/';
    response = await fetch(url, {
        method: 'GET',
        headers:{
            "X-CSRFToken": csrfToken,
            "Authorization": `Token ${token}`
        }
    });
    let data = await response.json();
    return data;
}

async function loadAssignedContacts() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    const url = 'http://127.0.0.1:8000/assignedTo/';
    response = await fetch(url, {
        method: 'GET',
        headers:{
            "X-CSRFToken": csrfToken,
            "Authorization": `Token ${token}`
        }
    });
    let data = await response.json();
    return data;
}

async function loadCategories() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    const url = 'http://127.0.0.1:8000/categories/';
    response = await fetch(url, {
        method: 'GET',
        headers:{
            "X-CSRFToken": csrfToken,
            "Authorization": `Token ${token}`
        }
    });
    let data = await response.json();
    return data;
}

async function loadContacts() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    const url = 'http://127.0.0.1:8000/contacts/';
    response = await fetch(url, {
        method: 'GET',
        headers:{
            "X-CSRFToken": csrfToken,
            "Authorization": `Token ${token}`
        }
    });
    let data = await response.json();
    return data;
}

function setUserColor() {
    userColor = localStorage.getItem('userColor');
    console.log(userColor);
    setTimeout(() => {
        document.getElementById('topNavBarRightImgPicture').style.borderColor = userColor;
    }, 200);
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
/**
 * This function adds a new user to the users array and saves it on the ftp server.
 */
async function addUser() {
    let name = document.getElementById('name');
    let surname = document.getElementById('surname');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let color = document.getElementById('userColor');
    let colorValue = color.options[color.selectedIndex].value;
    let userData = {first_name: name.value, last_name: surname.value, email: email.value, password: password.value, phone: '-', color: colorValue};
    validateSignup(userData, name, surname, email, password);
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
    //document.getElementById('loginScreenLoading').style.display = 'flex';
    disableFieldsSignUp();
    const csrfToken = getCookie("csrftoken");
    let userDataString = JSON.stringify(userData);

    try {
        let response = await fetch('http://127.0.0.1:8000/signUp/', {
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
        //enableFieldsSignUp();  
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
    window.location.href = 'login.html'; // => IMMER ANPASSEN!!!
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
    window.location.href = './signup.html';
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
            let response = await fetch('http://127.0.0.1:8000/login/', {
              method: 'POST',
              headers: {"X-CSRFToken": csrfToken},
              body: fd
            });
            //localStorage.setItem('token', response['token']);
            console.log(response);
            let data = await response.json();
            console.log(data);
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
function guestLogin() {
    let userName = "Guest";
    localStorage.setItem('userName', userName);
    localStorage.setItem('userColor', '#29abe2');
    window.location.href = 'index.html';
    //let userIdLogin = '';
    //localStorage.setItem('userIdLogin', userIdLogin);
}

async function guestLogin() {
    document.getElementById('loginScreenLoading').style.display = 'flex';
    disableFields();
    const csrfToken = getCookie("csrftoken");
    let fd = new FormData();
    fd.append('email', "guest@guest.com");
    fd.append('password', "Hallo_123");
    fd.append('csrfmiddlewaretoken', csrfToken);
    try {
        let response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {"X-CSRFToken": csrfToken},
            body: fd
        });
        let data = await response.json();
        if(response.ok) {
            console.log("response.ok", response.ok);
            localStorage.setItem('userColor', data.userColor);
            localStorage.setItem('userName', data.firstname);
            localStorage.setItem('token', data.token);
            window.location.href = "http://127.0.0.1:5500/index.html";
            enableFields();      
        }
    } catch(error) {
        console.log('An error occured', error);
        enableFields(); 
    }    
    document.getElementById('loginScreenLoading').style.display = 'none';
}


/* ================================================================= FORGOT PASSWORD ================================================================= */
/**
 * This function validates the forgot password form and throws an error if necessary.
 */
async function checkForCorrectEmail() {
    let userEmail = document.getElementById('sendEmailToResetPw');
    const csrfToken = getCookie("csrftoken");
    let fd = new FormData();
    fd.append('email', userEmail.value);
    fd.append('csrfmiddlewaretoken', csrfToken);

    try {
        let response = await fetch('http://127.0.0.1:8000/resetPassword/', {
            method: 'POST',
            //headers: {
            //    "X-CSRFToken": csrfToken
            //},
            body: fd
        });
        let data = await response.json();
        console.log(data);
        
        if(data.status == 1) {
            displaySnackbar('userDoesNotExist2');
        } else if(data.status == 2) {
            displaySnackbar('sendingMailNotPossible');
        } else {
            displaySnackbar("sendEmail");
            setTimeout(() => {
                window.location.href = "http://127.0.0.1:5500/login.html";
            }, 1500);
        }
    } catch(error) {
        console.log('An error occured', error);
    } 
}




/*async function checkForCorrectEmail(event) {
    event.preventDefault(); // Prevent default Form Action
    let sendEmailToResetPw = document.getElementById('sendEmailToResetPw').value;
    let formData = new FormData(event.target) // create a FormData based on our Form Element in HTML
    let response = await action(formData);
    if ((users.find(u => u.email == sendEmailToResetPw)) == null) {
        displaySnackbar('userDoesNotExist2');
        return false;
    }
    if(response.ok) {   
        displaySnackbar('sendEmail');
        document.getElementById('sendEmailToResetPw').value = '';
        setInterval(backToLoginScreen, 1200);
        console.log('Email was sent!');
    } else {
        console.log('Email not sent!');
    }
}

function action(formData) {
    const input = "https://join.tobias-odermatt.ch/send_mail.php"; // => immer anpassen!!
    const requestInit = {
        method: 'post',
        body: formData
    };

    return fetch (
        input,
        requestInit
    );
}*/

/* ================================================================= RESET PASSWORD ================================================================= */
/**
 * This function validates the reset password form and throws an error if necessary.
 */
function resetPassword() {
    let urlParams = new URLSearchParams(window.location.search);
    let userEmail = urlParams.get('email');
    let newPassword = document.getElementById('newPassword');
    let confirmPassword = document.getElementById('confirmPassword');
    let existingEmail = users.find(u => u.email == userEmail)
    let currentUser = users.indexOf(existingEmail);
    validatePassword(newPassword, confirmPassword, existingEmail, currentUser);
}

/**
 * This function validates the new password and throws an error if necessary.
 * @param {*} newPassword - input of the new passoword
 * @param {*} confirmPassword - input of the new confirmed password
 * @param {*} existingEmail - email adress of an existing user
 * @param {*} currentUser - index of the current user
 */
function validatePassword(newPassword, confirmPassword, existingEmail, currentUser) {
    if (newPassword.value == confirmPassword.value) {
        if (existingEmail) {
            users[currentUser]['password'] = confirmPassword.value;
            saveUsers();
            displaySnackbar('passwordReset');
            setInterval(backToLoginScreen, 1200);
        } else {
            displaySnackbar('userDoesNotExist3');
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

async function logout(){
    localStorage.removeItem("userName");
    localStorage.removeItem("userColor");
    localStorage.removeItem("token");
    window.location.href = 'login.html';
}


/**
 * This function logs the current user out and returns the user to the login page.
 */
/*async function logout(event){
    event.preventDefault(); // Prevent default Form Action
    const csrfToken = getCookie("csrftoken");
    let csrfInput = document.getElementById('csrfToken');
    csrfInput.value = csrfToken;
    let formData = new FormData(event.csrfInput); // create a FormData based on our Form Element in HTML
    //let fd = new FormData();
    //fd.append('csrfmiddlewaretoken', csrfToken);
    try {
        let response = await logoutAction(formData);

        //let response = await fetch('http://127.0.0.1:8000/logout/', {
        //    method: 'POST',
        //    headers: {"X-CSRFToken": csrfToken},
        //    body: formData
        //});
        //if(response.status == 200) {
        //    localStorage.removeItem("userName");
        //    localStorage.removeItem("userColor");
        //    localStorage.setItem("token");
        //    window.location.href = 'login.html';
        //}

        if(response.ok) {
            localStorage.removeItem("userName");
            localStorage.removeItem("userColor");
            localStorage.setItem("token");
            window.location.href = 'login.html';
        }
    } catch (e) {
        console.log('An error occured', error);
    }

/* try {
        let response = await fetch('http://127.0.0.1:8000/logout/', {
          method: 'POST',
          headers: {"X-CSRFToken": csrfToken},
        });
        //let data = await response.json();
        //console.log("Logout response", data);
        localStorage.removeItem("userName");
        localStorage.removeItem("userColor");
        //window.location.href = 'login.html'; 
      } catch(error) {
        console.log('An error occured', error);
    }  
*/ 
/* 
}
*/




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



