import DashView from 'components/Dash.vue'
import LoginView from 'components/Login.vue'
import ForgetView from 'components/Forgot.vue'
import ResetView from 'components/Reset.vue'
import NotFoundView from 'components/404.vue'
import baseRouters from './baseRouters.js'
import testRouters from './testRouters.js'
// Import Views - Dash
import DashMainView from 'components/views/dash/Main.vue'

import SCReportTableView from 'components/views/reports/ReportTable'
import SCReportDeatilView from 'components/views/reports/ReportDetail'
import SCReportCategoryView from 'components/views/reports/ReportCategory.vue'

import SCUserTableView from 'components/views/users/UserTable.vue'
import SCUserAddFormView from 'components/views/users/UserAddForm'
import SCUserDetailView from 'components/views/users/UserDetails.vue'
import SCUserLabelManage from 'components/views/users/UserLabelManage.vue'
import SCUserRoleView from 'components/views/users/UserRole.vue'

import SCArticleTableView from 'components/views/cms/ArticleTable'
import SCArticleAddFormView from 'components/views/cms/ArticleAddForm.vue'
import SCArticleDetailView from 'components/views/cms/ArticleDetail.vue'
import SCArticleCategoryManageView from 'components/views/cms/ArticleCategoryManage.vue'

import SCNotifyTableView from 'components/views/notify/NotifyTable.vue'
import SCNotifyAddFormView from 'components/views/notify/NotifyAddForm.vue'
import SCNotifyInfoView from 'components/views/notify/NotifyInfo'

import SCFirmTableView from 'components/views/firm/FirmTable.vue'
import SCFirmDetailView from 'components/views/firm/FirmDetail.vue'

import SCWxUserTableView from 'components/views/wxusers/WxUserTable.vue'
import SCWxUserTagAddView from 'components/views/wxusers/AddUserTag.vue'
import SCWxUserLinkView from 'components/views/wxusers/WxLinkUser.vue'
import SCWxUserTagTableView from 'components/views/wxusers/WxTagTable.vue'
import SCWxTagUserListView from 'components/views/wxusers/WxTagUserInfo.vue'
import SCWxUserProfileView from 'components/views/wxusers/WxUserProfile.vue'

import SCAdvertisementPoints from 'components/views/wxadvertisement/advertisementPoints.vue'
import SCAdvertisementContent from 'components/views/wxadvertisement/advertisementContent.vue'
import SCUpAdvContent from 'components/views/wxadvertisement/upPage/adContent.vue'
import SCUpAdvPoint from 'components/views/wxadvertisement/upPage/adLocation.vue'

import SCMenuTree from 'components/views/menulist/MenuTree.vue'
import SCMenuLink from 'components/views/menulist/MenuJurisdiction.vue'

import SCDictTableView from 'components/views/dict/DictTable.vue'
import SCDictElTableView from 'components/views/dict/DictElTable.vue'

import SCRoleTableView from 'components/views/characters/RoleTable.vue'
import SCRoleUserTableView from 'components/views/characters/RoleUserTable.vue'
import SCRoleLinkUserTableView from 'components/views/characters/RoleLinkUserTable.vue'
import SCRoleLinkAuthTableView from 'components/views/characters/LinkAuth.vue'

import SCOrgaTreeView from 'components/views/organization/OrgaTree.vue'
import SCDutyListView from 'components/views/organization/DutyList.vue'
import SCDutyUnrelatedView from 'components/views/organization/DutyUnrelated.vue'

import SCPersonalTable from 'components/views/personal/PersonalTable.vue'
import SCPersonalDetail from 'components/views/personal/PersonalDetail.vue'

import SCDutyManageView from 'components/views/duty/DutyManage.vue'

import SCAuthTableView from 'components/views/auth/AuthTable.vue'
import SCAuthRoleView from 'components/views/auth/LinkRole.vue'
import SCAuthMenuView from 'components/views/auth/LinkMenu.vue'

import SCActivityList from 'components/views/activity/List'
import SCActivityCategory from 'components/views/activity/Category'
import SCActivitySteps from 'components/views/activity/Steps'
import SCActivityProperty from 'components/views/activity/Property'
import SCActivityOption from 'components/views/activity/Options'
import SCActivitiAdd from 'components/views/activity/Add'

import SCTrainingList from 'components/views/training/List'
import SCTrainingPublish from 'components/views/training/Publish'
import SCTrainingCategory from 'components/views/training/Category'
import SCTrainingEdit from 'components/views/training/Edit'

import SCFileResource from 'components/views/fileresource/FileTable.vue'

/* 积分商城系统开始 */
import SCCommodity from 'components/views/produdcts/Commodity.vue'
import SCProducts from 'components/views/produdcts/products/Products.vue'
import SCAddProducts from 'components/views/produdcts/products/addProduct.vue'
import SCProductsRecycle from 'components/views/produdcts/products/ProductsRecycle.vue'
import SCInteract from 'components/views/produdcts/Interaction.vue'
import SCOrder from 'components/views/produdcts/order/Order.vue'
import SCSystemConfig from 'components/views/produdcts/SysConfig.vue'
import SCOrderSet from 'components/views/produdcts/order/OrderSet.vue'
import SCOrderDetail from 'components/views/produdcts/order/OrderDetail.vue'
/* 积分商城系统结束 */

import SCForm from 'components/views/form/Form.vue'
import SCFormDetail from 'components/views/form/FormDetail.vue'
import SCField from 'components/views/form/Field.vue'

import SCTutorialSignIn from 'components/views/tutorial/Signin.vue'
import SCTutorialManage from 'components/views/tutorial/Manage.vue'
import SCTutorialCategory from 'components/views/tutorial/Category.vue'
import SCTutorialTrash from 'components/views/tutorial/Trash.vue'
import SCTutorialSetting from 'components/views/tutorial/Setting.vue'
import SCTutorialComment from 'components/views/tutorial/Comment.vue'
import SCTutorialRankMange from 'components/views/tutorial/RankManage.vue'
import SCTutorialPublish from 'components/views/tutorial/Publish.vue'
import SCTutorialInfo from 'components/views/tutorial/Info.vue'
import SCTutorialEdit from 'components/views/tutorial/Edit.vue'

import SCTeam from 'components/views/team/Team.vue'
import SCTeamDetail from 'components/views/team/TeamDetail.vue'

import SCNewcmsColumn from 'components/views/cms/newcms/Column.vue'
import SCNewcmsJurisdiction from 'components/views/cms/newcms/Jurisdiction.vue'
import SCNewcmsContentAdd from 'components/views/cms/newcms/ContentAdd.vue'
import SCNewcmsContentRecycle from 'components/views/cms/newcms/ContentRecycle.vue'
import SCNewcmsContentEdit from 'components/views/cms/newcms/ContentEdit.vue'
import SCSysConfig from 'components/views/cms/newcms/SystemConfig.vue'
import SCInteraction from 'components/views/cms/newcms/Interaction.vue'
import SCHotWords from 'components/views/cms/newcms/word/HootWords.vue'
import SCWordSource from 'components/views/cms/newcms/word/Source.vue'
import SCWordLabel from 'components/views/cms/newcms/word/Label.vue'
import SCWordSensitive from 'components/views/cms/newcms/word/Sensitive.vue'

import SCSubjectView from 'components/views/cms/newcms/Subject.vue'
import SCMyContentView from 'components/views/cms/newcms/MyContent.vue'

import SCAwardsClass from 'components/views/awards/awardClass.vue'
import SCAwards from 'components/views/awards/awards.vue'
import SCAwardsAdd from 'components/views/awards/awardsAdd.vue'
import SCAwardsEdit from 'components/views/awards/awardsEdit.vue'
import SCAwardsSpec from 'components/views/awards/awardsSpec.vue'
import SCAwardsRelate from 'components/views/awards/awardsRelate.vue'
import SCAwardsRecycle from 'components/views/awards/awardRecycle.vue'

import NewLoginView from 'components/newLogin.vue'

import SCFundationList from 'components/views/reservation/fundationManagement/List.vue'
import SCFundationConfigList from 'components/views/reservation/fundationManagement/Config.vue'
import SCReservationList from 'components/views/reservation/reservationManagement/List.vue'
import SCCommentList from 'components/views/reservation/commentManagement/List.vue'
import SCBannedList from 'components/views/reservation/bannedListManagement/List.vue'

// recycle
import RecycleClass from 'components/views/recycle/village/recycleClass.vue'
import RecycleAdd from 'components/views/recycle/village/recycleAdd.vue'
import VillageDetail from 'components/views/recycle/village/villageDetail.vue'
import RelSeverList from 'components/views/recycle/village/relSever.vue'

// 工作台
import WorkBench from 'components/views/recycle/workbench/index.vue'
import DoWork from 'components/views/recycle/workbench/dispatcherDetail.vue'

// server
import ServerIndex from 'components/views/recycle/server/index.vue'
import ServerDetail from 'components/views/recycle/server/serverDetail.vue'
import ServerAdd from 'components/views/recycle/server/add.vue'
import RelVillage from 'components/views/recycle/server/relVillage.vue'

// 餐饮企业管理
import RestaurantsList from 'components/views/recycle/restaurants/RestaurantsList.vue'
import RestaurantsAdd from 'components/views/recycle/restaurants/RestaurantsAdd.vue'
import RestaurantsEdit from 'components/views/recycle/restaurants/RestaurantsEdit.vue'

// 地磅信息管理
import LoadometerInformationList from 'components/views/recycle/loadometerInformation/LoadometerInformationList.vue'
import LoadometerStatistics from 'components/views/recycle/loadometerInformation/LoadometerStatistics.vue'
import LoadometerDetailByDay from 'components/views/recycle/loadometerInformation/LoadometerDetailByDay.vue'

import RecycleRecoveryList from 'components/views/recycle/recovery/index.vue'
import RecycleRecoveryAdd from 'components/views/recycle/recovery/add.vue'
import RecycleRecoveryInfo from 'components/views/recycle/recovery/baseInfo.vue'
import RecycleRecoveryWay from 'components/views/recycle/recovery/way.vue'
import RecycleRecoveryWayEdit from 'components/views/recycle/recovery/wayManage/editWay.vue'
import RecycleRecoveryWayAdd from 'components/views/recycle/recovery/wayManage/addWay.vue'

// 电子围栏管理
import ElectronicFenceList from 'components/views/recycle/electronicFence/List.vue'
import ElectronicFenceAdd from 'components/views/recycle/electronicFence/AddNewFence.vue'
import ElectronicFenceConfig from 'components/views/recycle/electronicFence/FenceConfig.vue'
import ElectronicGpsInfo from 'components/views/recycle/electronicFence/GpsInfo.vue'

const routes = [
  {
    path: '/newlogin',
    component: LoginView
  }, {
    path: '/login',
    component: NewLoginView
  }, {
    path: '/forgot',
    component: ForgetView
  }, {
    path: '/reset',
    component: ResetView
  }, {
    path: '/',
    component: DashView,
    redirect: '/admin/index',
    children: [{
      path: 'index',
      component: DashMainView,
      name: '主页'
    }]
  }, {
    path: '/admin',
    component: DashView,
    redirect: '/admin/index',
    children: [
      ...baseRouters,
      ...testRouters,
      {
        path: 'index',
        component: DashMainView,
        name: '深传互动'
      }, {
        // User Module
        path: 'user',
        component: DashMainView,
        redirect: '/admin/user/index',
        name: '用户',
        meta: { description: '后台用户' },
        children: [{
          path: 'index',
          component: SCUserTableView,
          name: '后台用户',
          meta: { description: '后台用户列表' }
        }, {
          path: 'detail',
          component: SCUserDetailView,
          name: '后台用户详情',
          meta: { description: '后台用户详情' }
        }, {
          path: 'role',
          component: SCUserRoleView,
          name: '后台用户角色管理',
          meta: { description: '后台用户角色' }
        }, {
          path: 'add',
          component: SCUserAddFormView,
          name: '添加后台用户',
          meta: { description: '添加后台用户' }
        }]
      }, {
        // Report Module
        path: 'report',
        component: DashMainView,
        redirect: '/admin/report/index',
        name: '安全隐患',
        meta: { description: '安全隐患案件' },
        children: [{
          path: 'index',
          component: SCReportTableView,
          name: '安全隐患管理',
          meta: { description: '安全隐患案件列表' }
        }, {
          path: 'detail',
          component: SCReportDeatilView,
          name: '安全隐患详情',
          meta: { description: '安全隐患案件详情' }
        }, {
          path: 'category',
          component: SCReportCategoryView,
          name: '安全隐患分类管理',
          meta: { description: '安全隐患分类详情' }
        }]
      }, {
        // Article Module
        path: 'article',
        component: DashMainView,
        redirect: '/admin/article/index',
        name: '文章管理',
        meta: { description: '文章管理' },
        children: [{
          path: 'index',
          component: SCArticleTableView,
          name: '文章列表',
          meta: { description: '文章管理列表' }
        }, {
          path: 'add',
          component: SCArticleAddFormView,
          name: '文章添加',
          meta: { description: '添加文章' }
        }, {
          path: 'detail',
          component: SCArticleDetailView,
          name: '文章详情',
          meta: { description: '文章详情' }
        }, {
          path: 'category',
          component: SCArticleCategoryManageView,
          name: '文章板块管理',
          meta: { description: '文章板块管理' }
        }]
      }, {
        // Notify Template Module
        path: 'notify',
        component: DashMainView,
        redirect: '/admin/notify/index',
        name: '消息通知',
        meta: { description: '消息通知' },
        children: [{
          path: 'index',
          component: SCNotifyTableView,
          name: '消息通知管理',
          meta: { description: '消息通知列表' }
        }, {
          path: 'add',
          component: SCNotifyAddFormView,
          name: '消息通知添加',
          meta: { description: '消息通知添加' }
        }, {
          path: 'info',
          component: SCNotifyInfoView,
          name: '消息通知明细',
          meta: { description: '消息通知明细' }
        }]
      }, {
        // Firm Module
        path: 'firm',
        component: DashMainView,
        redirect: '/admin/firm/index',
        name: '企业信息管理',
        meta: { description: '企业信息上报' },
        children: [{
          path: 'index',
          component: SCFirmTableView,
          name: '企业信息列表',
          meta: { description: '企业信息列表' }
        }, {
          path: 'detail',
          component: SCFirmDetailView,
          name: '企业信息详情',
          meta: { description: '企业信息详情' }
        }]
      }, {
        // WxUser Module
        path: 'wxuser',
        component: DashMainView,
        redirect: '/admin/wxuser/index',
        name: '微信用户',
        meta: { description: '微信用户' },
        children: [{
          path: 'index',
          component: SCWxUserTableView,
          name: '微信用户管理',
          meta: { description: '微信用户列表' }
        }, {
          path: 'tag',
          component: SCWxUserTagTableView,
          name: '微信用户标签组管理',
          meta: { description: '微信用户标签组' }
        }, {
          path: 'add',
          component: SCWxUserTagAddView,
          name: '微信用户标签组添加',
          meta: { description: '微信用户标签组添加' }
        }, {
          path: 'link',
          component: SCWxUserLinkView,
          name: '标签组关联微信用户',
          meta: { description: '关联微信用户标签组' }
        }, {
          path: 'user',
          component: SCWxTagUserListView,
          name: '标签微信用户信息管理',
          meta: { description: '微信用户标签组' }
        }, {
          path: 'profile',
          component: SCWxUserProfileView,
          name: '微信用户详情',
          meta: { description: '微信用户详情' }
        }]
      }, {
        // Auth Module
        path: 'auth',
        component: DashMainView,
        redirect: '/admin/auth/index',
        name: '权限管理',
        meta: { description: '权限管理' },
        children: [{
          path: 'index',
          component: SCAuthTableView,
          name: '权限列表',
          meta: { description: '权限列表管理' }
        }, {
          path: 'role',
          component: SCAuthRoleView,
          name: '权限关联角色管理',
          meta: { description: '权限关联角色' }
        }, {
          path: 'menu',
          component: SCAuthMenuView,
          name: '权限关联菜单管理',
          meta: { description: '权限关联菜单' }
        }]
      }, {
        // Role Module
        path: 'role',
        component: DashMainView,
        redirect: '/admin/role/index',
        name: '角色管理',
        meta: { description: '角色管理' },
        children: [{
          path: 'index',
          component: SCRoleTableView,
          name: '角色列表管理',
          meta: { description: '角色管理列表' }
        }, {
          path: 'user',
          component: SCRoleUserTableView,
          name: '角色用户列表管理',
          meta: { description: '角色用户列表详情' }
        }, {
          path: 'link',
          component: SCRoleLinkUserTableView,
          name: '角色关联用户列表',
          meta: { description: '角色关联用户列表详情' }
        }, {
          path: 'auth',
          component: SCRoleLinkAuthTableView,
          name: '角色权限管理',
          meta: { description: '角色关联权限详情' }
        }]
      }, {
        // Dict Module
        path: 'dict',
        component: DashMainView,
        redirect: '/admin/dict/index',
        name: '字典管理',
        meta: { description: '字典管理' },
        children: [{
          path: 'index',
          component: SCDictTableView,
          name: '字典列表管理',
          meta: { description: '字典列表' }
        }, {
          path: 'element',
          component: SCDictElTableView,
          name: '字典元素管理',
          meta: { description: '字典元素列表' }
        }]
      }, {
        // Menu Module
        path: 'menu',
        component: DashMainView,
        redirect: '/admin/menu/index',
        name: '菜单管理',
        meta: {description: '后台菜单'},
        children: [{
          path: 'index',
          component: SCMenuTree,
          name: '后台菜单管理',
          meta: { description: '后台菜单' }
        }, {
          path: 'auth',
          component: SCMenuLink,
          name: '菜单权限管理',
          meta: {description: '菜单关联权限管理'}
        }]
      }, {
        // Organization Module
        path: 'organization',
        component: DashMainView,
        redirect: '/admin/organization/index',
        name: '组织管理',
        meta: {description: '组织管理'},
        children: [{
          path: 'index',
          component: SCOrgaTreeView,
          name: '组织列表管理',
          meta: { description: '组织列表管理' }
        }, {
          path: 'duty',
          component: SCDutyListView,
          name: '组织职位管理',
          meta: { description: '组织职位管理' }
        }, {
          path: 'link',
          component: SCDutyUnrelatedView,
          name: '组织关联职位',
          meta: { description: '组织职位管理' }
        }]
      }, {
        // Duty Module
        path: 'duty',
        component: DashMainView,
        redirect: '/admin/duty/index',
        name: '职位',
        meta: { description: '职位管理' },
        children: [{
          path: 'index',
          component: SCDutyManageView,
          name: '职位管理',
          meta: { description: '职位管理详情' }
        }]
      }, {
        // Personal Module
        path: 'personal',
        component: DashMainView,
        redirect: '/admin/personal/index',
        name: '个人信息上报',
        meta: { description: '职位管理' },
        children: [{
          path: 'index',
          component: SCPersonalTable,
          name: '个人信息管理',
          meta: { description: '个人信息上报管理' }
        }, {
          path: 'detail',
          component: SCPersonalDetail,
          name: '个人信息详情',
          meta: { description: '个人信息上报详情' }
        }]
      }, {
        path: 'activity',
        component: DashMainView,
        redirect: '/admin/activity/index',
        name: '活动管理',
        meta: { description: '活动管理' },
        children: [{
          path: 'index',
          component: SCActivityList,
          name: '活动列表管理',
          meta: { description: '活动列表' }
        }, {
          path: 'publish',
          component: SCActivitiAdd,
          name: '活动发布',
          meta: { description: '发布信息' }
        }, {
          path: 'category',
          component: DashMainView,
          redirect: '/admin/activity/category/index',
          name: '活动类型管理',
          meta: { description: '活动类型管理' },
          children: [{
            path: 'index',
            component: SCActivityCategory,
            name: '活动类型列表',
            meta: { description: '活动类型管理' }
          }]
        }, {
          path: 'steps',
          component: DashMainView,
          redirect: '/admin/activity/steps/index',
          name: '活动步骤管理',
          meta: { description: '活动步骤管理' },
          children: [{
            path: 'index',
            component: SCActivitySteps,
            name: '活动步骤列表',
            meta: { description: '活动步骤管理' }
          }]
        }, {
          path: 'property',
          component: DashMainView,
          redirect: '/admin/activity/property/index',
          name: '活动属性管理',
          meta: { description: '活动属性管理' },
          children: [{
            path: 'index',
            component: SCActivityProperty,
            name: '活动属性列表',
            meta: { description: '活动属性管理' }
          }]
        }, {
          path: 'option',
          component: DashMainView,
          redirect: '/admin/activity/option/index',
          name: '活动属性值管理',
          meta: { description: '活动属性值管理' },
          children: [{
            path: 'index',
            component: SCActivityOption,
            name: '活动属性值列表',
            meta: { description: '活动属性值管理' }
          }]
        }]
      }, {
        path: 'training',
        component: DashMainView,
        redirect: '/admin/training/index',
        name: '培训管理',
        meta: { description: '活动管理' },
        children: [{
          path: 'index',
          component: SCTrainingList,
          name: '培训列表',
          meta: { description: '列表' }
        }, {
          path: 'publish',
          component: SCTrainingPublish,
          name: '培训发布',
          meta: { description: '发布新的活动' }
        }, {
          path: 'category',
          component: SCTrainingCategory,
          name: '培训分类管理',
          meta: { description: '分类' }
        }, {
          path: 'edit',
          component: SCTrainingEdit,
          name: '培训信息修改',
          meta: { description: '培训详细信息' }
        }]
      }, {
        path: 'userlabelmanage',
        component: SCUserLabelManage,
        name: '用户标签组管理',
        meta: { description: '管理信息' }
      }, {
        path: 'ad',
        component: DashMainView,
        redirect: '/admin/ad/index',
        name: '广告管理',
        meta: {description: '广告管理'},
        children: [{
          path: 'point',
          component: DashMainView,
          redirect: '/admin/ad/point/index',
          name: '广告点位管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: SCAdvertisementPoints,
            name: '广告点位管理列表',
            meta: {description: '列表'}
          }]
        }, {
          path: 'content',
          component: DashMainView,
          redirect: '/admin/ad/content/index',
          name: '广告内容管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            name: '广告列表',
            component: SCAdvertisementContent,
            meta: {description: '管理'}
          }]
        }, {
          path: 'upload',
          component: DashMainView,
          redirect: '/admin/ad/upload/index',
          name: '广告上画管理',
          meta: {description: '广告上画管理'},
          children: [{
            path: 'index',
            component: SCUpAdvContent,
            name: '广告内容上画管理',
            meta: {description: '按照广告内容上画到广告点位'}
          }, {
            path: 'point',
            component: SCUpAdvPoint,
            name: '广告点位上画管理',
            meta: {description: '按照广告点位上画到广告内容'}
          }]
        }]
      }, {
        path: 'files',
        component: DashMainView,
        redirect: '/admin/files/index',
        name: '文件资源',
        meta: {description: '文件资源管理'},
        children: [{
          path: 'index',
          component: SCFileResource,
          name: '文件资源管理',
          meta: {description: '集中上传管理文件资源和图片资源'}
        }]
      }, {
        path: 'goods',
        component: DashMainView,
        redirect: '/admin/goods/index',
        name: '商品管理',
        meta: {description: '列表'},
        children: [{
          path: 'index',
          component: SCCommodity,
          name: '商品分类管理',
          meta: {description: '列表'}
        }, {
          path: 'product',
          component: DashMainView,
          redirect: '/admin/goods/product/index',
          name: '商品管理信息',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: SCProducts,
            name: '商品信息管理',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: SCAddProducts,
            name: '新增商品',
            meta: {description: '添加'}
          }, {
            path: 'recycle',
            component: SCProductsRecycle,
            name: '商品回收站',
            meta: {description: '列表'}
          }]
        }, {
          path: 'interact',
          component: SCInteract,
          name: '互动管理',
          meta: {description: '评价列表'}
        }, {
          path: 'order',
          component: DashMainView,
          redirect: '/admin/goods/order/index',
          name: '订单',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: SCOrder,
            name: '订单管理',
            meta: {description: '列表'}
          }, {
            path: 'setting',
            component: SCOrderSet,
            name: '订单设置',
            meta: {description: '修改订单处理配置信息'}
          }, {
            path: 'detail',
            component: SCOrderDetail,
            name: '订单详情',
            meta: {description: '列出具体的订单详细信息'}
          }]
        }, {
          path: 'system',
          component: SCSystemConfig,
          name: '系统配置',
          meta: {description: '列表'}
        }]
      }, {
        path: 'form',
        component: DashMainView,
        redirect: '/admin/form/index',
        name: '表单管理',
        meta: {description: '表单管理'},
        children: [{
          path: 'index',
          component: SCForm,
          name: '表单',
          meta: {description: '列表'}
        }, {
          path: 'field',
          component: SCField,
          name: '标签管理',
          meta: {description: '列表'}
        }, {
          path: 'detail',
          component: SCFormDetail,
          name: '表单详情',
          meta: {description: '列表'}
        }]
      }, {
        path: 'newcms',
        component: DashMainView,
        redirect: '/admin/newcms/index',
        name: 'cms信息管理',
        meta: {description: '列表'},
        children: [{
          path: 'index',
          component: SCNewcmsColumn,
          name: '栏目管理',
          meta: {description: '列表'}
        }, {
          path: 'jurisdict',
          component: SCNewcmsJurisdiction,
          name: '栏目权限管理',
          meta: {description: '列表'}
        }, {
          path: 'content',
          component: DashMainView,
          redirect: '/admin/newcms/content/index',
          name: 'CMS内容管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: SCMyContentView,
            name: '内容管理',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: SCNewcmsContentAdd,
            name: '内容新增',
            meta: {description: '列表'}
          }, {
            path: 'edit',
            component: SCNewcmsContentEdit,
            name: '内容修改',
            meta: {description: '列表'}
          }, {
            path: 'recycle',
            component: SCNewcmsContentRecycle,
            name: '内容回收站',
            meta: {description: '列表'}
          }]
        }, {
          path: 'sysconfig',
          component: SCSysConfig,
          name: '配置管理',
          meta: {description: '列表'}
        }, {
          path: 'interaction',
          component: SCInteraction,
          name: '互动管理信息',
          meta: {description: '列表'}
        }, {
          path: 'word',
          component: DashMainView,
          redirect: '/admin/newcms/word/index',
          name: '词汇管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: SCHotWords,
            name: '热词管理',
            meta: {description: '列表'}
          }, {
            path: 'source',
            component: SCWordSource,
            name: '来源管理',
            meta: {description: '列表'}
          }, {
            path: 'label',
            component: SCWordLabel,
            name: 'CMS标签管理',
            meta: {description: '列表'}
          }, {
            path: 'sensitive',
            component: SCWordSensitive,
            name: '敏感词管理',
            meta: {description: '列表'}
          }]
        }, {
          path: 'subject',
          component: SCSubjectView,
          name: '专题管理',
          meta: {description: '列表'}
        }]
      }, {
        path: 'team',
        component: DashMainView,
        redirect: '/admin/team/index',
        name: '团队管理',
        meta: {description: '列表'},
        children: [{
          path: 'index',
          component: SCTeam,
          name: '团队',
          meta: {description: '列表'}
        }, {
          path: 'detail',
          component: SCTeamDetail,
          name: '团队详情',
          meta: {description: '展示'}
        }]
      }, {
        path: 'tutorial',
        component: DashMainView,
        redirect: '/admin/tutorial/index',
        name: '线上课堂应用',
        meta: {description: '线上课堂管理'},
        children: [{
          path: 'index',
          component: SCTutorialManage,
          name: '课程管理',
          meta: {description: '课程管理中心'}
        }, {
          path: 'category',
          component: SCTutorialCategory,
          name: '课程分类管理',
          meta: {description: '课程分类管理中心'}
        }, {
          path: 'signin',
          component: SCTutorialSignIn,
          name: '课程报名管理',
          meta: {description: '查看课程的详细信息'}
        }, {
          path: 'trash',
          component: SCTutorialTrash,
          name: '课程回收站',
          meta: {description: '课程中心'}
        }, {
          path: 'setting',
          component: SCTutorialSetting,
          name: '线上课堂系统配置',
          meta: {description: '修改系统配置信息'}
        }, {
          path: 'rank',
          component: SCTutorialRankMange,
          name: '课程评价打分管理',
          meta: {description: '查看课程的详细评价打分'}
        }, {
          path: 'comment',
          component: SCTutorialComment,
          name: '课程评论信息',
          meta: {description: '查看课程的详细信息'}
        }, {
          path: 'publish',
          component: SCTutorialPublish,
          name: '新增课程',
          meta: {description: '发布新的课程'}
        }, {
          path: 'info',
          component: SCTutorialInfo,
          name: '查看课程信息',
          meta: {description: '查看课程的详细信息'}
        }, {
          path: 'edit',
          component: SCTutorialEdit,
          name: '修改课程信息',
          meta: {description: '修改课程的详细信息'}
        }]
      }, {
        path: 'awards',
        component: DashMainView,
        redirect: '/admin/awards/index',
        name: '奖品管理',
        meta: {description: '列表'},
        children: [{
          path: 'index',
          component: SCAwardsClass,
          name: '奖品分类管理',
          meta: {description: '列表'}
        }, {
          path: 'product',
          component: SCAwards,
          name: '奖品信息管理',
          meta: {description: '展示'}
        }, {
          path: 'spec',
          component: SCAwardsSpec,
          name: '奖品规格管理',
          meta: {description: '展示'}
        }, {
          path: 'relate',
          component: SCAwardsRelate,
          name: '奖品分类关联规格管理',
          meta: {description: '展示'}
        }, {
          path: 'add',
          component: SCAwardsAdd,
          name: '奖品新增',
          meta: {description: '展示'}
        }, {
          path: 'edit',
          component: SCAwardsEdit,
          name: '奖品修改',
          meta: {description: '展示'}
        }, {
          path: 'recycle',
          component: SCAwardsRecycle,
          name: '奖品回收站',
          meta: {description: '展示'}
        }]
      },
      {
        path: 'reservation',
        component: DashMainView,
        redirect: '/admin/reservation/index',
        name: '预约管理',
        meta: {description: '列表'},
        children: [{
          path: 'index',
          component: SCFundationList,
          name: '基地预约管理',
          meta: {description: '列表'}
        }, {
          path: 'reserve',
          component: SCReservationList,
          name: '预约单管理',
          meta: {description: '列表'}
        }, {
          path: 'comment',
          component: SCCommentList,
          name: '评价管理',
          meta: {description: '列表'}
        }, {
          path: 'banned',
          component: SCBannedList,
          name: '黑名单管理',
          meta: {description: '列表'}
        }, {
          path: 'config',
          component: SCFundationConfigList,
          name: '基地配置',
          meta: {description: '列表'}
        }]
      },
      {
        path: 'recycle',
        component: DashMainView,
        redirect: '/admin/recycle/village',
        name: '罗湖城管垃圾分类',
        meta: {description: '列表'},
        children: [{
          path: 'workbench',
          component: DashMainView,
          redirect: '/admin/recycle/workbench/index',
          name: '工作台',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: WorkBench,
            name: '工作台',
            meta: {description: '列表'}
          }, {
            path: 'do',
            component: DoWork,
            name: '待办工作',
            meta: {description: ''}
          }]
        }, {
          path: 'village',
          component: DashMainView,
          redirect: '/admin/recycle/village/index',
          name: '小区管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: RecycleClass,
            name: '小区信息管理',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: RecycleAdd,
            name: '添加小区',
            meta: {description: '列表'}
          }, {
            path: 'detail',
            component: VillageDetail,
            name: '小区详情',
            meta: {description: '列表'}
          }, {
            path: 'relserver',
            component: RelSeverList,
            name: '关联物业',
            meta: {description: '列表'}
          }]
        }, {
          path: 'server',
          component: DashMainView,
          redirect: '/admin/recycle/server/index',
          name: '物业管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: ServerIndex,
            name: '物业信息管理',
            meta: {description: '列表'}
          }, {
            path: 'detail',
            component: ServerDetail,
            name: '物业详情',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: ServerAdd,
            name: '添加物业',
            meta: {description: '列表'}
          }, {
            path: 'relvillage',
            component: RelVillage,
            name: '关联小区',
            meta: {description: '列表'}
          }]
        }, {
          path: 'recovery',
          component: DashMainView,
          redirect: '/admin/recycle/recovery/index',
          name: '收运公司管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: RecycleRecoveryList,
            name: '清运公司管理',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: RecycleRecoveryAdd,
            name: '回收公司管理',
            meta: {description: '新增'}
          }, {
            path: 'info',
            component: RecycleRecoveryInfo,
            name: '回收公司',
            meta: {description: '信息管理'}
          }, {
            path: 'way',
            component: DashMainView,
            redirect: '/admin/recycle/recovery/way/index',
            name: '线路',
            meta: {description: '信息管理'},
            children: [{
              path: 'index',
              component: RecycleRecoveryWay,
              name: '回收公司线路管理',
              meta: {description: '列表'}
            }, {
              path: 'add',
              component: RecycleRecoveryWayAdd,
              name: '线路管理',
              meta: {description: '添加线路'}
            }, {
              path: 'edit',
              component: RecycleRecoveryWayEdit,
              name: '线路管理详情',
              meta: {description: '修改线路'}
            }]
          }]
        }, {
          path: 'restaurants',
          component: DashMainView,
          redirect: '/admin/recycle/restaurants/index',
          name: '餐饮企业管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: RestaurantsList,
            name: '餐饮企业信息管理',
            meta: {description: '列表'}
          }, {
            path: 'add',
            component: RestaurantsAdd,
            name: '添加餐饮企业',
            meta: {description: '添加餐饮企业'}
          }, {
            path: 'edit',
            component: RestaurantsEdit,
            name: '企业详情',
            meta: {description: '查看和编辑企业信息'}
          }]
        }, {
          path: 'loadometerinformation',
          component: DashMainView,
          redirect: '/admin/recycle/loadometerinformation/index',
          name: '地磅信息总路由',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: LoadometerInformationList,
            name: '地磅信息管理',
            meta: {description: '列表'}
          }, {
            path: 'statistics',
            component: LoadometerStatistics,
            name: '地磅数据管理',
            meta: {description: '地磅数据统计'}
          }, {
            path: 'detail',
            component: LoadometerDetailByDay,
            name: '地磅数据详情',
            meta: {description: '地磅点每天数据详情'}
          }]
        }, {
          path: 'fence',
          component: DashMainView,
          redirect: '/admin/recycle/fence/index',
          name: '电子围栏管理',
          meta: {description: '列表'},
          children: [{
            path: 'index',
            component: ElectronicFenceList,
            name: '电子围栏管理',
            meta: {description: '列表'}
          },
          {
            path: 'new',
            component: ElectronicFenceAdd,
            name: '添加电子围栏',
            meta: {description: '列表'}
          },
          {
            path: 'config',
            component: ElectronicFenceConfig,
            name: '围栏设置',
            meta: {description: '列表'}
          },
          {
            path: 'gps',
            component: ElectronicGpsInfo,
            name: 'GPS信息点',
            meta: {description: '列表'}
          }]
        }]
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
