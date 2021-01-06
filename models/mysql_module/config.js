
// heroku cleardb
let config = {
    locol_pool_config: {
        connectionLimit: 8,
        host: 'localhost',
        user: 'root',
        password: 'Do!ng123',
        database: 'hot_dog_vendor'
    },
    heroku_pool_config: {
        connectionLimit: 8,
        host: 'us-cdbr-east-02.cleardb.com',
        user: 'b3840efa44f27c',
        password: '12adbffd',
        database: 'heroku_f724630b2e52279'
    }
}

module.exports = config;

