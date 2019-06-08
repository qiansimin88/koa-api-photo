// service 
const { Album, Phopto } = require('../../mongoose/schema/index')

module.exports = {
    // 新建相册
    async addAlbum (userid, name) {
        return Album.create({
            userId:userid,
            name
        })
    },
    // 通过ID查找相册
    async findById( id ) {
        return Album.findById( id );
    },
    // 更新相册名称
    async update (id, name) {
        return Album.update({
            _id: id
        }, {
            name: name
        })
    },
    async getPhotosCount (userId, albumId) {
        return Phopto.count({
          userId,
          albumId,
          isApproved: true,
          isDelete: false
        })
    },
    async getPhotos (userId, albumId, pageIndex, pageSize) {
        let result
        if (pageSize) {
          result = await Phopto.find({
            userId,
            albumId,
            isApproved: true,
            isDelete: false
          }).sort({
            'created': -1
          }).skip((pageIndex - 1) * pageSize).limit(pageSize)
        } else {
          result = result = await Phopto.find({
            userId,
            albumId,
            isApproved: true,
            isDelete: false
          }).sort({
            'created': -1
          })
        }
        return result
      },
    // 取不同类型的图片数量
    async getTypeCount (type) {
        let type = null; 
        if (type !== 'pending') {
            if ( type === 'accepted' ) {
                type = true 
            }
            if ( type === 'rejected' ) {
                type = false
            }
        }
        return Phopto.count({
          isApproved: type,
          isDelete: false
        })
    },
    async getTypePhotos (type, pageIndex, pageSize) {
        let type = null; 
        if (type !== 'pending') {
            if ( type === 'accepted' ) {
                type = true 
            }
            if ( type === 'rejected' ) {
                type = false
            }
        }
        return Phopto.find({
          isApproved: type,
          isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    },
    async getAllCount () {
        return Phopto.count({
          isDelete: false
        })
    },
    async getAll (pageIndex, pageSize) {
        return Phopto.find({
          isDelete: false
        }).skip((pageIndex - 1) * pageSize).limit(pageSize)
    },
    // 照片审核
    async photoApprove (id, state) {
        return Phopto.update({
            _id: id
        }, {
            isApproved: state || true
        })
    },
    // 删除相册
    async delete (id) {
        return Album.deleteOne({
            _id: id
        })
    },
    // 通过iD查看相册是否有照片 并且已经审核并且未被删除过
    async getPhotosByAlbumIdCount( id ) {
        return Phopto.count({
            albumId: id,
            isApproved: true,
            isDelete: false
        })
    },
    // 查询当前用户下的所有相册
    async getAlbums ( userid ) {
        return Album.find({
            userId: userid
        }).sort({
            'updated': -1   // 更新时间倒叙排列
        })
    },
    // 当前相册ID下的所有照片
    async getPhotosByAlbumId ( id ) {
        return Phopto.find({
            albumId: id,
            isApproved: true,
            isDelete: false
        }).sort({
            'updated': -1
        })
    },
    // 上传图片
    async addPhoto (userId, url, albumId) {
        let _photo = await Phopto.create({
          userId,
          url,
          albumId
        })
        return _photo
    },
    // 根据ID找图片
    async getPhotoById (id) {
        return Phopto.findById(id)
    },
    // 删除图片
    async deletePhoto (id) {
        return Phopto.update({
          _id: id
        }, {
          isDelete: true
        })
    },
}