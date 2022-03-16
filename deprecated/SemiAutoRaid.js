// ==UserScript==
// @name         PNW - Semi Auto Raid
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Semi Automatic Nation Raider
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/nation/war/groundbattle/war=*
// @match        https://politicsandwar.com/nation/war/declare/id=*
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/SemiAutoRaid.js
// @grant        none
// ==/UserScript==


if(window.location.href.startsWith("https://politicsandwar.com/nation/war/groundbattle/war")){
    //try turning off munitions
    try {
        console.log('munitions button found');
        document.querySelector('tbody tr.smallText.bold td.center label input').click()
    }
    catch(err) {
        console.log('no munitions button found');
    }

    //do the rest
    let fightAgainButton = document.getElementsByClassName('btn btn-danger')[0]

    if(fightAgainButton == undefined){
        window.location="https://politicsandwar.com/nation/war"
    } else {
        if(document.getElementsByClassName('btn btn-danger')[0].textContent == " Attack Again"){
           setTimeout(clickWar, 2800);
           } else {
               clickWar();
           }
    }


    function clickWar(){
        document.getElementsByClassName('btn btn-danger')[0].click();
    }
} else if(window.location.href.startsWith('https://politicsandwar.com/nation/war/declare/id=')){
    //set to raid
    document.querySelector("#war_type_selector").value = "raid";
    //set to raid cosmetics
    document.querySelector("#war_type_desc_raid").classList.remove("hidden");
    document.querySelector("#war_type_desc_ord").className = "hidden";
    document.querySelector("#war_type_desc_att").className = "hidden";
    //set message
    document.querySelector('table.nationtable tbody tr td input').value = "Inactive, PM for peace.";
} else if(window.location.href.startsWith("https://politicsandwar.com/nation/war/declare/id=")) {
    document.querySelector('div#rightcolumn.col-md-10 p.center a.btn.btn-lg.btn-warning').click()
}




/*

setTimeout(clickWar, 3000)

function clickWar(){
    try {
        document.getElementsByClassName('btn btn-danger')[0].click();

    } catch (error) {
        window.location="https://politicsandwar.com/nation/war"
    }
}


*/
