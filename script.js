"use strict";
confirm = function () {
    return true;
};
function clickAnyButton() {
    const rButton = document.querySelector("#levelreset > button");
    if (rButton != null) {
        rButton.click();
    }
    const gButtons = document.querySelectorAll(".gbutton, .abutton");
    let aimButton = gButtons[0];
    gButtons.forEach(element => {
        if (element.className.indexOf("unavailable") > 0) {
            aimButton = element;
        }
    });
    if (aimButton.className.indexOf("unavailable") > 0) {
        aimButton.click();
    }
}
const coinamount = document.querySelector("#coinamount");
if (coinamount != null) {
    coinamount.addEventListener("DOMNodeInserted", clickAnyButton);
}
clickAnyButton();
