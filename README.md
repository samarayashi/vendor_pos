# pos-nodejs

## 描述
希望利用nodejs寫出一個簡單的pos系統

## 使用說明
1. 開方環境為Node.js 8.11.4
2. 有sqlite和mysql兩種版本: 可在app.js調整
3. local端使用sqlite
4. 線上部署heroku，使用mysql配合heroku上的clear db  
    - 部署位置：https://nodejs-pos-mysql.herokuapp.com


## 實作內容
1. 前端頁面利用ajax向後端傳值
2. nodejs充當router並且對db操作
3. 資料庫撈出的值暫放在session storage
4. Flex切版實現RWD，方便電腦、手機、平板等不同視窗大小

### 關聯式資料庫雛形
table：orders、products、orders_products
1. order：order_ID(pk), order_datetime, total_price, payment_status
2. product: product_ID(pk), prdocut_name, produc_price
3. orders: order_id(pf), product_id(pf), quantity, tomato_sauce, mustard_sauce, both_sauce

