// ==UserScript==
// @name         newincrementalgame-custom
// @namespace    https://github.com/hotarunx
// @version      1.0.0
// @description  ツイートボタンの埋め込みテキストに情報を追加します
// @author       hotarunx
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/push.js/1.0.12/push.min.js
// ==/UserScript==

"use strict";

/** localStorageのプレフィックス */
const keyPrefix = "hotarunx/newincrementalgame-custom/";

/** localStorageのKey集合 */
const lsKey = {
  lastCurrentWorld: keyPrefix + "lastCurrentWorld",
  lastCurrentTab: keyPrefix + "lastCurrentTab",
  generateButtonKey: function (name: string, index: number | null = null) {
    const key = keyPrefix + "/" + name + "/" + (index ?? 0).toString();
    return key;
  },
} as const;

class Buttons {
  /** 発生器購入ボタン */
  generator;
  /** 裏発生器購入ボタン */
  darkGenerator;
  /** 時間加速器購入ボタン */
  accelerator;
  /** 段位アイテム購入ボタン */
  levelItem;
  自動購入;
  輝き消費;
  自動段位リセット;
  自動段位リセットIF;
  自動階位リセット;
  自動階位リセットIF;
  自動階位稼ぎ;
  自動階位稼ぎIF;
  効力自動設定;
  挑戦自動開始;
  挑戦自動開始TA;
  constructor() {
    this.generator = document.querySelectorAll(".generator > button.gbutton");
    this.darkGenerator = document.querySelectorAll(
      ".darkgenerator > button.gbutton"
    );
    this.accelerator = document.querySelectorAll("button.abutton");
    this.levelItem = document.querySelectorAll("button.lbutton");
    this.自動購入 = document.getElementsByClassName("自動購入");
    this.輝き消費 = document.getElementsByClassName("輝き消費");
    this.自動段位リセット = document.getElementsByClassName("自動段位リセット");
    this.自動段位リセットIF =
      document.getElementsByClassName("自動段位リセットIF");
    this.自動階位リセット = document.getElementsByClassName("自動階位リセット");
    this.自動階位リセットIF =
      document.getElementsByClassName("自動階位リセットIF");
    this.自動階位稼ぎ = document.getElementsByClassName("自動階位稼ぎ");
    this.自動階位稼ぎIF = document.getElementsByClassName("自動階位稼ぎIF");
    this.効力自動設定 = document.getElementsByClassName("効力自動設定");
    this.挑戦自動開始 = document.getElementsByClassName("挑戦自動開始");
    this.挑戦自動開始TA = document.getElementsByClassName("挑戦自動開始TA");
  }
}

/**
 * ボタンが選択されているか
 */
function buttonSelected(buttons: NodeList | HTMLCollection) {
  let selected = false;
  for (let i = 0; i < buttons.length; i++) {
    const element = buttons[i] as HTMLButtonElement;
    if (element.classList.contains("selected")) {
      selected = true;
    }
  }
  return selected;
}

let thisButtons: Buttons;

/** ゲームのインスタンス */
const ctx = (() => {
  const app = document.getElementById("app") as any;
  return app.__vue_app__._instance.ctx;
})();
// @ts-ignore
// eslint-disable-next-line no-undef
ctx0 = ctx;
// デバッグで触るよう

/**
 * alert関数を無視する 一時的に別の関数に置き換える
 */
function ignoreAlert(f: () => void) {
  // confirm, alertを無視する
  // eslint-disable-next-line no-unused-vars
  const confirmOrg = confirm;
  // eslint-disable-next-line no-unused-vars
  const alertOrg = alert;

  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  confirm = () => true;
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  alert = () => true;

  f();

  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  confirm = confirmOrg;
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  alert = alertOrg;
}

// メイン処理
window.addEventListener("load", function () {
  // 最初に実行する処理を実行
  initialProcess();

  // 処理を定期実行するよう設定
  setInterval(intervalProcess, 100);

  // updateメソッド修正
  const _update = ctx.update.bind(ctx);
  ctx.update = () => {
    updateBefore();
    _update();
    updateAfter();
  };

  // resetLevel（段位リセット）メソッド修正
  const _resetLevel = ctx.resetLevel.bind(ctx);
  // @ts-ignore
  ctx.resetLevel = (force, exit) => {
    resetLevelBefore();
    _resetLevel(force, exit);
    resetLevelAfter();
  };

  // resetRank（階位リセット）メソッド修正
  const _resetRank = ctx.resetRank.bind(ctx);
  // @ts-ignore
  ctx.resetRank = (force) => {
    resetRankBefore();
    _resetRank(force);
    resetRankAfter();
  };
});

function initialProcess() {
  // カスタム領域追加
  addCustomDiv();

  thisButtons = new Buttons();

  // 前いた世界とタブを読み込む
  const lastCurrentWorld = parseInt(
    localStorage.getItem(lsKey.lastCurrentWorld) ?? ""
  );
  const lastCurrentTab = localStorage.getItem(lsKey.lastCurrentTab);
  if (lastCurrentWorld) ctx.moveworld(lastCurrentWorld);
  if (lastCurrentTab) ctx.changeTab(lastCurrentTab);
}
function intervalProcess() {
  // 今いる世界とタブを保存する
  localStorage.setItem(lsKey.lastCurrentWorld, ctx.world);
  localStorage.setItem(lsKey.lastCurrentTab, ctx.player.currenttab);

  autoLevelReset();
  autoRankReset();
  autoEarnRank();
  autoBuy();
  autoSelectReward();
  autoSpendShine();
  autoStartChallenge();
}
function updateBefore() {}
function updateAfter() {}
function resetLevelBefore() {
  効力型保存();
  効力型適用(効力型集.リセット稼ぎ, 上位効力型集.リセット稼ぎ);
}
function resetLevelAfter() {
  保存効力型適用();
}
function resetRankBefore() {
  // 効力型適用(効力型集.稼ぎ, 上位効力型集.稼ぎ);
}
function resetRankAfter() {}

/**
 * ボタンを作成する
 *
 * @param {string} label ラベル
 * @param {string} buttonClass ボタン独自のクラス ボタン参照時に使う
 * @param {(number | null)} [index=null] index インデックス localStorageのキー
 * @return {*}
 */
function createButton(
  label: string,
  buttonClass: string,
  index: number | null = null
) {
  // ボタン作成
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.addEventListener("click", () => b.classList.toggle("selected"));

  // ボタン選択状態の読み込み保存機能

  const key = lsKey.generateButtonKey(buttonClass, index);

  // localStorageからclassを読み込む
  const item = localStorage.getItem(key);
  if (item) {
    b.className = item;
  } else {
    b.classList.add("button", "autobuyerbutton", buttonClass);
  }

  // ボタンがクリックされたときclassをlocalStorageに保存する
  b.addEventListener("click", () => {
    localStorage.setItem(key, b.className);
  });

  return b;
}

function createInputForm(inputClass: string) {
  // フォーム作成
  const b = document.createElement("input");
  b.type = "text";
  b.value = "1";
  b.classList.add(inputClass);

  // フォーム選択状態の読み込み保存機能
  const key = lsKey.generateButtonKey(inputClass);

  // localStorageからclassを読み込む
  const item = localStorage.getItem(key);
  if (item) {
    b.value = item;
  }

  // フォームが変更されたときclassをlocalStorageに保存する
  b.addEventListener("change", () => {
    localStorage.setItem(key, b.value);
  });

  return b;
}

function createTextArea(inputClass: string) {
  // フォーム作成
  const b = document.createElement("textarea");
  b.value = "";
  b.rows = 30;
  b.cols = 80;
  b.classList.add(inputClass);

  // フォーム選択状態の読み込み保存機能
  const key = lsKey.generateButtonKey(inputClass);

  // localStorageからclassを読み込む
  const item = localStorage.getItem(key);
  if (item) {
    b.value = item;
  }

  // フォームが変更されたときclassをlocalStorageに保存する
  b.addEventListener("change", () => {
    localStorage.setItem(key, b.value);
  });

  return b;
}

/**
 * 自動タブのページに設定ボタンを追加する
 */
function addCustomDiv() {
  // 自動タブのdiv要素を取得する
  // autoTabStringのテキストを含むdivを自動タブと判定する
  const autoTabString = "自動購入器設定";

  const container = document.getElementsByClassName("container")[0];
  if (!container) return;

  const containerChildren = Array.from(container.children);
  const autoTab = containerChildren.find(
    (element) =>
      element.textContent !== null &&
      element.textContent.indexOf(autoTabString) >= 0
  );

  if (!autoTab) return;

  // 自動タブにボタンを含む新たなdiv要素を追加する
  {
    /** 追加する要素全体 */
    const additionalDiv = document.createElement("div");
    additionalDiv.appendChild(
      document.createTextNode("newincrementalgame-custom")
    );
    autoTab.appendChild(additionalDiv);

    /** 購入ボタン領域 */
    {
      const d = document.createElement("div");
      additionalDiv.appendChild(d);

      d.appendChild(document.createTextNode("自動購入"));
      d.appendChild(createButton("自動購入", "自動購入"));
      d.appendChild(createButton("輝き消費", "輝き消費"));
    }

    /** 自動リセットボタン領域 */
    {
      const d = document.createElement("div");
      additionalDiv.appendChild(d);

      d.appendChild(document.createTextNode("自動リセット"));
      d.appendChild(createButton("自動段位リセット", "自動段位リセット"));
      d.appendChild(createInputForm("自動段位リセットIF"));
      d.appendChild(createButton("自動階位リセット", "自動階位リセット"));
      d.appendChild(createInputForm("自動階位リセットIF"));
      d.appendChild(createButton("自動階位稼ぎ", "自動階位稼ぎ"));
      d.appendChild(createInputForm("自動階位稼ぎIF"));
    }

    /** 効力自動設定ボタン領域 */
    {
      const d = document.createElement("div");
      additionalDiv.appendChild(d);

      d.appendChild(document.createTextNode("効力自動設定"));
      d.appendChild(createButton("効力自動設定", "効力自動設定"));
    }

    /** 挑戦自動開始ボタン領域 */
    {
      const d = document.createElement("div");
      additionalDiv.appendChild(d);

      d.appendChild(document.createTextNode("挑戦自動開始"));
      d.appendChild(createButton("挑戦自動開始", "挑戦自動開始"));
      d.appendChild(document.createElement("br"));
      d.appendChild(createTextArea("挑戦自動開始TA"));
    }

    // /** 購入機通知ボタン領域 */
    // {
    //   const d = document.createElement("div");
    //   additionalDiv.appendChild(d);

    //   d.appendChild(document.createTextNode("通知設定"));
    //   const b = createButton("挑戦達成", "achieveChallenge");
    //   d.appendChild(b);
    // }
  }
}

function autoBuy() {
  if (!buttonSelected(thisButtons.自動購入)) return;

  // 階位アイテム
  // 裏発生器
  // 時間加速器
  // 発生器

  for (let i = thisButtons.levelItem.length - 1; i >= 0; i--) {
    const button = thisButtons.levelItem[i] as HTMLButtonElement;
    if (!button.classList.contains("unavailable")) {
      button.click();
    }
  }

  for (let i = thisButtons.darkGenerator.length - 1; i >= 0; i--) {
    const button = thisButtons.darkGenerator[i] as HTMLButtonElement;
    if (!button.classList.contains("unavailable")) {
      button.click();
    }
  }

  for (let i = thisButtons.accelerator.length - 1; i >= 0; i--) {
    const button = thisButtons.accelerator[i] as HTMLButtonElement;
    if (!button.classList.contains("unavailable")) {
      button.click();
    }
  }

  for (let i = thisButtons.generator.length - 1; i >= 0; i--) {
    const button = thisButtons.generator[i] as HTMLButtonElement;
    if (!button.classList.contains("unavailable")) {
      button.click();
    }
  }
}

function autoSpendShine() {
  if (!buttonSelected(thisButtons.輝き消費)) return;

  if (ctx.player.shine > 0) ctx.spendshine(1);
  if (ctx.player.brightness > 0) ctx.spendbrightness(1);
}

function autoLevelReset() {
  if (!buttonSelected(thisButtons.自動段位リセット)) return;

  // @ts-ignore
  let customBorder: string = thisButtons.自動段位リセットIF[0].value;
  if (isNaN(Number(customBorder)) || customBorder === "") {
    customBorder = "1";
  }

  const can = (() => {
    if (ctx.player.money.greaterThanOrEqualTo(customBorder)) {
      if (ctx.player.money.greaterThanOrEqualTo("1e18")) {
        if (ctx.player.onchallenge && ctx.player.challenges.includes(0)) {
          // @ts-ignore
          // eslint-disable-next-line no-undef
          if (ctx.player.money.lt(new Decimal("1e24"))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  })();

  if (!can) return;

  ignoreAlert(() => {
    // @ts-ignore
    ctx.resetLevel(false, false);
  });
}

function autoRankReset() {
  if (!buttonSelected(thisButtons.自動階位リセット)) return;

  // @ts-ignore
  let customBorder: string = thisButtons.自動階位リセットIF[0].value;
  if (isNaN(Number(customBorder)) || customBorder === "") {
    customBorder = "1";
  }

  const can = (() => {
    if (ctx.player.money.greaterThanOrEqualTo(customBorder)) {
      if (ctx.player.money.greaterThanOrEqualTo(ctx.resetRankborder())) {
        if (ctx.player.onchallenge && ctx.player.challenges.includes(0)) {
          // @ts-ignore
          // eslint-disable-next-line no-undef
          if (ctx.player.money.greaterThanOrEqualTo(ctx.resetRankborder())) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  })();

  if (!can) return;

  thisButtons.自動段位リセット[0]?.classList.add("selected");

  ignoreAlert(() => {
    // @ts-ignore
    ctx.resetRank(false);
  });
}

function autoEarnRank() {
  if (!buttonSelected(thisButtons.自動階位稼ぎ)) return;

  // @ts-ignore
  let customBorder: string = thisButtons.自動階位稼ぎIF[0].value;
  if (isNaN(Number(customBorder)) || customBorder === "") {
    customBorder = "1";
  }

  if (ctx.player.levelresettime.greaterThanOrEqualTo(customBorder)) {
    thisButtons.自動段位リセット[0]?.classList.remove("selected");
  }
}

function clearChallangeBonus() {
  for (let i = 0; i < 15; i++) {
    if (ctx.player.challengebonuses.includes(i)) {
      ctx.buyRewards(i);
    }
  }
}

function clearRankChallangeBonus() {
  for (let i = 0; i < 15; i++) {
    if (ctx.player.rankchallengebonuses.includes(i)) {
      ctx.buyrankRewards(i);
    }
  }
}

const 効力型集 = {
  tmp: [0],
  リセット稼ぎ: [0, 1, 8, 12],
  挑戦: [4, 2, 3, 7, 11, 13, 6, 10],
  挑戦4: [4, 2, 3, 13, 7, 11, 6, 10],
  通常: [2, 3, 7, 11, 13, 6, 10],
};
const 上位効力型集 = {
  tmp: [0],
  リセット稼ぎ: [0, 1, 8, 12],
  通常: [2, 3, 4, 7, 10, 11, 9, 13],
};

function 効力型適用(rewardSet: number[], rankRewardSet: number[]) {
  clearChallangeBonus();
  clearRankChallangeBonus();

  rewardSet.forEach((element) => {
    ctx.buyRewards(element);
  });
  rankRewardSet.forEach((element) => {
    ctx.buyrankRewards(element);
  });
}

function 効力型保存() {
  let 効力型: number[] = [];
  let 上位効力型: number[] = [];
  for (const i of ctx.player.challengebonuses) {
    効力型.push(i);
  }
  for (const i of ctx.player.rankchallengebonuses) {
    上位効力型.push(i);
  }
  効力型集.tmp = 効力型;
  上位効力型集.tmp = 上位効力型;
}

function 保存効力型適用() {
  効力型適用(効力型集.tmp, 上位効力型集.tmp);
}

/**
 * 自動効力選択とモード選択
 */
function autoSelectReward() {
  if (!buttonSelected(thisButtons.効力自動設定)) return;

  // 自動効力選択

  let 効力型 = 効力型集.通常;
  let 上位効力型 = 上位効力型集.通常;

  if (ctx.player.onchallenge) {
    if (ctx.player.onchallenge && ctx.player.challenges.includes(3)) {
      効力型 = 効力型集.挑戦4;
    } else {
      効力型 = 効力型集.挑戦;
    }
  }

  上位効力型 = 上位効力型集.通常;
  効力型適用(効力型, 上位効力型);

  // モード選択
  if (!ctx.player.challengebonuses.includes(13)) {
    if (!(ctx.player.onchallenge && ctx.player.challenges.includes(3))) {
      ctx.player.generatorsMode = [0, 1, 2, 3, 4, 5, 6, 7];
    }
  }
}

// 挑戦自動開始
function autoStartChallenge() {
  // ボタンが押されてない、挑戦中、段位タブが表示されてないなら、何もせず終了
  if (!buttonSelected(thisButtons.挑戦自動開始)) return;
  if (ctx.player.onchallenge) return;
  if (!(ctx.player.levelresettime.gt(0) || ctx.player.rankresettime.gt(0)))
    return;

  // @ts-ignore
  const operations: string[] = thisButtons.挑戦自動開始TA[0]?.value.split("\n");

  operations.some((operation) => {
    const a = operation.trim().split(/\s*,\s*/);
    const an = a.map(Number).map((x) => x - 1);

    if (a.includes("shrinkworld")) {
      ignoreAlert(() => {
        ctx.shrinkworld(ctx.world);
      });
    }

    if (a.includes("rankresettime")) {
      if (ctx.rankresettime.gt(0)) {
        thisButtons.自動段位リセット[0]?.classList.add("selected");
      } else {
        thisButtons.自動段位リセット[0]?.classList.remove("selected");
        thisButtons.自動階位リセット[0]?.classList.add("selected");
      }
      return true;
    }

    let isRankChallenge = a.includes("rank");

    // eslint-disable-next-line no-unused-vars
    const challengeId = ctx.getchallengeid(an);

    if (challengeId === 0) {
      return false;
    }
    if (!isRankChallenge && ctx.player.challengecleared.includes(challengeId)) {
      return false;
    }
    if (
      isRankChallenge &&
      ctx.player.rankchallengecleared.includes(challengeId)
    ) {
      return false;
    }

    for (let i = 0; i < 8; i++) {
      if (
        (ctx.player.challenges.includes(i) || an.includes(i)) &&
        !(ctx.player.challenges.includes(i) && an.includes(i))
      ) {
        ctx.configchallenge(i);
      }
    }

    if (isRankChallenge) {
      thisButtons.自動段位リセット[0]?.classList.remove("selected");
    }
    ignoreAlert(() => {
      ctx.startChallenge();
    });
    return true;
  });
}
