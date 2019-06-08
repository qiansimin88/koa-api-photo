const Koa = require('koa')
const app = new Koa()
const router = require('./router');
const allMiddleware = require('./middleware');
// 中间件调用
allMiddleware( app );
// 数据库 mysql 
// require('./sequelize/db/index.js'); 
// 数据库 mongo 
const mongo = require('./mongoose/db/index.js'); 
mongo.collectMongo();

// 路由注册
router( app );

app.listen(3721, () => {
    console.log('serve is running at http://localhost:3000');
})
