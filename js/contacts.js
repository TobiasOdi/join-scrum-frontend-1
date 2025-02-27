// ================================================ VARIABLES ==========================================================
let contacts = [];
let contactData = [];
let editedContactData = [];
let existingUserEmail;
let activeUserContact;
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let contactName = document.getElementById('contactName');
let contactSurname = document.getElementById('contactSurname');
let contactEmail = document.getElementById('contactEmail');
let contactPhone = document.getElementById('contactPhone');
let contactPhoneValue;
let idContact;

let editName = document.getElementById('editContactName');
let editSurname = document.getElementById('editContactSurname');
let editEmail = document.getElementById('editContactEmail');
let editPhone = document.getElementById('editContactPhone');

let newContactPopUp = document.getElementById('addContactBackground');
let editContactPopUp = document.getElementById('editContactBackground');

let bgColor;
let textColor;
let firstLetters;

// ================================================ INIT CONTACTS ==========================================================
/**
 * This fuction runs the function to render the contacts.
 */
function initContacts() {
    renderLetters();
}

// ================================================ CONTACT LIST ==========================================================
/**
 * This function renders the letters for the categorization of the contacts to the contact list.
 */
function renderLetters() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < letters.length; i++) {
        let letter = letters[i];
        contactList.innerHTML += contactContainerTemplate(i, letter);
        renderContacts(i, letter);
        checkForEmptyLetters(i);
    }
}

/**
 * This function renders the contacts to the correct letter category of the contact list.
 * @param {string} i - index of the current letter
 * @param {string} letter  - current letter
 */
function renderContacts(i, letter) {
    let sortedContacts = document.getElementById('sortedContacts' + i);
    sortedContacts.innerHTML = '';
    contactsSorted = contacts.sort((a, b) => {if (a.name < b.name) {
            return -1;
        }
    });
    sortContacts(letter, sortedContacts);
}

/**
 * This function sorts the contacts depending on the starting letter.
 * @param {*} letter 
 */
function sortContacts(letter, sortedContacts) {
    for (let c = 0; c < contactsSorted.length; c++) {
        let contactListName = contacts[c]['first_name'];
        let contactListSurname = contacts[c]['last_name'];
        let contactEmail = contacts[c]['email'];
        let contactBgColor = contacts[c]['color'];
        let contactTextColor = contacts[c]['text_color']
        getFirstletter(c);
        if(firstLetters.charAt(0).toUpperCase() == letter) {
            sortedContacts.innerHTML += sortedContactsTemplate(c, contactBgColor, contactTextColor, firstLetters, contactListName, contactListSurname, contactEmail);
        }
    }
}

/**
 * This function checks if letter cegory is empty end hindes it. 
 * @param {index} i - index of the letter
 */
function checkForEmptyLetters(i) {
    let contactContainer = document.getElementById('contactContainer' + i);
    let emptyLetters = document.getElementById('sortedContacts' + i);
    if (emptyLetters.innerHTML == '') {
        contactContainer.style.display = 'none';
    }
}

// ================================================ ADD NEW CONTACT ==========================================================
/**
 * This function displays the add contacts overlay.
 */
function newContact() {
    document.getElementById('addContactBackground').style.display = 'flex';
}

/**
 * This function closes the add contacts overlay and resets the input values.
 */
function closePopup() {
    document.getElementById('addContactBackground').style.display = 'none';
    document.getElementById('editContactBackground').style.display = 'none';
    document.getElementById('contactName').value = '';
    document.getElementById('contactSurname').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

/**
 * This function prevents the a function from a parent element is beeing executed when clicked on a child element.
 * @param {*} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * This function runs the formvalidation and saves the new contact to the "contacts" array on the ftp server.
 */
async function createContact() {
    let existingContact = contacts.find(c => c.email == document.getElementById('contactEmail').value);
    if(existingContact) {
        displaySnackbar('contactAllreadyExists');
    } else {
        generateBackgroundColor();
        checkForPhoneNumber();    
        contactData = {
            first_name: document.getElementById('contactName').value, 
            last_name: document.getElementById('contactSurname').value, 
            email: document.getElementById('contactEmail').value, 
            phone: contactPhoneValue, 
            color: bgColor,
            text_color: textColor,
            active_user: null
        };
        await saveContact();
        await loadData();
        document.getElementById('contactName').value = '';
        document.getElementById('contactSurname').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactPhone').value = '';
        renderLetters();
        displaySnackbar('contactCreated');
        document.getElementById('addContactBackground').style.display = 'none';  
        bgColor = "";
        textColor = "";
    }
}

/**
 * This function generates a random color.
 */
function generateBackgroundColor() {
    let x = Math.floor(Math.random() * 256)
    let y = Math.floor(Math.random() * 256)
    let z = Math.floor(Math.random() * 256)
    bgColor = `rgb(${x}, ${y}, ${z})`;
    let bgColorArray = [x, x, z];
    textColor = checkBrightness(bgColorArray);
}

/**
 * This function checks if the generated backgroundcolor needs a white or black text.
 * @param {*} bgColorArray - Array with every rgb color value
 */
function checkBrightness(bgColorArray){
    const brightness = Math.round(((parseInt(bgColorArray[0]) * 299) + (parseInt(bgColorArray[1]) * 587) + (parseInt(bgColorArray[2]) * 114)) / 1000);
    if(brightness < 150){
        return 'rgb(255, 255, 255)';
    } else {
        return "rgb(0, 0, 0)";
    }
}

/**
 * This function saves the contact data on the ftp server.
 */
async function saveContact() {
    let contactsAsString = JSON.stringify(contactData);
    try {
        let path = 'contacts/save_created_contact';
        let response = await fetchApiHelper(path, contactsAsString);
    } catch(e) {
        console.log('Creating task was not possible', error);
    }
}

// ================================================ OPEN CONTACTS ==========================================================
/**
 * This function displays all the contact info.
 * @param {index} c - index of the current contact
 */
function openContactInfo(c) {
    let contactInformation = document.getElementById('contactsContent');
    contactInformation.innerHTML = '';
    let contactId = contacts[c]['id'];
    let contactInfoName = contacts[c]['first_name'];
    let contactInfoSurname = contacts[c]['last_name'];
    let contactInfoEmail = contacts[c]['email'];
    let contactInfoPhone = contacts[c]['phone'];
    let contactInfoBgColor = contacts[c]['color'];
    let contactTextColor = contacts[c]['text_color'];
    activeContact(c, contactTextColor);
    getFirstletter(c);
    contactInformation.innerHTML += contactInfoTemplate(firstLetters, contactInfoName, contactInfoSurname, c, contactInfoEmail, contactInfoPhone, contactInfoBgColor, contactTextColor, contactId);
    document.getElementById('contactIconBig' + c).style.backgroundColor = contactInfoBgColor;
    document.getElementById('contactDetails' + c).style.animation = 'flying 225ms ease-in-out';
    checkWindowWidth();
}

/**
 * This function adds css classes depending on the width of the window.
 */
function checkWindowWidth() {
    if (window.innerWidth < 950) {
        document.getElementById('contactsBar').classList.add('d-none');
        document.getElementById('contactsContainer').classList.add('contactsContainerMobile');
        document.getElementById('newContactButton').classList.add('d-none');
    }
}

/**
 * This function highlights the acitve contact.
 * @param {index} c - index of the current contact
 */
function activeContact(c, contactTextColor) {
    let currentElement = document.getElementById('contactID' + c);
    let allElements = document.querySelectorAll('.contact');
    allElements.forEach((element) => {
        element.style.backgroundColor = '#F6F7F8';
        element.style.color = contactTextColor;
    })
    currentElement.style.backgroundColor = '#2A3647';
    currentElement.style.color = contactTextColor;
}

/**
 * This function lets you go back to the contactlist.
 */
function backToContactsList() {
    document.getElementById('contactsBar').classList.remove('d-none');
    document.getElementById('contactsContainer').classList.remove('contactsContainerMobile');
    document.getElementById('newContactButton').classList.remove('d-none');
}

// ================================================ EDIT CONTACTS ==========================================================
/**
 * This function retrieves all the contact date of the current contact and displays them via the edit contacts overlay.
 * @param {index} i - index of the current contact
 */
function editContact(i) {
    if(contacts[i]['email'] == 'guest@guest.com') {
        displaySnackbar('guestUsterLocked');
    } else {
        let saveChangesFormContainer = document.getElementById('saveChangesFormContainer');
        saveChangesFormContainer.innerHTML = "";
        saveChangesFormContainer.innerHTML += saveChangesFormTemplate(i);
        getCurrentContactData(i);
        let contactInfoBgColor = contacts[i]['color'];
        let contactInfoTextColor = contacts[i]['text_color'];
        getFirstletter(i);
        document.getElementById('contactImg').innerHTML = contactBigImgTemplate(i, firstLetters);
        document.getElementById('contactImgBg' + i).style.backgroundColor = contactInfoBgColor;
        document.getElementById('contactImgText' + i).style.color = contactInfoTextColor;
        existingUserEmail = document.getElementById('editContactEmail').value;
        activeUserContact = contacts[i]['active_user'];
    }
}

/**
 * This function retrievs the contact data.
 * @param {index} i - index of the current contact.
 */
function getCurrentContactData(i) {
    document.getElementById('editContactBackground').style.display = 'flex';
    document.getElementById('editContactName').value = contacts[i]['first_name'];
    document.getElementById('editContactSurname').value = contacts[i]['last_name'];
    document.getElementById('editContactEmail').value = contacts[i]['email'];
    document.getElementById('editContactPhone').value = contacts[i]['phone'];
}

/**
 * This function saves the changed contact data.
 * @param {index} i - index of the current contact
 */
async function saveChanges(i) {
    let currentContactId = contacts[i]['id'];
    let existingContact = contacts.find(c => c.email == document.getElementById('editContactEmail').value);

    if(existingUserEmail == document.getElementById('editContactEmail').value) {
        checkForPhoneNumberEdit(i);
        editedContactData = {
            id: currentContactId,
            first_name: document.getElementById('editContactName').value, 
            last_name: document.getElementById('editContactSurname').value, 
            email: document.getElementById('editContactEmail').value, 
            phone: document.getElementById('editContactPhone').value,
            //activeUser: contacts[i]['activeUser']
        };
        await saveChangesToServer();
        await loadData();
        renderLetters();
        displaySnackbar('contactChangesSaved');
        document.getElementById('editContactBackground').style.display = 'none';
        openContactInfo(i);    
    } else {
        if(activeUserContact != null) {
            displaySnackbar('activeUser');
        } else {
            if(existingContact) {
                displaySnackbar('contactAllreadyExists');
            } else {
                checkForPhoneNumberEdit(i);
                editedContactData = {
                    id: currentContactId,
                    first_name: document.getElementById('editContactName').value, 
                    last_name: document.getElementById('editContactSurname').value, 
                    email: document.getElementById('editContactEmail').value, 
                    phone: document.getElementById('editContactPhone').value
                };
                await saveChangesToServer();
                await loadData();
                //contacts = await loadData();
                renderLetters();
                displaySnackbar('contactChangesSaved');
                document.getElementById('editContactBackground').style.display = 'none';
                openContactInfo(i);        
            } 
        }
    }
}

/**
 * Saves the changed contact data on the server.
 */
async function saveChangesToServer() {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    let editedContactAsString = JSON.stringify(editedContactData);
    try {
        let path = 'contacts/save_edited_contact';
        let response = await fetchApiHelper(path, editedContactAsString);
    } catch(e) {
        console.log('Creating task was not possible', error);
    }
}

/**
 * This function checks if the phone number contains a value and adds a "-" if empty.
 * @param {index} i - index of the current contact 
 */
function checkForPhoneNumber() {
    if(document.getElementById('contactPhone').value == "") {
        contactPhoneValue = '-';
    } else {
        contactPhoneValue = document.getElementById('contactPhone').value;
    }
}

/**
 * This function checks if the phone number contains a value and adds a "-" if empty.
 * @param {index} i - index of the current contact 
 */
function checkForPhoneNumberEdit(i) {
    let editContactPhoneInput = document.getElementById('editContactPhone');
    if(editContactPhoneInput.value == "") {
        contacts[i]['phone'] = '-';
    } else {
        contacts[i]['phone'] = editContactPhoneInput.value;
    }
}

/**
 * This function deletes the contact.
 * @param {index} i - index of the current contact
 */
async function deleteContact(c) {
    let currentContact = contacts[c];
    activeUserContact = currentContact['active_user']

    if(activeUserContact != null) {
        displaySnackbar('activeUserDelete');
    } else {
        contacts.splice(c, 1);  
        let contactToDeleteAsString = JSON.stringify(currentContact);
        try {
            let path = 'contacts/delete_contact';
            let response = await fetchApiHelper(path, contactToDeleteAsString);
            document.getElementById('contactsContent').innerHTML = '';
            renderLetters();
            await loadData();
        } catch(e) {
            console.log('Deleting contact was not possible', error);
        }
    }   
}


