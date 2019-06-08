
const {
    findBySessionKey
  } = require('../../lib/wx/user');

// 是否登录的中间件
module.exports = async function ( ctx, next ) {
    const sessionKey = ctx.get('x-session'); // 获取前端请求头的session
    ctx.logger.debug( `[auth]: 获取到sessionKey为${ sessionKey }` );
    if ( !sessionKey ) {  
        ctx.throw( 401, '请求头中未包含x-session' );
    }
    
    const user = await findBySessionKey( sessionKey );

    if ( user ) {
        ctx.logger.debug(`[auth] 根据sessionKey查询到的用户为${JSON.stringify(user)}`)
        if ( user.userType === -1 ) {
            ctx.throw( 401, '当前用户被禁止' )
        }
        ctx.state.user = {  // 注入上下文 方便后续使用
            id: user._id,
            name: user.name,
            avatar: user.avatar,
            isAdmin: user.userType === 1
        }
    } else {
        ctx.logger.info(`[auth] 根据sessionKey未获取到用户`)
        ctx.throw( 401, 'session过期或token错误' )
    }

    if (/^\/admin/i.test(ctx.url) && !ctx.state.user.isAdmin) {
        ctx.logger.info(`[auth] 当前的${ctx.url} 必须为管理员访问.`)
        ctx.throw(401, '当前资源必须管理员才能访问')
    }
    await next();
}