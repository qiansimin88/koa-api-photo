const { User } = require('../../mongoose/schema/index')
const { encode, decode } = require('../../utils/encode');

const getByOpenId = async (openId) => {
    const users = await User.find({
      openId: openId
    })
    if (users.length) {
      return users[0]
    }
    return null
}

module.exports = {
    async goLogin ( openId ) {
        let user = await getByOpenId( openId );  // 根据openid数据库查找用户信息
        if ( !user ) {    // 如果没有该用户 直接创建
            user = await User.create({   
                openId: openId
            })
        }
        const id = user._id;
        const sessionKey = encode(id);  // 生产登录凭证

        await User.update( { _id: id }, { lastLogin: Date.now() } );  // 登录一次都要更新加密时间

        return { sessionKey };  // 返回前端登录凭证
    },
    // 前端token 获得 用户
    async findBySessionKey ( sessionKey ) {
        const {
            id,
            timespan 
          } = decode(sessionKey)  // 解密得到 openid和时间戳

        if ( Date.now() - timespan > 1000 * 60 * 60 * 24 * 30 ) {  // 超过一个月的session即过期
            return null // 返回空
        }

        const users = await User.find({
            _id: id
        })

        if ( users && users.length ) {
            return users[0]  // 有就返回
        }else {
            return null;
        }
    }
}