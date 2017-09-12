/**
 * 在线考试列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import TestView from 'components/views/test/library/testLibrary/index.vue'

const testRouters = [
  {
    path: 'test',
    component: DashMainView,
    redirect: '/admin/test/index',
    name: '在线模拟考试',
    meta: {description: '信息'},
    children: [{
      path: 'index',
      component: TestView,
      name: '题库管理',
      meta: {description: '列表'}
    }, {
      path: 'label',
      // component: TestView,
      name: '标签管理',
      meta: {description: '列表'}
    }, {
      path: 'class',
      // component: TestView,
      name: '题库分类管理',
      meta: {description: '列表'}
    }, {
      path: 'paper',
      // component: TestView,
      name: '考卷管理',
      meta: {description: '列表'}
    }]
  }
]
export default testRouters
