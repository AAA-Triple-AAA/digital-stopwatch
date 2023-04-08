const bg = document.querySelector(".bg");
const changeBGButton = document.querySelector("#change-bg");
const root = document.querySelector(":root");

// Stopwatch timer control buttons
const startStop = document.querySelector("#start-stop-button");
const splitButton = document.querySelector("#split-button");
const resetButton = document.querySelector("#reset-button");

// Individual time digits
const milliText = document.querySelector("#m-secs");
const secondsText = document.querySelector("#sec");
const minsText = document.querySelector("#min");
const hoursText = document.querySelector("#hour");

// Split Interval List
const timeContainer = document.querySelector(".times-container");
const timesList = document.querySelector(".times");
const clearTimesButton = document.querySelector(".clear-button");

// Copy Elements
const copyButton = document.querySelector(".copy");
const copyMessage = document.querySelector(".copy-message");
const copyText = document.querySelector(".copied-text");

// General stop watch variables
let startTime;
let elapsedTime = 0; // stop time - start time
let minuteCount = 0;
let hourCount = 0;
let firstRun = true;
let isRunning = false;
let stopWatchInterval;
let lastSnapshot;

// Event Functions
function startStopwatch(e) {
    if (e.target.textContent === "STOP") {
        stopStopwatch();
        elapsedTime = new Date().getTime() - startTime + elapsedTime;
        isRunning = false;
        e.target.textContent = "START";
        e.target.style.backgroundColor = "green";
        e.target.style.color = "black";
    } else {
        startTime = new Date().getTime();
        e.target.textContent = "STOP";
        e.target.style.backgroundColor = "red";
        e.target.style.color = "black";
        if (firstRun) {
            lastSnapshot = startTime;
        }
        isRunning = true;
        firstRun = false;
        stopWatchInterval = setInterval(updateStopwatch, 1);
    }
}

function stopStopwatch() {
    clearInterval(stopWatchInterval);
}

function updateStopwatch() {
    // Get the latest millisecond information
    let getMilli = milliseconds();

    // Display milliseconds
    let milli = "" + getMilli;
    milli = milli.slice(-3); // Takes the last 3 digits
    milliText.textContent = milli;

    // Display seconds
    let seconds = Math.floor(getMilli / 1000) - minuteCount * 60;
    seconds = `${seconds < 10 ? "0" : ""}${seconds}`;
    secondsText.textContent = seconds;

    let minutes = Math.floor(getMilli / 60000) - hourCount * 60;
    minutes = `${minutes < 10 ? "0" : ""}${minutes}`;
    minsText.textContent = minutes;

    let hours = Math.floor(getMilli / 3600000);
    hours = `${hours < 10 ? "0" : ""}${hours}`;
    hoursText.textContent = hours;

    if (seconds > 59) {
        minuteCount++;
    }
    if (minutes > 59) {
        hourCount++;
    }
    if (hours > 99) {
        stopStopwatch();
    }
}

function milliseconds() {
    let date = new Date();
    let currTime = date.getTime() + elapsedTime - startTime;
    return currTime;
}

// Function to reset all variables and time displayed
function reset() {
    if (!isRunning) {
        stopStopwatch();
        clearTimes();
        elapsedTime = 0;
        minuteCount = 0;
        hourCount = 0;
        firstRun = true;
        milliText.textContent = "000";
        secondsText.textContent = "00";
        minsText.textContent = "00";
        hoursText.textContent = "00";
    }
}

// Function to add an interval of time using the yellow split button
function addTime() {
    if (isRunning) {
        timeContainer.style.display = "block";

        let timeSnapshot = new Date().getTime();
        let interval = timeSnapshot - lastSnapshot;
        let intervalDisplay = generateIntervalDisplay(interval);
        lastSnapshot = timeSnapshot;

        let listItem = document.createElement("li");
        listItem.textContent = intervalDisplay;
        listItem.classList.add("list-item");

        timesList.append(listItem);

        scrollToBottom();

        return intervalDisplay;
    }
}

function generateIntervalDisplay(interval) {
    let milliInterval = interval;
    if (milliInterval > 99) {
        milliInterval = "" + milliInterval;
        milliInterval = milliInterval.slice(-3);
    }
    if (milliInterval < 10) {
        milliInterval = "00" + milliInterval;
    } else if (milliInterval < 100) {
        milliInterval = "0" + milliInterval;
    }

    // SAFEGUARD CONDITION
    if (milliInterval.length > 3) {
        milliInterval = milliInterval.slice(-3);
    }

    let secondInterval = Math.floor(interval / 1000);
    secondInterval = `${secondInterval < 10 ? "0" : ""}${secondInterval}`;

    let minuteInterval = Math.floor(interval / 60000);
    minuteInterval = `${minuteInterval < 10 ? "0" : ""}${minuteInterval}`;

    let hourInterval = Math.floor(interval / 3600000);
    hourInterval = `${hourInterval < 10 ? "0" : ""}${hourInterval}`;

    // 00:00:00.000
    return `${hourInterval}:${minuteInterval}:${secondInterval}.${milliInterval}`;
}

// Clear button function
function clearTimes() {
    timesList.innerHTML = "";
    timeContainer.style.display = "none";
}

// Change Background Function
function changeBG() {
    // If at the last background in array, change to the first
    const r = Math.floor(Math.random() * 196) + 59;
    const g = Math.floor(Math.random() * 196) + 59;
    const b = Math.floor(Math.random() * 196) + 59;
    bg.style.background = `rgb(${r}, ${g}, ${b})`;
    root.style.setProperty("--bg-color", `rgb(${r}, ${g}, ${b})`);
}

// Hover functionality for start and stop button
function changeButtonColor(e) {
    if (e.type === "mousemove") {
        if (e.target.textContent === "START") {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "green";
        } else {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "red";
        }
    } else {
        if (e.target.textContent === "START") {
            e.target.style.backgroundColor = "green";
            e.target.style.color = "black";
        } else {
            e.target.style.backgroundColor = "red";
            e.target.style.color = "black";
        }
    }
}

// Function to copy time shown on stopwatch to clipboard (taken from: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp)
function copy() {
    let value = `${hoursText.textContent}:${minsText.textContent}:${secondsText.textContent}.${milliText.textContent}`;

    navigator.clipboard.writeText(value);

    copyMessage.style.display = "inline";
    copyText.textContent = value;

    // Message is removed after 2 seconds
    setTimeout(removeCopyMessage, 2000);
}

function removeCopyMessage() {
    copyMessage.style.display = "none";
    copyText.textContent = "";
}

// Function to keep the split time list at the bottom
const scrollToBottom = () => {
    timeContainer.scrollTo(0, timesList.children.length * 31);
};

changeBG();

// Event Listeners
changeBGButton.addEventListener("click", changeBG, 100);

startStop.addEventListener("click", startStopwatch);
startStop.addEventListener("mousemove", changeButtonColor);
startStop.addEventListener("mouseout", changeButtonColor);

resetButton.addEventListener("click", reset);
splitButton.addEventListener("click", addTime);
clearTimesButton.addEventListener("click", clearTimes);
copyButton.addEventListener("click", copy);
