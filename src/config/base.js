/* eslint no-useless-escape: "off" */
/**
 * 罗湖城管垃圾接口列表
 */
export default {
  // Dash 配置信息
  dashconfig: '/admin/ext/config',
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
    delete: '/admin/account/delete',
    /* 商户后台管理接口 */
    current: '/admin/account/current'
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
  fmrole: {
    index: '/admin/role/index',
    delete: '/admin/role/delete',
    update: '/admin/role/update',
    active: '/admin/role/active',
    show: '/admin/role/show',
    aindex: '/admin/account/index',
    create: '/admin/role/create',
    check: '/admin/role/check',
    relatedP: '/admin/rolepermission/show/permission/related',
    norelP: '/admin/rolepermission/show/permission/relate',
    rpdelete: '/admin/rolepermission/delete',
    rpcreate: '/admin/rolepermission/create',
    relatedU: '/admin/userrole/show/user/related',
    rudelete: '/admin/userrole/delete',
    norelU: '/admin/userrole/show/user/relate',
    rucreate: '/admin/userrole/create',
    permissionActive: '/admin/permission/active',
    userLock: '/admin/user/lock'
  },
  // 5.菜单管理
  frameWorkMenu: {
    index: '/admin/menu/index',
    showLeft: '/admin/menu/show_left',
    create: '/admin/menu/create',
    delete: '/admin/menu/delete',
    edit: '/admin/menu/update',
    check: '/admin/menu/check',
    active: '/admin/menu/active',
    // 菜单关联权限
    related: '/admin/mp/show/permission/related',
    relate: '/admin/mp/show/permission/relate',
    relCreate: '/admin/mp/create',
    relDelete: '/admin/mp/delete',
    relactive: '/admin/permission/active'
  },
  // 9.日志管理
  journal: {
  }
}
