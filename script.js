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
    // すべての発生器購入・時間加速器購入・段位リセットボタンを押す
    function clickAllButton() {
        // confirm, alertを無視する
        const confirmOrg = confirm;
        const alertOrg = alert;
        confirm = () => true;
        alert = () => true;
        // 段位リセットボタンを押す
        const rButton = document.querySelector("#levelreset > button");
        if (rButton != null) {
            rButton.click();
        }
        // 発生器・時間加速器購入ボタンを押す
        const buttonList = document.querySelectorAll(".gbutton, .abutton");
        const buttonArray = Array.from(buttonList);
        buttonArray.reverse().forEach(element => {
            element.click();
        });
        confirm = confirmOrg;
        alert = alertOrg;
    }
    // clickAllButton関数をVueインスタンスのupdateに含める
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
