function insert_order(data) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(__dirname + "/hotDog.db", function (e) {
        if (e) throw e;
    });

    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO simple_transaction (transaction_date, sheet_num, normal_count, fort_count, french_count) VALUES (DateTime('now'), $sheet, $normal, $fort, $french)");
        stmt.run(data);
        stmt.finalize();
    });

    db.close();
}

module.exports.insert_order = insert_order;
