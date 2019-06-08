const serviceAll = require('../service/index.js');
// 所有的控制逻辑
module.exports = {
    index: async( ctx, next ) => {
        ctx.response.body = `<h1>当前访问${ ctx.url }</h1>`;
    },
    home: async( ctx, next ) => {
        ctx.response.body = `<h1>当前访问${ ctx.url }</h1>`;
    },
    homeParams: async( ctx, next ) => {
        ctx.response.body = `<h1>当前访问${ ctx.url }</h1> <h2>参数是${ ctx.params }</h2>`;
    },
    user: async( ctx, next ) => {
        // 增加视图 
        await ctx.render('index/login', {
            btnName: '提交吧'
        })
    },
    register: async( ctx, next ) => {
        let { name, password } = ctx.request.body;
        // 响应的数据库操作 属于 service 
        let info = await serviceAll.getUserInfo( name, password );
        if ( info.status === 0 ) {
            await ctx.render('index/home', info.data);
        }
    },
    upload: async( ctx, next ) => {
        await ctx.render('index/uploadAvatar', {
            title: '上传头像',
            content: '上传头像'
        });
    }
}