# pos-nodejs

## 描述
嘗試使用 Node.js 開發簡單的pos系統，支援本地開發和 Heroku 部署。
替夜市的賣熱狗的朋友小作業練習

## 功能特點

- 訂單狀態追蹤
- 價格計算
- RWD 響應式設計
- 支援本地開發和雲端部署

## 技術棧

- **後端框架**: Express.js
- **前端模板**: EJS
- **資料庫**: 
  - 開發環境: SQLite
  - 生產環境: MySQL (JawsDB on Heroku)
- **前端技術**: 
  - jQuery
  - HTML5
  - CSS3

## 系統需求
- Node.js 18.x
- npm 9.x

## 本地運行：
   - 本地開發預設使用 SQLite 資料庫
   - 複製 `.env.example` 為 `.env`根據需求修改配置
   - `npm install`
   - `npm run`
   - 打開瀏覽器訪問 `http://localhost:5438`
  
## heroku 部署
現在Heroku上已經沒有免費的部署容器。因此現在Basic dynos被我關掉。
1. 在 Heroku 創建新應用
2. 添加 JawsDB MySQL 附加元件（程式會自動抓取precess的參數進行連線）
3. 連結cicd到github自動部署


## 開發特色

1. **環境適配**
   - 開發環境使用 SQLite，方便本地開發
   - 生產環境自動切換至 MySQL

2. **模組化設計**
   - 資料庫操作統一介面
   - 使用工廠模式切換資料庫

3. **安全性考慮**
   - 環境變數管理敏感資訊
   - 資料庫連線池管理

### 關聯式資料庫雛形（懶了以後再整個重寫，好幾年前的小練習而已）
table：orders、products、orders_products
1. order：order_ID(pk), order_datetime, total_price, payment_status
2. product: product_ID(pk), prdocut_name, produc_price
3. orders: order_id(pf), product_id(pf), quantity, tomato_sauce, mustard_sauce, both_sauce

