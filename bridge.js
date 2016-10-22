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
    if (next.length() < 20) {
        var max = next.length()
    } else {
        var max = 20;
    }
    for (i = 0; i < max ; i += 1) { //ensure that a event with the same name DNE
        var s = next.name + "," + next.date+"\n";
        document.getElementById("upcoming").innerHTML += s;
    }
   
}

