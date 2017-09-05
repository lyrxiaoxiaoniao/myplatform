/* eslint no-useless-escape: "off" */
/**
 * 罗湖城管垃圾接口列表
 */
export default {
  // 清运公司管理
  recovery: {
    index: '/recycle/index',
    add: '/recycle/create',
    edit: '/recycle/update',
    show: '/recycle/show',
    remove: '/recycle/delete',
    // 服务街道列表
    service: '/recycle/region/index',
    serviceAdd: '/recycle/region/create',
    serviceRemove: '/recycle/region/delete',
    // 服务街道下拉列表
    dropService: '/recycle/drop/region/index'
  },
  village: {
    list: '/rubbish/community/index',
    audit: '/rubbish/community/audit',
    delete: '/rubbish/community/delete',
    create: '/rubbish/community/create',
    update: '/rubbish/community/update',
    repetition: '/rubbish/community/repetition',
    indexOne: '/rubbish/community/indexOne'
  },
  restaurants: {
    index: '/restaurants/index'
  }
}
