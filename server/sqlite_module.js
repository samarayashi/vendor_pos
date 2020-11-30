const e = require('express');

function sql(db_name = 'hotDong.db') {
    this.db_name = db_name;

    this.init_db = function () {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
            if (e) throw e;
        });
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS simple_transaction(\
            transaction_ID INTEGER, \
            transaction_date NUMERIC NOT NULL, \
            sheet_num INTEGER NOT NULL, \
            normal_count INTEGER NOT NULL DEFAULT 0, \
            fort_count INTEGER NOT NULL DEFAULT 0, \
            french_count INTEGER NOT NULL DEFAULT 0, \
            payment_status NUMERIC NOT NULL DEFAULT 0, \
            PRIMARY KEY(transaction_ID AUTOINCREMENT) \
            ) ");

        })
        db.close();
    }

    this.insert_order = function (data) {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
            if (e) throw e;
        });

        db.serialize(function () {
            var stmt = db.prepare("INSERT INTO simple_transaction (transaction_date, sheet_num, normal_count, fort_count, french_count) VALUES (DateTime('now'), $sheet, $normal, $fort, $french)");
            stmt.run(data);
            stmt.finalize();
        });

        db.close();
    }

    this.confirm_order = function (data) {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
            if (e) throw e;
        });
        db.serialize(function () {
            db.get('SELECT transaction_ID FROM simple_transaction WHERE sheet_num = $checked_sheet_num ORDER BY transaction_ID DESC LIMIT 1', data, function (e, row) {
                if (e) throw e;
                if (!(row === undefined)) {
                    db.run(`UPDATE simple_transaction SET payment_status = 1 WHERE transaction_ID = ${row.transaction_ID}`, function (e) { if (e) throw e; })
                }

            })
        })

    }

}


module.exports.sql = sql;
