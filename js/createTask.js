// ================================================ VARIABLES ==========================================================
let selectedUsers = [];
let priority = "";
let allValueCheck = false;
let categoryValue = "";
let categoryColorValue = "";
let categories = [
    {'categoryName': 'Marketing', 'color': 'rgb(0, 56, 255)', 'categoryType': 'default'},
    {'categoryName': 'Media', 'color': 'rgb(255, 199, 2)', 'categoryType': 'default'},
    {'categoryName': 'Backoffice', 'color': 'rgb(31, 215, 193)', 'categoryType': 'default'},
    {'categoryName': 'Design', 'color': 'rgb(255, 122, 0)', 'categoryType': 'default'},
    {'categoryName': 'Sales', 'color': 'rgb(252, 113, 255)', 'categoryType': 'default'}
];

let statusCategory;
let editedTaskPriority = [];
let firstLettersAvailableUser;
let prevPriorityElement = null; // keep track of previously clicked button
let subtasks = [];
let data = [];

// ================================================ MAIN SITE FUNCTIONS ==========================================================
/**
 * This function sets the status category of the task and renders the elements.
 */
function initCreateTask() {
    setStatusCategory('toDo');
    renderCategories();
    renderAvailableUsers();
    setDateToday();
}

/**
 * This function sets the value for the statusCategory
 * @param {string} statusCategoryToDo - status of the task
 */
function setStatusCategory(statusCategoryToDo) {
    statusCategory  = statusCategoryToDo;
}

/**
 * This function opens and closes the dropdowns.
 * @param {*} id - id of the container
 */
function openDropdown(id) {
    if (document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.remove('d-none');
        checkForSelectedUsers();
    }
    else if (!document.getElementById(id).classList.contains('d-none')) {
        document.getElementById(id).classList.add('d-none');
        checkForSelectedUsers();
    }
}

function closeDropdown() {
    if(!document.getElementById('categoryChoices').classList.contains('d-none') || !document.getElementById('avatarPicker').classList.contains('d-none') ) {
        document.getElementById('categoryChoices').classList.add('d-none');
        document.getElementById('avatarPicker').classList.add('d-none');
    }
}

/**
 * This function sets the date.
 */
function setDateToday() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("dueDate").setAttribute('min', String(today));
}

/**
 * This function changes the symbols for the subtasks to "delete" and "add" symbol when the inputfield is beeing clicked.
 */
function changeSubIcon() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

/**
 * This function changes the symbols for the categories to "delete" and "add" symbol when the inputfield is beeing clicked.
 */
function changeNewCatIcon() {
    document.getElementById('plusNewCategoryImg').classList.add('d-none');
    document.getElementById('clearNewCategoryImg').classList.remove('d-none');
    document.getElementById('addNewCategoryImg').classList.remove('d-none');
}

/**
 * This function changes the symbols for the subtasks to "delete" and "add" symbol when the inputfield is beeing changed.
 */
function inputChangeSubIcons() {
    document.getElementById('plusSubtaskImg').classList.add('d-none');
    document.getElementById('clearSubtaskImg').classList.remove('d-none');
    document.getElementById('addSubtaskImg').classList.remove('d-none');
}

/**
 * This function changes the symbols for the categories to "delete" and "add" symbol when the inputfield is beeing changed.
 */
function inputChangeNewCatIcons() {
    document.getElementById('plusNewCategoryImg').classList.add('d-none');
    document.getElementById('clearNewCategoryImg').classList.remove('d-none');
    document.getElementById('addNewCategoryImg').classList.remove('d-none');
}

/**
 * This function prevents the selection of pasted dates.
 */
document.addEventListener("DOMContentLoaded", () => {
    var dateToday = new Date();
    var month = dateToday.getMonth() + 1;
    var day = dateToday.getDate();
    var year = dateToday.getFullYear();
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    document.getElementById('dueDate')?.setAttribute('min', maxDate);
});

// ================================================ CREATE TASK ==========================================================
/**
 * This function creates a task if all the required fields/values are filled in.
 */
async function createTask() {
    if (document.getElementById('title').value && document.getElementById('description').value && document.getElementById('dueDate').value && priority && categoryValue != "" && selectedUsers.length !== 0) {
        setTaskParameters();
        await saveCreatedTask();
        displaySnackbar('taskCreated');
        clearAllInputs();
        document.getElementById('avatarPicker').classList.add('d-none');
        await includeHTML();
        updateHTML();
        displayPage('mainBoardContainerDisplay');
    } else {
        highlightInputs(); 
    }
}

/**
 * This function sets all the task parameters.
 */
function setTaskParameters() {
    // statusCategory > is beeing set wehn clicked on "Add Task" Tab or on plus sign on the board
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = categoryValue;
    let categoryColor = categoryColorValue;
    //let assignTo = selectedUsers;
    let dueDate = document.getElementById('dueDate');
    let priorityValue = priority;
    //subtasks array> is beeing set wehn adding an subtask
    //taskData = {taskId: taskId, statusCategory: statusCategory, title: title.value, description: description.value, category: category, categoryColor: categoryColor, assignTo: assignTo, dueDate: dueDate.value, priorityValue: priorityValue, subtasks: subtasks};
    let taskData = [{statusCategory: statusCategory, title: title.value, description: description.value, category: category, due_date: dueDate.value, priorityValue: priorityValue}];
    let assignedToData = selectedUsers;
    let subtaskData = subtasks;
    data = [{"taskData": taskData, "assignedToData": assignedToData, "subtaskData": subtaskData}];
}

/* function compileAssigendToData() {
    let assignedToDataRaw = [];
    for (let i = 0; i < selectedUsers.length; i++) {
        const element = selectedUsers[i];
        let existingUser = contacts.find(u => u.pk == element);

        if(existingUser) {
            assignedToDataRaw.push({
                "user_id": existingUser.pk,
                "contactColor": existingUser.color,
                "first_name": existingUser.first_name,
                "last_name": existingUser.last_name
            })
        }
    }
    return assignedToDataRaw;
} */

async function saveCreatedTask() {
    const csrfToken = getCookie("csrftoken");
    let token = localStorage.getItem('token', data.token);
    let newTaskAsString = JSON.stringify(data);
    try {
        let response = await fetch('http://127.0.0.1:8000/tasks/save_created_task/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json",
                "Authorization": `Token ${token}`
            },
            body: newTaskAsString
          });
    } catch(e) {
        console.log('Creating task was not possible', error);
    }
    data = [];
}

/**
 * This function runs the highlight functions.
 */
function highlightInputs() {
    highlightEmptyTitleInput();
    highlightEmptyDescriptionInput();
    highlightEmptyDueDateInput();
    highlightEmptyPriorityInput();
    highlightEmptyCategoryInput();
    highlightEmptySelectedUsersInput();
    displaySnackbar('missingInput');
}

/**
 * This function highlights the title input field if empty when the form is beeing submitted.
 */
function highlightEmptyTitleInput() {
    if(!document.getElementById('title').value) {
        document.getElementById('title').classList.add('redBorder');
    } else if(document.getElementById('title').value) {
        document.getElementById('title').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the title input description if empty when the form is beeing submitted.
 */
function highlightEmptyDescriptionInput() {
    if(!document.getElementById('description').value) {
        document.getElementById('description').classList.add('redBorder');
    } else if(document.getElementById('description').value) {
        document.getElementById('description').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the due date input field if empty when the form is beeing submitted.
 */
function highlightEmptyDueDateInput() {
    if(!document.getElementById('dueDate').value){
        document.getElementById('dueDate').classList.add('redBorder');
    } else if(document.getElementById('dueDate').value){
        document.getElementById('dueDate').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the priority input field if empty when the form is beeing submitted.
 */
function highlightEmptyPriorityInput() {
    if(priority == "") {
        document.getElementById('urgent').classList.add('redBorder');
        document.getElementById('medium').classList.add('redBorder');
        document.getElementById('low').classList.add('redBorder');
    } else if(priority !== "") {
        document.getElementById('urgent').classList.remove('redBorder');
        document.getElementById('medium').classList.remove('redBorder');
        document.getElementById('low').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the category input field if empty when the form is beeing submitted.
 */
function highlightEmptyCategoryInput() {
    if(categoryValue == "") {
        document.getElementById('selectCategoryForm').classList.add('redBorder');
    } else if(categoryValue !== "") {
        document.getElementById('selectCategoryForm').classList.remove('redBorder');
    }
}

/**
 * This function highlights the selected users input field if empty when the form is beeing submitted.
 */
function highlightEmptySelectedUsersInput() {
    if(selectedUsers.length == 0){
        document.getElementById('assignedToForm').classList.add('redBorder');
    } else if(selectedUsers.length !== 0){
        document.getElementById('assignedToForm').classList.remove('redBorder');
    } 
}

/**
 * This function resets all the parameters.
 */
function clearAllInputs() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('dueDate').value = '';
    categoryValue = "";
    renderCategories();
    selectedUsers = [];
    renderAvailableUsers();
    checkForSelectedUsers()
    clearPriority();
    subtasks = [];
    data = [];
    document.getElementById('subtaskList').innerHTML = "";
    clearHighlightedFields();
}

/**
 * This function resets the appearance of the priority buttons.
 */
function clearPriority() {
    document.getElementById('urgent').style.backgroundColor = white;
    document.getElementById('medium').style.backgroundColor = white;
    document.getElementById('low').style.backgroundColor = white;
    document.getElementById('urgent').style.color = black;
    document.getElementById('medium').style.color = black;
    document.getElementById('low').style.color = black;
    document.getElementById('imgUrgent').style.filter = '';
    document.getElementById('imgMedium').style.filter = '';
    document.getElementById('imgLow').style.filter = '';
    priority = "";
}

/**
 * This function removes all red borders.
 */
function clearHighlightedFields() {
    document.getElementById('title').classList.remove('redBorder');
    document.getElementById('description').classList.remove('redBorder');
    document.getElementById('dueDate').classList.remove('redBorder');
    document.getElementById('urgent').classList.remove('redBorder');
    document.getElementById('medium').classList.remove('redBorder');
    document.getElementById('low').classList.remove('redBorder');
    document.getElementById('selectCategoryForm').classList.remove('redBorder');
    document.getElementById('assignedToForm').classList.remove('redBorder');
}

// ================================================ ASSIGN USER FUNCTIONS ==========================================================
/**
 * This function renders the alle the users from the "users" array. 
 */
function renderAvailableUsers() {
    let assignedToForm = document.getElementById('assignedToForm');
    assignedToForm.innerHTML = "";
    assignedToForm.innerHTML += assignToPlaceholderTemplate();
    let avatarPicker = document.getElementById('avatarPicker');
    avatarPicker.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        let availableUserId = contacts[i]['id'];
        let userName = contacts[i]['first_name'];
        let userSurname = contacts[i]['last_name'];
        let userColor = contacts[i]['color'];
        getFirstletter(i);
        //getFirstLetterAvailableUser(i);
        avatarPicker.innerHTML += assignUserTemplate(availableUserId, userColor, firstLetters, userName, userSurname);
    }
}

/**
 * This function returns the first letter of the name and surname of the current user.
 * @param {index} i - index of the current user
 */
/* function getFirstLetterAvailableUser(i) {
    let x = contacts[i]['name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = contacts[i]['surname'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLettersAvailableUser = x.toUpperCase() + y.toUpperCase();
} */

/**
 * This function selects a user. Adds classes to the div's and pushes the user id to the "selectedUsers" array.
 * @param {number} availableUserId - id of the user
 */
function selectUser(availableUserId) {
    let user = document.getElementById(availableUserId);
    let userIcon = document.getElementById('icon' + availableUserId);
    user.classList.toggle('avatarSelected');
    userIcon.classList.toggle('avatarSelectedIcon');
    if(selectedUsers.includes(availableUserId)){
        selectedUsers = selectedUsers.filter(a => a != availableUserId);
        checkForSelectedUsers();
    } else {
        selectedUsers.push(availableUserId);
        checkForSelectedUsers();
    }
}

/**
 * This function renders the selected users into the placeholder div.
 */
function checkForSelectedUsers() {
    let selectedUsersPlaceholder = document.getElementById('selectedUsersPlaceholder');
    if(selectedUsers == []) {
        selectedUsersEmpty();
    } else if (selectedUsers != []) {
        selectedUsersAvailable();
    }
}

/**
 * This function renders the placeholder when the "selectedUsers" array is empty.
 */
function selectedUsersEmpty() {
    selectedUsersPlaceholder.innerHTML = "";
    selectedUsersPlaceholder.innerHTML += `
        <div id="assignedToHeader" class="assignedToHeader">Select contacts to assign</div>
    `;
}

/**
 * This function renders the user icons when the "selectedUsers" array contains users.
 */
function selectedUsersAvailable() {
    if(selectedUsers.length <= 10){
        selectedUsersAvailableLessThenTen();
    } else {
        selectedUsersAvailableMoreThenTen();
    }
}

/**
 * This function renders the selected users in the placeholder div if less then 10 or 10 users are selected.
 */
function selectedUsersAvailableLessThenTen() {
    selectedUsersPlaceholder.innerHTML = "";
    for (let i = 0; i < selectedUsers.length; i++) {
        let contactId = selectedUsers[i];
        let existingUser = contacts.find(u => u.id == contactId);
        let currentUser = contacts.indexOf(existingUser);
        let userColor = contacts[currentUser]['color'];
        //getFirstLetterAvailableUser(currentUser);
        getFirstletter(currentUser);
        selectedUsersPlaceholder.innerHTML += selectedUsersPlaceholderTemplate(userColor, firstLetters);
    }
}

/**
 * This function renders the selected users in the placeholder div if more then 10 users are selected.
 */
function selectedUsersAvailableMoreThenTen() {
    selectedUsersPlaceholder.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        let contactId = selectedUsers[i];
        let existingUser = contacts.find(u => u.contactId == contactId);
        let currentUser = contacts.indexOf(existingUser);
        let userColor = contacts[currentUser]['contactColor'];
        //getFirstLetterAvailableUser(currentUser);
        getFirstletter(currentUser);
        selectedUsersPlaceholder.innerHTML += selectedUsersPlaceholderTemplate(userColor, firstLetters);
    }
    let remainingUsers = selectedUsers.length - 9;
    selectedUsersPlaceholder.innerHTML += selectedUsersPlaceholderTemplateOthers(remainingUsers);
}

// ================================================ PRIORITY FUNCTIONS ==========================================================
/**
 * This function sets the priorityValue and changes the appearance of the urgent button.
 */
function selectUrgent() {
    select("urgent", ["medium", "low"], ["imgMedium", "imgLow"], ["urgent"], ["imgUrgent"]);
}

/**
 * This function sets the priorityValue and changes the appearance of the urgentEdit button.
 */
function selectUrgentEdit() {
    select("urgent", ["mediumEdit", "lowEdit"], ["imgMediumEdit", "imgLowEdit"], ["urgentEdit"], ["imgUrgentEdit"]);
}

/**
 * This function sets the priorityValue and changes the appearance of the medium button.
 */
function selectMedium() {
    select("medium", ["urgent", "low"], ["imgUrgent", "imgLow"], ["medium"], ["imgMedium"]);
}

/**
 * This function sets the priorityValue and changes the appearance of the mediumEdit button.
 */
function selectMediumEdit() {
    select("medium", ["urgentEdit", "lowEdit"], ["imgUrgentEdit", "imgLowEdit"], ["mediumEdit"], ["imgMediumEdit"]);
}

/**
 * This function sets the priorityValue and changes the appearance of the low button.
 */
function selectLow() {
    select("low", ["urgent", "medium"], ["imgUrgent", "imgMedium"], ["low"], ["imgLow"]);
}

/**
 * This function sets the priorityValue and changes the appearance of the lowEdit button.
 */
function selectLowEdit() {
    select("low", ["urgentEdit", "mediumEdit"], ["imgUrgentEdit", "imgMediumEdit"], ["lowEdit"], ["imgLowEdit"]);
}

/**
 * This function changes the appearance of the buttons.
 * @param {*} id - id of the priority button
 * @param {array} idsToDeselect - id's to deselect
 * @param {array} filtersToDeselect - filters to deselect
 * @param {array} idsToSelect -  id's to select
 * @param {array} filtersToSelect - filters to select
 */
function select(id, idsToDeselect, filtersToDeselect, idsToSelect, filtersToSelect) {
    saveSelectedPriority(id);
    // Set background and color for IDs to deselect
    deselectPriorityButtons(idsToDeselect, filtersToDeselect);

    // Set background and color for IDs to select
    selectPriorityButtons(idsToSelect, filtersToSelect);
}

/**
 * This function changes the appearance of priorty buttons that are not selected.
 * @param {array} idsToDeselect - id's to deselect
 * @param {array} filtersToDeselect - filters to deselect
 */
function deselectPriorityButtons(idsToDeselect, filtersToDeselect) {
    for (var i = 0; i < idsToDeselect.length; i++) {
        var element = document.getElementById(idsToDeselect[i]);
        element.style.background = "white";
        element.style.color = "black";
        if (filtersToDeselect[i]) {
            var imgElement = document.getElementById(filtersToDeselect[i]);
            imgElement.style.filter = "";
        }
    }
}

/**
 * This function changes the appearance of the priorty button that is selected.
 * @param {array} idsToSelect - id's to select
 * @param {array} filtersToSelect - filters to select
 */
function selectPriorityButtons(idsToSelect, filtersToSelect) {
    for (var i = 0; i < idsToSelect.length; i++) {
        var element = document.getElementById(idsToSelect[i]);
        if(idsToSelect[i] == 'urgent' || idsToSelect[i] == 'urgentEdit') {
            element.style.background = orange;
            element.style.color = white;

        } else if (idsToSelect[i] == 'medium' || idsToSelect[i] == 'mediumEdit') {
            element.style.background = lightorange;
            element.style.color = white;

        } else if (idsToSelect[i] == 'low' || idsToSelect[i] == 'lowEdit') {
            element.style.background = green;
            element.style.color = white;
        } else {
            element.style.background = white;
            element.style.color = black;
        }

        if (filtersToSelect[i]) {
            var imgElement = document.getElementById(filtersToSelect[i]);
            imgElement.style.filter = "brightness(0) invert(1)";
        }
    }
}

/**
 * This function sets the priorty value to the selected priority.
 */
function saveSelectedPriority(id) {
    priority = id;
}

// ================================================ CATEGORY FUNCTIONS ==========================================================
/**
 * This function renders the alle the categories from the "categories" array.
 */
function renderCategories() {
    let selectCategoryForm = document.getElementById('selectCategoryForm');
    selectCategoryForm.innerHTML = "";
    selectCategoryForm.innerHTML += categoryPlaceholderTemplate();
    let categoryConatiner = document.getElementById('categoryChoices');
    categoryConatiner.innerHTML = "";
    
    
    for (let i = 0; i < categories.length; i++) {
        let categoryName = categories[i]['categoryName'];
        let categoryColor = categories[i]['color'];
        let categoryType = categories[i]['categoryType'];
        let categoryId = categories[i]['id'];
    
        if(categoryType == 'default') {
            categoryConatiner.innerHTML += defaultCategoryTemplate(categoryName, categoryColor);
        } else {
            categoryConatiner.innerHTML += newCategoryTemplate(categoryName, categoryColor, i, categoryId);
        }
    }
}

/**
 * This function saves the selected category in the "categoryValue" variable and displays the selected category.
 * @param {string} categoryName - name of the new category
 * @param {string} categoryColor - color of the new category
 */
function saveSelectedCategory(categoryName, categoryColor) {
    categoryValue = categoryName;
    categoryColorValue = categoryColor;
    document.getElementById('categoryChoices').classList.add('d-none');
    let placeholderCategory = document.getElementById('placeholderCategory')
    placeholderCategory.innerHTML = `
        <div class="category">
            <div>${categoryName}</div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        <img src="./img/arrow.svg">
    `;
}

/**
 * This function prevents the inherit function to run.
 * @param {*} event 
 */
function doNotAdd(event) {
    event.stopPropagation();
}

function doNotClose(event) {
    event.stopPropagation(); 
}

/**
 * This function adds a new category to the the "categoires" array.
 */
async function addNewCategory() {
    let newCategory = document.getElementById('newCategory').value;
    if (newCategory !== '') {
        generateCategoryColor();
        let categoryData = {'categoryName': newCategory, 'color': categoryColor, 'categoryType': 'custom'};
        categories.push(categoryData);
        await saveCategories(categoryData);
        await loadData();
        renderCategories();
        document.getElementById('newCategory').value = '';
        displaySnackbar('newCategoryAdded');
        document.getElementById('plusNewCategoryImg').classList.remove('d-none');
        document.getElementById('clearNewCategoryImg').classList.add('d-none');
        document.getElementById('addNewCategoryImg').classList.add('d-none');
    } else {
        displaySnackbar('missingInput');
    }
}

/**
 * This function generates a random color.
 */
function generateCategoryColor() {
    let x = Math.floor(Math.random() * 256)
    let y = Math.floor(Math.random() * 256)
    let z = Math.floor(Math.random() * 256)
    categoryColor = `rgb(${x}, ${y}, ${z})`;
}

/**
 * This function saves the "categories" array on the server.
 */
async function saveCategories(categoryData) {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    let newCategoryAsString = JSON.stringify(categoryData);
    try {
        let response = await fetch('http://127.0.0.1:8000/tasks/save_created_category/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json",
                "Authorization": `Token ${token}`
            },
            body: newCategoryAsString
          });
    } catch(e) {
        console.log('Creating category was not possible', error);
    }
}

/**
 * This function deletes an added category.
 */
async function deleteNewCategory(i, categoryName, categoryId) {
    let token = localStorage.getItem('token', data.token);
    const csrfToken = getCookie("csrftoken");
    if(categoryValue == categoryName) {
        categoryValue = "";
        categoryColorValue = "";
    }

    categories.splice(i, 1);
    let currentCategory = categories[i];
    console.log('currentCategory', currentCategory);
    let deleteCategoryAsString = JSON.stringify(currentCategory);

    try {
        let response = await fetch(`http://127.0.0.1:8000/tasks/delete_category/${categoryId}/`, {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Accept":"application/json", 
                "Content-Type":"application/json",
                "Authorization": `Token ${token}`
            },
            body: deleteCategoryAsString
          });
          let placeholderCategory = document.getElementById('placeholderCategory')
          placeholderCategory.innerHTML = `
              <div class="sectorTop" id='placeholderCategory'>
              <p>Select task category</p>
              <img src="./img/arrow.svg">
              </div>`;
          renderCategories();
    } catch(error) {
        console.log('Creating category was not possible', error);
    }
}

/**
 * This function clears the categories array and changes the symbol back to the "Plus"-symbol.
 */
function clearNewCategory() {
    document.getElementById('newCategory').value = "";
    document.getElementById('plusNewCategoryImg').classList.remove('d-none');
    document.getElementById('clearNewCategoryImg').classList.add('d-none');
    document.getElementById('addNewCategoryImg').classList.add('d-none');
}

// ================================================ SUBTASK FUNCTIONS ==========================================================
/**
 * This function adds a subtask to the the subtask array.
 */
async function addSubtask() {
    let subtask = document.getElementById('subtask').value;
    if (subtask !== '') {
        subtasks.push({'subtaskName': subtask, 'status': 'undone'});
        document.getElementById('subtask').value = '';
        renderAddSubtasks();
        displaySnackbar('newSubtaskAdded');
        document.getElementById('plusSubtaskImg').classList.remove('d-none');
        document.getElementById('clearSubtaskImg').classList.add('d-none');
        document.getElementById('addSubtaskImg').classList.add('d-none');
    } else {
        displaySnackbar('missingInput');
    }
}

/**
 * This function renders the subtasks into the subtask container.
 */
function renderAddSubtasks() {
    document.getElementById('subtaskList').innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        let subtaskRender = subtasks[i]['subtaskName'];
        document.getElementById('subtaskList').innerHTML += `
        <div class="subtask">
            <div>- ${subtaskRender}</div>
            <img src="./img/delete.svg" onclick="deleteAddSubtask(${i})">
        </div>`;
    }
}

/**
 * This function deletes the subtask.
 */
function deleteAddSubtask(i) {
    subtasks.splice(i, 1);
    renderAddSubtasks();
}

/**
 * This function clears the subtask array and changes the subtask symbol back to the "Plus"-symbol.
 */
function clearSubtask() {
    document.getElementById('subtask').value = "";
    document.getElementById('plusSubtaskImg').classList.remove('d-none');
    document.getElementById('clearSubtaskImg').classList.add('d-none');
    document.getElementById('addSubtaskImg').classList.add('d-none');
}