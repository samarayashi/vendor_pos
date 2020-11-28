var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index_connect_backend.html')
});


app.post('/send_order', function (req, res) {
    var fort_number = req.body.hot_dog_fort;
    var normal_number = req.body.normal_hot_dog;
    var french_number = req.body.french_fries_dog;
    var sheet_number = req.body.sheet_number;

    var html = '單號：' + sheet_number +
        '熱狗堡數量：' + fort_number +
        ' 一般熱狗數量：' + normal_number +
        ' 薯條熱狗數量：' + french_number;
    console.log(html);
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