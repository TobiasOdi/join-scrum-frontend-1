/* =============================== SUMMARY FUNCTIONS =================================== */
/**
 * This function runs all the counter functions for the summary.
 */
function counters() {
    taskCounter();
    inProgressCounter();
    awaitingFeedbackCounter();
    urgentCounter();
    deadlineDate();
    todoCounter();
    doneCounter();
    greeting();
    displayUserName();
    activeTab('summary');
}

/**
 * This function counts how many task there are.
 */
function taskCounter() {
    let taskCounter = tasks.length;
    document.getElementById("taskCounter").innerHTML = `
    ${taskCounter}
    `;
}

/**
 * This functions counts how many tasks are in the category "toDo".
 */
function todoCounter() {
    let toDoCounter = tasks.filter(t => t["statusCategory"] == "toDo");
    toDoCounter = toDoCounter.length;
    document.getElementById("todoCounter").innerHTML = `${toDoCounter}`;
}

/**
 * This functions counts how many tasks are in the category "inProgress".
 */
function inProgressCounter() {
    let inProgressCounter = tasks.filter(t => t["statusCategory"] == "inProgress");
    inProgressCounter = inProgressCounter.length;
    document.getElementById("inProgressCounter").innerHTML = `
    ${inProgressCounter}
    `;
}

/**
 * This functions counts how many tasks are in the category "awaitingFeedback".
 */
function awaitingFeedbackCounter() {
    let awaitingFeedbackCounter = tasks.filter(t => t["statusCategory"] == "awaitingFeedback");
    awaitingFeedbackCounter = awaitingFeedbackCounter.length;
    document.getElementById("awaitingFeedbackCounter").innerHTML = `
    ${awaitingFeedbackCounter}
    `;
}

/**
 * This functions counts how many tasks are in the category "done".
 */
function doneCounter() {
    let doneCounter = tasks.filter(t => t["statusCategory"] == "done");
    doneCounter = doneCounter.length;
    document.getElementById("doneCounter").innerHTML = `
    ${doneCounter}
    `;
}

/**
 * This functions counts how many tasks are urgent.
 */
function urgentCounter() {
    let urgentCounter = tasks.filter(t => t["priorityValue"] == "urgent");
    urgentCounter = urgentCounter.length;
    document.getElementById("urgentCounter").innerHTML = `
    ${urgentCounter}
    `;
}

/**
 * This function returns the most urgent deadline.
 * @returns 
 */
function deadlineDate() {
    let sortedDueDate = tasks
        .filter((t) => t.due_date)
        .map((t) => new Date(t.due_date))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());
    
    if (sortedDueDate.length === 0) {
        // console.log("No valid due dates found.");
        return;
    }
    let currentDate = new Date();
    let closestDate = sortedDueDate.reduce((a, b) => Math.abs(b - currentDate) < Math.abs(a - currentDate) ? b : a);
    let closestDateString = closestDate.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
    document.getElementById("deadlineDate").innerHTML = closestDateString;
}

/**
 * This function displays the greeting depending on the current time.
 */
function greeting() {
    let currentdate = new Date();
    let datetime = currentdate.getHours();
    let greeting = "Good morning,";
    if (datetime > 12) {
        greeting = "Good evening,";
    }
    document.getElementById("greeting").innerHTML = `
    ${greeting}
    `;
}

/**
 * This function displays the user name of the logen in user.
 */
function displayUserName() {
    let userName = localStorage.getItem("userName");
    let abbreviatedName = abbreviateName(userName, 10);

    if (userName == undefined) {
        document.getElementById("userName").innerHTML = 'Guest';

    } else {
        document.getElementById("userName").innerHTML = `
        ${abbreviatedName}
        `;
    }
}

/**
 * This function cuts the displayed name of the user if it is too long.
 * @param {string} name - name of the user
 * @param {number} maxLength - number of the allowed characters
 * @returns 
 */
function abbreviateName(name, maxLength) {
    if (name.length <= maxLength) {
        return name;
    } else {
        let words = name.split(' ');
        let firstWord = words[0];
        let secondWordInitial = words[1].charAt(0);
        return `${firstWord} ${secondWordInitial}.`;
    }
}
