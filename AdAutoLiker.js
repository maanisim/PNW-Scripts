// ==UserScript==
// @name         PAW - Ad Auto Liker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://politicsandwar.com/*
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @grant        none
// ==/UserScript==

setTimeout(
    function() {
        if(document.querySelector('div.hidden-xs.alert.alert-info p.bold a').textContent == 'Edward the Elder')
            try {
                document.querySelector('.btn-ad-vote.btn-default').click()
                console.log('Successfully like the ad!');
            }
        catch (exception_var) {
            if(document.querySelector('.btn-ad-vote.btn-success' != undefined)){
                console.log('Ad was already liked.')
            } else{
                console.log('Unexpected error! in Ad Liker..')
                console.log(exception_var);
            }
        }
    }, 2000);


