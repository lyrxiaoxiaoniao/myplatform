/**
 * 超底层路由列表
 */
import DashMainView from './components/views/dash/Main.vue'
import NewLoginView from './components/views/superbottom/merchant/index.vue'
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
    // 其他模块
  }
]
export default baseRouters
