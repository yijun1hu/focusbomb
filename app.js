"use strict";

/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */

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