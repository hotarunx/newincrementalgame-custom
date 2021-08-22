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
    function clickAllButton() {
        // confirm, alertを無視する
        confirm = () => true;
        alert = () => true;
        const rButton = document.querySelector("#levelreset > button");
        if (rButton != null) {
            rButton.click();
        }
        const buttonList = document.querySelectorAll(".gbutton, .abutton");
        const buttonArray = Array.from(buttonList);
        buttonArray.forEach(element => {
            element.click();
        });
    }
    const container = window.document.getElementById("app");
    const app = container.__vue_app__;
    const ctx = app._instance.ctx;
    const _update = ctx.update.bind(ctx);
    const update = () => {
        _update();
        clickAllButton();
    };
    ctx.update = update;
})();
