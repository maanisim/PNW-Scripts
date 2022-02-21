// ==UserScript==
// @name         PNW - Baseball Host Auto
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automatically plays Baseball home games every 28-35seconds
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/obl/host/
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballHostAuto.js
// @grant        none
// ==/UserScript==

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}


(function() {
    'use strict';
    var submithomegame = document.getElementsByName('submithomegame')[0]
    try {
        submithomegame.click();
    }
    catch (exception_var) {
        //document.querySelector('div.alert.alert-danger').innerText.startsWith('Unable to Host Game')
        console.log('too early');
    }
    function reloadPage(){
        console.log('referasho');
        //location.reload(true);
        window.location=window.location;
    }
    //setTimeout(reloadPage, 3000);
    setInterval(function() {
        reloadPage(true);
    }, getRandomIntInclusive(28000,35000));
    //getRandomIntInclusive(6000,9000));
    //getRandomIntInclusive(10000,16000));
    //25000
    //30000
})();
