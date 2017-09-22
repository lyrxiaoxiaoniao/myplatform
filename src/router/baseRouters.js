/**
 * 超底层路由列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import SBMerchantView from 'components/views/framework/merchant/index.vue'
import SBMerchantConfigView from 'components/views/framework/merchant/config.vue'
import SBNewUserView from 'components/views/framework/newuser/index.vue'
import SBNewAuthView from 'components/views/framework/authority/index.vue'
// 日志管理
import LogIndex from 'components/views/framework/log/logIndex.vue'
import MsLogIndex from 'components/views/framework/merchantSystem/log/logIndex.vue'

// 角色管理
import RoleIndex from 'components/views/framework/role/index.vue'
import MsRoleIndex from 'components/views/framework/merchantSystem/role/index.vue'
// 菜单管理
import RcMenu from 'components/views/framework/menu/menuIndex.vue'
// 商户关联
import MerchantRole from 'components/views/framework/merchant/relateRole.vue'
import MsMenu from 'components/views/framework/merchantSystem/menu/menuIndex.vue'
// 商户后台管理页面
import PSmerchant from 'components/views/framework/merchantSystem/merchant/config.vue'
import PSUser from 'components/views/framework/merchantSystem/newuser/index.vue'
import PSAuth from 'components/views/framework/merchantSystem/authority/index.vue'
const baseRouters = [
  {
    // 商户模块路由
    path: 'merchant',
    component: DashMainView,
    redirect: '/admin/merchant/index',
    name: '商户',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: SBMerchantView,
      name: '商户管理',
      meta: {description: '列表'}
    }, {
      path: 'config',
      component: SBMerchantConfigView,
      name: '商户管理配置',
      meta: {description: '详情'}
    }]
  }, {
    // 商户关联权限菜单模块路由
    path: 'merchantrole',
    component: DashMainView,
    redirect: '/admin/merchantrole/index',
    name: '商户关联',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: MerchantRole,
      name: '商户关联管理',
      meta: {description: '列表'}
    }]
  }, {
    // 用户模块路由
    path: 'newuser',
    component: DashMainView,
    redirect: '/admin/newuser/index',
    name: '用户',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: SBNewUserView,
      name: '用户管理',
      meta: {description: '列表'}
    }]
  }, {
    // 权限模块路由
    path: 'newauth',
    component: DashMainView,
    redirect: '/admin/newauth/index',
    name: '权限',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: SBNewAuthView,
      name: '权限管理',
      meta: {description: '列表'}
    }]
  }, {
    // 日志模块路由
    path: 'log',
    component: DashMainView,
    redirect: '/admin/log/index',
    name: '日志',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: LogIndex,
      name: '日志管理',
      meta: {description: '系统'}
    }, {
      path: 'merchant',
      component: MsLogIndex,
      name: '日志管理',
      meta: {description: '商户'}
    }]
  }, {
    // 角色模块路由
    path: 'newrole',
    component: DashMainView,
    redirect: '/admin/newrole/index',
    name: '角色',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: RoleIndex,
      name: '角色管理',
      meta: {description: '系统'}
    }, {
      path: 'merchant',
      component: MsRoleIndex,
      name: '角色管理',
      meta: {description: '商户'}
    }]
  }, {
    // 菜单模块路由
    path: 'rcmenu',
    component: DashMainView,
    redirect: '/admin/rcmenu/index',
    name: '菜单',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: RcMenu,
      name: '菜单管理',
      meta: {description: '系统'}
    }, {
      path: 'merchant',
      component: MsMenu,
      name: '菜单管理',
      meta: {description: '商户'}
    }]
  }, {
    // 商户管理后台路由
    path: 'psmerchant',
    component: DashMainView,
    redirect: '/admin/psmerchant/index',
    name: '商户管理后台',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: PSmerchant,
      name: '商户信息',
      meta: {description: '管理'}
    }]
  }, {
    // 商户后台用户管理路由
    path: 'psuser',
    component: DashMainView,
    redirect: '/admin/psuser/index',
    name: '商户后台用户',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: PSUser,
      name: '商户信息用户',
      meta: {description: '管理'}
    }]
  }, {
    // 商户后台权限管理路由
    path: 'psauth',
    component: DashMainView,
    redirect: '/admin/psauth/index',
    name: '商户后台权限',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: PSAuth,
      name: '商户信息权限',
      meta: {description: '管理'}
    }]
  }
]
export default baseRouters
