// 整个项目 的所有中间件 都在这里调用 主要修改根目录的indexjs

const bodyParser = require('koa-bodyparser')
const static = require('koa-static');  // 处理静态资源
const nunjucks = require('koa-nunjucks-2');  // 模板引擎
const path = require('path');
const toJson = require('./mi-send');  // 转换响应体为json
const logger = require('./logger');  // 日志
const cors = require('@koa/cors')


module.exports = (app) => {
  
    app.use(cors({
        origin: '*'
    }));
    // post
    app.use(bodyParser({multipart: true}))
    // 日志
    app.use( logger );

    // 统一处理错误
    app.use(async (context, next) => {
        try {
            await next()
        } catch (ex) {
            context.logger.error(ex.stack || ex)
            context.body = {
                status: -1,
                message: ex.message || ex,
                code: ex.status
            }
        }
    })
    // 统计响应时间
    app.use( async( ctx, next ) => { 
        const sTime = new Date().getTime();
        await next();
        const eTime = new Date().getTime();
        // ctx.response.type = 'text/html';
        console.log( `响应时长${ eTime - sTime }ms, 响应地址${ ctx.path }`  );
    });

      // 指定静态资源目录
    app.use(static( path.resolve( __dirname, '../public' ), {  
        maxage: 30 * 24 * 60 * 60 * 1000 // 缓存时长 一个月
    } ));

    // 模板引擎
    app.use(nunjucks({
        ext: 'html',
        path: path.join( __dirname, '../views' ),  // 指定视图目录
        nunjucksConfig: {
            trimBlocks: true  // 开启转义  防止XXS攻击
        }
    }))

    app.use( toJson() );
}   