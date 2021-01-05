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
app.get('/', function (req, res) {
    res.render('index', products_ejs)
});


app.post('/send_order', function (req, res) {
    var sheet_number = req.body.sheet_number;
    var product1_number = req.body[products_ejs.product1.input_name];
    var product2_number = req.body[products_ejs.product2.input_name];
    var product3_number = req.body[products_ejs.product3.input_name];
    var totoal_price = req.body.total_price;
    var data = [sheet_number, product1_number, product2_number, product3_number, 0, totoal_price, 0]
    vendorSQL.insert_order(data);
    // 希望傳值處理完後仍保持原本頁面
    res.render('index', products_ejs);
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
    vendorSQL.get_unpayment(function (results) {
        res.send(results);
    });
})

app.get('*', function (req, res) {
    res.status(404);
    res.send('找不到網頁！');
});

app.listen(PORT, function (req, res) {
    console.log(`網站伺服器在${PORT}埠口開工了！`);
});