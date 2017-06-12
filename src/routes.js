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

import SCReportTableView from './components/views/reports/ReportTable'
import SCReportDeatilView from './components/views/reports/ReportDetail'
import SCReportCategoryView from './components/views/reports/ReportCategory.vue'

import SCUserTableView from './components/views/users/UserTable.vue'
import SCUserAddFormView from './components/views/users/UserAddForm'
import SCUserLabelManage from './components/views/users/UserLabelManage.vue'

import SCArticleTableView from './components/views/cms/ArticleTable'
import SCArticleAddFormView from './components/views/cms/ArticleAddForm.vue'
import SCArticleDetailView from './components/views/cms/ArticleDetail.vue'
import SCArticleCategoryManageView from './components/views/cms/ArticleCategoryManage.vue'

import SCNotifyTableView from './components/views/notify/NotifyTable.vue'
import SCNotifyAddFormView from './components/views/notify/NotifyAddForm.vue'
import SCNotifyInfoView from './components/views/notify/NotifyInfo'

import SCFirmTableView from './components/views/firm/FirmTable.vue'
import SCFirmDetailView from './components/views/firm/FirmDetail.vue'

import SCWxUserTableView from './components/views/wxusers/WxUserTable.vue'
import SCWxUserTagAddView from './components/views/wxusers/AddUserTag.vue'
import SCWxUserLinkView from './components/views/wxusers/WxLinkUser.vue'
import SCWxUserTagTableView from './components/views/wxusers/WxTagTable.vue'
import SCWxTagUserListView from './components/views/wxusers/WxTagUserInfo.vue'
import SCWxUserProfileView from './components/views/wxusers/WxUserProfile.vue'

import SCDictTableView from './components/views/dict/DictTable.vue'
import SCDictElTableView from './components/views/dict/DictElTable.vue'

import SCRoleTableView from './components/views/characters/RoleTable.vue'
import SCRoleUserTableView from './components/views/characters/RoleUserTable.vue'
import SCRoleLinkUserTableView from './components/views/characters/RoleLinkUserTable.vue'

import SCOrgaListView from './components/views/organization/orgaTable.vue'

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
        meta: {description: '用户列表详情'}
      }, {
        path: 'reports',
        component: SCReportTableView,
        name: '案件列表',
        meta: {description: '安全隐患案件列表'}
      }, {
        path: 'reportcategory',
        component: SCReportCategoryView,
        name: '分类管理',
        meta: {description: '安全隐患分类管理'}
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
        path: 'article',
        component: SCArticleTableView,
        name: '文章管理',
        meta: {description: '文章管理列表'}
      }, {
        path: 'articleadd',
        component: SCArticleAddFormView,
        name: '文章添加',
        meta: {description: '添加文章信息'}
      }, {
        path: 'articledetail',
        component: SCArticleDetailView,
        name: '文章详情',
        meta: {description: '查看文章详情'}
      }, {
        path: 'articlecategorymanage',
        component: SCArticleCategoryManageView,
        name: '文章板块管理',
        meta: {description: '板块管理'}
      }, {
        path: 'notify',
        component: SCNotifyTableView,
        name: '紧急通知',
        meta: {description: '模板管理'}
      }, {
        path: 'notifyadd',
        component: SCNotifyAddFormView,
        name: '模板添加',
        meta: {description: '添加模板信息'}
      }, {
        path: 'notifyinfo',
        component: SCNotifyInfoView,
        name: '通知明细',
        meta: {description: '模板明细'}
      }, {
        path: 'userlabelmanage',
        component: SCUserLabelManage,
        name: '用户标签组管理',
        meta: {description: '管理信息'}
      }, {
        path: 'firm',
        component: SCFirmTableView,
        name: '企业信息上报',
        meta: {description: '企业信息'}
      }, {
        path: 'firmdetail',
        component: SCFirmDetailView,
        name: '企业信息详情',
        meta: {description: '企业详情'}
      }, {
        path: 'wxuser',
        component: SCWxUserTableView,
        name: '微信用户管理',
        meta: {description: '微信用户详情'}
      }, {
        path: 'wxtagadd',
        component: SCWxUserTagAddView,
        name: '微信用户标签',
        meta: {description: '微信用户标签组'}
      }, {
        path: 'wxlink',
        component: SCWxUserLinkView,
        name: '关联微信用户',
        meta: {description: '关联微信用户标签组'}
      }, {
        path: 'wxtag',
        component: SCWxUserTagTableView,
        name: '微信用户标签组管理',
        meta: {description: '微信用户标签组'}
      }, {
        path: 'wxtaguser',
        component: SCWxTagUserListView,
        name: '标签用户信息管理',
        meta: {description: '微信用户标签组'}
      }, {
        path: 'wxprofile',
        component: SCWxUserProfileView,
        name: '微信用户详情'
      }, {
        path: 'dict',
        component: SCDictTableView,
        name: '字典管理'
      }, {
        path: 'dictel',
        component: SCDictElTableView,
        name: '字典元素管理'
      }, {
        path: 'role',
        component: SCRoleTableView,
        name: '角色管理'
      }, {
        path: 'roleuser',
        component: SCRoleUserTableView,
        name: '角色用户列表',
        meta: {description: '角色用户列表详情'}
      }, {
        path: 'rolelink',
        component: SCRoleLinkUserTableView,
        name: '关联角色用户列表',
        meta: {description: '关联角色用户列表详情'}
      }, {
        path: 'orgalist',
        component: SCOrgaListView,
        name: '组织列表管理'
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
