// 假設接收參數
// 陣列形式傳入參數
// var data = ['20201125', '001', '1', '0', '3']

// json形式傳入參數，佔位符預設index從1開始
// var data = {
//     1: 20201126,
//     2: 002,
//     3: 0,
//     4: 2,
//     5: 0
// }

var data = {
    $id: 20201127,
    $sheet: 003,
    $fort: 8,
    $normal: 5,
    $french: 0
}

// 載入 sqlite3
var sqlite3 = require('sqlite3').verbose();
// new 一個 sqlite 的 database，檔案是 hotDog.db
var db = new sqlite3.Database("./hotDog.db", function (e) {
    if (e) throw e;
});


db.serialize(function () {

    // insert語法 =>可以指定column，或是values全給
    // 範例：https://www.runoob.com/sqlite/sqlite-insert.html

    // 佔位符docs: https://github.com/mapbox/node-sqlite3/wiki/API
    // 關鍵字： Database#run(sql, [param, ...], [callback])
    // var stmt = db.prepare('INSERT INTO test_passing VALUES (?,?,?,?,?)');

    // 嘗試替佔位符命名，增加可讀性
    var stmt = db.prepare('INSERT INTO test_passing VALUES ($id,$sheet,$normal,$fort,$french)');

    // 寫進接收資料
    stmt.run(data);
    stmt.finalize();

    db.each('SELECT rowid AS id, sheet_num FROM test_passing', function (err, row) {
        console.log(row.id + ': ' + row.sheet_num);
    });
});

db.close();