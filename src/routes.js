import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import ForgetView from './components/Forgot.vue'
import ResetView from './components/Reset.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/views/Dashboard.vue'
import TablesView from './components/views/Tables.vue'
import TasksView from './components/views/Tasks.vue'
import SettingView from './components/views/Setting.vue'
import AccessView from './components/views/Access.vue'
import ServerView from './components/views/Server.vue'
import ReposView from './components/views/Repos.vue'

import SCUserTableView from './components/views/UserTable.vue'
import SCReportTableView from './components/views/ReportTable'
import SCUserAddFormView from './components/views/UserAddForm'
import SCReportDeatilView from './components/views/ReportDetail'
import SCArticleTableView from './components/views/ArticleTable'

// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  }, {
    path: '/forgot',
    component: ForgetView
  }, {
    path: '/reset',
    component: ResetView
  }, {
    path: '/',
    component: DashView,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: {description: 'Overview of environment'}
      }, {
        path: 'tables',
        component: TablesView,
        name: 'Tables',
        meta: {description: 'Simple and advance table in CoPilot'}
      }, {
        path: 'tasks',
        component: TasksView,
        name: 'Tasks',
        meta: {description: 'Tasks page in the form of a timeline'}
      }, {
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page'}
      }, {
        path: 'access',
        component: AccessView,
        name: 'Access',
        meta: {description: 'Example of using maps'}
      }, {
        path: 'server',
        component: ServerView,
        name: 'Servers',
        meta: {description: 'List of our servers'}
      }, {
        path: 'repos',
        component: ReposView,
        name: 'Repository',
        meta: {description: 'List of popular javascript repos'}
      }, {
        path: 'users',
        component: SCUserTableView,
        name: '用户列表',
        meta: {description: '这是用户列表的描述'}
      }, {
        path: 'reports',
        component: SCReportTableView,
        name: '案件列表',
        meta: {description: '这是案件列表的描述'}
      }, {
        path: 'useradd',
        component: SCUserAddFormView,
        name: '添加用户',
        meta: {description: '添加用户描述'}
      }, {
        path: 'reportdetail',
        component: SCReportDeatilView,
        name: '案件详情',
        meta: {description: '案件详情列表'}
      }, {
        path: 'articles',
        component: SCArticleTableView,
        name: '文章管理',
        meta: {description: '文章管理列表'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
