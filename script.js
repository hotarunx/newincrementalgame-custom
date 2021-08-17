"use strict";
// ==UserScript==
// @name            新しい放置ゲーム自作自動購入機
// @namespace       https://github.com/hotarunx
// @homepage        https://github.com/hotarunx/nig-auto-buy-bot
// @version         0.0.1
// @author          hotarunx
// @match           https://dem08656775.github.io/newincrementalgame/
// @grant           none
// ==/UserScript==
(() => {
    confirm = () => true;
    function clickAnyButton() {
        const rButton = document.querySelector("#levelreset > button");
        if (rButton != null) {
            rButton.click();
        }
        const gButtons = document.querySelectorAll(".gbutton, .abutton");
        let aimButton = gButtons[0];
        gButtons.forEach(element => {
            if (element.className.indexOf("unavailable") < 0) {
                aimButton = element;
            }
        });
        if (aimButton.className.indexOf("unavailable") < 0) {
            aimButton.click();
        }
    }
    const coinamount = document.querySelector("#coinamount");
    if (coinamount != null) {
        coinamount.addEventListener("DOMNodeInserted", clickAnyButton);
    }
    clickAnyButton();
})();
