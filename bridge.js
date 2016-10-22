"use strict";

/* **************** Connecting Functions **************** */

/**
 * Create a series of dummy events to populate the list with.
 * @return array of all next 20 events, sorted by date
 */
function CreateDummyEvents() {
    createNewList("Angel", "b", "#8000F", ["twitter.com", "reddit.com"]);
    createNewEvent("name", true, "MWF", ["2016 12 24"], null, 1400, 1600, "Angel");
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

