"use strict";

/* **************** Connecting Functions **************** */

/**
 * Create a series of dummy events to populate the list with.
 * @return array of all next 20 events, sorted by date
 */
function CreateDummyEvents() {
    alert("Create dummy variables");
    createNewList("Angel", "b", "#8000F", ["twitter.com", "reddit.com"]);
    createNewList("Blue", "b", "#8000F", ["twitter.com", "reddit.com"]);
    createNewList("Seven", "b", "#8000F", ["twitter.com", "reddit.com"]);
    createNewList("Dark", "b", "#8000F", ["twitter.com", "reddit.com"]);
    createNewEvent("ahhhhh", true, "MWF", ["2016 12 24", "2016 12 25"], null, 1400, 1600, "Angel");
    createNewEvent("man", false, null, null, "2016 10 31", 400, 600, "Blue");
    createNewEvent("two", false, null, null, "2016 10 22", 1600, 2200, "Seven");

}

/**
 * Obtain data from the front-end and convert that into a new event
 */
function MEvent() {
    var ename = document.getElementById("eventName").value;
    var inputDate = document.getElementById("inputDate").value;
    inputDate.replace("-", " "); //convert the output into the required format
    var startTime = parseInt(document.getElementById("startTime").value); //assumes 00:00:00 format
    startTime.replace(":", "");
    startTime = startTime.substring(0, 4);
    var endTime = parseInt(document.getElementById("endTime").value); //assumes 00:00:00 format
    endTime.replace(":", "");
    endTime = endTime.substring(0, 4);
    var repeat = document.getElementById("repeat").checked;
    var dates = [document.getElementById("dayM").checked, document.getElementById("dayT").checked, document.getElementById("dayW").checked, 
        document.getElementById("dayR").checked, document.getElementById("dayF").checked, document.getElementById("dayS").checked, 
        document.getElementById("dayN").checked];
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
    createNewEvent(ename, repeat, datestring, [], inputDate, startTime, endTime, null);
}

/**
 * Get the name, date, and time of next twenty events
 * @return array of all next 20 events, sorted by date
 */
function getNextEvents() {
    var nextEvents = getAllEvents();
    if (nextEvents === null || nextEvents === undefined) {
        alert("Unable to get next events - no events to get");
        return;
    }
    var printOut = "";
    var list;
    for (var i = 0; i < nextEvents.length; i ++) {
        list = readExistingEvent(nextEvents[i]);
        if (list.repeat) {
            var stringEvents = stringifyEvent(list.daysRepeated);
            var stringException = stringifyExceptDate(list.exceptionDates);

             printOut += "<div id='futureEvents'>" + list.name + " , " +
            stringEvents+  " , "+ stringException + " , " + list.startTime + " , "
            + list.endTime+"<br></div>";
        } else {
            printOut += "<div id='futureEvents'>" + list.name + " , " +
            list.date + " , " + list.startTime + " , "
            + list.endTime+"<br></div>";
        }
    }
    /*if (next.length() < 20) {
        var max = next.length()
    } else {
        var max = 20;
    }

    var list;
    for (i = 0; i < max ; i += 1) { //ensure that a event with the same name DNE
        list = readExistingList(i)
        var s = next.name + "," + readExistingList.date+"," + nex+"\n";
    }*/
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
    for (var i = 0; i < exceptionDates.length; i+=1) {
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
    var list;
    var printLists= "";
    for (var i = 0; i < allList.length; i+=1) {
        list = readExistingList(allList[i]);
        printLists += "<li role='presentation'><a role='menuitem' tabindex='-1' id="+ list.name +">" + list.name+"</a></li>";
    }
    document.getElementById("testJennifer").innerHTML = printLists;
}
