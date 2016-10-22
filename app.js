/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */

/**
 * Create a new list and save it to local storage
 */
function createNewList(String name, String type, String color, String[] sites) {
    var currstorage = JSON.parse(loadLocalStorage("lists")); //obtain all currently stored lists
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i++) { //ensure that a list with the same name DNE
        if (currstorage.lists[i].name === name) {
            alert("Failed to create new list - the provided name belongs to a list that already exists. Please choose a different name.");
        }
    }
    var newlist = {
        "name" : name,
        "type" : type,
        "color" : color,
        "sites" : sites
    };
    currstorage.lists.push(newlist);
    setLocalStorage("lists", JSON.stringify(currstorage));
}

/**
 * Read an existing list from local storage
 * @return javascript object referring to 
 */
function readExistingList(String name) {
    var currstorage = JSON.parse(loadLocalStorage("lists"));
    var i = 0;
    for (i = 0; i < currstorage.lists.length(); i++) { //find the specific list
        if (currstorage.lists[i].name === name) {
            return currstorage.lists[i];
        }
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
function setLocalStorage(String key, String value) {
    localStorage.setItem(key, value);
}

/**
 * Obtain value in local storage with given key
 */
function loadLocalStorage(String key) {
    return localStorage.getItem(key);
}