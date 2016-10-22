"use strict";

/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */



/* **************** CRUD Functions **************** */

/**
 * Create a new event and save it to local storage
 */
function createNewEvent(name, repeat, repeatedDays, daysRepeated, exceptionDates, date, startTime, endTime, listName) {
    var currstorage = JSON.parse(loadLocalStorage("events")); //obtain all currently stored events
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //ensure that a event with the same name DNE
        if (currstorage.events[i].name === name) {
            alert("Failed to create new event - the provided name belongs to a event that already exists. Please choose a different name.");
        }
    }
    var newevent = {
        "name": name,
        "repeat": repeat,
        "repeatedDays": repeatedDays,
        "daysRepeated": daysRepeated,
        "exceptionDates": exceptionDates,
        "date": date,
        "startTime": startTime,
        "endTime": endTime,
        "listName": listName
    };
    currstorage.lists.push(newevent);
    setLocalStorage("events", JSON.stringify(currstorage));
}

/**
 * Read an existing event from local storage
 * @return javascript object referring to
 */
function readExistingEvent(name) {
    var currstorage = JSON.parse(loadLocalStorage("events"));
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //find the specific event
        if (currstorage.events[i].name === name) {
            return currstorage.events[i];
        }
    }
    alert("Failed to read event - the provided name does not match any existing events.");
}

/**
 * Update an existing event from local storage
 */
function updateExistingEvent(name, repeat, repeatedDays, daysRepeated, exceptionDates, date, startTime, endTime, listName) {
    var currstorage = JSON.parse(loadLocalStorage("events"));
    var targeteventindex = -1;
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //find the specific list
        if (currstorage.events[i].name === name) {
            targetleventindex = i;
        }
    }
    if (targeteventindex === -1) {
        alert("Failed to update event - the provided name does not match any existing events.");
    } else {
        var newevent = {
            "name": name,
            "repeat": repeat,
            "repeatedDays": repeatedDays,
            "daysRepeated": daysRepeated,
            "exceptionDates": exceptionDates,
            "date": date,
            "startTime": startTime,
            "endTime": endTime,
            "listName": listName
        };
        currstorage.events.push(newevent);
        setLocalStorage("events", JSON.stringify(currstorage));
    }
}

/**
 * Delete an existing event from local storage
 */
function deleteExistingEvent(name) {
    var currstorage = JSON.parse(loadLocalStorage("events"));
    var found = false;
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //find the specific list
        if (currstorage.events[i].name === name) {
            currstorage.events = array.splice(i, 1); //remove the specific list
            found = true;
        }
    }
    if (!found) {
        alert("Failed to delete event - the provided name does not match any existing events.");
    } else {
        setLocalStorage("events", JSON.stringify(currstorage));
    }
}

/**
 * Create a new list and save it to local storage
 */
function createNewList(name, type, color, sites) {
    var currstorage = JSON.parse(loadLocalStorage("lists")); //obtain all currently stored lists
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i += 1) { //ensure that a list with the same name DNE
        if (currstorage.lists[i].name === name) {
            alert("Failed to create new list - the provided name belongs to a list that already exists. Please choose a different name.");
        }
    }
    var newlist = {
        "name": name,
        "type": type,
        "color": color,
        "sites": sites
    };
    currstorage.lists.push(newlist);
    setLocalStorage("lists", JSON.stringify(currstorage));
}

/**
 * Read an existing list from local storage
 * @return javascript object referring to 
 */
function readExistingList(name) {
    var currstorage = JSON.parse(loadLocalStorage("lists"));
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i += 1) { //find the specific list
        if (currstorage.lists[i].name === name) {
            return currstorage.lists[i];
        }
    }
    alert("Failed to read list - the provided name does not match any existing lists.");
}

/**
 * Update an existing list from local storage
 */
function updateExistingList(name, type, color, sites) {
    var currstorage = JSON.parse(loadLocalStorage("lists"));
    var targetlistindex = -1;
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i += 1) { //find the specific list
        if (currstorage.lists[i].name === name) {
            targetlistindex = i;
        }
    }
    if (targetlistindex === -1) {
        alert("Failed to update list - the provided name does not match any existing lists.");
    } else {
        var newlist = {
            "name": name,
            "type": type,
            "color": color,
            "sites": sites
        };
        currstorage.lists[targetlistindex] = newlist;
        setLocalStorage("lists", JSON.stringify(currstorage));
    }
}

/**
 * Delete an existing list from local storage
 */
function deleteExistingList(name) {
    var currstorage = JSON.parse(loadLocalStorage("lists"));
    var found = false;
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i += 1) { //find the specific list
        if (currstorage.lists[i].name === name) {
            currstorage.lists = array.splice(i, 1); //remove the specific list
            found = true;
        }
    }
    if (!found) {
        alert("Failed to delete list - the provided name does not match any existing lists.");
    } else {
        setLocalStorage("lists", JSON.stringify(currstorage));
    }
}


/* **************** Helper Functions **************** */

/**
 * See if the browser supports local storage
 * @return true if supported, false otherwise
 */
function checkBrowserCompatibility() {
    return typeof(Storage) !== "undefined";
}

/**
 * Set local storage with given key-value pair
 */
function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Obtain value in local storage with given key
 */
function loadLocalStorage(key) {
    return localStorage.getItem(key);
}