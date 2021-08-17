"use strict";
const gButtons = document.querySelectorAll(".gbutton, .abutton");

function clickAnyButton() {
    let aimButton = gButtons[0];
    gButtons.forEach(element => {
        if (element.className.indexOf("unavailable")) {
            aimButton = element;
        }
    });
    if (aimButton.className.indexOf("unavailable")) {
        aimButton.click();
    }
}
const coinamount = document.querySelector("#coinamount");
if (coinamount != null) {
    coinamount.addEventListener("DOMNodeInserted", clickAnyButton);
}