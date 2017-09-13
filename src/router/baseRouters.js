/**
 * 超底层路由列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import SBMerchantView from 'components/views/superbottom/merchant/index.vue'
import SBMerchantConfigView from 'components/views/superbottom/merchant/config.vue'
import SBNewUserView from 'components/views/superbottom/newuser/index.vue'
// 日志管理
import LogIndex from 'components/views/superbottom/log/logIndex.vue'

// 角色管理
import RoleIndex from 'components/views/superbottom/role/index.vue'
// 菜单管理
import RcMenu from 'components/views/superbottom/menu/menuIndex.vue'
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
      meta: {description: '列表'}
    }]
  }, {
    // 角色模块路由
    path: 'recyclerole',
    component: DashMainView,
    redirect: '/admin/recyclerole/index',
    name: '角色',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: RoleIndex,
      name: '角色管理',
      meta: {description: '列表'}
    }]
  }, {
    // 菜单模块路由
    path: 'rcmenu',
    component: DashMainView,
    redirect: '/admin/rcmenu/index',
    name: '角色',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: RcMenu,
      name: '角色管理',
      meta: {description: '列表'}
    }]
  }
]
export default baseRouters
