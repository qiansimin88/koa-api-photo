const allInfo = require('../../config');
const request = require('request');

module.exports = {
    // 获取openid 和 sessionKey 
    async getSession ( code ) {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ allInfo.wxInfo.appId }&secret=${ allInfo.wxInfo.appSecret }&js_code=${ code }&grant_type=authorization_code`;
        return new Promise( (resolve, reject) => {
            request( url, {
                method: 'GET',
                json: true
            }, ( err, res, body ) => {
                if ( err ) {   // http 异常
                    return reject( err );
                }
                if( body.errcode ) {  // 微信返回异常
                    reject( new Error( body.errmsg  ) )
                }else {
                    resolve( body );
                }
            } )
        } );
    }
}