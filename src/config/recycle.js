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
    dropService: '/recycle/drop/region/index',
    // 车辆管理
    carIndex: '/vehicle/index',
    carAdd: '/vehicle/create',
    carEdit: '/vehicle/update',
    carRemove: '/vehicle/delete',
    // 线路管理
    wayIndex: '/rounter/index',
    wayShow: '/rounter/show',
    wayAdd: '/rounter/create',
    wayEdit: '/rounter/update',
    wayRemove: '/rounter/delete',
    wayActive: '/rounter/state/update',
    wayRecycle: '/rounter/recycle/show',
    wayHistory: '/rounter/history/index',
    wayCar: '/rounter/vehicle/index',
    wayCater: '/rounter/cater/index',
    wayCarRelate: '/rounter/vehicle/addition/index',
    wayCaterRelate: '/rounter/cater/addition/index',
    wayCarAdd: '/rounter/vehicle/add',
    wayCarRemove: '/rounter/vehicle/delete',
    wayCaterAdd: '/rounter/cater/add',
    wayCaterRemove: '/rounter/cater/delete'
  },
  village: {
    list: '/rubbish/community/index',
    audit: '/rubbish/community/audit',
    delete: '/rubbish/community/delete',
    create: '/rubbish/community/create',
    update: '/rubbish/community/update',
    repetition: '/rubbish/community/repetition',
    indexOne: '/rubbish/community/indexOne',
    advanced: '/rubbish/community/advanced',
    relServer: '/rubbish/community/queryCommunity',
    uncorrelated: '/rubbish/community/uncorrelated',
    addcorrelate: '/rubbish/community/tenement/create',
    removeCorrelate: '/rubbish/community/tenement/delete',
    history: '/rubbish/community/queryHistory',
    streetTree: '/rub/region/index',
    move: '/rubbish/community/move'
  },
  server: {
    index: '/rubbish/tenement/index',
    audit: '/rubbish/tenement/audit',
    delete: '/rubbish/tenement/delete',
    create: '/rubbish/tenement/create',
    update: '/rubbish/tenement/update',
    repetition: '/rubbish/tenement/repetition',
    indexOne: '/rubbish/tenement/indexOne',
    queryTenement: '/rubbish/tenement/queryTenement',
    uncorrelated: '/rubbish/tenement/uncorrelated',
    queryHistory: '/rubbish/tenement/queryHistory',
    advanced: '/rubbish/tenement/advanced'
  },
  // 餐饮企业管理
  restaurants: {
    index: '/cater/index',
    delete: '/cater/delete',
    create: '/cater/create',
    show: '/cater/show',
    getRecycle: '/rounter/recycle/show', //  清运公司列表
    update: '/cater/update', // 修改整张表单，除签约信息
    updateSign: '/cater/sign/update', //  签约状态更新
    updateCheck: '/cater/state/update', //  审核状态更新,0.未审核 1.已审核
    getRegion: '/recycle/drop/region/index'// 所属街道列表
  },
  // 地磅信息管理
  loadometer: {
    index: '/rubbish/weighbridge/index',
    indexOne: '/rubbish/weighbridge/indexOne',
    create: '/rubbish/weighbridge/create',
    delete: '/rubbish/weighbridge/delete',
    update: '/rubbish/weighbridge/update',
    audit: '/rubbish/weigh/detail/audit',
    suttleDay: '/rubbish/weighbridge/suttleDay',
    suttleMonth: '/rubbish/weighbridge/suttleMonth',
    suttleYear: '/rubbish/weighbridge/suttleYear',
    weighDetail: '/rubbish/weighbridge/weighDetail'
  },
  fence: {
    index: '/rubbish/fence/index',
    delete: '/rubbish/fence/delete',
    region: '/rub/region/index',
    create: '/rubbish/fence/create',
    update: '/rubbish/fence/update',
    query: '/rubbish/fence/query',
    vehicleIndex: '/rubbish/fence/vehicle',
    vehicleUnrelevance: '/rubbish/vehicle/unrelevance',
    addVehicle: '/rubbish/vehicle/restrict',
    deleteVehicle: '/rubbish/vehicle/remove',
    gpsInfo: '/rubbish/gps/vehicle'
  }
}
