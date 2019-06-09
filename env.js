// 处理环节切换
const env = process.env.NODE_ENV;

let photoUploadUri = null;   // 图片上传的地址

if ( env === 'dev' ) {
    photoUploadUri = 'http://localhost:3721/img/';
}else if ( env === 'production' ) {
    photoUploadUri = 'https://photo.api.qiansimin.xyz/'
}

module.exports = {
    photoUploadUri
}