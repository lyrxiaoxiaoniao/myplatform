/* eslint no-useless-escape: "off" */
/**
 * 罗湖城管垃圾接口列表
 */
export default {
  // 1.商户管理
  merchant: {
    index: '/admin/account/index',
    edit: '/admin/account/update',
    add: '/admin/account/create',
    show: '/admin/account/show',
    extid: '/admin/extkey/all',
    alter: '/admin/ext/alter',
    wxupdate: '/admin/wxcfg/update',
    wxadd: '/admin/wxcfg/create',
    sendMail: '/admin/account/send',
    delete: '/admin/account/delete'
  },
  // 2.用户管理
  newuser: {
    index: '/admin/user/index',
    add: '/admin/user/create',
    delete: '/admin/user/delete',
    edit: '/admin/user/update'
  },
  // 3.权限管理
  authority: {
  },
  // 4.角色管理
  role: {
  },
  // 5.角色管理
  menu: {
  },
  // 9.日志管理
  journal: {
  }
}
