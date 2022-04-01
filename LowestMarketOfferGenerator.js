// ==UserScript==
// @name         PNW - Lowest Market Offer Generator
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Creates a SELL button which allows you to set the price of the resource to sell to (-1) of the current lowest market offer.
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/nation/trade/create/
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/LowestMarketOfferGenerator.js
// @downloadURL  https://raw.githubusercontent.com/michalani/PNW-Scripts/master/LowestMarketOfferGenerator.js
// @grant        none
// ==/UserScript==
var currentResourceName;
var returnedPage;
var costOfItem;

//change size of the current button
var zzzzzzzz = document.querySelector('table.nationtable tbody tr td div.input-icon input#priceper.right')
zzzzzzzz.style.removeProperty('width');


// generate a button for user to click when they want to fetch current lowest offer -1.
var buyButton = document.querySelector('div.btn-group button.btn.btn-success.btn-lg')
var MinusOneButton = document.createElement("button");
MinusOneButton.className = 'btn btn-warning btn-lg';
var text = document.createTextNode(' -1$');
let i = document.createElement('i');
i.className = 'fas fa fa-balance-scale';
MinusOneButton.appendChild(i)
MinusOneButton.appendChild(text);
//disable submit in the button
MinusOneButton.setAttribute('type', "button");
zzzzzzzz.style.margin = "8px";



//tmp
//MinusOneButton.disabled=true;
//MinusOneButton.setAttribute('data-toggle', "modal");

//buyButton.after(MinusOneButton);
zzzzzzzz.after(MinusOneButton);

// scrape the current lowest price from the trading page for that resource
MinusOneButton.addEventListener("click", myFunction);
function myFunction() {
    currentResourceName = document.querySelector('table.nationtable tbody tr td select#resourceoption').value
    fetch('https://politicsandwar.com/index.php?id=26&display=world&resource1='+currentResourceName+'&buysell=sell&ob=price&od=DEF&maximum=15&minimum=0&search=Go')
        .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
        .then(function(html) {
        // Initialize the DOM parser
        var parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");

        //debug
        //console.log(doc);
        returnedPage = doc;
        costOfItem = parseInt(returnedPage.querySelectorAll('div.row div#rightcolumn.col-md-10 table.nationtable tbody tr td.center')[4].textContent.split(' / each Total')[0].replace(/[^0-9.]+/g,""));
        document.querySelector('tbody tr td div.input-icon input#priceper.right').value = costOfItem-1;

    })
        .catch(function(err) {
        console.log('Failed to fetch page: ', err);
    });
}