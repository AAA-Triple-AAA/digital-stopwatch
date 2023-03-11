// Image Information
let imageIndex = 0;
const imageArray = [
    "../images/mountain-climbing.jpg",
    "../images/track-and-field.jpg",
];
const bgImage = document.querySelector(".bg-img");

// Target buttons
const startStop = document.querySelector("#start-stop-button");
const splitButton = document.querySelector("#split-button");
const resetButton = document.querySelector("#reset-button");
const changeBGButton = document.querySelector("#change-bg");

// Target individual clock elements
const clock = document.querySelector(".clock");

const milliText = document.querySelector("#m-secs");
const secondsText = document.querySelector("#sec");
const minsText = document.querySelector("#min");
const hoursText = document.querySelector("#hour");

// Time variables
let startTime;
let elapsedTime = 0;
let minuteCount = 0;
let hourCount = 0;
let stopWatchInterval;

// Event Functions
function startStopwatch(e) {
    if (e.target.textContent === "STOP") {
        stopStopwatch();
        elapsedTime = new Date().getTime() - startTime + elapsedTime;
        e.target.textContent = "START";
        e.target.style = "background-color: green;";
    } else {
        e.target.textContent = "STOP";
        e.target.style.backgroundColor = "red";
        startTime = new Date().getTime();
        stopWatchInterval = setInterval(updateStopwatch, 1);
    }
}

function stopStopwatch() {
    clearInterval(stopWatchInterval);
}

function updateStopwatch() {
    let getMilli = milliseconds();

    // Display milliseconds
    let milli = "" + getMilli;
    milli = milli.slice(-3);
    milliText.textContent = milli;

    // Display seconds
    let seconds = "" + Math.floor(getMilli / 1000) - minuteCount * 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    secondsText.textContent = seconds;

    let minutes = "" + Math.floor(getMilli / 60000) - hourCount * 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    minsText.textContent = minutes;

    let hours = "" + Math.floor(getMilli / 3600000);
    if (hours < 10) {
        hours = "0" + hours;
    }
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

// Change Background Function
function changeBG() {
    // If at the last background in array, change to the first
    if (imageIndex === imageArray.length - 1) {
        imageIndex = 0;
    } else {
        imageIndex++;
    }
    bgImage.style.backgroundImage = `url(${imageArray[imageIndex]})`;
}

// Event Listeners
changeBGButton.addEventListener("click", changeBG);
startStop.addEventListener("click", startStopwatch);
