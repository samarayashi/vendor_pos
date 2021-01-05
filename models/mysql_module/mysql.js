let mysql = require('mysql');
let config = require('./config.js');
let connection = mysql.createConnection(config);

function vendorSQL() {

}

vendorSQL.prototype.insert_order = function (transaction) {
    let stmt = `INSERT INTO simple_transaction(transaction_date,sheet_num,normal_count,french_count,fort_count,payment_status, total_price, cancel)
    VALUES(now() ,?,?,?,?,?,?,?)`;

    connection.query(stmt, transaction, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        // get inserted id
        console.log('transaction_Id:' + results.insertId);
    });

}

vendorSQL.prototype.update_payment = function (sheet_num) {
    let sql = `update simple_transaction set payment_status = 1
            where sheet_num = ? order by transaction_ID desc limit 1;`

    connection.query(sql, sheet_num, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
    });
}

// 時間物件操作參考 https://www.yiibai.com/mysql/today.html
vendorSQL.prototype.get_unpayment = function () {
    let sql = `select sheet_num, total_price, normal_count, french_count, fort_count from simple_transaction where date(transaction_date) = curdate() and payment_status = 0 and cancel=0;`
    connection.query(sql, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log(results);
    })
}

vendorSQL.prototype.cancel_payment = function (sheet_num) {
    let sql = `update simple_transaction set cancel = 1
            where sheet_num = ? order by transaction_ID desc limit 1;`
    connection.query(sql, sheet_num, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
    });
}

module.exports.vendorSQL = vendorSQL;


