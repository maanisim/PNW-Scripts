// ==UserScript==
// @name         PNW - Pirate Semi-Automatic Raider Enchancement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Speeds up raiding other players by automating certain actions, such as setting ground battles to raid mode and disabling the use of munitions if enemy has no troops.
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/nation/war/groundbattle/war=*
// @match        https://politicsandwar.com/nation/war/declare/id=*
// @match        https://politicsandwar.com/nation/war
// @match        https://politicsandwar.com/nation/war/
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/PirateSemiAutomaticRaiderEnchancement.js
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @grant        none
// ==/UserScript==


//do not change
var totalArmy = NaN;
var noMunitionsBox = NaN;
var buttonText = NaN;
var lootText = NaN;
var goToWars = NaN;
let warPage = "https://politicsandwar.com/nation/war";

//--- changable ---
let raidMessage = "Inactive, PM for peace";


function startBattle(){
    document.getElementsByClassName('btn btn-danger')[0].click();
}

function loadWarPage(){
    window.location=warPage;
}

function reloadPage(){
    window.location=window.location;
}

function isServerUnderLoad(){
    try{
        if(document.querySelector('body div.container div.row div#rightcolumn.col-md-10 div.columnheader').textContent == "Server Under Heavy Load"){
            return true;
        } else{
            return false;
        }
    } catch(err){
        return false;
    }
}



/*
If on a war page with enemy nation, check if there are enough points in order to attack the enemy

if there are check if the enemy has any army, if they don't dont waste your munitions on them.

else attack them
*/

if(isServerUnderLoad() == true){
    setTimeout(reloadPage, 5100);
}

if(window.location.href.startsWith("https://politicsandwar.com/nation/war/groundbattle/war=")){
    //if "attack again" or "ground battle" everything is fine, otherwise we are redirected to /human page or server is under heavy load.
    try{
        try{
            buttonText = document.getElementsByClassName('btn btn-danger')[0].textContent.split(" ").join("").split("\n");
        } catch{
            //buttonText is missing possibly server underload, /human page is loading. verify if it's not by checking if back to wars button exists.
            if(document.querySelector('body div.container div.row div#rightcolumn.col-md-10 form div.row div.col-xs-12.center p.center a.btn.btn-lg.btn-warning').textContent == " Back to Wars" ){
                window.location=warPage;
            }
        }

        //GroundBattle text
        if(buttonText.length == 3){
            let rawMilitaryActionPoints = document.querySelector('body div.container div.row div#rightcolumn.col-md-10 form div.row div.col-xs-12.center p.center.bold');
            let militaryActionPointsInt = parseInt(rawMilitaryActionPoints.textContent.split("Military Action Points Available: ")[1].split(" ").join(""));

            //if enemy has enough military action points
            if(militaryActionPointsInt < 3){
                console.log('less than 3 military points load');//debug
                window.location=warPage;
                //console.log('redirect due to lack of military action points');//DEBUG
                //otherwise enemy has no military action points
            } else{
                totalArmy = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 form div.row div.col-xs-12.col-md-6 div.row div.col-xs-6 p.center.smallText');

                //if enemy has no army, dont waste bullets on him.
                if(totalArmy[2].textContent == "0 Available" && totalArmy[3].textContent == "0 Available"){
                    noMunitionsBox = document.querySelector('tbody tr.smallText.bold td.center label input');
                    if(noMunitionsBox.checked == false){
                        noMunitionsBox.click();
                    }
                }
                //
                document.getElementsByClassName('btn btn-danger')[0].click();
            }
        }
        //AttackAgain text
        else {
            try{
                lootText = document.querySelector('body div.container div.row div#rightcolumn.col-md-10 div.alert.alert-success p.bold').textContent;
                loadWarPage();
            } catch(err1){
                //document.getElementsByClassName('btn btn-danger')[0].click();
                console.log('AttackAgain pressed');//debug
                setTimeout(startBattle, 2300);//2500 is good

            }

        }
    //we are redirected to /human page or server is under heavy load.
    } catch(err){
        console.log('under heavyload or /human page');
        setTimeout(loadWarPage, 6000);//debug
    }

} else if(window.location.href.startsWith('https://politicsandwar.com/nation/war/declare/id=')){
    //if this button loads, user has already submitted the changes.. redirect them to wars page as otherwise they have to press a button
    goToWars = document.querySelector('body div.container div.row div#rightcolumn.col-md-10 p.center a.btn.btn-lg.btn-warning');
    if(goToWars != null){
        loadWarPage();
    }
    //set to raid
    document.querySelector("#war_type_selector").value = "raid";
    //set to raid css cosmetics
    document.querySelector("#war_type_desc_raid").classList.remove("hidden");
    document.querySelector("#war_type_desc_ord").className = "hidden";
    document.querySelector("#war_type_desc_att").className = "hidden";
    //set message
    document.querySelector('table.nationtable tbody tr td input').value = raidMessage;
}