const Sequelize = require('sequelize');

const dbInfo = {
    database: 'Custom',  // 数据库名称
    username: 'root', // 数据库账号
    password: '12345678', // 数据库密码
    host: '127.0.0.1', // 数据库地址
    dialect: 'mysql'  
}

// 建立链接
const sequelize = new Sequelize(dbInfo.database, dbInfo.username, dbInfo.password, {
    host: dbInfo.host,
    dialect: dbInfo.dialect,
    // 设置时区
    timezone: '+08:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// 连接成功与否
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
