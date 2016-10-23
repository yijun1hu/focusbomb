"use strict";

/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */

/**
 * Block a tab by replacing it with a sample HTML page. Based off of tetsuwo's code
 * @param id the id of the current tab
 * @param url the url on the current tab, which is currently blocked
 */
function blockPage(id, url) {
    var redirect = chrome.extension.getURL("blocked.html") + "?url=" + encodeURIComponent(url);
    chrome.tabs.update(id, {url: redirect});
}

/**
 * Determine whether or not the given page is blocked (i.e. in an ongoing blacklist, not in an ongoing whitelist)
 */
function determineIsBlocked(url) {
    var events = getAllEvents();
    var i;
    var list;
    for (i = 0; i < events.length; i += 1) { //see all filters to see if there is a violation
        list = readExistingList(events[i].listName); //gets the list object for the filter
        if ((list.type === "b" && list.sites.contains(url)) || (list.type === "w" && !list.sites.contains(url))) {
            return determineIsEventOngoing(events[i]); //checks the time slot for violations
        }
    }
    return false;
}

/**
 * Determine whether or not the current date is within a event's date range
 */
function determineIsEventOngoing(nextevent) {
    var d = new Date(); //Get current date and time
    var dateSTART;
    var dateEND;
    var eventmonthdate;
    if (nextevent.repeat) {
        //determine the start and end dates.
        eventmonthdate = getRepeatingEventMonthDate(d, nextevent);
        dateSTART = "" + d.getYear() + " " + zerofillTwoDigits(eventmonthdate[0]) + "" + zerofillTwoDigits(eventmonthdate[1]) + nextevent.startTime;
        dateEND = "" + d.getYear() + " " + zerofillTwoDigits(eventmonthdate[0]) + "" + zerofillTwoDigits(eventmonthdate[1]) + nextevent.endTime;
    } else {
        dateSTART = new Date(parseInt(nextevent.date.substring(0, 4)), parseInt(nextevent.date.substring(5, 7)), parseInt(nextevent.date.substring(8, 10)), parseInt(nextevent.beginTime.substring(0, 2)), parseInt(nextevent.beginTime.substring(2, 4)), 0, 0);
        dateEND = new Date(parseInt(nextevent.date.substring(0, 4)), parseInt(nextevent.date.substring(5, 7)), parseInt(nextevent.date.substring(8, 10)), parseInt(nextevent.endTime.substring(0, 2)), parseInt(nextevent.endTime.substring(2, 4)), 0, 0);
    }
    return dateSTART < d && d < dateEND;
}

/**
 * Get the names of all events
 * @return array of all event names, sorted by date
 */
function getAllEvents() {
    var d = new Date();
    var currYear = d.getYear();
    var currstorage = JSON.parse(loadLocalStorage("events")); //obtain all currently stored events
    if (currstorage === null) {
        alert("Failed to get events - there are no events in the system. Please consider adding an event.");
        return;
    }
    var toSort = [];
    var i = 0; //event counter
    var nextevent;
    var eventmonthdate;
    var newDateSTRING; //string for the exact date of the start of an event
    var s; //insertion sort counter
    var t; //insertion sort counter
    var temp; //insertion sort temp variable
    for (i = 0; i < currstorage.events.length; i += 1) { //ensure that a event with the same name DNE
        //for sorting purposes, repeated events use next non-exception dates
        nextevent = currstorage.events[i];
        if (nextevent.repeat) {
            eventmonthdate = getRepeatingEventMonthDate(d, nextevent);

            //Generate the date string for comparison
            newDateSTRING = "" + currYear + " " + zerofillTwoDigits(eventmonthdate[0]) + "" + zerofillTwoDigits(eventmonthdate[1]) + nextevent.startTime;

            //Finally, push to the toSort array
            toSort.push({name: nextevent.name, date: newDateSTRING});

        } else {
            //Date of the event
            newDateSTRING = nextevent.date + "" + nextevent.startTime;
            toSort.push({name: nextevent.name, date: newDateSTRING});
        }

        //now do the sort. Insertion Sort.
        for (s = 1; s < toSort.length; s += 1) {
            temp = toSort[s];
            t = s - 1;
            while (t >= 0 && toSort[t].date > temp.date) {
                toSort[t + 1] = toSort[t];
                t = t - 1;
            }
            toSort[t + 1] = temp;
        }
    }

    var toreturn = [];
    for (i = 0; i < toSort.length; i += 1) {
        toreturn.push(toSort[i].name);
    }
    return toreturn;
}

/**
 * Using current date, determine the month and date of the next occurance of a repeating event
 * @return array consisting of month and day (date) of the event's next occurance
 */
function getRepeatingEventMonthDate(d, nextevent) {
    var currDay = d.getDay(); //0 is Sunday, 6 is Saturday
    var currYear = d.getYear();
    var currMonth = d.getMonth();
    var currDate = d.getDate();
    var currHour = d.getHours();
    var currMinutes = d.getMinutes();
    var currtime = "" + currHour.toString() + currMinutes.toString();
    //First, find the difference between the current day of the week and the next scheduled repeat event
    var eventdays = nextevent.daysRepeated;
    var ddate = 0; //number of days difference between today and the next occurance of the event
    var matchingindex = -1; //in the case that the event takes place on the current day, this will match the index. I.E. Today is Wednesday, daysrepeated is MTWS, matchingindex = 2 for W.
    var j;
    var unit; //the specific day of the week identifier currently chosen
    for (j = 0; j < eventdays.length; j += 1) { //for every day it repeats
        unit = eventdays.charAt(j); // get the value and test
        //test: if the event occurs on a given day, ensure that the edge case where the event has already passed is caught
        if (unit === "M") {
            ddate = Math.min(ddate, (0 - currDay) % 7);
            if ((0 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "T") {
            ddate = Math.min(ddate, (1 - currDay) % 7);
            if ((1 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "W") {
            ddate = Math.min(ddate, (2 - currDay) % 7);
            if ((2 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "R") {
            ddate = Math.min(ddate, (3 - currDay) % 7);
            if ((3 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "F") {
            ddate = Math.min(ddate, (4 - currDay) % 7);
            if ((4 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "S") {
            ddate = Math.min(ddate, (5 - currDay) % 7);
            if ((5 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        } else if (unit === "N") {
            ddate = Math.min(ddate, (6 - currDay) % 7);
            if ((6 - currDay) % 7 === 0) {
                matchingindex = j;
            }
        }
    }

    var nextoccurance; //the character for the day of the week of the next occurance of the event
    var nextoccurancenum; //the day ID of the next occurance of the event after the current day

    //edge case where event is currently happening or happened earlier today
    if (currtime > nextevent.startTime && matchingindex > -1) {
        nextoccurance = eventdays.charAt((matchingindex + 1) % eventdays.length);
        nextoccurancenum = 0;
        if (nextoccurance === "M") {
            nextoccurancenum = 0;
        } else if (nextoccurance === "T") {
            nextoccurancenum = 1;
        } else if (nextoccurance === "W") {
            nextoccurancenum = 2;
        } else if (nextoccurance === "R") {
            nextoccurancenum = 3;
        } else if (nextoccurance === "F") {
            nextoccurancenum = 4;
        } else if (nextoccurance === "S") {
            nextoccurancenum = 5;
        } else if (nextoccurance === "N") {
            nextoccurancenum = 6;
        }
        ddate = (nextoccurancenum - currDay) % 7;
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

    return [eventmonth, eventdate];
}

/* **************** CRUD Functions **************** */

/**
 * Create a new event and save it to local storage
 */
function createNewEvent(name, repeat, daysRepeated, exceptionDates, date, startTime, endTime, listName) {
    var currstorage = JSON.parse(loadLocalStorage("events")); //obtain all currently stored events
    if (endTime < startTime) {
        alert("Failed to create new event - end time occurs before start time.");
        return;
    }
    if (currstorage !== null) {
        var i = 0;
        for (i = 0; i < currstorage.events.length; i += 1) { //ensure that a event with the same name DNE
            if (currstorage.events[i].name === name) {
                alert("Failed to create new event - the provided name belongs to a event that already exists. Please choose a different name.");
                return;
            }
        }
    } else {
        currstorage = {events: []};
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
    currstorage.events.push(newevent);
    setLocalStorage("events", JSON.stringify(currstorage));
}

/**
 * Read an existing event from local storage
 * @return javascript object referring to
 */
function readExistingEvent(name) {
    var currstorage = JSON.parse(loadLocalStorage("events"));
    if (currstorage === null) {
        alert("Failed to read event - there are no events in the system. Please consider adding an event.");
        return;
    }
    var i = 0;
    for (i = 0; i < currstorage.events.length; i += 1) { //find the specific event
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
    if (currstorage === null) {
        alert("Failed to update events- there are no events in the system. Please consider adding an event.");
        return;
    }
    var targeteventindex = -1;
    var i = 0;
    for (i = 0; i < currstorage.events.length; i += 1) { //find the specific list
        if (currstorage.events[i].name === name) {
            targeteventindex = i;
            break;
        }
    }
    if (targeteventindex === -1) {
        alert("Failed to update event - the provided name does not match any existing events.");
        return;
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
    if (currstorage === null) {
        alert("Failed to delete event - there are no events in the system. Please consider adding an event.");
        return;
    }
    var found = false;
    var i = 0;
    for (i = 0; i < currstorage.events.length; i += 1) { //find the specific list
        if (currstorage.events[i].name === name) {
            currstorage.events = array.splice(i, 1); //remove the specific list
            found = true;
        }
    }
    if (!found) {
        alert("Failed to delete event - the provided name does not match any existing events.");
        return;
    } else {
        setLocalStorage("events", JSON.stringify(currstorage));
    }
}

/**
 * Create a new list and save it to local storage
 */
function createNewList(name, type, color, sites) {
    var currstorage = JSON.parse(loadLocalStorage("lists")); //obtain all currently stored lists
    if (currstorage !== null) {
        var i = 0;
        for (i = 0; i < currstorage.lists.length; i += 1) { //ensure that a list with the same name DNE
            if (currstorage.lists[i].name === name) {
                alert("Failed to create new list - the provided name belongs to a list that already exists. Please choose a different name.");
            }
        }
    } else {
        currstorage = {lists: []};
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
    if (currstorage === null) {
        alert("Failed to read list - there are no lists in the system. Please consider adding an list.");
        return;
    }
    var i = 0;
    for (i = 0; i < currstorage.lists.length; i += 1) { //find the specific list
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
    if (currstorage === null) {
        alert("Failed to update list - there are no lists in the system. Please consider adding an list.");
        return;
    }
    var targetlistindex = -1;
    var i = 0;
    for (i = 0; i < currstorage.lists.length; i += 1) { //find the specific list
        if (currstorage.lists[i].name === name) {
            targetlistindex = i;
            break;
        }
    }
    if (targetlistindex === -1) {
        alert("Failed to update list - the provided name does not match any existing lists.");
        return;
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
    if (currstorage === null) {
        alert("Failed to delete list - there are no lists in the system. Please consider adding an list.");
        return;
    }
    var found = false;
    var i = 0;
    for (i = 0; i < currstorage.lists.length; i += 1) { //find the specific list
        if (currstorage.lists[i].name === name) {
            currstorage.lists = array.splice(i, 1); //remove the specific list
            found = true;
        }
    }
    if (!found) {
        alert("Failed to delete list - the provided name does not match any existing lists.");
        return;
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

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}