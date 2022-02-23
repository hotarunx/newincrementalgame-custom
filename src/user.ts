(() => {
  // sessionStorageのプレフィックス
  const keyPrefix = "hotarunx/newincrementalgame-custom_";

  // 自作自動購入機機能
  /** 購入機有効ボタンクラス */
  const buyerButtonClass = "custom-buyer-button";
  /** 購入機通知ボタンクラス */
  const noticeButtonClass = "custom-notice-button";
  /** 昇階リセット後自動昇段リセット有効ボタンクラス */
  const autoEnableLevelResetClass = "custom-auto-enable-level-reset";

  // DOM編集
  addMyAutoBuyerButton();
  addNotice();
  addWikiLink();

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call */
  // @ts-ignore
  // vueインスタンスのctx取得
  function getCtx() {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return document.getElementById("app").__vue_app__._instance.ctx;
  }
  const ctx = getCtx();
  // メソッド更新
  const _update = ctx.update.bind(ctx);
  ctx.update = () => {
    _update();
    runBuyer();

    if (ctx.player.money.toNumber() > 1e80) {
      ctx.resetLevel();
      console.log(ctx.player.money.toNumber());
    }
  };

  const _resetLevel = ctx.resetLevel.bind(ctx);
  // @ts-ignore
  ctx.resetLevel = (force, exit) => {
    const bonuses: number[] = Array.from(ctx.player.challengebonuses);
    // const bonusesReset: number[] = [0, 1, 4, 8];
    const bonusesReset: number[] = [0, 1, 4, 8, 12];
    for (const i of bonuses) ctx.buyRewards(i);
    for (const i of bonusesReset) ctx.buyRewards(i);
    // @ts-ignore
    _resetLevel(force, exit);
    for (const i of bonusesReset) ctx.buyRewards(i);
    for (const i of bonuses) ctx.buyRewards(i);
    autoEarningLevelReset();
  };

  const _resetRank = ctx.resetRank.bind(ctx);
  ctx.resetRank = () => {
    const bonuses: number[] = Array.from(ctx.player.challengebonuses);
    // const bonusesReset: number[] = [0, 1, 4, 8];
    const bonusesReset: number[] = [0, 1, 4, 8, 12];
    for (const i of bonuses) ctx.buyRewards(i);
    for (const i of bonusesReset) ctx.buyRewards(i);
    _resetRank();
    for (const i of bonusesReset) ctx.buyRewards(i);
    for (const i of bonuses) ctx.buyRewards(i);
    autoEarningRankReset();
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
    const levelResetBuyerButton =
      document.getElementsByClassName(buyerButtonClass)[2];
    const rankResetBuyerButton =
      document.getElementsByClassName(buyerButtonClass)[3];
    const levelItemBuyerButton =
      document.getElementsByClassName(buyerButtonClass)[4];

    // 昇階リセット
    if (rankResetBuyerButton.classList.contains("selected")) {
      const rBuyButton: HTMLElement | null = document.querySelector(
        "#rankreset > button"
      );
      if (rBuyButton != null) {
        rBuyButton.click();
      }
    }

    // 昇段リセット
    if (levelResetBuyerButton.classList.contains("selected")) {
      const lBuyButton: HTMLElement | null = document.querySelector(
        "#levelreset > button"
      );
      if (lBuyButton != null) {
        lBuyButton.click();
      }
    }

    // 段位捧所
    if (levelItemBuyerButton.classList.contains("selected")) {
      const buttons = document.getElementsByClassName("lbutton");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (let i = 5 - 1; i >= 0; i--) {
        if (
          i < buttons.length &&
          !buttons[i].classList.contains("unavailable")
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ctx.buylevelitems(i);
        }
      }
    }

    // 時間加速器
    if (accBuyerButton.classList.contains("selected")) {
      const buttons = document.getElementsByClassName("abutton");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (let i = ctx.player.accelerators.length - 1; i >= 0; i--) {
        if (
          i < buttons.length &&
          !buttons[i].classList.contains("unavailable")
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ctx.buyAccelerator(i);
          ctx.buyAccelerator(i);
          ctx.buyAccelerator(i);
          ctx.buyAccelerator(i);
        }
      }
    }

    // 発生器
    if (genBuyerButton.classList.contains("selected")) {
      const buttons = document.getElementsByClassName("gbutton");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (let i = ctx.player.generators.length - 1; i >= 0; i--) {
        if (
          i < buttons.length &&
          !buttons[i].classList.contains("unavailable")
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ctx.buyGenerator(i);
          ctx.buyGenerator(i);
          ctx.buyGenerator(i);
          ctx.buyGenerator(i);
        }
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
  function createBuyerButton(
    label: string,
    buttonClass: string,
    index: number | null
  ) {
    // ボタン作成
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", () => b.classList.toggle("selected"));

    // sessionStorageからclassを読み込む classの状態をsessionStorageに保存する
    const key =
      keyPrefix + buttonClass + (index != null ? index.toString() : "");
    const dataItem = sessionStorage.getItem(key);
    if (dataItem != null) {
      b.className = dataItem;
    } else {
      b.classList.add("button", "autobuyerbutton", buttonClass);
    }
    b.addEventListener("click", () => {
      sessionStorage.setItem(key, b.className);
    });

    return b;
  }

  /** 自作自動購入機を有効にするボタンを追加する */
  function addMyAutoBuyerButton() {
    // 自動タブのdiv要素を取得する
    // autoTabStringのテキストを含むdivを自動タブと判定する
    const autoTabString = "自動購入器設定";

    const container = document.getElementsByClassName("container")[0];
    if (container === null) return;
    const containerChildren = Array.from(container.children);
    const autoTab = containerChildren.find(
      (element) =>
        element.textContent != null &&
        element.textContent.indexOf(autoTabString) >= 0
    );
    if (autoTab === undefined) return;

    // 自動タブにボタンを含む新たなdiv要素を追加する
    {
      /** 追加する要素全体 */
      const additionalDiv = document.createElement("div");
      additionalDiv.appendChild(document.createElement("br"));
      additionalDiv.appendChild(document.createTextNode("自作自動購入機設定"));

      const labels = [
        "発生器",
        "加速器",
        "段位リセット",
        "階位リセット",
        "段位効力",
      ];
      const n_labels = labels.length;

      /** 購入機有効ボタン領域 */
      const buyerButtonDiv = document.createElement("div");
      buyerButtonDiv.appendChild(document.createTextNode("自動購入設定"));
      for (let i = 0; i < n_labels; i++) {
        const b = createBuyerButton(labels[i], buyerButtonClass, i);
        buyerButtonDiv.appendChild(b);
      }
      additionalDiv.appendChild(buyerButtonDiv);

      /** 購入機通知ボタン領域 */
      const noticeButtonDiv = document.createElement("div");
      noticeButtonDiv.appendChild(document.createTextNode("通知設定"));
      for (let i = 0; i < n_labels; i++) {
        const b = createBuyerButton(labels[i], noticeButtonClass, i);
        if (i < 2) {
          b.hidden = true;
        }
        noticeButtonDiv.appendChild(b);
      }
      additionalDiv.appendChild(noticeButtonDiv);

      /** 昇階リセット後自動昇段リセット有効ボタン領域 */
      const autoEnableLevelResetDiv = document.createElement("div");
      autoEnableLevelResetDiv.appendChild(
        document.createTextNode("昇階リセット後自動昇段リセット設定")
      );
      {
        const b = createBuyerButton("変更", autoEnableLevelResetClass, null);
        autoEnableLevelResetDiv.appendChild(b);
      }
      additionalDiv.appendChild(autoEnableLevelResetDiv);

      autoTab.appendChild(additionalDiv);
    }
  }

  /** 通知機能を追加する */
  function addNotice() {
    const levelrcontents = document.getElementsByClassName("levelrcontents")[0];
    const rankrcontents = document.getElementsByClassName("rankrcontents")[0];

    if (levelrcontents !== undefined) {
      levelrcontents.addEventListener("DOMNodeInserted", () => {
        const lNoticeButton =
          document.getElementsByClassName(noticeButtonClass)[2];
        if (lNoticeButton.classList.contains("selected")) {
          /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          Push.create("昇段リセットしました。");
          /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
        }
      });
    }
    if (rankrcontents !== undefined) {
      rankrcontents.addEventListener("DOMNodeInserted", () => {
        const rNoticeButton =
          document.getElementsByClassName(noticeButtonClass)[3];
        if (rNoticeButton.classList.contains("selected")) {
          /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          Push.create("昇階リセットしました。");
          /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
        }
      });
    }
  }

  /** 昇階リセット後に自動昇段リセットボタンを押下状態に */
  function autoEarningRankReset() {
    const lBuyerButton = document.getElementsByClassName(buyerButtonClass)[2];
    const autoEnableLevelResetClassButton = document.getElementsByClassName(
      autoEnableLevelResetClass
    )[0];
    if (autoEnableLevelResetClassButton.classList.contains("selected"))
      if (!lBuyerButton.classList.contains("selected")) {
        lBuyerButton.click();
      }
  }

  function autoEarningLevelReset() {
    const lBuyerButton = document.getElementsByClassName(buyerButtonClass)[2];
    const autoEnableLevelResetClassButton = document.getElementsByClassName(
      autoEnableLevelResetClass
    )[0];
    if (autoEnableLevelResetClassButton.classList.contains("selected")) {
      if (ctx.player.levelresettime.toNumber() > 30000) {
        if (lBuyerButton.classList.contains("selected")) {
          Push.create("昇段リセット回数が貯まりました。");
          lBuyerButton.click();
        }
      }
    }
  }

  function addWikiLink() {
    const container = document.getElementsByClassName("container")[0];
    if (container != null) {
      const div = document.createElement("div");
      const link = document.createElement("a");
      link.href = "https://w.atwiki.jp/newincrementalgame/";
      link.textContent =
        "新しい放置ゲーム(1).file【8/24更新】 | newincrementalgame";
      link.style.color = "skyblue";
      div.appendChild(link);
      container.appendChild(div);
    }
  }
})();
