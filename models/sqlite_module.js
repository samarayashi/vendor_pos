const e = require('express');
var sqlite3 = require('sqlite3').verbose();

function sql(db_name = 'hot_dog.db') {
    this.db_name = db_name;
}

sql.prototype.init_db = function () {
    var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
        if (e) throw e;
    });
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS simple_transaction(\
            `transaction_ID` INTEGER NOT NULL,\
            `transaction_date` datetime NOT NULL,\
            `sheet_num` INTEGER NOT NULL, \
            `normal_hot_dog` INTEGER NOT NULL DEFAULT '0', \
            `corn_hot_dog` INTEGER NOT NULL DEFAULT '0', \
            `french_fries_dog` INTEGER NOT NULL DEFAULT '0', \
            `payment_status` NUMERIC NOT NULL DEFAULT '0', \
            `total_price` INTEGER NOT NULL DEFAULT '0', \
            `cancel` NUMERIC NOT NULL DEFAULT '0', \
            PRIMARY KEY(transaction_ID AUTOINCREMENT) );");
        db.close();
    })
}

// SQLite 日期和時間的操作 https://pro.ctlok.com/2010/08/sqlite-date-time.html
// 替代mysql CONVERT_TZ() https://stackoverflow.com/questions/28873066/does-sqlite3-has-analogue-mysqls-convert-tz-function
sql.prototype.insert_order = function (data) {
    var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
        if (e) throw e;
    });

    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO simple_transaction (transaction_date,sheet_num, normal_hot_dog, corn_hot_dog, french_fries_dog,  payment_status, total_price, cancel) VALUES (DateTime('now','+8 hour'), ?, ?, ?, ?, ?, ?, ?);");
        stmt.run(data);
        stmt.finalize();
        db.close();
    });

}

sql.prototype.update_payment = function (data) {
    var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
        if (e) throw e;
    });
    db.serialize(function () {
        db.get('SELECT transaction_ID FROM simple_transaction WHERE sheet_num = ? ORDER BY transaction_ID DESC LIMIT 1;', data, function (e, row) {
            if (e) throw e;
            if (!(row === undefined)) {
                db.run(`UPDATE simple_transaction SET payment_status = 1 WHERE transaction_ID = ${row.transaction_ID};`, function (e) { if (e) throw e; })
                db.close();
            }
        })
    })
}

sql.prototype.cancel_payment = function (data) {
    var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
        if (e) throw e;
    });
    db.serialize(function () {
        db.get('SELECT transaction_ID FROM simple_transaction WHERE sheet_num = ? ORDER BY transaction_ID DESC LIMIT 1;', data, function (e, row) {
            if (e) throw e;
            if (!(row === undefined)) {
                db.run(`UPDATE simple_transaction SET cancel  = 1 WHERE transaction_ID = ${row.transaction_ID};`, function (e) { if (e) throw e; })
                db.close();
            }
        })
    })
}


sql.prototype.get_unpayment = function (callback) {
    var db = new sqlite3.Database(__dirname + '/' + this.db_name, function (e) {
        if (e) throw e;
    });
    db.serialize(function () {
        db.all(`select sheet_num, total_price, normal_hot_dog, corn_hot_dog ,french_fries_dog from simple_transaction 
            where (date(transaction_date) = date('now', '+8 hour')) and payment_status = 0 and cancel=0;`, function (e, rows) {
            if (e) {
                throw e;
            }
            return callback(rows)
        })
        db.close();
    })
}


module.exports.sql = sql;
