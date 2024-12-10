/* ========================================================== BOARD TASKS TEMPLATES ========================================= */
/**
 * This function returns the template for the tasks in the "todo" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} taskStatus - The current category in which the task is.
 * @returns 
 */
function generateToDoHTMLToDo(element, taskStatus, categoryColor) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["id"]})" onclick="openTask(${element["id"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${categoryColor}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                     <div id="pushToNextCategory${element["id"]}" onclick="pushToNextCategory('${taskStatus}', ${element["id"]})">
                        <img src="./img/next.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["id"]})" class="boardContainerProgress">
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["id"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template for the tasks in the "inProgress" and "awaitingFeedback" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} taskStatus - The current category in which the task is.
 * @returns 
 */
function generateToDoHTML(element, taskStatus, categoryColor) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["id"]})" onclick="openTask(${element["id"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${categoryColor}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                    <div id="pushToPreviousCategory${element["id"]}" onclick="pushToPreviousCategory('${taskStatus}', ${element["id"]})">
                        <img src="./img/previous.svg">
                    </div>
                    <div id="pushToNextCategory${element["id"]}" onclick="pushToNextCategory('${taskStatus}', ${element["id"]})">
                        <img src="./img/next.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["id"]})" class="boardContainerProgress">
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["id"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template for the tasks in the "done" category.
 * @param {number} element - index of the current task in the filtered category.
 * @param {string} taskStatus - The current category in which the task is.
 * @returns 
 */
function generateToDoHTMLDone(element, taskStatus, categoryColor) {
    return `
        <div class="boardContainer" draggable="true" ondragstart="startDragging(${element["id"]})" onclick="openTask(${element["id"]})">
            <div class="boardContainerTop">
                <div style = "background-color:${categoryColor}">
                    <div>${element["category"]}</div>
                </div>
                <div onclick="doNotOpenTask(event)">
                    <div id="pushToPreviousCategory${element["id"]}" onclick="pushToPreviousCategory('${taskStatus}', ${element["id"]})">
                        <img src="./img/previous.svg">
                    </div>
                </div>
                    
                </div>
            <div class="boardContainerHeadline">
                <h2>${element["title"]}</h2>
            </div>
            <div class="boardContainerDescripton">
                <span>${element["description"]}</span>
            </div>
            <div id="boardContainerProgress(${element["id"]})" class="boardContainerProgress">
            </div>
            <div class="boardContainerUserBubbles">
                <div class="userBubble" id="userBubble${element["id"]}"></div>
                <div>
                    <img class="priorityImg" src="./img/${element["priorityValue"]}.svg">
                </div>
            </div>
        </div>
    `;
}

/**
 * This function returns the progressbar template (one subtask).
 * @param {number} progress - percentage of the completed subtasks
 * @param {number} numerator - the number 0
 * @param {number} denominator - number of subtasks in the current task
 * @returns 
 */
function progressbarTaskTemplate(progress, numerator, denominator) {
    return `
    <div class="progress">
        <div class="progressBar" style="width: ${progress}%";>
        </div>
    </div>
    <div class="progressInNumbers">${numerator}/${denominator} Subtask</div>`;
}

/**
 * This function returns the progressbar template (more than one subtak).
 * @param {number} progress - percentage of the completed subtasks
 * @param {number} numerator - the value 0
 * @param {number} denominator - number of subtasks in the current task
 * @returns 
 */
function progressbarTasksTemplate(progress, numerator, denominator) {
    return `
    <div class="progress">
        <div class="progressBar" style="width: ${progress}%";>
        </div>
    </div>
    <div class="progressInNumbers">${numerator}/${denominator} Subtasks</div>`;
}

/* ================================================================ OPEN TASK TEMPLATE ================================================================== */
/**
 * This function return the template for an opened task.
 * @param {number} currentTask - index of the current task
 * @returns 
 */
function openTaskTemplate(currentTask, currentCategory, currentTaskIndex) {
    return `
        <div id="openTask" class="openTask">
            <div class="openTaskTop">
                <div style="background-color: ${currentCategory.color};">
                    <p>${currentTask.category}</p>
                </div>
                <div onclick="closeTask()">
                    <img src="./img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                 <h1>${currentTask.title}</h1>
                 <p>${currentTask.description}</p>
                 <div class="openTaskDate">
                    <div>Due date:</div>
                    <div id="dateNumber">${currentTask.due_date}</div>
                </div>

                <div class="openTaskPriority">
                    <div>Priority:</div>
                    <div>
                        <div>
                            <button class="prioButton2" id="priorityOpenTask">
                                <span>${currentTask.priorityValue}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="openTaskMain">
                <div class="openTaskSubtask">
                    <div>Subtasks:</div>
                    <div id="subtaskContainer" class="boardSubtaskContainer">

                    </div>                
                </div>

                <div class="openTaskAssigned">
                     <div>Assigned To:</div>
                     <div id="assignedToContainer" class="assignedToContainer">

                    </div>                
                </div>
            </div>

            <div class="openTaskButtonContainer">
                <div class="deleteTaskButton" onclick="deleteTask(${currentTaskIndex})">
                    <img src="./img/deleteTask.svg">
                </div>
                <div class="openTaskEditButton" onclick="editTask(${currentTask.id}, '${currentCategory.color}')">
                    <img src="./img/editWhite.svg">
                </div>
            </div>
            
        </div>

     `;
}

/* ================================================================ EDIT TASK TEMPLATE ================================================================== */
/**
 * This function returns the template of an opened task that can be edited.
 * @param {number} currentTask - index of the current task
 * @returns 
 */
function editOpenTaskTemplate(currentTask, currentCategoryColor) {
    return `
        <div id="openTask${currentTask.id}" class="openTask">
            <div class="openTaskTop">
                <div id="selectCategoryContainer" class="selectCategoryContainer">
                    <select id="editSelectCategory" class="selectCategory" name="category">


                    </select>
                </div>

                <div onclick="closeTask()">
                    <img src="./img/close.svg">
                </div>
            </div>

            <div class="openTaskHeader">
                <input placeholder="${currentTask.title}" class="titleEdit" id="titleEdit" required="">
                <input placeholder="${currentTask.description}" class="descriptionEdit" id="descriptionEdit" required="">
            </div>

            <div class="openTaskMain">

                <div class="openTaskDate openTaskDateEdit">
                    <div>Due date:</div>
                    <input class="date" type="date" class="editDueDate" id="editDueDate" value="${currentTask.due_date}">
                </div>

                <div class="openTaskPriority openTaskPriorityEdit">
                    <div>Priority:</div>
                    <div>
                        <div class="prioButtons prioButtonsEdit">
                            <button class="urgent prioButtonEdit" id="urgentEdit" type="button" onclick="selectUrgentEdit(), savePriorityValueEdit('urgent', ${currentTask.id})">
                                <div>Urgent</div>
                                <img id="imgUrgentEdit" src="./img/urgent.svg">
                            </button>
                            <button class="medium prioButtonEdit" id="mediumEdit" type="button" onclick="selectMediumEdit(), savePriorityValueEdit('medium', ${currentTask.id})">
                                <div>Medium</div>
                                <img id="imgMediumEdit" src="./img/medium.svg">
                            </button>
                            <button class="low prioButtonEdit" id="lowEdit" type="button" onclick="selectLowEdit(), savePriorityValueEdit('low', ${currentTask.id})">
                                <div>Low</div>
                                <img id="imgLowEdit" src="./img/low.svg">
                            </button>
                        </div>
                    </div>
                </div>

                <div id="openTaskSubtask" class="openTaskSubtask openTaskSubtaskEdit">
                    <div>
                        <div>Subtasks:</div>
                        <div>
                            <input id="addSubtaskEdit" class="addSubtaskEdit" type="text">
                            <button onclick="addSubtaskEdit(${currentTask.id})">Add</button>
                        </div>
                    </div>
                    <div id="subtaskContainerEdit" class="boardSubtaskContainer">

                    </div>                
                </div>

                <div class="openTaskAssigned">
                    <div>Assigned To:</div>
                    <div id="assignedToContainerEdit" class="assignedToContainer">

                    </div>                
                </div>
            </div>
        </div>

        <div class="openTaskButtonContainer">
            <div class="cancelTaskEditButton" onclick="closeTask()">
                Cancel
            </div>
            <div class="saveChangesTask" onclick="saveEditedTask(${currentTask.id}, '${currentCategoryColor}')">
                Save
            </div>

        </div>
    `;
}

/* ========================================= OPEN TASK - SUBTASKS TEMPLATE ========================================= */
/**
 * This function returns the template of a undone subtask within the opened task.
 * @param {number} currentTask - index of the current subtask
 * @returns 
 */
function renderSubtasksUndoneTemplate(currentTaskId, subtaskId, subtask){
    return `
        <div class="openSubtask">
            <input id="subtask${subtaskId}" type="checkbox" value="${subtaskId}" onclick="saveCompletedSubtasks(${currentTaskId}, ${subtaskId}, 'open')" checked>
            <div>${subtask}</div>
        </div>
    `;
}

/**
 * This function returns the template of a done subtask within the opened task.
 * @param {number} currentTask - index of the current subtask
 * @returns 
 */
function renderSubtasksTemplate(currentTaskId, subtaskId, subtask) {
    return `
        <div class="openSubtask">
            <input id="subtask${subtaskId}" type="checkbox" value="${subtaskId}" onclick="saveCompletedSubtasks(${currentTaskId}, ${subtaskId}, 'open')">
            <div>${subtask}</div>
        </div>
    `;
}
/* ========================================= EDIT TASK - CATEGORY TEMPLATE ========================================= */
/**
 * This function returns the template for a category in the dropdown.
 * @param {*} categoryName - name of the category
 * @param {*} categoryColor - color of the category
 * @returns 
 */
function editCategoryTemplate(categoryName, categoryColor) {
    return `
        <option value="${categoryName}" style="background-color: ${categoryColor};">${categoryName}</option>
    `;
}

/* ========================================= EDIT TASK - SUBTASKS TEMPLATE ========================================= */
/**
 * This function returns the template of a undone subtask within an editable opened task.
 * @param {number} subtaskIndex - index of the current subtask
 * @param {number} currentTask - index of the current task
 * @param {string} subtask - name of the current subtask
 * @returns 
 */
function subtasksEditUndoneTemplate(currentTaskId, subtask, subtaskId) {
    return `
        <div class="openSubtask">
            <input id="subtask${subtaskId}" type="checkbox" value="${subtaskId}" onclick="saveCompletedSubtasks(${currentTaskId}, ${subtaskId}, 'edit')" checked>
            <div>${subtask}</div>
            <img src="./img/delete.svg" onclick="deleteSubtaskEdit(${currentTaskId}, ${subtaskId}), doNotOpenTask(event)">
        </div>
    `;
}

/**
 * This function returns the template of a done subtask within an editable opened task.
 * @param {number} subtaskIndex - index of the current subtask
 * @param {number} currentTask - index of the current task
 * @param {string} subtask - name of the current subtask
 * @returns 
 */
function subtasksEditTemplate(currentTaskId, subtask, subtaskId) {
    return `
        <div class="openSubtask">
            <input id="subtask${subtaskId}" type="checkbox" value="${subtaskId}" onclick="saveCompletedSubtasks(${currentTaskId}, ${subtaskId}, 'edit')">
            <div>${subtask}</div>
            <img src="./img/delete.svg" onclick="deleteSubtaskEdit(${currentTaskId}, ${subtaskId}), doNotOpenTask(event)">
        </div>
    `;
}

/* ========================================= OPEN TASK - ASSIGNED USERS TEMPLATE ========================================= */
/**
 * This function returns the template for the user that are assigned to the current opened task.
 * @param {string} assignColor - color of the assigned user
 * @param {string} firstLetters - first letters of the assigned user
 * @param {string} assignName - name of the assigned user
 * @param {string} assignSurname - surname of the assigned user
 * @returns 
 */
function renderAssignedUserTemplate(assignColor, firstLetters, assignName, assignSurname){
    return `
        <div class="openTaskAssignedPerson">
            <div style="background-color: ${assignColor};">
                <span>${firstLetters.toUpperCase()}</span>
            </div>
            <div>${assignName} ${assignSurname}</div>
        </div>
    `;
}

/* ========================================= EDIT TASK - ASSIGNED USERS TEMPLATE ========================================= */
/**
 * This function returns the template for the selected user that are assigned to the current opened edited task.
 * @param {number} userId - id of the current task
 * @param {string} j - index of the current user
 * @param {string} firstLetters - first letters of the assigned user
 * @returns 
 */
function selectedAssignedUsersEditTemplate(assignedContactId, i, firstLetters, currentTaskId) {
    return `
        <div id="edit${assignedContactId}" class="avatarContainer avatarSelected" onclick="saveSelectedUsersEdit(${assignedContactId}, ${currentTaskId})">
            <div id="editIcon${assignedContactId}" class="avatar avatarSelectedIcon" style="background-color: ${contacts[i]['color']};">
                <div>${firstLetters}</div>
            </div>
            <div class="nameText">
                <div>${contacts[i]['first_name']} ${contacts[i]['last_name']}</div>
            </div>
        </div>
`;
}

/**
 * This function returns the template for the available/deselected user in the opened edited task.
 * @param {number} userId - id of the current task
 * @param {string} j - index of the current user
 * @param {string} firstLetters - first letters of the assigned user
 * @returns 
 */
function notSelectedAssignedUsersEditTemplate(assignedContactId, i, firstLetters, currentTaskId) {
    return `
        <div id="edit${assignedContactId}" class="avatarContainer" onclick="saveSelectedUsersEdit(${assignedContactId}, ${currentTaskId})">
            <div id="editIcon${assignedContactId}" class="avatar" style="background-color: ${contacts[i]['color']};">
                <div>${firstLetters}</div>
            </div>
            <div class="nameText">
                <div>${contacts[i]['first_name']} ${contacts[i]['last_name']}</div>
            </div>
        </div>
    `;
}

/* ========================================= CREATE TASK TEMPLATES ========================================= */
/**
 * This function returns the template for the category placeholder on the create task html.
 * @returns 
 */
function categoryPlaceholderTemplate() {
 return `
    <div class="sectorTop" id='placeholderCategory'>
        <p>Select task category</p>
        <img src="./img/arrow.svg">
    </div>

    <div class="categoryChoices d-none" id="categoryChoices"></div>
    `;
}

/**
 * This function returns the template for the default categories.
 * @param {string} categoryName - name of the category
 * @param {string} categoryColor - color of the category
 * @returns 
 */
function defaultCategoryTemplate(categoryName, categoryColor){
    return `
        <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
            <div>${categoryName}</div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        `;
}

/**
 * This function returns the template for the new categories.
 * @param {string} categoryName - name of the category
 * @param {string} categoryColor - color of the category
 * @param {index} i - index of the category
 * @returns 
 */
function newCategoryTemplate(categoryName, categoryColor, i, categoryId){
    return `
        <div class="category" onclick="saveSelectedCategory('${categoryName}', '${categoryColor}'), doNotAdd(event)">
            <div>${categoryName} <img src="./img/delete.svg" onclick="deleteNewCategory(${i}, '${categoryName}', ${categoryId}), doNotAdd(event)">
            </div>
            <div class="circle" style="background: ${categoryColor};"></div>
        </div>
        `;
}

/**
 * This function returns the template for the assigned users placeholder on the create task html.
 * @returns 
 */
function assignToPlaceholderTemplate() {
    return `
        <div class="sectorTop">
            <div id="selectedUsersPlaceholder" class="selectedUsersPlaceholder">
                <div id="assignedToHeader">Select contacts to assign</div>
            </div>
            <img src="./img/Vector 2.png">
        </div>

        <div class="assignedToChoices d-none" id="avatarPicker"></div>
       `;
}

/**
 * This function returns the template for the available users.
 * @param {number} availableUserId - id the of the user
 * @param {string} userColor - color of the user
 * @param {string} firstLetters - first letter of the name and surname
 * @param {string} userName - name of the user 
 * @param {string} userSurname  - surname of the user
 * @returns 
 */
function assignUserTemplate(availableUserId, userColor, firstLetters, userName, userSurname) {
    return `
        <div id="${availableUserId}" class="avatarContainer" onclick="selectUser(${availableUserId}), doNotAdd(event)">
            <div id="icon${availableUserId}"class="avatar" style="background-color: ${userColor};">
                <div>${firstLetters}</div>
            </div>
            <div class="nameText">
                <div>${userName} ${userSurname}</div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template for the selected users in the placeholder container.
 * @param {string} userColor - color of the user
 * @param {string} firstLetters  - first letter of the name and surname
 * @returns 
 */
function selectedUsersPlaceholderTemplate(userColor, firstLetters) {
    return `
        <div class="avatarContainer avatarContainerSelected">
            <div class="avatar avatarSelectedIconPlaceholder" style="background-color: ${userColor};">
                <div>${firstLetters}</div>
            </div>
        </div>
    `;
}

/**
 * This function returns the template of the bubble for the users that are not beeing displayed.
 * @param {number} remainingUsers - number of the remaining users that are not displayed
 * @returns 
 */
function selectedUsersPlaceholderTemplateOthers(remainingUsers) {
    return `
        <div class="avatarContainer avatarContainerSelected">
            <div class="avatar avatarSelectedIconPlaceholder" style="background-color: black;">
                <div style="background-color: white;">+${remainingUsers}</div>
            </div>
        </div>
    `;
}

/* ========================================= CONTACTS TEMPLATES ========================================= */
/**
 * This function returns the template of a contact container in the contact list.
 * @param {index} i - index of the contact
 * @param {string} letter - first letter of the name and surname of the contact
 * @returns 
 */
function contactContainerTemplate(i, letter) {
    return `
        <div id='contactContainer${i}' class="contactContainer">
            <div class="letter">
                <div>${letter}</div>
            </div>
            <div class="contactsHline"></div>
            <div id="sortedContacts${i}" class="sortedContacts">
            </div>
        </div>
    `;
}

/**
 * This function returns the template of a contact in the contact list.
 * @param {index} c - index of the contact
 * @param {string} contactBgColor - color of the contact
 * @param {string} firstLetters - first letter of the name and surname of the contact
 * @param {string} contactListName - name of the contact
 * @param {string} contactListSurname - surname of the contact
 * @param {string} contactEmail - email address of the contact
 * @returns 
 */
function sortedContactsTemplate(c, contactBgColor, firstLetters, contactListName, contactListSurname, contactEmail) {
    return `
        <div id="contactID${c}" class="contact" onclick="openContactInfo(${c})">
            <div>
                <div style="background-color:${contactBgColor};"class="contactIcon">
                    <span>${firstLetters.toUpperCase()}</span>
                </div>
            </div>
            <div>
                <div class="contactName">
                    <span>${contactListName}</span>
                    <span>${contactListSurname}</span>
                </div>
                <a class="contactEmail" href="mailto:${contactEmail}">${contactEmail}</a> 
            </div>
        </div>
    `;
}

/**
 * This function returns the template of the contact information of a selected contact.
 * @param {string} firstLetters - first letter of the name and surname of the contact
 * @param {string} contactInfoName - name of the contact
 * @param {string} contactInfoSurname surname of the contact
 * @param {index} c - index of the contact
 * @param {string} contactInfoEmail - email address of the contact
 * @param {number} contactInfoPhone - phone number of the contact
 * @param {string} contactInfoBgColor - color of the contact
 * @returns 
 */
function contactInfoTemplate(firstLetters, contactInfoName, contactInfoSurname, c, contactInfoEmail, contactInfoPhone, contactInfoBgColor) {
    return `
            <div class="contactDetails" id="contactDetails${c}">
                <div>
                    <div>
                        <div id="contactIconBig${c}" class="contactIconBig" style="background-color: ${contactInfoBgColor};">
                            <span>${firstLetters}</span>
                        </div>
                    </div>
                    <div class="contactDetailsName">
                        <div class="name">
                            <div>
                                <span>${contactInfoName}</span>
                                <span>${contactInfoSurname}</span>
                            </div>
                        </div>
                        <div onclick="initCreateTask(), displayPage('mainAddTaskContainerDisplay'), activeTab('addTask')" class="addTask">
                            <img src="./img/plus.svg"><span>Add Task</span>
                        </div>
                    </div>
                </div>

                <div class="contactInformation">
                    <div>
                        <div class="contactInformationHeader">
                            <div>
                                <span>Contact Information</span>
                            </div>
                            <div class="editContact" onclick="editContact(${c})">
                                <img src="./img/edit.svg">
                                <span>Edit Contact</span>
                            </div>
                        </div>

                        <div class="contactInformationMain">
                            <div>
                                <span>Email</span>
                                <a href="mailto:${contactInfoEmail}">${contactInfoEmail}</a>
                            </div>
                            <div>
                                <span>Phone</span>
                                <a href="tel:${contactInfoPhone}">${contactInfoPhone}</a>
                            </div>
                        </div>

                        <div class="deleteContact">
                            <div onclick="deleteContact(${c})">
                                <span>Delete contact</span>
                                <img src="./img/delete.svg">
                            </div>
                        </div>
        
                    </div>
                   
                </div>
            </div>

        `;
}

/**
 * This function returns the template of the big contact icon of the contact information. 
 * @param {index} i - index of the contact
 * @param {string} firstLetters - first letter of the name and surname of the contact
 * @returns 
 */
function contactBigImgTemplate(i, firstLetters) {
    return `
        <div id="contactImgBg${i}" class="contactImgBg">
            <span>${firstLetters}</span>
        </div>
    `;
}

/**
 * This function returns the template for the edit contact form.
 * @param {index} i - index of the contact
 * @returns 
 */
function saveChangesFormTemplate(i) {
    return `
        <form name="saveChangesForm" onsubmit="saveChanges(${i});return false">
            <div class="inputContainer">
                <div class="inputFieldContainer">
                    <input id="editContactName" class="inputFields" type="text" placeholder="Name" required/>
                    <img src="./img/userIcon.svg" class="img" />
                </div>
            </div>
            <div class="inputContainer">
                <div class="inputFieldContainer">
                    <input id="editContactSurname" class="inputFields" type="text" placeholder="Surname" required/>
                    <img src="./img/userIcon.svg" class="img" />
                </div>
            </div>
            <div class="inputContainer">
                <div class="inputFieldContainer">
                    <input id="editContactEmail" class="inputFields" type="email" placeholder="Email" required/>
                    <img src="./img/letter.svg" class="img" />
                </div>
            </div>
            <div class="inputContainer">
                <div class="inputFieldContainer">
                    <input id="editContactPhone" class="inputFields" type="number" placeholder="Phone"/>
                    <img src="./img/phone.svg" class="img" />
                </div>
            </div>

            <div class="buttons editButton" id="saveChangesButton">
                <button class="createContact" type="submit">  
                    <span>Save</span>
                </button>
            </div>
        </form>
    `;
}


   