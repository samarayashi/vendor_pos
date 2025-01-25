const sqlite3 = require('sqlite3').verbose();

class SQL {
    constructor(db_name) {
        this.db = new sqlite3.Database(db_name);
    }

    init_db() {
        let stmt = `CREATE TABLE IF NOT EXISTS simple_transaction (
            transaction_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            sheet_num INTEGER NOT NULL,
            normal_hot_dog INTEGER NOT NULL DEFAULT 0,
            corn_hot_dog INTEGER NOT NULL DEFAULT 0,
            french_fries_dog INTEGER NOT NULL DEFAULT 0,
            payment_status INTEGER NOT NULL DEFAULT 0,
            total_price INTEGER NOT NULL DEFAULT 0,
            cancel INTEGER NOT NULL DEFAULT 0
        )`;

        this.db.run(stmt, (err) => {
            if (err) {
                return console.log(err.message);
            }
        });
    }

    insert_order(transaction) {
        let stmt = `INSERT INTO simple_transaction(
            sheet_num, normal_hot_dog, corn_hot_dog, french_fries_dog, 
            payment_status, total_price, cancel
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        this.db.run(stmt, transaction, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('insert transaction_Id:' + this.lastID);
        });
    }

    update_payment(sheet_num) {
        let stmt = `UPDATE simple_transaction 
            SET payment_status = 1
            WHERE sheet_num = ? 
            AND transaction_ID = (
                SELECT transaction_ID FROM simple_transaction 
                WHERE sheet_num = ? 
                ORDER BY transaction_ID DESC LIMIT 1
            )`;

        this.db.run(stmt, [sheet_num, sheet_num], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('confirm:' + this.changes + 'rows');
        });
    }

    cancel_payment(sheet_num) {
        let stmt = `UPDATE simple_transaction 
            SET cancel = 1
            WHERE sheet_num = ? 
            AND transaction_ID = (
                SELECT transaction_ID FROM simple_transaction 
                WHERE sheet_num = ? 
                ORDER BY transaction_ID DESC LIMIT 1
            )`;

        this.db.run(stmt, [sheet_num, sheet_num], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('cancel:' + this.changes + 'rows');
        });
    }

    get_unpayment(callback) {
        let stmt = `SELECT sheet_num, total_price, normal_hot_dog, corn_hot_dog, french_fries_dog 
            FROM simple_transaction 
            WHERE date(transaction_date) = date('now', 'localtime')
            AND payment_status = 0 AND cancel = 0`;

        this.db.all(stmt, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            callback(rows);
        });
    }

    discard_orders() {
        let stmt = `UPDATE simple_transaction 
            SET cancel = 1
            WHERE date(transaction_date) = date('now', 'localtime')
            AND payment_status = 0 AND cancel = 0`;

        this.db.run(stmt, function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log('total discard ' + this.changes + ' orders');
        });
    }
}

module.exports = {
    sql: SQL
};
