const album = require('../lib/wx/photo');

module.exports = {
    // 创建相册控制器
    async addAlbum (userid, name) {
        return album.addAlbum(userid, name)
    },
    // 修改相册名
    async updateAlbum (id, name, user) {
        const _album = await album.findById( id )
        if ( !_album ) {
            throw new Error( 'ID错误或者相册不存在' )
        } 

        if (!user.isAdmin && user.id !==  _album.userId) {
            throw new Error('你没有权限修改此相册')
        }

        return album.update(id, name)
    },
    // 删除相册
    async deleteAlbum ( id ) {
        const photos = await album.getPhotosByAlbumIdCount(id)
        
        if ( photos ) {
            throw new Error('相册还存在相片，不允许删除')
        } 
        return album.delete(id)
    },
    // 查询当前用户所有相册和每个相册中的照片
    async getAlbums ( userid, pageIndex, pageSize ) {
        const albums = await album.getAlbums(userid);

        return Promise.all( albums.map( async ( o ) => {
            const id = o._id;
            let photoLength = await album.getPhotosByAlbumId( id ); // 获得当前相册ID下的照片
            return Object.assign({
                photoCount: photoLength.length,  // 当前相册照片数量
                photoUrl: photoLength[0] ? photoLength[0].url : null, // 最近一张图的URL
            }, o.toObject())   // toObject() 是把当前Mongoose对象o 转换成js对象
        } ) );
    },
    // 通过相册id查找该相册所有的图
    async getPhotos (userId, albumId, pageIndex, pageSize) {
      const [count, photos] = await Promise.all([album.getPhotosCount(userId, albumId), album.getPhotos(userId, albumId, pageIndex, pageSize)])
      return {
        count,
        data: photos
      }
    },
    // 图片上传
    async addPhoto (userId, url, albumId) {
        return album.addPhoto(userId, url, albumId)
    },
    // 通过图片ID查找图片
    async getPhotoById (id) {
        return album.getPhotoById(id)
    },
    // 删除图片
    async deletePhoto (id) {
        return album.deletePhoto(id)
    },
    // 取不同类型的图片
    async getPhotosByType (type, pageIndex, pageSize) {
        let count, photos
        switch (type) { 
          case 'pending':  // 待审核
            [count, photos] = await Promise.all([album.getTypeCount('pending'), album.getTypePhotos('pending', pageIndex, pageSize)])
            return {
              count,
              data: photos
            }
          case 'accepted': // 已审核
            [count, photos] = await Promise.all([album.getTypeCount('accepted'), album.getTypePhotos('accepted', pageIndex, pageSize)])
            return {
              count,
              data: photos
            }
          case 'rejected': // 已拒绝
            [count, photos] = await Promise.all([album.getTypeCount('rejected'), album.getTypePhotos('rejected', pageIndex, pageSize)])
            return {
              count,
              data: photos
            }
          default:
            [count, photos] = await Promise.all([album.getAllCount(), album.getAll(pageIndex, pageSize)])
            return {
              count,
              data: photos
            }
        }
    },
    // 照片审核
    async photoApprove (id, state) {
        return album.photoApprove(id, state)
    }
}