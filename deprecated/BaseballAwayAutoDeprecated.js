// ==UserScript==
// @name         PNW - Baseball Away Auto
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automatically plays Baseball away games.
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/obl/play/
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballAwayAuto.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var submitawaygame = document.getElementsByName('submitawaygame')[0]
    try {
        submitawaygame.click();
    }
    catch (exception_var) {
        console.log('too early');
    }
    function reloadPage(){
        //location.reload(true);
        if(parseInt(document.querySelectorAll('p.bold.center')[1].textContent.split(' ')[3]) > 0){
            submitawaygame = document.getElementsByName('submitawaygame')[0]
        } else {
            window.location="https://politicsandwar.com/obl/play/"

            //new - make it faster
            //window.location="https://politicsandwar.com/obl/host/"
            //new
        }
    }
    //setTimeout(reloadPage, 3000);
    setInterval(function() {
        reloadPage(true);
    }, 3000);
})();
