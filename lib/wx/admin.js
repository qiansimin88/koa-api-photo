const { User } = require('../../mongoose/schema/index')

module.exports = {
    // 区分类型获取用户总数
    async getUsersCountByType (type) {
        return User.count({
          userType: type
        })
    },
    // 
    async getUsersByType (type, pageIndex, pageSize) {
        return User.find({
          userType: type  
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)  // skip(10) 跳过10条  limit(10)展示10条
    },
    // 所有总数量
    async getUsersCount () {
        return User.count()
    },
    async getUsers (pageIndex, pageSize) {
        return User.find().skip((pageIndex - 1) * pageSize).limit(pageSize)
    }
}