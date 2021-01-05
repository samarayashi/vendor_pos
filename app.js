var path = require('path');
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var products_ejs = require('./models/productsBean.js').productsBean;
// var sqilte_module = require('./models/sqlite_module.js');
var mysql = require('./models/mysql_module/mysql.js')
var vendorSQL = new mysql.vendorSQL()
// var sql = new sqilte_module.sql('hot_dog.db');
// sql.init_db()

const PORT = process.env.PORT || 5438
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/views')))
app.set('view engine', 'ejs');
index_ejs = {
    product1: {
        html_name: '火腿熱狗',
        input_name: "normal_hot_dog"
    },
    product2: {
        html_name: '原味熱狗',
        input_name: "hot_dog_fort"
    },
    product3: {
        html_name: '脆薯熱狗',
        input_name: "french_fries_dog"
    }
}
app.get('/', function (req, res) {
    res.render('index', products_ejs)
});


app.post('/send_order', function (req, res) {
    var sheet_number = req.body.sheet_number;
    var normal_number = req.body.normal_hot_dog;
    var fort_number = req.body.hot_dog_fort;
    var french_number = req.body.french_fries_dog;
    var totoal_price = req.body.total_price;
    var data = [sheet_number, normal_number, fort_number, french_number, 0, totoal_price, 0]
    console.log(totoal_price);
    vendorSQL.insert_order(data);

    // 希望傳值處理完後仍保持原本頁面
    res.render('index', index_ejs);
});


app.post('/payment', function (req, res) {
    var sheet_num = [req.body.checked_sheet_number];
    vendorSQL.update_payment(sheet_num);
})

app.post('/cancel', function (req, res) {
    var sheet_num = [req.body.cancel_sheet_number];
    vendorSQL.cancel_payment(sheet_num);
})

app.post('/test', function (req, res) {
    vendorSQL.get_unpayment();
})

app.get('*', function (req, res) {
    res.status(404);
    res.send('找不到網頁！');
});

app.listen(PORT, function (req, res) {
    console.log(`網站伺服器在${PORT}埠口開工了！`);
});