var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var sql = require('./sqlite_module.js')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index_beta.html'))
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
    res.sendFile(path.join(__dirname, '../public/index_beta.html'));
});

/* 之後再實驗如何對後端傳值
app.get('/payment', function (req, res) {
    var sheet_number = req.query.sheet_number;
    var data = {
        $sheet: sheet_number,
        $status: 1
    }
    // sql.comfirm_order(data);
})
*/

app.get('*', function (req, res) {
    res.status(404);
    res.send('找不到網頁！');
});

app.listen(5438, function (req, res) {
    console.log("網站伺服器在5438埠口開工了！");
});