// 相册有关
const photo = require('../controller/photo');  // control控制器
const auth = require('../middleware/auth/index');  // 是否登录的局部中间件
const multer = require('koa-multer');  // 上传中间件
const uuid = require('uuid')
const path = require('path')
const { photoUploadUri } = require('../env');

// const uploadConf = multer({
//     dest: 'uploads/'  // 存储的位置
// })

const storage = multer.diskStorage({   // 磁盘存储
    destination: path.join(__dirname, '../public/img'), // 存储目录
    filename (req, file, cb) {                  // 重命名 以防文件名相同
      const ext = path.extname(file.originalname)
      cb(null, uuid.v4() + ext)
    }
  })
  
const uplader = multer({
    storage: storage
})


// 统一输出模板
async function responseOK (ctx, next) {
    ctx.body = {
      status: 0
    }
    await next()
}

module.exports = ( router ) => {
    // 新建相册
    router.post('/album', auth, async (ctx, next) => {
        const {
            name 
        } = ctx.request.body;  // 相册名字
        let success = null;
        success = await photo.addAlbum( ctx.state.user.id, name );  // state 是 auth中间件绑定的属性
        ctx.logger.info(`[photo] 创建相册成功 ${ JSON.stringify( success ) }`);
        await next();
    }, responseOK);

    // 修改相册名
    router.put('/album/:id', auth, async (ctx, next) => {
        await photo.updateAlbum(ctx.params.id, ctx.body.name, ctx.state.user) // params指的是url的参数 body是URL?后面的请求体 
        await next()
    }, responseOK)

    /**
     * 删除相册
     */
    router.del('/album/:id', auth, async (ctx, next) => {
        await photo.deleteAlbum(ctx.params.id)
        await next()
    }, responseOK)

    /**
     * 小程序种获取相册列表
     */
    router.get('/xcx/album', auth, async (ctx, next) => {
        const albums = await photo.getAlbums(ctx.state.user.id)
        ctx.body = {
            data: albums,
            status: 0
        }
    })
    /**
     * 小程序种获取相册的相片列表
     */
    router.get('/xcx/album/:id', auth, async (ctx, next) => {
        const photos = await photo.getPhotos(ctx.state.user.id, ctx.params.id)
        ctx.body = {
        status: 0,
        data: photos
        }
    })
    // 上传图片
    router.post('/photo', auth, uplader.single('file'), async (ctx, next) => {
        const {
          file
        } = ctx.req    // koa-multer组件绑定到req对象上的字段
        const {
          id
        } = ctx.req.body   // 相册id   // 先用本地服务器硬盘  
        await photo.addPhoto(ctx.state.user.id, `${photoUploadUri}${file.filename}`, id)
        await next()
    }, responseOK)
    /**
     * 删除相片
     */
    router.delete('/photo/:id', auth, async (ctx, next) => {
        const p = await photo.getPhotoById(ctx.params.id)
        if (p) {
            if (p.userId === ctx.state.user.id || ctx.state.user.isAdmin) {
                await photo.deletePhoto(ctx.params.id)
            } else {
                ctx.throw(403, '该用户无权限')
            }
        } else {
            ctx.throw(403, '图片ID错误或不存在')
        }
        await next()
    }, responseOK)
}