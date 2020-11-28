function insert_order(data) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database("./hotDog.db", function (e) {
        if (e) throw e;
    });

    db.serialize(function () {

        var stmt = db.prepare('INSERT INTO test_passing (sheet_num, normal_count, fort_count, french_count) VALUES ($sheet, $normal, $fort, $french)');
        stmt.run(data);
        stmt.finalize();

        db.each('SELECT rowid AS id, sheet_num FROM test_passing', function (err, row) {
            console.log(row.id + ': ' + row.sheet_num);
        });
    });

    db.close();
}

module.exports.insert_order = insert_order;
