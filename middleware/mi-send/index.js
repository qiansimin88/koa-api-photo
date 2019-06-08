// 响应体 转换为json格式

module.exports = () => {
    const toJson = ( json ) => {
        this.set('Content-Type', 'application/json');
        this.body = JSON.stringify( json );
    }
    return async ( ctx, next ) => {
        ctx.send = toJson.bind( ctx );  // 给ctx对象挂载一个send的全局方法
        await next();
    }
};