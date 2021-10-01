export {
    hide,
    show,
    domGetValue,
    domSetValue,
    domSetText,
    domSetStyle,
    bindClick,
    swapTheme
};

function hide(id) {
    document.getElementById(id).style.display = 'none';
}

function show(id) {
    document.getElementById(id).style.display = '';
}

function domGetValue(id) {
    return document.getElementById(id).value;
}

function domSetValue(id, v) {
    document.getElementById(id).value = v;
}

function domSetText(id, t) {
    document.getElementById(id).innerText = t;
}

function domSetStyle(id, s) { 
    document.getElementById(id).style = s;
}

function bindClick(id, cb) {
    document.getElementById(id).addEventListener('click', () => { cb(); })
}

/**
 * Swap UI
 * @param  {boolean} isLight
 */
function swapTheme(isLight) {
    ['body',
    'ticker',
    'alertprice',
    'currPrice',
    'priceinput',
    'pricelabel',
    'priceerror',
    'submitbutton'].forEach(id => {
        document.getElementById(id).classList.remove(isLight ? 'dark' : 'light');
        document.getElementById(id).classList.add(isLight ? 'light' : 'dark');
    });
}