// ==UserScript==
// @name         newincrementalgame-custom
// @namespace    https://github.com/hotarunx
// @version      1.0.0
// @description  新しい放置ゲーム(1).fileを改造する。
// @author       hotarunx
// @license      MIT
// @supportURL   https://github.com/hotarunx/newincrementalgame-custom/issues
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.12/push.min.js
// ==/UserScript==
(() => {
    // sessionStorageのプレフィックス
    const keyPrefix = 'hotarunx/newincrementalgame-custom_';
    // 自作自動購入機機能
    /** 購入機有効ボタンクラス */
    const buyerButtonClass = 'custom-buyer-button';
    /** 購入機通知ボタンクラス */
    const noticeButtonClass = 'custom-notice-button';
    /** 昇階リセット後自動昇段リセット有効ボタンクラス */
    const autoEnableLevelResetClass = 'custom-auto-enable-level-reset';
    // DOM編集
    addMyAutoBuyerButton();
    enableLevelResetDiv();
    addNotice();
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call */
    // @ts-ignore
    // vueインスタンスのctx取得
    const ctx = document.getElementById('app').__vue_app__._instance.ctx;
    // メソッド更新
    const _update = ctx.update.bind(ctx);
    ctx.update = () => {
        _update();
        runBuyer();
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
    // すべての発生器購入・時間加速器購入・段位リセットボタンを押す
    function runBuyer() {
        // confirm, alertを無視する
        const confirmOrg = confirm;
        const alertOrg = alert;
        /* eslint-disable no-global-assign, @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        confirm = () => true;
        // @ts-ignore
        alert = () => true;
        /* eslint-enable no-global-assign, @typescript-eslint/ban-ts-comment */
        const genBuyerButton = document.getElementsByClassName(buyerButtonClass)[0];
        const accBuyerButton = document.getElementsByClassName(buyerButtonClass)[1];
        const lBuyerButton = document.getElementsByClassName(buyerButtonClass)[2];
        const rBuyerButton = document.getElementsByClassName(buyerButtonClass)[3];
        // 昇階リセット
        if (rBuyerButton.classList.contains('selected')) {
            const rBuyButton = document.querySelector('#rankreset > button');
            if (rBuyButton != null) {
                rBuyButton.click();
            }
        }
        // 昇段リセット
        if (lBuyerButton.classList.contains('selected')) {
            const lBuyButton = document.querySelector('#levelreset > button');
            if (lBuyButton != null) {
                lBuyButton.click();
            }
        }
        // 時間加速器
        if (accBuyerButton.classList.contains('selected')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            for (let i = ctx.player.accelerators.length - 1; i >= 0; i--) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ctx.buyAccelerator(i);
            }
        }
        // 発生器
        if (genBuyerButton.classList.contains('selected')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            for (let i = ctx.player.generators.length - 1; i >= 0; i--) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ctx.buyGenerator(i);
            }
        }
        /* eslint-disable no-global-assign, @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        confirm = confirmOrg;
        // @ts-ignore
        alert = alertOrg;
        /* eslint-enable no-global-assign, @typescript-eslint/ban-ts-comment */
    }
    /** 自作自動購入機のボタンを作成する */
    function createBuyerButton(label, buttonClass, index) {
        // ボタン作成
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.addEventListener('click', () => b.classList.toggle('selected'));
        // sessionStorageからclassを読み込む classの状態をsessionStorageに保存する
        const key = keyPrefix + buttonClass + (index != null ? index.toString() : '');
        const dataItem = sessionStorage.getItem(key);
        if (dataItem != null) {
            b.className = dataItem;
        }
        else {
            b.classList.add('button', 'autobuyerbutton', buttonClass);
        }
        b.addEventListener('click', () => {
            sessionStorage.setItem(key, b.className);
        });
        return b;
    }
    /** 自作自動購入機を有効にするボタンを追加する */
    function addMyAutoBuyerButton() {
        // 自動タブのdiv要素を取得する
        // autoTabStringのテキストを含むdivを自動タブと判定する
        const autoTabString = '自動購入機設定';
        const container = document.getElementsByClassName('container')[0];
        if (container === null)
            return;
        const containerChildren = Array.from(container.children);
        const autoTab = containerChildren.find((element) => element.textContent != null && element.textContent.indexOf(autoTabString) >= 0);
        if (autoTab === undefined)
            return;
        // 自動タブにボタンを含む新たなdiv要素を追加する
        {
            /** 追加する要素全体 */
            const additionalDiv = document.createElement('div');
            additionalDiv.appendChild(document.createElement('br'));
            additionalDiv.appendChild(document.createTextNode('自作自動購入機設定'));
            const labels = ['発生器', '加速器', '段位リセット', '階位リセット'];
            /** 購入機有効ボタン領域 */
            const buyerButtonDiv = document.createElement('div');
            buyerButtonDiv.appendChild(document.createTextNode('自動購入設定'));
            for (let i = 0; i < 4; i++) {
                const b = createBuyerButton(labels[i], buyerButtonClass, i);
                buyerButtonDiv.appendChild(b);
            }
            additionalDiv.appendChild(buyerButtonDiv);
            /** 購入機通知ボタン領域 */
            const noticeButtonDiv = document.createElement('div');
            noticeButtonDiv.appendChild(document.createTextNode('通知設定'));
            for (let i = 0; i < 4; i++) {
                const b = createBuyerButton(labels[i], noticeButtonClass, i);
                if (i < 2) {
                    b.hidden = true;
                }
                noticeButtonDiv.appendChild(b);
            }
            additionalDiv.appendChild(noticeButtonDiv);
            /** 昇階リセット後自動昇段リセット有効ボタン領域 */
            const autoEnableRankResetDiv = document.createElement('div');
            autoEnableRankResetDiv.appendChild(document.createTextNode('昇階リセット後自動昇段リセット設定'));
            {
                const b = createBuyerButton('変更', autoEnableLevelResetClass, null);
                autoEnableRankResetDiv.appendChild(b);
            }
            additionalDiv.appendChild(autoEnableRankResetDiv);
            autoTab.appendChild(additionalDiv);
        }
    }
    /** 通知機能を追加する */
    function addNotice() {
        const levelrcontents = document.getElementsByClassName('levelrcontents')[0];
        const rankrcontents = document.getElementsByClassName('rankrcontents')[0];
        levelrcontents.addEventListener('DOMNodeInserted', () => {
            const lNoticeButton = document.getElementsByClassName(noticeButtonClass)[2];
            if (lNoticeButton.classList.contains('selected')) {
                /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                Push.create('昇段リセットしました。');
                /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
            }
        });
        rankrcontents.addEventListener('DOMNodeInserted', () => {
            const rNoticeButton = document.getElementsByClassName(noticeButtonClass)[2];
            if (rNoticeButton.classList.contains('selected')) {
                /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                Push.create('昇階リセットしました。');
                /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
            }
        });
    }
    /** 昇階リセット後に自動昇段リセットボタンを押下状態に */
    function enableLevelResetDiv() {
        const levelrcontents = document.getElementsByClassName('levelrcontents')[0];
        levelrcontents.addEventListener('DOMNodeInserted', () => {
            const rBuyerButton = document.getElementsByClassName(buyerButtonClass)[2];
            const autoEnableLevelResetClassButton = document.getElementsByClassName(autoEnableLevelResetClass)[0];
            if (autoEnableLevelResetClassButton.classList.contains('selected')) {
                rBuyerButton.classList.add('selected');
            }
        });
    }
})();
