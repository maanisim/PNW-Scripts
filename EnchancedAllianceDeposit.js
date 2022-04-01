// ==UserScript==
// @name        PNW - Enchanced Alliance Deposit Functionality
// @version     1.1
// @description Expands the functionality of depositing by filling the cash deposit for you, or alternatively all resources for safekeeping.
// @author      https://github.com/michalani/
// @license     MIT
// @include     https://politicsandwar.com/alliance/id=8429&display=bank
// @grant       none
// @icon        https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL   https://raw.githubusercontent.com/michalani/PNW-Scripts/master/EnchancedAllianceDeposit.js
// @downloadURL https://raw.githubusercontent.com/michalani/PNW-Scripts/master/EnchancedAllianceDeposit.js

// @noframes
// ==/UserScript==

//1. Set message to "safekeep"
document.querySelector('body div.container div.row div#rightcolumn.col-md-10 div.row div.col-sm-6.col-xs-12 form table.nationtable tbody tr td.center p input').value = "safekeep"

//var bankElements = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 div.row div.col-sm-6.col-xs-12 form table.nationtable tbody tr td')[1].firstChild
var bankElements = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 div.row div.col-sm-6.col-xs-12 form table.nationtable tbody tr td');
var maxResourceValue = NaN;
var currentCash = NaN;
var cashToDeposit = NaN;

//CHANGABLE - minimum cash to not take from user
let minCashOnHand = 1500000

function clickDepositButton(){
    //click normal deposit button.
    document.querySelector('form table.nationtable tbody tr td.center p input.big-submit').click();
}

//deposit all
function depositAll(){
    for (let i = 1; i < bankElements.length-1; i+=2) {
        //remove , ) and $ from the numbers to parse.
        maxResourceValue = (bankElements[i-1].textContent.split(' (Available: ')[1].replace(/[,\\$)]/g, ''));
        //print value element
        //console.log(i);
        //console.log(bankElements[i]);
        bankElements[i].firstChild.value = parseInt(maxResourceValue);
    }
    //clickDepositButton();
}



//change size of the current button
var normalDepositButton = document.querySelector('body div.container div.row div#rightcolumn.col-md-10 div.row div.col-sm-6.col-xs-12 form table.nationtable tbody tr td.center p input.big-submit')
normalDepositButton.style.removeProperty('width');


// generate a button for user to click when they want to deposit ALL of the resources
var DepositAllButton = document.createElement("button");
DepositAllButton.className = 'btn btn-warning btn-lg';
var text = document.createTextNode(' Deposit All');
var i = document.createElement('i');
i.className = 'fas fa fa-university';
DepositAllButton.appendChild(i)
DepositAllButton.appendChild(text);
//disable submit in the button
DepositAllButton.setAttribute('type', "button");
normalDepositButton.style.margin = "8px";
normalDepositButton.after(DepositAllButton);

DepositAllButton.addEventListener("click", depositAll);


// generate a button for user to click when they want to deposit MOST of the money (up to 1.5kk)
var DepositMostButton = document.createElement("button");
DepositMostButton.className = 'btn btn-success btn-lg';
var DepoMostText = document.createTextNode(' Deposit Most Cash');
var DepoMostI = document.createElement('i');
DepoMostI.className = 'fas fa fa-dollar';
DepositMostButton.appendChild(DepoMostI);
DepositMostButton.appendChild(DepoMostText);
//disable submit in the button
DepositMostButton.setAttribute('type', "button");

normalDepositButton.after(DepositMostButton);
DepositMostButton.addEventListener("click", depositMostCash);

function depositMostCash(){
    //remove , ) and $ from the numbers to parse.
    maxResourceValue = (bankElements[0].textContent.split(' (Available: ')[1].replace(/[,\\$)]/g, ''));
    currentCash = parseInt(maxResourceValue);

    //if current cash is more than 3kk
    if(currentCash > minCashOnHand){
        cashToDeposit = currentCash - minCashOnHand;
        bankElements[1].firstChild.value = cashToDeposit;
    }
    clickDepositButton();
}
