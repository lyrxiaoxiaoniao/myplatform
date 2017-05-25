export default {
  serverURI: 'http://192.168.1.4:8080',
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
  removeArticleCatlgAPI: '/cms/category/delete',
  deleteArticleAPI: '/cms/article/delete',
  addArticleAPI: '/cms/article/create',
  articleDetailAPI: '/cms/article/show',
  addTagAPI: '/cms/tag/create',
  notifyListAPI: '/notify/wx/index',
  notifyInfoAPI: '/notify/wx/detail/index',
  templateTypeAPI: '/notify/wx/template/type',
  templateGetAPI: '/notify/wx/param/get',
  templateSaveAPI: '/notify/wx/save',
  wxUserGroupAPI: '/user/usr/userGroup/queryTagNames',
  userLabelAPI: '/user/usr/userGroup/queryTagNames',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { label: '进行中', value: 1 },
    { label: '已结案', value: 2 },
    { label: '已驳回', value: 3 }
  ]
}
