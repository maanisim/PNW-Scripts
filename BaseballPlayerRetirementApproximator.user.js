// ==UserScript==
// @name         Baseball player retirement approximator
// @namespace    BaseballPlayerRetirementApproximator
// @version      0.1
// @description  Allow to see the players retirement in approximate days making it easier to see the players retirement
// @author       You
// @match        https://politicsandwar.com/obl/team/id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=politicsandwar.com
// @grant        none
// ==/UserScript==

document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 table.nationtable tbody tr th')[6].textContent = "Time to death";

var table = document.querySelectorAll('table.nationtable tbody tr td.center')

for (let i = 5; i < table.length; i++) {
    if(i%2!=0){
        table[i].textContent = ((40-table[i].textContent)*4.3).toFixed(1) + " days";
    }
}