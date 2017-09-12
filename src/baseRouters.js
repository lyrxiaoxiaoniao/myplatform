/**
 * 超底层路由列表
 */
import DashMainView from './components/views/dash/Main.vue'
import NewLoginView from './components/views/superbottom/merchant/index.vue'

// 日志管理
import LogIndex from './components/views/recycle/log/logIndex.vue'

// 角色管理
import RoleIndex from './components/views/recycle/role/index.vue'
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
      component: NewLoginView,
      name: '商户管理',
      meta: {description: '列表'}
    }]
  }, {
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
  }
]
export default baseRouters
