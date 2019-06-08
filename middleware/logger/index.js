// 增加日志中间件
const log4js = require('log4js');
const chalk = require('chalk');
const env = process.env.NODE_ENV;

console.log( chalk.green('[ logger ] 日志系统成功开启 ：)') );
// 配置
log4js.configure({
    appenders: {
        // 生产环境的日志
        production: {     
            type: 'file', // 写入文件
            filename: 'logs/wx.log',  // 文件目录 自动生成
            maxLogSize: 10485760, // 最大体积  会自动删除  100M
            backups: 3,  // 备份个数
            pattern: '-yyyy-mm-dd.log',  // 以日期为后缀
            alwaysIncludePattern: true // 总有后缀
        },
        // 开发环境
        dev: {
            type: 'console' // 直接控制台打出即可
        } 
    },
    categories: {
        default: {
            appenders: ['production'], 
            level: 'info'  // info以上级别打印
        },
        dev: {
            appenders: ['dev', 'production'],
            level: 'debug' 
        }
    }
})

let logger = log4js.getLogger();  // 获取记录器

if ( env !== 'production' ) {
    logger = log4js.getLogger('dev');  // 非正式环境用dev的记录模式
} 

module.exports = async function ( ctx, next ) {
    ctx.logger = logger   // 给ctx上下文绑定logger 对象

    ctx.logger.info({
        url: ctx.url, 
        query: ctx.query,
        requestMothod: ctx.request.method,
        body: ctx.request.body,
        header: ctx.request.header,
        ua: ctx.userAgent,
        timespan: Date.now()
    });
    await next();
}

