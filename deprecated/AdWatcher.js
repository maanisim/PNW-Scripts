// ==UserScript==
// @name        PNW - Ad Watcher
// @namespace   https://politicsandwar.com
// @version     1
// @description This script automaticaly watches Ads on PNW, please make sure to fill data: {'account_id' : 'XXXX', 'api_key' : 'YYY'} with details.
// @author      https://github.com/michalani/
// @license     MIT
// @include     https://politicsandwar.com/rewarded-ads/
// @grant       none
// @require     https://cdn.applixir.com/applixir.sdk3.0m.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon        https://www.google.com/s2/favicons?domain=politicsandwar.com
// @updateURL   https://raw.githubusercontent.com/michalani/PNW-Scripts/master/AdWatcher.js
// @noframes
// ==/UserScript==

function secondsLeftToWatch(){
    return parseInt(document.getElementById('countdown').textContent.substring(30).replace(" seconds", ""));
}
function setAdsWatched(x){
    document.getElementById('rewarded_ads_watched_today').textContent = x;
    console.log(x + " ads watched in total");
}

    function countWatchedAds() {
        $.ajax({
            url: "https://politicsandwar.com/api/today_rewarded_ads.php",
            method: "POST",
            data: {'account_id' : '', 'api_key' : ''},
            dataType: "json",
            async:false,
            success: function(data){
                if(data.success ==true) {
                    setAdsWatched(data.rewarded_ads_watched_today);
                    //rewarded_ads_watched_today
                }
            }
        });
    }

function adsWatched(){
    return parseInt(document.getElementById('rewarded_ads_watched_today').textContent)
}
function dummy(){
    console.log("dummy function executed");
}

function watchVideo(){
    console.log("Playing the video");
    document.getElementById("btnAds").click();
}

function doWork(x){
    console.log(x)
}

function main(){
    countWatchedAds();
    if(adsWatched()<25){

        //console.log(adsWatched());
        //watchVideo();
        var options = {
            zoneId: 3776,
            devId: 4777,
            gameId: 5850,
            userId: 384251,  // optional values such as user ID
            custom: 80000,  // optional values such as reward information
            dMode: 1,       // dMode 1 for MD5 checksum 0 for no MD5 checksum
            adStatusCb: dummy,
            fallback: 1,
            btnDelay: 30
        };
        invokeApplixirVideoUnit(options);
    } else {
        clearInterval(myTimer);
    }
}



/*
function main(){
    var clicked = 0;
    var adsSeen = adsWatched();
    var secLeft = 0;

    if(adsSeen < 25){
        secLeft = secondsLeftToWatch();
        if(isNaN(secondsLeftToWatch()) || secLeft == 1){
            watchVideo();
            //while(isNaN(secondsLeftToWatch())){
            //    setTimeout(main, 3000);
            //}
        } else{
            setTimeout(main, (secLeft+"000"));
        }
    }
    //console.log(secondsLeftToWatch());
    //console.log(document.getElementById("btnAds"));
}

*/

/*
function main(){
    console.log(secondsLeftToWatch());
    console.log(adsWatched());
}*/
//setTimeout(main, 3000);
//main();


//setTimeout(watchVideo, 3000);
setTimeout(main, 3000);
var myTimer = setInterval(function() {
    main();
}, 181000);   // Interval set to 4 seconds
//181000