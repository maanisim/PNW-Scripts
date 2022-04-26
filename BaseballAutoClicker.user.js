// ==UserScript==
// @name         BB AutoClick Seperate v1
// @namespace    BaseballAutoClicker.user.js
// @version      1
// @description  Automates the clicking of baseball Host/Away button
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/obl/host/*
// @match        https://politicsandwar.com/obl/play/*
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballAutoClicker.user.js
// @downloadURL	 https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballAutoClicker.user.js
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @grant        none
// ==/UserScript==

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

let playBtnTxtClassPath = 'button#Play.btn';

waitForElm(playBtnTxtClassPath).then((elm) => {
    loadClickyClacky();
});

function loadClickyClacky(){
    var cancelBtn = document.querySelector('#Cancel');
    var playBtn = document.querySelector(playBtnTxtClassPath);

    // Set up a new observer
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check the modified attributeName is "disabled"
            if(mutation.attributeName === "disabled") {
                console.log('clicky clakcy');
                playBtn.click();
            }
        });
    });
    // Configure to only listen to attribute changes
    var config = { attributes: true };
    // Start observing myElem
    observer.observe(cancelBtn, config);
}