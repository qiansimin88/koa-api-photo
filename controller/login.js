const { getSession } = require('../lib/wx/index');
const { goLogin } = require('../lib/wx/user');
const { encodeErCode, decode } = require('../utils/encode.js');
const { add, removeData, updateSessionKey, getSessionKey, update } = require('../lib/wx/code');
// 微信小程序有关
module.exports = {
    // 修改用户的微信信息
    async update (id, data) {
        return update(id, data)
    },
    // 登录
    async login ( code ) {
        const session = await getSession( code );
        console.log('[node:] node取得session' + session.openid)
        if ( session ) {
            const { openid } = session;
            return goLogin( openid );
        }else {
            throw new Error( '登录失败' );
        }
    },
    // 生成二维码
    async getErCode () {
        const code = encodeErCode()  // 生成加密随机字符串
        await add(code);  // 将二维码信息存入数据库
        setTimeout(() => {
            removeData( code ) // 30s清除二维码
        }, 30000)
        return code;
    },
    // 更新二维码凭证 塞入session
    async setSessionKeyForCode ( code, session ) {
        const { timespan } = decode( code ); // 得到解密  的时间戳
        if ( Date.now() - timespan > 30000 ) { // 大于30s 则过期
            throw new error( '二维码过期' )
        }
        await updateSessionKey( code, session ); // 数据库更新
    },
    // 根据code 获得session
    async getSessionKeyByCode ( code ) {
        const sessionKey = await getSessionKey( code );
        if ( sessionKey ) {  // 有的话 数据库清除  避免堆积
            await removeData(code);
        }
        return sessionKey
    }
}