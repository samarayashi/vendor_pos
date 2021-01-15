# pos-nodejs
使用說明：
1. 開方環境為Node.js 8.11.4
2. 有sqlite和mysql兩種版本
3. 本機端單機使用 => sqlite
4. 部署heroku => mysql配合heroku上的clear db

希望利用nodejs寫出一個簡單的pos系統，可以在品項少人潮快速流動的攤位使用
目前大致架構
1. 前端頁面利用ajax向後端傳值
2. nodejs充當router並且對db操作
3. 資料庫撈出的值暫放在session storage

未實踐部分
1. 在平板上運行時，似乎需要修改點擊物件的大小
2. 資料庫做成關聯式

關聯式資料庫雛形
- table：orders、products、orders_products
1. order：order_ID(pk), order_datetime, total_price, payment_status
2. product: product_ID(pk), prdocut_name, produc_price
3. orders: order_id(pf), product_id(pf), quantity, tomato_sauce, mustard_sauce, both_sauce

