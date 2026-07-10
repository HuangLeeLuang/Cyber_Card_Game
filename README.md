# 賽博牌局

一款可在瀏覽器遊玩的短局賽博卡牌遊戲。卡池目前 94 張，包含 60 張新增卡與 AI 生成卡牌插畫圖集。

## 網站

部署到 GitHub Pages 後，首頁會是：

`https://huangleeluang.github.io/Cyber_Card_Game/`

## 頁面

- `index.html`：遊戲本體
- `story.html`：劇情模式，含新手教學、章節進度與破關圖片
- `modifier.html`：修改器，可調整規則與卡牌數值
- `guide.html`：攻略與推薦打法

## 本機預覽

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

然後開啟 `http://127.0.0.1:4173/`。
