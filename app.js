"use strict";

/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */

/**
 * Get the names of all events
 * @return array of all event names, sorted by date
 */
function getAllEvents() {
    var d = new Date();
    var currTimeSTRING = "" + d.getFullYear().toString() + " " + d.getMonth().toString() + " " + d.getDate().toString() + " " + d.getHours().toString() + d.getMinutes().toString();
    var currDay = currTime.getDay(); //0 is Sunday, 6 is Saturday
    var currMonth = d.getMonth();
    var currDate = d.getDate();
    var currYear = d.getYear();
    var currHour = d.getHours();
    var currMinutes = d.getMinutes();
    var currtime = "" + currHour.toString() + currMinutes.toString();
    var currstorage = JSON.parse(loadLocalStorage("events")); //obtain all currently stored events
    var toSort = [];
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //ensure that a event with the same name DNE
        //for sorting purposes, repeated events use next non-exception dates
        var nextevent = currstorage.events[i];
        if (nextevent.repeat) {
            //First, find the difference between the current day of the week and the next scheduled repeat event
            var eventdays = nextevent.daysRepeated;
            var ddate = 0; //number of days difference
            var j;
            for (j = 0; j < eventdays.length(); j += 1) { //for every day it repeats
                var unit = eventdays.charAt(j); // get the value and test
                //test: if the event occurs on a given day, 
                if (unit === "M") {
                    ddate = Math.min(ddate, (0 - currDay) % 7);
                } else if (unit === "T") {
                    ddate = Math.min(ddate, (1 - currDay) % 7);
                } else if (unit === "W") {
                    ddate = Math.min(ddate, (2 - currDay) % 7);
                } else if (unit === "R") {
                    ddate = Math.min(ddate, (3 - currDay) % 7);
                } else if (unit === "F") {
                    ddate = Math.min(ddate, (4 - currDay) % 7);
                } else if (unit === "S") {
                    ddate = Math.min(ddate, (5 - currDay) % 7);
                } else if (unit === "N") {
                    ddate = Math.min(ddate, (6 - currDay) % 7);
                }
            }
            //Then, adjust months and days (dates) based off of leap years and month transitions.
            var eventmonth = currMonth;
            var eventdate = currDate;

            if ((currMonth === 1 || currMonth === 3 || currMonth === 5 || currMonth === 7 || currMonth === 8 || currMonth === 10 || currMonth === 12) && currDate + ddate > 31) {
                eventmonth += 1;
                eventdate = (eventdate + ddate) % 31;
            } else if ((currMonth === 4 || currMonth === 6 || currMonth === 9 || currMonth === 11) && currDate + ddate > 30) {
                eventmonth += 1;
                eventdate = (eventdate + ddate) % 39;
            } else if (currMonth === 2 && currYear % 4 === 0 && currDate + ddate > 29) {
                eventmonth += 1;
                eventdate = (eventdate + ddate) % 29;
            } else if (currMonth === 2 && currYear % 4 !== 0 && currDate + ddate > 28) {
                eventmonth += 1;
                eventdate = (eventdate + ddate) % 28;
            }

            //Generate the date string for comparison
            var newDateSTRING = "" + currYear + " " + zerofillTwoDigits(eventmonth) + "" + zerofillTwoDigits(eventdate) + nextevent.startTime;

            //Finally, push to the toSort array
            toSort.push({name: nextevent.name, date: newDateSTRING});

        } else {
            //Date of the event
            var newDateSTRING = nextevent.date + "" + nextevent.startTime;
            toSort.push({name: nextevent.name, date: newDateSTRING});
        }

        //now do the sort
        
    }

}

/* **************** CRUD Functions **************** */

/**
 * Create a new event and save it to local storage
 */
function createNewEvent(name, repeat, daysRepeated, exceptionDates, date, startTime, endTime, listName) {
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
function updateExistingEvent(name, repeat, daysRepeated, exceptionDates, date, startTime, endTime, listName) {
    var currstorage = JSON.parse(loadLocalStorage("events"));
    var targeteventindex = -1;
    var i = 0;
    for (i = 0; i < currstorage.events.length(); i += 1) { //find the specific list
        if (currstorage.events[i].name === name) {
            targeteventindex = i;
            break;
        }
    }
    if (targeteventindex === -1) {
        alert("Failed to update event - the provided name does not match any existing events.");
    } else {
        var newevent = {
            "name": name,
            "repeat": repeat,
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
            break;
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

/**
 * Zerofill an integer with 2 digits and output the result as a string
 */
function zerofillTwoDigits(input) {
    return ("00" + input).slice(-2);
}