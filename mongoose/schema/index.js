const mongoose = require('mongoose');

// 用户
const userSchema = new mongoose.Schema({
    // 记录微信openid
    openId: {
        type: String,
        index: true,     // 添加索引
        unique: true     // 唯一标示
    },
    // 账户创建时间
    created: {
        type: Date,
        default: Date.now()
    },
    // 最近一次登录
    lastLogin: {
        type: Date
    },
    name: {
        type: String,
        index: true 
    },
    avatar: {
        type: String
    },
    // 用户类型 
    userType: {
        type: Number 
    }
})

// 二维码
const codeSchema = new mongoose.Schema({
    code: {       // 存储二维码字符串
        type: String
    },
    sessionKey: String  // 存储小程序的登录凭证
})


// 相册的模型
const albumSchema = new mongoose.Schema({
    userId: {        // 相册的拥有者
        type: String
    },
    name: {
        type: String   // 相册名称
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'created', updatedAt: 'updated' }  // 自动生成这两个字段 并且每次保存和跟新 都会更新这两个字段 取当前操作时间
})

// 照片的模型
const photoSchema = new mongoose.Schema({
    userId: {
      type: String
    },
    url: {
      type: String
    },
    isApproved: {    // 是否审核
      type: Boolean,
      default: null,
      index: true
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId // 自带的ID
    },
    created: {
      type: Date,
      default: Date.now
    },
    isDelete: {
      type: Boolean,
      default: false
    }
})

module.exports = {
    User: mongoose.model( 'User', userSchema ),   // 创建模型
    Code: mongoose.model('code', codeSchema),  // 二维码模型
    Album: mongoose.model('album', albumSchema), // 相册
    Phopto: mongoose.model('photo', photoSchema) // 照片
}

