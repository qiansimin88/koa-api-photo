// 二维码相关的数据库操作
const { Code, User } = require('../../mongoose/schema/index')

module.exports = {
    async update (id, data) {
        return User.update({
          _id: id
        }, data)
    },
    // 添加二维码
    async add (code) {
        return Code.create({
            code: code
        })
    },
    // 删除
    async removeData (code) {
        return Code.deleteMany({
            code: code
        })
    },
    // 更新二维码的session
    async updateSessionKey (code, session) {
        return Code.update({   // update 第一个参数查询 第二个参数更新
            code: code
        }, {
            sessionKey: session
        })
    },
    // 根据code 查找session
    async getSessionKey ( code ) {
        const data = Code.findOne({
            code: code
        })
        if ( data ) {
            return data.sessionKey;
        }else {
            return null;
        }
    }
}

