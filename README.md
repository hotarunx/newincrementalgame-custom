# newincrementalgame-custom

## 自動化したい機能

1. 段位リセット
2. 階位リセット
3. 輝き消費
   1. 煌き消費
4. 購入
   1. 発生器
   2. 時間加速器
   3. 裏発生器
   4. 階位得点
5. 効力変更

## 辞書

level
: 段位
Rank
: 階位

ctx0.player.challengebonuses

          this.buyRewards(i)
          this.buyRewards(i)
            this.buyrankRewards(i)
      if(this.player.challengebonuses.includes(index)){

報酬削除
      for(let i=0;i<15;i++){
        if(this.player.rankchallengebonuses.includes(i)){
          this.buyrankRewards(i)
        }
      }
