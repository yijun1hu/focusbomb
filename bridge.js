"use strict";

/* **************** Connecting Functions **************** */

/**
 * Create a series of dummy events to populate the list with.
 * @return array of all next 20 events, sorted by date
 */
function CreateDummyEvents() {
    alert("Create dummy variables");
    createNewList("Angel", "b", "#8000FF", ["twitter.com", "reddit.com"]);
    createNewList("Blue", "b", "#8000FF", ["twitter.com", "reddit.com"]);
    createNewList("Seven", "b", "#8000FF", ["twitter.com", "reddit.com"]);
    createNewList("Dark", "b", "#8000FF", ["twitter.com", "reddit.com"]);
    createNewEvent("ahhhhh", true, "MWF", ["2016 12 24", "2016 12 25"], null, 1400, 1600, "Angel");
    createNewEvent("man", false, null, null, "2016 10 31", 400, 600, "Blue");
    createNewEvent("two", false, null, null, "2016 10 22", 1600, 2200, "Seven");

}

/**
 * Obtain data from the front-end and convert that into a new event
 */
function MEvent() {
    var listChoice = document.getElementById("listsAvailable");
    if (listChoice === null) {
        alert("Please create a new list below!");
    } else {
        var ename = document.getElementById("eventName").value;
        var inputDate = document.getElementById("inputDate").value;
        inputDate.replace("-", " "); //convert the output into the required format
        var sTime = document.getElementById("startTime").value;
        var startTime = convertTime(sTime);
        var eTime = document.getElementById("endTime").value;
        var endTime = convertTime(eTime);
        var repeat = document.getElementById("repeat").checked;
        var dates = [document.getElementById("dayM").checked, document.getElementById("dayT").checked, document.getElementById("dayW").checked,
            document.getElementById("dayR").checked, document.getElementById("dayF").checked, document.getElementById("dayS").checked,
            document.getElementById("dayN").checked];
        var listName = listChoice.options[listChoice.selectedIndex].value;
        var datestring = "";
        var i = 0;
        for (i = 0; i < 7; i += 1) {
            if (dates[i]) {
                if (i === 0) {
                    datestring += "M";
                } else if (i === 1) {
                    datestring += "T";
                } else if (i === 2) {
                    datestring += "W";
                } else if (i === 3) {
                    datestring += "R";
                } else if (i === 4) {
                    datestring += "F";
                } else if (i === 5) {
                    datestring += "S";
                } else if (i === 6) {
                    datestring += "N";
                }
            }
        }
        createNewEvent(ename, repeat, datestring, [], inputDate, startTime, endTime, listName);
    }
}

/**
 * Get the name, date, and time of next twenty events
 * @return array of all next n events, sorted by date
 */
function getNextEvents() {
    var nextEvents = getAllEvents();
    var maxEvent;
    if (nextEvents === null || nextEvents === undefined) {
        console.log("Unable to get next events - no events to get");
        return;
    }

    var max;
    if (nextEvents.length < 5) {
        max = nextEvents.length;
    } else {
        max = 5;
    }

    var printOut = "";
    var list;
    var i;
    for (i = 0; i < max; i ++) {
        list = readExistingEvent(nextEvents[i]);
        if (list.repeat) {
            var stringEvents = stringifyEvent(list.daysRepeated);
            var stringException = stringifyExceptDate(list.exceptionDates);

            printOut += "<div id=" + list.name + ">" + list.name + " , " +
            stringEvents +  " , " + stringException + " , " + list.startTime + " , "
            + list.endTime + " , "+list.listName + "<br></div>";
        } else {
            printOut += "<div id=" + list.name + ">" + list.name + " , " +
            list.date + " , " + list.startTime + " , "
            + list.endTime + " , "+list.listName + "<br></div>";
        }
    }
    document.getElementById("futureEvents").innerHTML = printOut;
}

/**
 * Creates a new list white or black for future events.
 */
function MList() {
    var lname = document.getElementById("listName").value;

    var ccolor = "#cccccc";
    var ttype;
    if (document.getElementById("whitelist").checked) {
        ttype = "w";
    } else {
        ttype = "b";
    }
    var ssites = document.getElementById("listWebsites").value;
    ssites = ssites.replace(/\n/g, " ");
    ssites = ssites.replace(/,/g, " ");
    ssites = ssites.replace(/\s\s+/g, ' ');
    var dividesites = ssites.split(" ");
    createNewList(lname, ttype, ccolor, dividesites);
}

function stringifyEvent(weekEvent) {
    var printWeekEvent = "";
    var unit;
    for (var j = 0; j < weekEvent.length; j += 1) {
        unit = weekEvent.charAt(j);
        if (unit === "M") {
            printWeekEvent += "Mon ";
        } else if (unit === "T") {
             printWeekEvent += "Tues ";
        } else if (unit === "W") {
             printWeekEvent += "Wed ";
        } else if (unit === "R") {
            printWeekEvent += "Thur ";
        } else if (unit === "F") {
             printWeekEvent += "Fri ";
        } else if (unit === "S") {
             printWeekEvent += "Sat ";
        } else if (unit === "N") {
            printWeekEvent += "Sun ";
        }
    }
    return printWeekEvent;
}

function stringifyExceptDate(exceptionDates) {
    var printExceptDate = "[ ";
    var i;
    for (i = 0; i < exceptionDates.length; i += 1) {
        printExceptDate += (exceptionDates[i]);
        if (i != exceptionDates.length - 1) {
            printExceptDate += " , ";
        }
    }
    printExceptDate += " ]";
    return printExceptDate;
}

/**
 * Turn the list object into string form
 */
function stringifyList(inputList) {
    var printList = "";
    printList = inputList.name + " (" + inputList.type + ") [" + inputList.color + "] - ";
    var i = 0;
    for (i = 0; i < inputList.sites.length; i += 1) {
        printList += inputList.sites[i];
        printList += ", ";
    }
    return printList;
}


function previouslyUsedList() {
    var allList = getAllLists();
    if (allList != null) {
        var list;
        var printLists= "";
        for (var i = 0; i < allList.length; i += 1) {
            list = readExistingList(allList[i]);

            printLists += "<option value='" + list.name + "''>" + list.name + "</option>";
        }
        document.getElementById("listsAvailable").innerHTML = printLists;
    }
}

function convertTime (inputTime) {
    var timeSplit = inputTime.split(':');
    var hours = timeSplit[0];
    var minutes = timeSplit[1];
    var strTime = (hours + minutes);
    return strTime;
}
