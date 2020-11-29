const e = require('express');

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

function confirm_order(data) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(__dirname + "/hotDog.db", function (e) {
        if (e) throw e;
    });
    db.serialize(function () {
        db.get('SELECT transaction_ID FROM simple_transaction WHERE sheet_num = $checked_sheet_num ORDER BY transaction_ID DESC LIMIT 1', data, function (e, row) {
            if (e) throw e;
            db.run(`UPDATE simple_transaction SET payment_status = 1 WHERE transaction_ID = ${row.transaction_ID}`, function (e) { if (e) throw e; })
        })
    })

}

module.exports.insert_order = insert_order;
module.exports.confirm_order = confirm_order