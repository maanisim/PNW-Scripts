// ==UserScript==
// @name         PNW - Auto Comender
// @namespace    AutoComender.user.js
// @version      1
// @description  Automatically commends people starting from "https://politicsandwar.com/index.php?id=15&keyword=&cat=everything&ob=date&od=ASC&gopage=%3E%3E&maximum=50&minimum=*" until there is no more nations
// @author       https://github.com/michalani/
// @match        https://politicsandwar.com/index.php?id=15&keyword=&cat=everything&ob=date&od=ASC&gopage=%3E%3E&maximum=50&minimum=*
// @icon         https://www.google.com/s2/favicons?domain=politicsandwar.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AutoComender.user.js
// @download URL https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AutoComender.user.js
// @grant        none
// ==/UserScript==

// -- settings --
let delayBetweenRequestAsMs = 3000

// -- do not change --
var account_id = null;
var api_key = null;
var target_id = null;

var a = document.querySelectorAll('body div.container div.row div#rightcolumn.col-md-10 div.row div.col-sm-12 div.table-responsive table.nationtable tbody tr td.center a')
let isNation = "https://politicsandwar.com/nation/id=";
var tmp = null;


function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


async function iterateOverNations(){
// go through whole list of nations
    for (let i = 0; i < a.length; i++) {
        if(a[i].href.startsWith(isNation)){
            tmp = a[i].href.replace("https://politicsandwar.com/nation/id=", "");
            console.log(tmp);
            //Denouncements('commendment',tmp);
            await delay(delayBetweenRequestAsMs);
        }
    }
    //get params for next page
    var params = new URLSearchParams(window.location.search);
    var minimum = parseInt(params.get("minimum"));
    minimum += 50;


    //load next page
    window.location="https://politicsandwar.com/index.php?id=15&keyword=&cat=everything&ob=date&od=ASC&gopage=%3E%3E&maximum=50&minimum="+minimum.toString();
}

var apiKeyGet = document.querySelector('body div.container div.row div#rightcolumn.col-md-10 script')
var waitForEl = function(apiKeyGet, callback) {
  if (jQuery(apiKeyGet).length) {
    callback();
  } else {
    setTimeout(function() {
      api_key = waitForEl(apiKeyGet, callback);
    }, 100);
  }
};

waitForEl(apiKeyGet, function() {
  // work the magic
    account_id = apiKeyGet.textContent.split('account_id\': \"')[1].split('",')[0];
    console.log(account_id);
    apiKeyGet.textContent.split('\'api_key\': \"')[1].split('\"}')[0];
    console.log('updating api key');
    api_key = (apiKeyGet.textContent.split('\'api_key\': \"')[1].split('\"}')[0]);
    iterateOverNations();
});



    function Denouncements(action,target_id) {
        $.ajax({
            url: "https://politicsandwar.com/api/denouncements.php",
            method: 'POST',
            data: {'action' : action, 'account_id': account_id, 'target_id': target_id, 'api_key': api_key},
            async:false,
            dataType: "json",
        }).done(function(data) {
            if(data.success == true) {
                console.log(data);
            }
        });
    }
