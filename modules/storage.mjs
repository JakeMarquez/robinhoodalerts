export {
    sGet,
    sSet,
    sRemove
};

function sGet(key) {
    return new Promise(resolve => {
        chrome.storage.local.get(["robinhoodalerts"], function(store) {
            const alerts = store.robinhoodalerts || {};
            if (alerts[key]) { 
                resolve(alerts[key]);
            } else {
                resolve(null);
            }
        });
    });
}

function sSet(key, value) {
    return new Promise(async (resolve) => {
        chrome.storage.local.get(["robinhoodalerts"], function(items){
            if (!items.robinhoodalerts) { items.robinhoodalerts = {}; }
            items.robinhoodalerts[key] = value;
            chrome.storage.local.set({ "robinhoodalerts": items.robinhoodalerts }, () => {
                resolve();
            });
        });
    });
}

function sRemove(key) {
    return new Promise(async (resolve) => {
        chrome.storage.local.get(["robinhoodalerts"], function(items){
            if (!items.robinhoodalerts) { items.robinhoodalerts = {}; }
            delete items.robinhoodalerts[key];
            chrome.storage.local.set({ "robinhoodalerts": items.robinhoodalerts }, () => {
                resolve();
            });
        });
    });
}