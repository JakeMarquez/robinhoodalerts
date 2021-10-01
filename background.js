// udpate curent price if the tab is updated while the window is open
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {

    // check we are opening up on a robinhood stock or crypto page
    if (tabInfo.url.indexOf('https://robinhood.com/stocks/') > -1 
        || tabInfo.url.indexOf('https://robinhood.com/crypto/') > -1) {

        const storage = await sGetAll();
        const alerts = storage['robinhoodalerts'];
        
        console.log(alerts);

        let queryOptions = { };
        let tabs = await chrome.tabs.query(queryOptions);
        const titles = tabs.filter(tab => {
            return (tab.url.indexOf('https://robinhood.com/stocks/') !== -1 || tab.url.indexOf('https://robinhood.com/crypto/') !== -1);
        }).map(tab => tab.title);

        const currPrices = {};
        titles.forEach(title => {
            let ticker = title.split(' ')[0];
            let price = parseFloat(title.split(' ')[2].replace(/[$,]/g,''));
            currPrices[ticker] = price;
        });

        const notifications = [];
        for (const key in alerts) {
            const alert = alerts[key]
            if (currPrices[key]) {
                // there is a tab open matching the existing alert
                const alertPrice = parseFloat(alert.price);
                if ((currPrices[key] >= alertPrice && alert.rising) || 
                    (currPrices[key] <= alertPrice && !alert.rising)) {
                    notifications.push(alert);
                }
            }
        }

        notifications.forEach(notification => {
            chrome.notifications.create(
                `robinhood-alert-notification-${Date.now()}`,
                {
                type: "basic",
                iconUrl: "icon48.png",
                title: `Alert triggered for ${notification.ticker}`,
                message: `${notification.ticker}'s price has ${notifications.rising ? 'risen' : 'fallen' } and triggered your alert!`,
                },
                () => { }
            );
            sRemove(notification.ticker);
        });
    }

});

function sGetAll() {
    return new Promise(resolve => {
        chrome.storage.local.get(["robinhoodalerts"], function(items){
            resolve(items);
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
