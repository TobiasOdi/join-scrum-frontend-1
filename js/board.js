/* =============================================================================== VARIABLES =================================================================== */
let allTasks = [];
let userChar = [];
let allUsers = [];
let currentDraggedElement;
let currentDraggedTaskId;
let priorityValueEdit;
let startWithLetter = [];
let selectedUsersEdit = [];
let userSubtasks = [];
let subtasksEdit = [];
let openSubtasks = [];
let editedData = [];
let backupSubtasks = [];
let backupAssignedContacts = [];

/* ============================================================================ BOARD FUNCTIONS ======================================================================== */
/**
 * This function renders the tasks to the correct category.
 */
function updateHTML() {
    filterTasks('toDo');
    filterTasks('inProgress');
    filterTasks('awaitingFeedback');
    filterTasks('done');
    checkForEmptyCategories();
}

/**
 * This function filters all the tasks to the correct status.
 * @param {string} taskStatus - name of the task status
 */
function filterTasks(taskStatus) {
    let currentStatus = tasks.filter(t => t["statusCategory"] == taskStatus);
    document.getElementById(taskStatus).innerHTML = ``;
    for (let i = 0; i < currentStatus.length; i++) {
        let element = currentStatus[i]; 
        let existingCategory = categories.find(c => c.categoryName == element.category);
        let categoryColor = existingCategory.color;

        if(taskStatus == "toDo") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTMLToDo(element, taskStatus, categoryColor);
        } else if(taskStatus == "inProgress" || taskStatus == "awaitingFeedback") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTML(element, taskStatus, categoryColor);
        } else if(taskStatus == "done") {
            document.getElementById(taskStatus).innerHTML += generateToDoHTMLDone(element, taskStatus, categoryColor);
        }
        calculateProgressbar(element);
        createBubbles(element['id']);
    }
}

/**
 * This function calculates the values for the progressbar of the subtasks.
 * @param {index} element - index of the current task in the respective category array (toDo, inProgress etc.)
 */
function calculateProgressbar(element) {
    let numerator = 0;
    let subtasksCalculate = subtasksLoad.filter(s => s["parent_task_id"] == element.id);
    let denominator = subtasksCalculate.length;
    if(subtasksCalculate.length !== 0) {
        for (let j = 0; j < subtasksCalculate.length; j++) {
            if(!subtasksCalculate[j]['status'].includes('undone')) {
                numerator++;
            }
        }
        let progress = numerator / denominator;
        progress = progress * 100;
        generateProgressbarHtml(element, progress, numerator, denominator, subtasksCalculate);
    }
}

/**
 * This function renders the progressbar of the subtasks.
 * @param {index} element - index of the current task in the respective category array (toDo, inProgress etc.)
 * @param {%} progress - percentage of the done subtasks
 * @param {number} numerator - value "0"
 * @param {number} denominator - length of the subtask array of the current task
 */
function generateProgressbarHtml(element, progress, numerator, denominator, subtasksCalculate) {
    if(subtasksCalculate.length === 1) {
        document.getElementById(`boardContainerProgress(${element["id"]})`).innerHTML = progressbarTaskTemplate(progress, numerator, denominator);
    } else {
        document.getElementById(`boardContainerProgress(${element["id"]})`).innerHTML = progressbarTasksTemplate(progress, numerator, denominator);
    }
}

/**
 * This function renders the assigend users.
 */
function createBubbles(taskId) {
    let bubbleTaskId = taskId;
    let assignedUsers = assignedContacts.filter(c => c["parent_task_id"] == taskId);
    let assignedUserCount = assignedUsers.length;
    if(assignedUserCount <= 3) {
        let bubbleCount = assignedUserCount;    
        userBubbles(bubbleTaskId, bubbleCount, assignedUsers);
    } else if (assignedUserCount > 3) {
        let bubbleCount = 2;
        userBubbles(bubbleTaskId, bubbleCount, assignedUsers);
        getRemainingCount(bubbleTaskId, assignedUserCount);
    }
}

/**
 * This function renders the bubbles of the assigend users.
 * @param {index} j - index of the current task
 * @param {number} bubbleTaskId - id of the current task
 * @param {number} bubbleCount - count how many bubbles need to be rendered
 */
function userBubbles(bubbleTaskId, bubbleCount, assignedUsers) {
    for (let i = 0; i < bubbleCount; i++) {
        let assignedUser = assignedUsers[i]['contact_id'];
        let ac = contacts.find(c => c['id'] == assignedUser);
        getName(ac);
        let name = firstLetters;
        document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
            <div class="userBubbleOne" id="userBubbleOne${bubbleTaskId}${[i]}">${name}</div>`;
        let userBubble = document.getElementById(`userBubbleOne${bubbleTaskId}${[i]}`);
        userBubble.style.backgroundColor = getUserColor(ac);
        userBubble.style.color = getUserTextColor(ac);
    }
}

/**
 * This function returns the first letter of the name and surname.
 * @param {array} assignedUsers - array of the assigned users ot the current task
 * @param {index} i - index
 * @returns 
 */
function getName(assignedUser) {
    firstLetters = "";
    let x = assignedUser['first_name'];
    x = x.split(' ').map(word => word.charAt(0)).join('');
    let y = assignedUser['last_name'];
    y = y.split(' ').map(word => word.charAt(0)).join('');
    firstLetters = x.toUpperCase() + y.toUpperCase();
    return firstLetters;
}


/**
 * This function returns the color of the user.
 * @param {array} assignedUsers - array of the assigned users ot the current task
 * @param {index} i - index
 * @returns 
 */
function getUserColor(assignedUser) {
    let assignColor = assignedUser['color'];
    return assignColor;
}

/**
 * This function returns the color of the user.
 * @param {array} assignedUsers - array of the assigned users ot the current task
 * @param {index} i - index
 * @returns 
 */
function getUserTextColor(assignedUser) {
    let assignTextColor = assignedUser['text_color'];
    return assignTextColor;
}

/**
 * This function renders the bubble of the remaining count of the users that are not beeing rendered.
 * @param {index} j - index of the current task
 * @param {number} bubbleTaskId - id of the bubble
 */
function getRemainingCount(bubbleTaskId, assignedUserCount) {
    let remainingCount = assignedUserCount - 2;
    document.getElementById(`userBubble${[bubbleTaskId]}`).innerHTML += `
        <div class="userBubbleOne" id="userBubbleOne${bubbleTaskId}${[2]}">+${remainingCount}</div>
        `;
    let userBubbleOne = document.getElementById(`userBubbleOne${bubbleTaskId}${[2]}`);
    userBubbleOne.style.backgroundColor = "black";
}

/**
 * This function renders a placeholder if a category has no tasks.
 */
function checkForEmptyCategories() {
    let toDoCategory = document.getElementById('toDo');
    let inProgressCategory = document.getElementById('inProgress');
    let awaitingFeedbackCategory = document.getElementById('awaitingFeedback');
    let doneCategory = document.getElementById('done');
    checkForEmptyCategory(toDoCategory, 'to do');
    checkForEmptyCategory(inProgressCategory, 'in progress');
    checkForEmptyCategory(awaitingFeedbackCategory, 'awaiting feedback');
    checkForEmptyCategory(doneCategory, 'done');
}

/**
 * This function checks if a category is empty and renders the placeholder.
 * @param {string} category - task category
 * @param {string} categoryText - task category text for the placeholder text
 */
function checkForEmptyCategory(category, categoryText) {
    if(category.innerHTML == ""){
        category.innerHTML += `
            <div class="emptyCategory">
                <div class="emptyCategoryText">No tasks ${categoryText}</div>
            </div>
        `;
    } 
}

/* ============================================================================ DRAG & DROP ======================================================================== */
//Source: www.w3schools.com/html/html5_draganddrop.asp
/**
 * This function allows you to drag an element.
 * @param {number} id - id of the task
 */
function startDragging(id) {
    currentDraggedElement = tasks.findIndex(obj => obj.id === id);
    currentDraggedTaskId = id;
}

/**
 * This function changes the category to the 
 * @param {string} statusCategory - new category
 */
function moveTo(statusCategory) {
    tasks[currentDraggedElement]["statusCategory"] = statusCategory;
    saveTaskCategory(currentDraggedTaskId);
    updateHTML();
}

/**
 * This function highlights the container if element is hovering over.
 * @param {number} id - id of the current task 
 */
function highlight(id) {
    if(document.getElementById(id) !== id)
    document.getElementById(id).classList.add('dragAreahighlight');
}

/**
 * This function removes the highlight of the container if element is dragged away or placed.
 * @param {*} id - id of the current task
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragAreahighlight');
}

/**
 * This function allows you to drop an element into a container.
 * @param {*} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function prevents an a function of a parent elemtn beeing executed when clicking on a child element.
 * @param {*} event 
 */
function doNotOpenTask(event) {
    event.stopPropagation();
}

/**
 * This function saves the task data in the "tasks" array on the ftp server.
 */
async function saveTaskCategory(id) {
    let currentTask = tasks.find(i => i.id == id);
    let currentTaskAsString = JSON.stringify(currentTask);
    try {
        let path = `save_task_category/${id}`;
        let response = await fetchApiHelper(path, currentTaskAsString);
    } catch(e) {
        console.log('Saving task was not possible', error);
    }
}


/* ======================================================================= BOARD TASK FUNCTIONS ================================================================================= */
/**
 * This function pushes the task to the previous category.
 * @param {string} category - current category of the task
 * @param {number} taskId - id of the task
 */
async function pushToPreviousCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.id == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'done') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback';
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'inProgress'; 
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'toDo';
    } 
    await saveTaskCategory(taskId);
    updateHTML();
}

/**
 * This function pushes the task to the next category.
 * @param {*} category - current category of the task
 * @param {*} taskId - id of the task
 */
async function pushToNextCategory(category, taskId) {
    let currentTaskId = tasks.find(t => t.id == taskId);
    let currentTask = tasks.indexOf(currentTaskId);
    if(category == 'toDo') {
        tasks[currentTask]['statusCategory'] = 'inProgress';
    } else if(category == 'inProgress') {
        tasks[currentTask]['statusCategory'] = 'awaitingFeedback'; 
    } else if(category == 'awaitingFeedback') {
        tasks[currentTask]['statusCategory'] = 'done';
    }
    await saveTaskCategory(taskId);
    updateHTML();
}

/* ======================================================================= OPEN TASK ================================================================================= */
/**
 * This function opens a task and displays the task information.
 * @param {number} currentTaskId - id of the task
 */
function openTask(currentTaskId) {
    document.getElementById('openTaskBackground').style.display = 'flex';
    backupAssignedContacts = structuredClone(assignedContacts);
    let currentTask = tasks.find(u => u.id == currentTaskId);
    let currentTaskIndex = tasks.indexOf(currentTask)
    let currentCategory = categories.find(c => c.categoryName == currentTask.category);
    let openTaskContainer = document.getElementById('openTaskContainer');
    openTaskContainer.innerHTML = '';
    openTaskContainer.innerHTML = openTaskTemplate(currentTask, currentCategory, currentTaskIndex);
    renderprioritySymbol(currentTask);
    renderAssignedUsers(currentTaskId);
    renderSubtasks(currentTaskId);
}

/**
 * This function renders the priority of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderprioritySymbol(currentTask) {
    let currentPriority = currentTask.priorityValue;
    let priorityOpenTask = document.getElementById('priorityOpenTask');
    if (currentPriority == 'urgent') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/urgent.svg">`;
    } else if (currentPriority == 'medium') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/medium.svg">`;
    } else if (currentPriority == 'low') {
        priorityOpenTask.innerHTML += `<img id="openTaskImgPriority" src="./img/low.svg">`;
    }
}

/**
 * This function renders the users of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderAssignedUsers(currentTaskId) {
    let assignedUsers = assignedContacts.filter(c => c.parent_task_id == currentTaskId)
    for (let i = 0; i < assignedUsers.length; i++) {
        let assignedUser = assignedUsers[i]['contact_id'];
        let ac = contacts.find(c => c['id'] == assignedUser);
        getName(ac);
        let assignName = ac['first_name'];
        let assignSurname = ac['last_name'];
        let assignColor = ac['color'];
        let assignTextColor = ac['text_color'];
        document.getElementById('assignedToContainer').innerHTML += renderAssignedUserTemplate(assignColor, assignTextColor, firstLetters, assignName, assignSurname);
    }
}

/**
 * This function renders the subtasks of the current task.
 * @param {index} currentTask - index of the current task
 */
function renderSubtasks(currentTaskId){
    let taskForSubtaskId = currentTaskId;
    userSubtasks = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
    let backupUserSubtasks = structuredClone(subtasksLoad);
    document.getElementById('subtaskContainer').innerHTML = "";

    if(userSubtasks == "") {
        document.getElementById('subtaskContainer').innerHTML += `
            <div>No subtasks</div>
        `;
    } else {
        for (let j = 0; j < userSubtasks.length; j++) {
            let subtask = userSubtasks[j]['subtaskName'];
            let subtaskId = userSubtasks[j]['id'];
            let subtaskStatus = userSubtasks[j]['status'];
            if (!subtaskStatus.includes('undone')) {
                document.getElementById('subtaskContainer').innerHTML += renderSubtasksUndoneTemplate(currentTaskId, subtaskId, subtask);
            } else {
                document.getElementById('subtaskContainer').innerHTML += renderSubtasksTemplate(currentTaskId, subtaskId, subtask);
            }
        }
    }
}

/**
 * This function deletes the current task.
 * @param {index} currentTask - index of the current task
 */
async function deleteTask(currentTaskIndex) {
    let currentTask = tasks[currentTaskIndex];
    if(tasks.length > 1) {
        tasks.splice(currentTaskIndex, 1);
        await deleteTaskFromServer(currentTask);
        await loadData();
        updateHTML();
        document.getElementById('openTaskBackground').style.display = 'none';
    } else {
        tasks.splice(currentTaskIndex, 1);
        await deleteTaskFromServer(currentTask);
        await loadData();
        updateHTML();
        document.getElementById('openTaskBackground').style.display = 'none';
    }
}

/**
 * This function deltes the current task from the database.
 * @param {*} currentTask - Current task object
 */
async function deleteTaskFromServer(currentTask) {
    try {
        let path = `board/delete_task/${currentTask.id}`;
        let response = fetchApiHelper(path);
    } catch(e) {
        console.log('Deleting task was not possible', error);
    }
}

/* ======================================================================= EDIT TASK ================================================================================= */
/**
 * This function retrieves the task data and lets you edit tehm.
 * @param {index} currentTask - index of the current task
 */
function editTask(currentTaskId, currentCategoryColor) {
    let currentTask = tasks.find(t => t.id == currentTaskId);
    subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
    backupSubtasks = structuredClone(subtasksLoad);
    backupAssignedContacts = structuredClone(assignedContacts);
    document.getElementById('openTaskContainer').innerHTML = editOpenTaskTemplate(currentTask, currentCategoryColor);
    let selectCategoryContainer = document.getElementById('selectCategoryContainer');
    selectCategoryContainer.style.backgroundColor = currentCategoryColor;
    let titleEdit = document.getElementById('titleEdit');
    titleEdit.value = currentTask.title;
    let descriptionEdit = document.getElementById('descriptionEdit');
    descriptionEdit.value = currentTask.description;
    renderEditCategories();
    document.getElementById('editSelectCategory').value = currentTask.category;
    renderUrgency(currentTask);
    renderSubtasksEdit(currentTaskId);
    renderAssignedUsersEdit(currentTaskId);
    changeCategoryColor();
    editDateInput();
}

/**
 * This function renders the alle the categories from the "categories" array.
 */
function renderEditCategories() {
    document.getElementById('editSelectCategory').innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let categoryName = categories[i]['categoryName'];
        let categoryColor = categories[i]['color'];
        document.getElementById('editSelectCategory').innerHTML += editCategoryTemplate(categoryName, categoryColor);
    }
}

/**
 * This function renders the priority buttons to set the priority.
 * @param {index} currentTask - index of the current task
 */
function renderUrgency(currentTask) {
    if (currentTask.priorityValue == 'urgent') {
        selectUrgentEdit();
    } else if (currentTask.priorityValue == 'medium') {
        selectMediumEdit();
    } else if (currentTask.priorityValue == 'low') {
        selectLowEdit();
    }
    priorityValueEdit = currentTask.priorityValue;
}

/**
 * This function checks if a value form the dropdown is beeing selected and sets the background color.
 */
function changeCategoryColor() {
    document.getElementById('editSelectCategory').addEventListener("click", function() {
        let existingCategory = categories.find(c => c.categoryName == document.getElementById('editSelectCategory').value);
        let currentCategory = categories.indexOf(existingCategory);
        let currentCategoryColor = categories[currentCategory]['color'];
        document.getElementById('selectCategoryContainer').style.backgroundColor = currentCategoryColor;
    });
}

/**
 * This function renders the subtasks and lets you mark them.
 * @param {index} currentTask - index of the current task
 */
function renderSubtasksEdit(currentTaskId){
    document.getElementById('subtaskContainerEdit').innerHTML = "";
    if(subtasksEdit == "") {
        document.getElementById('subtaskContainerEdit').innerHTML += `
            <div>No subtasks</div>
        `;
    } else {
        renderAllSubtasks(currentTaskId);
    }
};

/**
 * This function renders the correct subtasks template.
 * @param {*} currentTaskId 
 */
function renderAllSubtasks(currentTaskId) {
    for (let j = 0; j < subtasksEdit.length; j++) {
        let subtask = subtasksEdit[j]['subtaskName'];
        let subtaskStatus = subtasksEdit[j]['status'];
        let subtaskId = subtasksEdit[j]['id'];
        if (!subtaskStatus.includes('undone')) {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditUndoneTemplate(currentTaskId, subtask, subtaskId);
        } else {
            document.getElementById('subtaskContainerEdit').innerHTML += subtasksEditTemplate(currentTaskId, subtask, subtaskId);
        }
    }
}

/**
 * This function adds a subtask to the the subtask array.
 */
async function addSubtaskEdit(currentTaskId) {
    let subtaskEdit = document.getElementById('addSubtaskEdit');
    if (subtaskEdit.value !== '') {
        subtasksLoad.push({'parent_task_id': currentTaskId, 'status': 'undone', 'subtaskName': subtaskEdit.value, 'id': 111});
        subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
        subtaskEdit.value = '';
        renderSubtasksEdit(currentTaskId);
        displaySnackbar('newSubtaskAdded');
    } else {
        displaySnackbar('missingInput');
    }
}

/**
 * This function deletes the subtask.
 */
function editSubtask(currentTaskId, subtaskId) {
    openSubtasks.push(subtaskId);
    let currentSubtask = subtasksLoad.find(s => s.id == subtaskId);
    let index = subtasksLoad.indexOf(currentSubtask);
    document.getElementById('subtaskBody' + subtaskId).innerHTML = "";
    document.getElementById('iconContainer' + subtaskId).innerHTML = "";
    document.getElementById('subtaskBody' + subtaskId).innerHTML += `<input id="subtaskBodyEdit${subtaskId}" type="text" value="${currentSubtask['subtaskName']}">`;
    document.getElementById('iconContainer' + subtaskId).innerHTML += `
        <img src="./img/discard.png" onclick="discardEditedSubtask(${currentTaskId}, ${subtaskId}), doNotOpenTask(event)">
        <img id="${'saveSubtaskIcon' + subtaskId}" class="saveSubtaskIcon" src="./img/download.png" onclick="saveEditedSubtask(${currentTaskId}, ${subtaskId}, ${index}), doNotOpenTask(event)">
    `;
}

/**
 * This function discards the content change of the subtask.
 * @param {*} currentTaskId - Id of the current task
 * @param {*} subtaskId - Id of the current subtask
 */
function discardEditedSubtask(currentTaskId, subtaskId) {
    let currentOpenSubtask = openSubtasks.find(s => s == subtaskId);
    let index = openSubtasks.indexOf(currentOpenSubtask);
    openSubtasks.splice(index, 1);

    subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);   
    renderSubtasksEdit(currentTaskId);
}

/**
 * This function saves the content of the subtask.
 * @param {*} currentTaskId - Id of the current task
 * @param {*} subtaskId - Id of the current subtask
 * @param {*} index
 */
function saveEditedSubtask(currentTaskId, subtaskId, index) {
    let currentOpenSubtask = openSubtasks.find(s => s == subtaskId);
    let indexOpenSubtask = openSubtasks.indexOf(currentOpenSubtask);
    openSubtasks.splice(indexOpenSubtask, 1);

    let subtaskText = document.getElementById('subtaskBodyEdit' + subtaskId);
    if(subtaskText.value == "") {
        displaySnackbar('emptySubtaskText');
    } else {
        subtasksLoad[index]['subtaskName'] = subtaskText.value;
        subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);   
        renderSubtasksEdit(currentTaskId);
    }
}

/**
 * This function deletes the subtask.
 */
function deleteSubtaskEdit(currentTaskId, subtaskId) {
    let currentSubtask = subtasksLoad.find(s => s.id == subtaskId);
    let index = subtasksLoad.indexOf(currentSubtask);
    subtasksLoad.splice(index, 1);
    subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
    renderSubtasksEdit(currentTaskId);
}

/**
 * This function renders the users of the current task to select more or deselect them.
 * @param {index} currentTask - index of the current task
 */
function renderAssignedUsersEdit(currentTaskId) {
    selectedUsersEdit = [];
    selectedUsersEdit = assignedContacts.filter(c => c.parent_task_id == currentTaskId);
    for (let i = 0; i < contacts.length; i++) {
        const assignedContact = contacts[i];
        getName(assignedContact);
        let userIsAssigned = selectedUsersEdit.find(u => u.contact_id == assignedContact["id"]);
        let assignedContactId = assignedContact.id;
        if (userIsAssigned) {
            document.getElementById('assignedToContainerEdit').innerHTML += selectedAssignedUsersEditTemplate(assignedContactId, i, firstLetters, currentTaskId);
        } else {
            document.getElementById('assignedToContainerEdit').innerHTML += notSelectedAssignedUsersEditTemplate(assignedContactId, i, firstLetters, currentTaskId);
        }
    }

}

/**
 * This function selects a user. Adds classes to the div's and pushes the user id to the "selectedUsersEdit" array.
 * @param {number} availableUserId - id of the user
 */
function saveSelectedUsersEdit(assignedContactId, currentTaskId) {
    let user = document.getElementById('edit' + assignedContactId);
    let userIcon = document.getElementById('editIcon' + assignedContactId);
    user.classList.toggle('avatarSelected');
    userIcon.classList.toggle('avatarSelectedIcon');

    if(selectedUsersEdit.some(ac => ac.contact_id === assignedContactId)){
        let currentAssignedContact = selectedUsersEdit.find(s => s.contact_id  == assignedContactId);
        let index = selectedUsersEdit.indexOf(currentAssignedContact)
        selectedUsersEdit.splice(index, 1);
    } else {
        selectedUsersEdit.push({
            contact_id: assignedContactId,
            parent_task_id: currentTaskId
        });
    }
}

/**
 * This function saves a completed subtask and.
 * @param {index} subtaskIndex - index of the current subtask
 * @param {index} currentTask - index of the current task
 */
async function saveCompletedSubtasks(currentTaskId, subtaskId, taskStatus) {
    let currentSubtaskElement = subtasksLoad.find(s => s.id == subtaskId);
    let index = subtasksLoad.indexOf(currentSubtaskElement);
    let currentSubtask = document.getElementById('subtask' + subtaskId);
    if(!currentSubtask.checked == true) {
        //subtasksEdit[j]['status'] = 'undone';
        subtasksLoad[index]['status'] = 'undone';
        if(taskStatus == "open") {
            userSubtasks = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
            renderSubtasks(currentTaskId);
        } else {
            subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
        }   
        await saveCompletedSubtasksToServer(currentSubtaskElement, subtaskId);
    }
    if(currentSubtask.checked == true) {
        //subtasksEdit[j]['status'] = 'done';
        subtasksLoad[index]['status'] = 'done';
        if(taskStatus == "open") {
            userSubtasks = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
            renderSubtasks(currentTaskId);
        } else {
            subtasksEdit = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
        }
        await saveCompletedSubtasksToServer(currentSubtaskElement, subtaskId);
    } 
};

/**
 * This function saves the status of the subtask to the database.
 * @param {*} currentSubtaskElement 
 * @param {*} subtaskId 
 */
async function saveCompletedSubtasksToServer(currentSubtaskElement, subtaskId) {
    let subtaskAsString = JSON.stringify(currentSubtaskElement);
    try {
        let path = `board/save_subtask_status/${subtaskId}`;
        let response = await fetchApiHelper(path, subtaskAsString);
    } catch(e) {
        console.log('Saving subtask status was not possible', error);
    }
}

/**
 * This function prevents the selection of pasted dates.
 */
function editDateInput() {
    var dateToday = new Date();
    var month = dateToday.getMonth() + 1;
    var day = dateToday.getDate();
    var year = dateToday.getFullYear();
    if (month < 10)
      month = '0' + month.toString();
    if (day < 10)
      day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    document.getElementById('editDueDate').setAttribute('min', maxDate);
}

/**
 * This function saves the data of the changed task on the ftp server.
 * @param {index} currentTask - index of the current task
 */
async function saveEditedTask(currentTaskId, currentCategoryColor) {
    editedData = [];
    let currentTask = tasks.find(t => t.id == currentTaskId);
    let index = tasks.indexOf(currentTask);
    
    if(openSubtasks.length == 0) {
        if(document.getElementById('titleEdit').value !== "" && selectedUsersEdit.length !== 0) {
            setEditedTaskParameters(index, currentTaskId);
            await saveEditedTaskToServer(currentTaskId);
            priority = "";
            selectedUsersEdit = [];
            subtasksEdit = [];
            await loadData();
            updateHTML();
            document.getElementById('openTaskBackground').style.display = 'none';
            document.getElementById('openTaskBackgroundEdit').style.display = 'none';
        } else {
            highlightInputsEditTask(); 
        }
    } else {
        displaySnackbar('openSubtask');
        for (let i = 0; i < openSubtasks.length; i++) {
            const openSubtask = openSubtasks[i];
            let icon = document.getElementById('saveSubtaskIcon' + openSubtask);
            icon.style.boxShadow = '0 0 2px 2px red';
            setTimeout(() => {
                icon.style.boxShadow = 'none';
            }, 3000);
        }
    }
}

/**
 * This function sets all the edited task parameters.
 */
function setEditedTaskParameters(index, currentTaskId) {
    tasks[index]['category'] = document.getElementById('editSelectCategory').value;
    tasks[index]['title'] = document.getElementById('titleEdit').value;
    tasks[index]['description'] = document.getElementById('descriptionEdit').value;
    tasks[index]['due_date'] = document.getElementById('editDueDate').value;
    tasks[index]['priorityValue'] = priorityValueEdit;
    let taskData = [tasks[index]];
    let assignedToData = selectedUsersEdit;
    let subtaskData = subtasksLoad.filter(s => s.parent_task_id == currentTaskId);
    editedData = [{"taskData": taskData, "assignedToData": assignedToData, "subtaskData": subtaskData}];
}

/**
 * This function saves all the edited task data to the database.
 * @param {*} currentTaskId 
 */
async function saveEditedTaskToServer(currentTaskId) {
    let editedTaskAsString = JSON.stringify(editedData);
    try {
        let path = `board/save_edited_task/${currentTaskId}`;
        let response = await fetchApiHelper(path, editedTaskAsString);
    } catch(e) {
        console.log('Creating task was not possible', error);
    }
}

/**
 * This function saves the chosen priority.
 * @param {string} priority - priority of the task
 * @param {index} currentTask - index of the current task
 */
function savePriorityValueEdit(priority, currentTask) {
    priorityValueEdit = priority;
}

/**
 * This function closes the task.
 * @param {string} priority - priority of the task
 * @param {index} currentTask - index of the current task
 */
function closeTask(priority, currentTask) {
    //subtasksLoad = backupSubtasks;
    openSubtasks = [];
    assignedContacts = backupAssignedContacts;
    savePriorityValueEdit(priority, currentTask);
    document.getElementById('openTaskBackground').style.display = 'none';
    document.getElementById('openTaskBackgroundEdit').style.display = 'none';
    updateHTML();
}

/**
 * This function runs the highlight functions.
 */
function highlightInputsEditTask() {
    highlightEmptyTitleInputEdit();
    highlightEmptySelectedUsersInputEdit();
    displaySnackbar('missingInput');
}

/**
 * This function highlights the title input field if empty when the form is beeing submitted.
 */
function highlightEmptyTitleInputEdit() {
    if(!document.getElementById('titleEdit').value) {
        document.getElementById('titleEdit').classList.add('redBorder');
    } else if(document.getElementById('titleEdit').value) {
        document.getElementById('titleEdit').classList.remove('redBorder');
    } 
}

/**
 * This function highlights the selected users input field if empty when the form is beeing submitted.
 */
function highlightEmptySelectedUsersInputEdit() {
    if(selectedUsersEdit.length == 0){
        document.getElementById('assignedToContainerEdit').classList.add('redBorder');
    } else if(selectedUsersEdit.length !== 0){
        document.getElementById('assignedToContainerEdit').classList.remove('redBorder');
    } 
}


/* ======================================================================= SEARCH FUNCTION ================================================================================= */
/**
 * This function shows only the tasks (title, description or category) that contain the serach value.
 */
function searchFunction() {
    let originalTasks = tasks;

    if(document.getElementById('searchValue').value !== "") {
        let newSearchArray = tasks.filter( task =>  {
            return task.title.toLowerCase().includes(document.getElementById('searchValue').value) || task.description.toLowerCase().includes(document.getElementById('searchValue').value) || task.category.toLowerCase().includes(document.getElementById('searchValue').value);
        });
        tasks = newSearchArray;
        updateHTML();
        tasks = originalTasks;
    } else {
        tasks = originalTasks;
        updateHTML();
    }
}
