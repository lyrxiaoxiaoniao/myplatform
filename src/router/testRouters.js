/**
 * 在线考试列表
 */
import DashMainView from 'components/views/dash/Main.vue'
import TestView from 'components/views/test/library/testLibrary/Index.vue'
import TestAddView from 'components/views/test/library/testLibrary/AddTest.vue'
import TestUploadView from 'components/views/test/library/testLibrary/UPloadTest.vue'

// 标签管理
import TestLabelListView from 'components/views/test/library/testLabel/Index.vue'
import TestLabelEditView from 'components/views/test/library/testLabel/Edit.vue'

// 题库分类管理
import TestClassListView from 'components/views/test/library/testClass/Index.vue'

// 试卷管理列表
import TestPaperListView from 'components/views/test/paper/list/Index.vue'

const testRouters = [
  {
    path: 'test',
    component: DashMainView,
    redirect: '/admin/test/library',
    name: '在线模拟考试',
    meta: { description: '信息' },
    children: [{
      path: 'list',
      component: DashMainView,
      name: '题库管理列表',
      meta: { description: '列表' },
      children: [{
        path: 'index',
        component: TestView,
        name: '题库管理列表',
        meta: { desceription: '列表' }
      },
      {
        path: 'add',
        component: TestAddView,
        name: '题库管理',
        meta: { desceription: '查看/编辑题目' }
      },
      {
        path: 'upload',
        component: TestUploadView,
        name: '题库管理',
        meta: { desceription: '上传题目' }
      }]
    }, {
      path: 'label',
      component: DashMainView,
      redirect: '/admin/test/label/index',
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
      component: TestClassListView,
      name: '题库分类管理',
      meta: { description: '列表' }
    }, {
      path: 'paper',
      component: TestPaperListView,
      name: '试卷管理',
      meta: { description: '试卷管理' }
    }]
  }
]
export default testRouters
