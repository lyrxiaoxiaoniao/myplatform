export default {
  serverURI: 'http://192.168.1.34:8080',
  menuAPI: '/admin/menu/show_left',
  appInfoAPI: '/admin/appinfo/show?code=gmaj',
  userListAPI: '/admin/user/index',
  removeUserAPI: '/admin/user/delete',
  caseListAPI: '/cmplnt/content/index',
  shieldCaseAPI: '/cmplnt/content/delete',
  caseDetailAPI: '/cmplnt/content/show',
  caseCatlgAPI: '/cmplnt/category/index',
  updateCaseAPI: '/cmplnt/content/update',
  uploadImgAPI: '/cms/image/upload',
  uploadCaseImgAPI: '/cmplnt/content/upload',
  articleAPI: '/cms/article/index',
  articleCatlgAPI: '/cms/category/index',
  addArticleCatlgAPI: '/cms/category/create',
  editArticleCatlgAPI: '/cms/category/update',
  removeArticleCatlgAPI: '/cms/category/delete',
  deleteArticleAPI: '/cms/article/delete',
  updateArticleAPI: '/cms/article/update',
  addArticleAPI: '/cms/article/create',
  articleDetailAPI: '/cms/article/show',
  updateArticleStatusAPI: '/cms/article/state',
  addTagAPI: '/cms/tag/create',
  notifyListAPI: '/notify/wx/index',
  notifyDeleteAPI: '/notify/wx/delete',
  notifyCountAPI: '/notify/wx/show',
  notifySendAPI: '/notify/wx/send',
  templateSaveAPI: '/notify/wx/save',
  notifyInfoAPI: '/notify/wx/detail/index',
  notifyDetailSendAPI: '/notify/wx/detail/send',
  templateTypeAPI: '/notify/wx/template/type',
  templateGetAPI: '/notify/wx/param/get',
  wxUserGroupAPI: '/user/usr/userGroup/queryTagNames',
  userLabelAPI: '/user/usr/userGroup/queryTagNames',
  firmListAPI: '/firm/companyinfo/index',
  firmDetailAPI: '/firm/companyinfo/show',
  firmUpdateAPI: '/firm/companyinfo/update',
  firmDeleteAPI: '/firm/companyinfo/delete',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { label: '进行中', value: 1 },
    { label: '已结案', value: 2 },
    { label: '已驳回', value: 3 }
  ]
}
