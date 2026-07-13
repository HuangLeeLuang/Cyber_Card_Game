# 賽博牌局

一款可在瀏覽器遊玩的短局賽博卡牌遊戲。卡池目前 160 張，包含 AI 生成卡牌插畫圖集、兩回合奢侈品投資，以及刀、手槍、步槍、機槍、狙擊槍與拳套武器。

## 網站

部署到 GitHub Pages 後，首頁會是：

`https://huangleeluang.github.io/Cyber_Card_Game/`

## 頁面

- `index.html`：遊戲本體
- `story.html`：劇情模式，含新手教學、章節進度與破關圖片
- `modifier.html`：修改器，可調整規則與卡牌數值
- `guide.html`：攻略與推薦打法

## iPhone 離線遊玩

先用 iPhone Safari 開啟 GitHub Pages 網站，等待首頁與卡圖載入完成，再從分享選單選擇「加入主畫面」。之後可從主畫面的「賽博牌局」離線開啟遊戲、劇情、修改器與攻略。

首次安裝及取得網站更新時仍需要網路。牌組、自製卡與劇情進度只保存在安裝它的裝置上。

## 本機預覽

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

然後開啟 `http://127.0.0.1:4173/`。
