// 載入 sqlite3
var sqlite3 = require('sqlite3').verbose();
// new 一個 sqlite 的 database，檔案是 hotDog.db
var db = new sqlite3.Database("./hotDog.db", function (e) {
    if (e) throw e;
});


db.serialize(function () {

    // db.run 如果 test 資料表不存在，那就建立 test 資料表
    db.run("CREATE TABLE IF NOT EXISTS test (content TEXT)");
    var stmt = db.prepare('INSERT INTO test VALUES (?)');

    // 寫進10筆資料
    for (var i = 0; i < 10; i++) {
        stmt.run('test' + i);
    }

    // 關閉這個stmt 
    stmt.finalize();

    // log 出所有的資料
    // rowid為內部保留的keyword，利用AS幫它取別名
    // docs: https://www.sqlite.org/autoinc.html
    db.each('SELECT rowid AS id, content FROM test', function (err, row) {
        console.log(row.id + ': ' + row.content);
    });
});

db.close();