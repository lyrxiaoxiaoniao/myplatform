/**
 * 超底层路由列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import SBMerchantView from 'components/views/superbottom/merchant/index.vue'
import SBMerchantConfigView from 'components/views/superbottom/merchant/config.vue'
import SBNewUserView from 'components/views/superbottom/newuser/index.vue'
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
  }
]
export default baseRouters
