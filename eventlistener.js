// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submit-newlist').addEventListener('click', newListHandler);
    document.getElementById('submit-newevent').addEventListener('click', newEventHandler);
    getNextEvents();
});

function newListHandler() {
    MList();
}

function newEventHandler() {
    MEvent();
}