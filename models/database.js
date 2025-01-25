const SQLiteDB = require('./sqlite_module').sql;
const MySQLDB = require('./mysql_module/use_mysql').sql;

class DatabaseFactory {
    static createDatabase(env) {
        // 根據環境變數決定使用哪種資料庫
        if (!env){
            env = process.env.NODE_ENV || 'development';
        }
        
        if (env === 'production') {
            console.log('Using MySQL database in production');
            return new MySQLDB();
        } else {
            console.log('Using SQLite database in development');
            return new SQLiteDB('hot_dog.db');
        }
    }
}

module.exports = DatabaseFactory; 