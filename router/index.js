const Router = require('koa-router');
const router = new Router();
const path = require('path');
const fs = require('fs');
const HomeControllers = require('../controller/index.js');
const multer = require('koa-multer');  // 上传中间件
const uploadConf = multer({
    dest: 'uploads/'  // 存储的位置
})
const loginRouter = require('./login');
const photoRouter = require('./photo');
const adminRouter = require('./admin');


//  ctx.params.xx  url中的参数
//  ctx.query.xx   url ? 后面的请求体
//  ctx.request.body  post请求的请求体


module.exports = ( app ) => {
    router.get( '/', HomeControllers.index);

    router.get( '/home', HomeControllers.home);

    router.get( '/home/:id/:name', HomeControllers.homeParams);

    router.get( '/user', HomeControllers.user);

    router.post('/user/register', HomeControllers.register);

    router.get('/upload', HomeControllers.upload);

    // 接受上传的头像
    router.post('/profile', uploadConf.single('avatar'), async ( ctx, next ) => {
        // 给文件加上后缀
        let {
            originalname,
            path: outPath,
            mimetype
        } = ctx.req.file;
        const newPath = outPath + path.parse( originalname ).ext; 
        const err = fs.renameSync( outPath, newPath );
        let result = null;

        if ( err ) {
            result = JSON.parse( err );
        }else {
            result = `上传成功${ newPath }`
        }

        ctx.response.body = result;
    });

    loginRouter( router );
    photoRouter( router );
    adminRouter( router );

        // 允许所有的资源跨域
    router.all( '/*', async( ctx, next ) => {
        ctx.set('Acess-Control-Allow-Origin', '*');
        await next()
    } )

    app.use( router.routes() ).use( router.allowedMethods() );  //注册路由
}