//Following was adapted from https://github.com/tetsuwo/website-blocker-chrome.ext
chrome.tabs.onCreated.addListener(function(tab) {
    if (determineIsBlocked(tab.url)) {
        alert("A");
        console.log("chrome.tabs.onCreated.addListener - blocking page");
        blockPage(tab.id, tab.url);
    }
});

chrome.tabs.onActivated.addListener(function(info) {
    chrome.tabs.get(info.tabId, function(tab) {
        if (determineIsBlocked(tab.url)) {
            alert("B");
            console.log("chrome.tabs.onActivated.addListener - blocking page");
            blockPage(tab.id, tab.url);
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "loading") {
        if (determineIsBlocked(tab.url)) {
            alert("C");
            console.log("chrome.tabs.onUpdated.addListener - blocking page");
            blockPage(tab.id, tab.url);
        }
        return;
    }
});

function checkCurrentTab() {
    chrome.tabs.getSelected(null, function(tab) {
        if (determineIsBlocked(tab.url)) {
            console.log("checkCurrentTab - blocking page");
            blockPage(tab.id, tab.url);
        }
    });
};