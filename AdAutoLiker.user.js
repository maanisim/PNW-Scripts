// ==UserScript==
// @name         PNW - Ad Auto Liker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically likes ad from the X user.
// @author       You
// @match        https://politicsandwar.com/*
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AdAutoLiker.user.js
// @downloadURL   https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AdAutoLiker.user.js
// @grant        none
// ==/UserScript==

let userToLike = 'Edward the Elder';

setTimeout(
    function() {
        if(document.querySelector('div.hidden-xs.alert.alert-info p.bold a').textContent == userToLike)
            try {
                document.querySelector('.btn-ad-vote.btn-default').click()
                //console.log('Successfully like the ad!');
            }
        catch (exception_var) {
            if(document.querySelector('.btn-ad-vote.btn-success' != undefined)){
                //console.log('Ad was already liked.')
            } else{
                //console.log('Unexpected error! in Ad Liker..')
                //console.log(exception_var);
            }
        }
    }, 2000);


