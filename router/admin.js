const admin = require('../controller/admin');  // control控制器
const auth = require('../middleware/auth/index');  // 是否登录的局部中间件
const photo = require('../controller/photo');  // control控制器

function getPageParams (ctx) {
    return {
      pageIndex: parseInt(ctx.query.pageIndex) || 1,
      pageSize: parseInt(ctx.query.pageSize) || 10
    }
}

// 统一输出模板
async function responseOK (ctx, next) {
    ctx.body = {
      status: 0
    }
    await next()
}
module.exports = ( router ) => {
    /**
 * 获取用户列表
 * type的值的类型为：
 * admin: 管理员
 * blocked: 禁用用户
 * ordinary: 普通用户
 * all: 全部用户
 */
    router.get('/admin/user/:type', async (ctx, next) => {
        const pageParams = getPageParams(ctx)
        ctx.body = {
            status: 0,
            data: await admin.getUsersByType(ctx.params.type, pageParams.pageIndex, pageParams.pageSize)
        }
        await next()
    }),
  /**
     * 按照状态获取相片列表，type类型如下：
     * pending：待审核列表
     * accepted：审核通过列表
     * rejected：审核未通过列表
     * all: 获取所有列表
*/
    router.get('/admin/photo/:type', auth, async (ctx, next) => {
        const pageParams = getPageParams(ctx)
        const photos = await photo.getPhotosByType(ctx.params.type, pageParams.pageIndex, pageParams.pageSize)
        ctx.body = {
            status: 0,
            data: photos
        }
    }),
    // 审核照片
    router.get('/admin/photo/approve/:id/:state', auth, async (ctx, next) => {
        const {
            id, state
        } = ctx.params;
        await photo.photoApprove(id, state)
    }, responseOK)
}