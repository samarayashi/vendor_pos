var express = require("express");
var bodyParser = require("body-parser");
var sql = require('./sqlite_test03_module.js')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index_connect_backend.html')
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

    // 是否只要註解掉這行就可以不轉跳，但是向後端傳值
    res.sendFile(__dirname + '/index_connect_backend.html');
});

app.get('*', function (req, res) {
    res.status(404);
    res.send('找不到網頁！');
});

app.listen(5438, function (req, res) {
    console.log("網站伺服器在5438埠口開工了！");
});