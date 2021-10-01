import {
    hide,
    show,
    domGetValue,
    domSetValue,
    domSetText,
    domSetStyle,
    bindClick,
    swapTheme
} from './modules/ui.mjs';
import { sGet, sSet, sRemove } from './modules/storage.mjs';
import * as types from './modules/classes.mjs';

// defaults
let ticker = 'T';
let currPrice = 0;

// Update theme if NYSE is open
let offset = -4.0
let clientDate = new Date();
let utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
let etDate = new Date(utc + (3600000*offset));
if ((etDate.getHours() === 8 && etDate.getMinutes() > 30) || (etDate.getHours() > 8 && etDate.getHours < 15)) {
    swapTheme(true);
} else {
    swapTheme(false);
}

// retrieve current tab and parse
let queryOptions = { active: true, currentWindow: true };
let tab = await chrome.tabs.query(queryOptions);
let url = tab[0].url;
// check we are opening up on a robinhood stock or crypto page
if (url.indexOf('https://robinhood.com/stocks/') === -1 
    && url.indexOf('https://robinhood.com/crypto/') === -1) {
    
    window.close();
}
let title = tab[0].title;
ticker = title.split(' ')[0];
currPrice = title.split(' ')[2];
updateForm();
bindClick('submitbutton', submit);

// udpate curent price if the tab is updated while the window is open
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
    if (tabId === tab[0].id) {
        if (tabInfo.url !== url) {
            // close on navigation
            window.close();
        } else {
            let title = tabInfo.title;
            currPrice = title.split(' ')[2];
            updateForm(false);
        }
    }
});

async function updateForm(clearInput = true) {
    domSetText('ticker', ticker);
    domSetText('currPrice', `Current Price ${currPrice}`);

    const existing = await sGet(ticker);

    if (existing) {
        hide('form');
        show('alertprice');
        domSetText('alertprice', `Alert Price $${existing.price}`);
        domSetText('submitbutton', 'Remove Alert');
        domSetStyle('html', 'height: 14rem; width: 18rem');
        domSetStyle('body', 'height: 14rem; width: 18rem');
    } else {
        if (clearInput) {
            domSetValue('priceinput', '');
        }
        show('form');
        hide('alertprice');
        domSetText('submitbutton', 'Set Alert');
        domSetStyle('html', 'height: 16rem; width: 18rem');
        domSetStyle('body', 'height: 16rem; width: 18rem');
    }
}

async function submit() {
    const existing = await sGet(ticker);
    if (existing) {
        await sRemove(ticker);
    } else {
        const curr = parseFloat(currPrice.replace(/[$,]/g,''));
        const price = domGetValue('priceinput');
        
        if (price < 1) {
            document.getElementById('pricecontainer').classList.add('is-invalid');
            return;
        }  
    
        const alert = new types.Alert(
            ticker,
            price,
            price > curr
        );

        await sSet(ticker, alert);
    }
    updateForm();
}