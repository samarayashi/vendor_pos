require('dotenv').config();

const config = {
    development: {
        mysql: {
            connectionLimit: 8,
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'Do!ng123',
            database: process.env.DB_NAME || 'hot_dog_vendor'
        }
    },
    production: {
        mysql: {
            connectionLimit: 8,
            host: process.env.JAWSDB_URL ? process.env.JAWSDB_URL.split('@')[1].split(':')[0] : '',
            user: process.env.JAWSDB_URL ? process.env.JAWSDB_URL.split('://')[1].split(':')[0] : '',
            password: process.env.JAWSDB_URL ? process.env.JAWSDB_URL.split(':')[2].split('@')[0] : '',
            database: process.env.JAWSDB_URL ? process.env.JAWSDB_URL.split('/').pop() : ''
        }
    }
};

// 根據環境變數選擇配置
const env = process.env.NODE_ENV || 'development';
module.exports = config[env]; 