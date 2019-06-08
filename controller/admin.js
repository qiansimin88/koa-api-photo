const admin = require('../lib/wx/admin');
module.exports = {
    // 通过用户类型获得相应类型用户
    async getUsersByType (type, pageIndex, pageSize) {
        let userType, count, users
        switch (type) {
          case 'admin':     // 管理员
            userType = 1
            break
          case 'blocked':   // 禁用用户
            userType = -1
            break
          case 'ordinary':  // 普通用户
            userType = 0
            break
        }
        if (userType !== undefined) {
          [count, users] = await Promise.all([admin.getUsersCountByType(userType), admin.getUsersByType(userType, pageIndex, pageSize)])
        } else {
          [count, users] = await Promise.all([admin.getUsersCount(), admin.getUsers(pageIndex, pageSize)])
        }
        return {
          count,  // 总数量
          data: users // 用户数据
        }
    }
}