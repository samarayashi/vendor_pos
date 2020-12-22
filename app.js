var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var app = express();
var products_ejs = require('./models/productsBean.js').productsBean;
var sqilte_module = require('./models/sqlite_module.js');
var sql = new sqilte_module.sql('hot_dog.db');
sql.init_db()

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
    var data = {
        $sheet: sheet_number,
        $fort: fort_number,
        $normal: normal_number,
        $french: french_number
    }
    sql.insert_order(data);

    // 希望傳值處理完後仍保持原本頁面
    res.render('index', index_ejs);
});


app.post('/payment', function (req, res) {
    var checked_sheet_number = req.body.checked_sheet_number;
    var data = {
        $checked_sheet_num: checked_sheet_number
    };
    sql.confirm_order(data);
})

app.get('*', function (req, res) {
    res.status(404);
    res.send('找不到網頁！');
});

app.listen(5438, function (req, res) {
    console.log("網站伺服器在5438埠口開工了！");
});