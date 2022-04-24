// ==UserScript==
// @name         PNW - Player Ads Upvoter
// @namespace    AdAutoLiker.user.js
// @version      0.3
// @description  Automatically likes ad from the X user.
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/*
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AdAutoLiker.user.js
// @downloadURL  https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AdAutoLiker.user.js
// @grant        none
// ==/UserScript==

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('b', bTag => bTag.append('Player Ads Upvoter')));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const UserToLike = localStorage.getItem('PNW_AdAutoLikeNationID');
		buttonTag.append(UserToLike ? 'Update Nation ID' : 'Insert Nation ID');
		buttonTag.onclick = () => {
			const response = prompt('Insert nation id which can be found at Nation > View, in the URL:', UserToLike || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('PNW_AdAutoLikeNationID', response);
			}
			else {
				localStorage.removeItem('PNW_AdAutoLikeNationID');
			}
			location.reload();
		};
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

if(localStorage.getItem('PNW_AdAutoLikeNationID') != null){
    setTimeout(
        function() {
            if(document.querySelector('div.hidden-xs.alert.alert-info p.bold a').href.split('id=')[1] == localStorage.getItem('PNW_AdAutoLikeNationID'))
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
}