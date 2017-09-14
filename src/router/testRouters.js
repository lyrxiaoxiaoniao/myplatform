/**
 * 在线考试列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import TestView from 'components/views/test/library/testLibrary/Index.vue'
// import TestAddView from 'components/views/test/library/testLibrary/AddTest.vue'

// 标签管理
import TestLabelListView from 'components/views/test/library/testLabel/Index.vue'
import TestLabelEditView from 'components/views/test/library/testLabel/Edit.vue'

const testRouters = [
  {
    path: 'test',
    component: DashMainView,
    redirect: '/admin/test/library',
    name: '在线模拟考试',
    meta: { description: '信息' },
    children: [{
      path: 'index',
      component: TestView,
      name: '题库管理列表',
      meta: { description: '列表' }
    }, {
      path: 'label',
      component: DashMainView,
      name: '标签管理',
      meta: { description: '列表' },
      children: [{
        path: 'index',
        component: TestLabelListView,
        name: '标签管理列表',
        meta: { description: '列表' }
      }, {
        path: 'edit',
        component: TestLabelEditView,
        name: '标签管理编辑',
        meta: { description: '列表' }
      }]
    }, {
      path: 'class',
      component: TestView,
      name: '题库分类管理',
      meta: { description: '列表' }
    }, {
      path: 'paper',
      component: DashMainView,
      name: '考卷管理',
      meta: { description: '列表' },
      children: [{
        path: 'library',
        component: TestView,
        name: '考卷管理列表',
        meta: { description: '列表' }
      }]
    }]
  }
]
export default testRouters
