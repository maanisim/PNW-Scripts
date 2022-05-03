// ==UserScript==
// @name         PNW - Pirate Semi-Automatic Raider Enchancement
// @namespace    PirateSemiAutomaticRaiderEnchancement.js
// @version      1.6.1
// @description  Speeds up raiding other players by automating certain actions, such as setting ground battles to raid mode and disabling the use of munitions if enemy has no troops.
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/nation/war/groundbattle/war=*
// @match        https://politicsandwar.com/nation/war/declare/id=*
// @match        https://politicsandwar.com/nation/war
// @match        https://politicsandwar.com/nation/war/
// @match        https://politicsandwar.com/nation/war/#
// @downloadURL  https://raw.githubusercontent.com/michalani/PNW-Scripts/master/PirateSemiAutomaticRaiderEnchancement.user.js
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/PirateSemiAutomaticRaiderEnchancement.user.js
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @grant        none
// ==/UserScript==


//do not change
var totalArmy = NaN;
var noMunitionsBox = NaN;
var buttonText = NaN;
var lootText = NaN;
var goToWars = NaN;
var nationsInvolded = [];
var shiftBy = 0;
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

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('b', bTag => bTag.append('Military Config')));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const NationID = localStorage.getItem('PNW_NationID');
		buttonTag.append(NationID ? 'Update Nation ID' : 'Insert Nation ID');
		buttonTag.onclick = () => {
			const response = prompt('Insert nation id which can be found at Nation > View, in the URL:', NationID || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('PNW_NationID', response);
			}
			else {
				localStorage.removeItem('PNW_NationID');
			}
			location.reload();
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const RaidMsg = localStorage.getItem('PNW_RaidMsg');
		buttonTag.append(RaidMsg ? 'Update Raid Message' : 'Insert Raid Message');
		buttonTag.onclick = () => {
			const response = prompt('Insert Raid Message used for Raiding:', RaidMsg || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('PNW_RaidMsg', response);
			}
			else {
				localStorage.removeItem('PNW_RaidMsg');
			}
			location.reload();
		};
	}));
	divTag.append(document.createElement('br'));

	divTag.append('Smart munitions: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_NoMunitions');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_NoMunitions', true);
			}
			else {
				localStorage.removeItem('PNW_NoMunitions');
			}
			document.querySelector('#notify').style.setProperty('display', inputTag.checked ? 'none' : 'block');
		};
		WaitForTag('#notify')
			.then(tag => tag.style.setProperty('display', localStorage.getItem('PNW_NoMunitions') ? 'none' : 'block'));
	}));

	divTag.append(document.createElement('br'));

}));


/* Functions
-------------------------*/
function CreateElement(type, func) {
	const tag = document.createElement(type);
	func(tag);
	return tag;
}

function Sleep(ms) {
	return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

async function WaitForTag(query) {
	let tag = document.querySelector(query);
	while (!tag) {
		await Sleep(50);
		tag = document.querySelector(query);
	}
	return tag;
}
//--- end of load config

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
                nationsInvolded = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 form div.row div.col-xs-12.col-md-6 p.center a.bold');

                totalArmy = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 form div.row div.col-xs-12.col-md-6 div.row div.col-xs-6 p.center.smallText');
                
                //smartmunitions
                if(localStorage.getItem('PNW_NoMunitions') == true || localStorage.getItem('PNW_NoMunitions') == null ){
                    for (let i = 0; i < nationsInvolded.length; i++) {
                        if(localStorage.getItem('PNW_NationID') != null && (nationsInvolded[i].href.split('id=')[1] != localStorage.getItem('PNW_NationID'))){
                            if(i == 1){
                                shiftBy = 2;
                            } else {
                                shiftBy = 0
                            }
                            console.log(shiftBy+" is shiftBy");
                            //if enemy has no army, dont waste bullets on him.
                            if(totalArmy[0+shiftBy].textContent == "0 Available" && totalArmy[1+shiftBy].textContent == "0 Available"){
                                noMunitionsBox = document.querySelector('tbody tr.smallText.bold td.center label input');
                                if(noMunitionsBox.checked == false){
                                    noMunitionsBox.click();
                                }
                            }
                            break;
                        }
                    }
                }

                //click final button
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

    //set message to user preferred
    if(localStorage.getItem('PNW_RaidMsg') != null){
        document.querySelector('table.nationtable tbody tr td input').value = localStorage.getItem('PNW_RaidMsg');
    //otherwise set it to default
    } else {
        document.querySelector('table.nationtable tbody tr td input').value = raidMessage;
    }

} else if(window.location.href == "https://politicsandwar.com/nation/war/"){
    console.log('https://politicsandwar.com/nation/war/')
}