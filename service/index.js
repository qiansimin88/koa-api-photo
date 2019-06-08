//  提供请求 数据库 等逻辑

module.exports = {
    getUserInfo: async( name, pwd ) => {
        return {
            status: 0,
            data: {
                title: '个人中心',
                content: '欢迎进入个人中心'
            }
        }
    }
}