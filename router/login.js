const account = require('../controller/login');  // control控制器
const auth = require('../middleware/auth/index');  // 是否登录的局部中间件


// 统一输出模板
async function responseOK (ctx, next) {
    ctx.body = {
      status: 0
    }
    await next()
}
// 给小程序调用的接口
module.exports = ( router ) => {
    /* 修改用户信息
    */
    router.post('/user', auth, async (ctx, next) => {
        ctx.logger.info(`[user] 修改用户信息, 用户ID为${ctx.state.user.id}, 修改的内容为${JSON.stringify(ctx.request.body)}`)
        await account.update(ctx.state.user.id, ctx.request.body)
        await next()
    }, responseOK)

    /**
     * 获取当前登陆的用户信息
     */
    router.get('/my', auth, async (context, next) => {
        context.body = {
            status: 0,
            data: context.state.user
        }
    })
    /**
     * 小程序登陆，接收小程序登陆获取的code
    */
    router.get('/login', async (ctx, next) => {
        const code = ctx.query.code
            ctx.logger.info(`[login] 用户登陆Code为${code}`)
            ctx.body = {
            status: 0,
            data: await account.login(code)
        }
    })
    // 扫码登录 生成二维码接口
    router.get('/login/errcode', async ( ctx, next ) => {
        ctx.logger.debug(`[login] 生成登陆二维码`)
        ctx.body = {
            status: 0,
            data: await account.getErCode()  // 将生成的二维码返回
        }
    }),
    /**
     * 扫码登陆中，小程序侧调用的接口。将扫到的二维码信息传递过来
     */
    router.get('/login/errcode/:code', auth, async ( ctx, next ) => {
        const code = ctx.params.code // post参数的二维码
        const sessionKey = ctx.get('x-session') // post请求请求头的参数
        await account.setSessionKeyForCode(code, sessionKey);
        await next();
    }, responseOK),
    /**
     * 服务端长轮询检查登陆状态  在服务端进行递归查询 超过10S后返回响应状态 让客户端再次查询
    */
   router.get('/login/errcode/check/:code', async ( ctx, next ) => {
        const startTime = Date.now();   // 获得起始时间
        async function login () {   // 定义轮训方法
            const code = ctx.params.code  // 获取微微吗
            const sessionKey = await account.getSessionKeyByCode(code)  // 获得session 
            if ( sessionKey ) {  // 存在返回
                ctx.body = {
                    status: 0,
                    data: {
                        sessionKey: sessionKey
                    }
                }
            }else {  // 如果没有就轮询查询
                if ( Date.now() - startTime < 10000 ) {  // 10s内 一直查询
                    await new Promose( ( resolve, reject ) => {
                        process.nextTick(() => {  // 等栈内其他任务完成后  resolve 继续递归
                            resolve();
                        })
                    } )
                    // 空闲时 递归 避免阻塞其他任务
                    await login();
                }else {  // 超时 返回错误码
                    ctx.body = {
                        status: -1
                    }
                }
            }
        }
        await login();
   } );
}

