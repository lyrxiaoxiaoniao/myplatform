/* eslint no-useless-escape: "off" */
/**
 * 罗湖城管垃圾接口列表
 */
export default {
  // 商户关联
  merchantRole: {
    // 1312
    related: '/admin/pa/show/permission/related',
    relate: '/admin/pa/show/permission/relate',
    relateRemoveMenu: '/admin/ma/delete',
    relateAddMenu: '/admin/ma/create',
    relateRemove: '/admin/pa/delete',
    relateAdd: '/admin/pa/create',
    relatedmenu: '/admin/ma/menus/related'
  },
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
    show: '/admin/user/show',
    check: '/admin/user/check',
    lock: '/admin/user/lock',
    edit: '/admin/user/update',
    delete: '/admin/user/delete',
    relate: '/admin/userrole/show/role/relate',
    related: '/admin/userrole/show/role/related',
    relateremove: '/admin/userrole/delete',
    relateradd: '/admin/userrole/create',
    relateractive: '/admin/role/active'
  },
  // 3.权限管理
  authority: {
    index: '/admin/permission/index',
    show: '/admin/permission/show',
    edit: '/admin/permission/update',
    add: '/admin/permission/create',
    active: '/admin/permission/active',
    delete: '/admin/permission/delete',
    related: '/admin/rolepermission/show/role/related',
    relate: '/admin/rolepermission/show/role/relate',
    relateradd: '/admin/rolepermission/create',
    relateremove: '/admin/rolepermission/delete',
    relateractive: '/admin/role/active',
    // 权限关联菜单
    relatedmenu: '/admin/mp/menus/related',
    relatedmenuAdd: '/admin/mp/create',
    relatedmenuDelete: '/admin/mp/delete'
  },
  // 4.角色管理
  role: {
  },
  // 5.菜单管理
  frameWorkMenu: {
    index: '/admin/menu/index',
    showLeft: '/admin/menu/show_left',
    delete: '/admin/menu/delete',
    check: '/admin/menu/check',
    active: '/admin/menu/active'
  },
  // 9.日志管理
  journal: {
  }
}
