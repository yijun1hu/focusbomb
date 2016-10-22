/* **************** Setup Functions **************** */



/* **************** Feature Functions **************** */



/* **************** Helper Functions **************** */

function setSessionStorage(String key, String value) {
    localStorage.setItem(key, value);
}

function loadSessionStorage(String key) {
    return localStorage.getItem(key);
}