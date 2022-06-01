// ==UserScript==
// @name         PNW Baseball+
// @namespace    BaseballPlus.user.js
// @version      1.6
// @description  Automatically plays baseball  [works with BlackAsLight script only]
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/human/
// @match        https://politicsandwar.com/obl/host/*
// @match        https://politicsandwar.com/obl/play/*
// @match        https://politicsandwar.com/obl/team/id=*
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballPlus.user.js
// @downloadURL	 https://raw.githubusercontent.com/michalani/PNW-Scripts/master/BaseballPlus.user.js
// @icon         https://politicsandwar.com/img/baseball/defaultlogo.png
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#PNW_BaseballAutoClicker')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', divTag => {
	divTag.setAttribute('id', 'PNW_BaseballAutoClicker');
	divTag.style.setProperty('display', 'none');
}));

/* settings
-------------------------*/
var firstPageLoad = true;
var tmpPlayed = null;
var tmpPlayedIntArr = [null,null];

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

async function showMyTeamRating(){
    //fetch current team score
    const data1 = JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={baseball_teams(id:[${(document.querySelectorAll(' body div.container div.row div#leftcolumn.col-md-2 ul.sidebar a')[20].href.split('id=')[1])}]){data{rating}}}`)).text()).data;
    //data1.baseball_teams.data[0].rating

    //append the data under the buttons
    var btnBox = document.getElementById( 'Game' );
    var newText = document.createElement( 'h2' ); // create new textarea
    newText.innerText = "Your team rating is: "+data1.baseball_teams.data[0].rating+"%"
    btnBox.parentNode.insertBefore( newText, btnBox.nextSibling );
    newText.id = 'PNW_Rating';

    //color the rating
    //red
    if(data1.baseball_teams.data[0].rating < 15){
        newText.style.color = 'red';

        //orange
    } else if(data1.baseball_teams.data[0].rating < 100){
        newText.style.color = 'orange';
        //green
    } else if(data1.baseball_teams.data[0].rating == 100){
        newText.style.color = 'green';
    }

    //center the element
    document.head.append(CreateElement('style', styleTag => {
        // Game Buttons
        styleTag.append('#PNW_Rating { font-size: 1.15em; text-align: center; width: 100%; }');
        styleTag.append('@media only screen and (max-width: 502px) { #PNW_Rating { font-size: 1em; } }');
        styleTag.append('@media only screen and (max-width: 407px) { #PNW_Rating { font-size: 12px; } } ');
        styleTag.append('#PNW_Rating > p { border-color: black; border-style: solid; border-width: 0 2px; display: inline; margin: 0 0.25em; padding: 0; }');
    }));

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
	divTag.append(CreateElement('b', bTag => bTag.append('Captcha Config')));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const CaptchaWebhook = localStorage.getItem('PNW_CaptchaWebhook');
		buttonTag.append(CaptchaWebhook ? 'Update webhook' : '(opt) Insert webhook');
		buttonTag.onclick = () => {
			const response = prompt('Insert webhook which can be found in discord settings:', CaptchaWebhook || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('PNW_CaptchaWebhook', response);
			}
			else {
				localStorage.removeItem('PNW_CaptchaWebhook');
			}
			//location.reload();
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const CaptchaWebhookMsg = localStorage.getItem('PNW_CaptchaWebhookMsg');
		buttonTag.append(CaptchaWebhookMsg ? '(opt) Update webhook msg' : '(opt) Insert webhook msg');
		buttonTag.onclick = () => {
			const response = prompt('Insert webhook msg which will be sent:', CaptchaWebhookMsg || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('PNW_CaptchaWebhookMsg', response);
			}
			else {
				localStorage.removeItem('PNW_CaptchaWebhookMsg');
			}
			//location.reload();
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Disable Captcha Sound: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('!PNW_CaptchaSound');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('!PNW_CaptchaSound', true);
			}
			else {
				localStorage.removeItem('!PNW_CaptchaSound');
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Enable Webhook: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_CaptchaWebhookSwitch');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_CaptchaWebhookSwitch', true);
			}
			else {
				localStorage.removeItem('PNW_CaptchaWebhookSwitch');
			}
		};
	}));
    divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('b', bTag => bTag.append('Baseball+')));
    divTag.append(document.createElement('br'));
	divTag.append('Enable AutoClick: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_AutoClick');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_AutoClick', true);
			}
			else {
				localStorage.removeItem('PNW_AutoClick');
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Click on page load: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_PageLoadClick');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_PageLoadClick', true);
			}
			else {
				localStorage.removeItem('PNW_PageLoadClick');
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('(exp) On 250+ load Away: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_PlayAway');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_PlayAway', true);
			}
			else {
				localStorage.removeItem('PNW_PlayAway');
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Show my team rating: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_ShowMyTeamRating');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_ShowMyTeamRating', true);
                showMyTeamRating();
			}
			else {
				localStorage.removeItem('PNW_ShowMyTeamRating');
                location.reload();
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('(exp) Click Random Delay: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('PNW_RandomDelay');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('PNW_RandomDelay', true);
                showMyTeamRating();
			}
			else {
				localStorage.removeItem('PNW_RandomDelay');
                location.reload();
			}
		};
	}));
}));

function sendWebhookMsg(user,userMsg,webhookURL) {
    const request = new XMLHttpRequest();
    request.open("POST", webhookURL);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
      username: user,
      avatar_url: "https://politicsandwar.com/img/baseball/defaultlogo.png",
      content: userMsg
    }
    request.send(JSON.stringify(params));
  }

  if(location.href != 'https://politicsandwar.com/human/'){

	let playBtnTxtClassPath = 'button#Play.btn';

	waitForElm(playBtnTxtClassPath).then((elm) => {
        if(localStorage.getItem('PNW_PageLoadClick') != null){
            document.querySelector(playBtnTxtClassPath).click();
        }
        if(localStorage.getItem('PNW_ShowMyTeamRating') != null){
            showMyTeamRating();
        }


		loadClickyClacky();
	});

	function loadClickyClacky(){
		var cancelBtn = document.querySelector('#Cancel');
		var playBtn = document.querySelector(playBtnTxtClassPath);
		//var playBtnTxtClassPath = 'button#Play.btn';
		// Set up a new observer
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				// Check the modified attributeName is "disabled"
				if(mutation.attributeName === "disabled" && localStorage.getItem('PNW_AutoClick') != null) {
                    tmpPlayed = document.querySelector('#Played').textContent.split("/");
					if(location.href == "https://politicsandwar.com/obl/host/" && localStorage.getItem('PNW_PlayAway') != null && tmpPlayed[0] != "?" && tmpPlayed[0] != "NaN" && tmpPlayed[0] >= tmpPlayed[1]){
                        //location.href = "https://politicsandwar.com/obl/play/";
                        //console.log('activate away');
                        //console.log(tmpPlayed[0]);
                        //console.log(tmpPlayed[1]);
                        playBtn.click();
					} else {
                        playBtn.click();
                    }

					//console.log('clicky clakcy');

				}
			});
		});

		// Configure to only listen to attribute changes
		var config = { attributes: true };
		// Start observing myElem
		observer.observe(playBtn, config);
	}

  } else {
	if (!document.querySelector('.alert-success')){
		if(localStorage.getItem('!PNW_CaptchaSound') != null){
			new Audio('data:audio/mpeg;base64,SUQzAwAAAAAPdlRFTkMAAAAxQAAB//5kAEIAcABvAHcAZQByAGEAbQBwACAAUgBlAGwAZQBhAHMAZQAgADEAMwAuADUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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').play();
	}
		if(localStorage.getItem('PNW_CaptchaWebhook') != null && localStorage.getItem('PNW_CaptchaWebhookSwitch') != null){
			if(localStorage.getItem('PNW_CaptchaWebhookMsg') != null){
				sendWebhookMsg("Baseball",localStorage.getItem('PNW_CaptchaWebhookMsg'),localStorage.getItem('PNW_CaptchaWebhook'));
			} else {
				sendWebhookMsg("Baseball","Captcha @here",localStorage.getItem('PNW_CaptchaWebhook'));
			}

		}

	}
  }