// test
let mysql = require('mysql');
let config = require('./config.js');
var pool = mysql.createPool(config.heroku_pool_config);

function vendorSQL() {

}

vendorSQL.prototype.insert_order = function (transaction) {
    let stmt = `INSERT INTO simple_transaction(transaction_date,sheet_num, normal_hot_dog, corn_hot_dog, french_fries_dog,  payment_status, total_price, cancel)
    VALUES(convert_tz(now(), '+00:00', '+08:00') ,?,?,?,?,?,?,?)`;

    pool.getConnection(function (err, conn) {
        if (err) {
            return console.log(err.message);
        }
        conn.query(stmt, transaction, (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            // get inserted id
            console.log('insert transaction_Id:' + results.insertId);
        });
    })
}



vendorSQL.prototype.update_payment = function (sheet_num) {
    let sql = `update simple_transaction set payment_status = 1
            where sheet_num = ? order by transaction_ID desc limit 1;`

    pool.getConnection(function (err, conn) {
        if (err) {
            return console.log(err.message);
        }
        conn.query(sql, sheet_num, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('confirm:' + results.changedRows + 'rows');
        });
        conn.release();
    });
}


// 時間物件操作參考 https://www.yiibai.com/mysql/today.html
// callback 參考 https://stackoverflow.com/questions/31875621/how-to-properly-return-a-result-from-mysql-with-node
vendorSQL.prototype.get_unpayment = function (callback) {
    let sql = `select sheet_num, total_price, normal_hot_dog, corn_hot_dog ,french_fries_dog from simple_transaction 
            where (date(transaction_date) = date(convert_tz(now(), '+00:00', '+08:00'))) and payment_status = 0 and cancel=0;`

    pool.getConnection(function (err, conn) {
        if (err) {
            return console.log(err.message);
        }
        conn.query(sql, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            return callback(results);
        })
        conn.release();
    });
}


vendorSQL.prototype.cancel_payment = function (sheet_num) {
    let sql = `update simple_transaction set cancel = 1
            where sheet_num = ? order by transaction_ID desc limit 1;`

    pool.getConnection(function (err, conn) {
        if (err) {
            return console.log(err.message);
        }
        conn.query(sql, sheet_num, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('cancel:' + results.changedRows + 'rows');
        });
        conn.release();
    });
}

vendorSQL.prototype.discard_orders = function () {
    let sql = `update simple_transaction set cancel = 1
            where date(transaction_date) = date(convert_tz(now(), '+00:00', '+08:00')) and payment_status = 0 and cancel = 0`;
    pool.getConnection(function (err, conn) {
        if (err) {
            return console.log(err.message);
        }
        conn.query(sql, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('total discard ' + results.affectedRows + ' orders');
        })
        conn.release();
    });
}

module.exports.vendorSQL = vendorSQL;


