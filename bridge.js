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
    createNewEvent("name", true, "MWF", ["2016 12 24"], null, 1400, 1600, "Angel");
    createNewEvent("man", false, null, null, "2016 10 31", 400, 600, "Blue");
    createNewEvent("two", false, null, null, "2016 10 22", 1600, 2200, "Seven");

}

/**
 * Get the name, date, and time of next twenty events
 * @return array of all next 20 events, sorted by date
 */
function getNextEvents() {
    var next = getAllEvents();
    if (next.length() < 5) {
        var max = next.length()
    } else {
        var max = 5;
    }
    for (i = 0; i < max ; i += 1) { //ensure that a event with the same name DNE
        var s = next.name + "," + next.date+"\n";
        document.getElementById("upcoming").innerHTML += s;
    }
   
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
 * Creates a new list white or black for future events.
 */
function MList() {
    var lname = document.getElementById("listName").value;
    var ccolor = "#cccccc";
    if (document.getElementById("whitelist").value) {
        var ttype = "w";
    } else {
        var ttype = "b";
    }
    var ssites = document.getElementById("listWebsites").value;
    ssites = ssites.replace(/\n/g, " ");
    ssites = ssites.replace(/,/g, " ");
    var dividesites = ssites.split(" ");
    createNewList(lname, ttype, ccolor, dividesites);

}
