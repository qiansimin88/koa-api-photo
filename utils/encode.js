const crypto = require('crypto')
const secret = 'qiansimin'  // 秘钥 
const algorithm = 'aes-256-cbc' // 加密算法

const ed = {
    // 加密算法
    encode (id) {
        const encoder = crypto.createCipher(algorithm, secret) // 加密器
        const str = [id, Date.now(), 'qiansimin'].join('|') // 自定义加密字符串
        let encrypted = encoder.update(str, 'utf8', 'hex')
        encrypted += encoder.final('hex')  // 生产秘钥
        return encrypted
    },
    // 解密
    decode (str) {
        const decoder = crypto.createDecipher(algorithm, secret)
        let decoded = decoder.update(str, 'hex', 'utf8')
        decoded += decoder.final('utf8')  // 生产明文
        const arr = decoded.split('|')  
        return {
          id: arr[0],  // 返回openod
          timespan: parseInt(arr[1])  // 返回时间戳
        }
    },
    encodeErCode () {
        return ed.encode(Math.random())
    }
}

module.exports = ed;