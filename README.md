# pos-nodejs
使用說明：
1. 先安裝Node.js 8.11.4(為當初開發環境，可自行安裝新版測試)
2. 在目標資料夾中下指令 npm install
3. 運行server中的router測試

希望利用nodejs寫出一個簡單的pos系統，可以實際在夜市佈署
目前大致架構
1. 前端頁面利用ajax向後端傳值
2. nodejs充當router並且對db操作
3. 選擇sqlite當作db
4. 利用local storage製作還原鍵

未實踐部分
1. 在平板上運行時，似乎需要修改點擊物件的大小
2. 資料庫做成關聯式
3. 做成restful，利用ejs產生網頁

關聯式資料庫雛形
table：orders、products、orders_products
order：order_ID(pk), order_datetime, total_price, payment_status
product: product_ID(pk), prdocut_name, produc_price
orders: order_id(pf), product_id(pf), quantity, tomato_sauce, mustard_sauce, both_sauce

