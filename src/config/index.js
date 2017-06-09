export default {
  serverURI: 'http://192.168.1.5:8080',
  menuAPI: '/admin/menu/show_left',
  appInfoAPI: '/admin/appinfo/show?code=gmaj',
  userListAPI: '/admin/user/index',
  removeUserAPI: '/admin/user/delete',
  caseListAPI: '/cmplnt/content/index',
  shieldCaseAPI: '/cmplnt/content/delete',
  caseDetailAPI: '/cmplnt/content/show',
  caseCatlgAPI: '/cmplnt/category/index',
  addCaseCatlgAPI: '/cmplnt/category/create',
  updateCaseCatlgAPI: '/cmplnt/category/update',
  editCaseCatlgAPI: '/cmplnt/category/delete',
  updateCaseAPI: '/cmplnt/content/update',
  uploadImgAPI: '/api/files/create',
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
  userLabelAPI: '/user/usr/userGroup/queryTagNames',
  firmListAPI: '/firm/companyinfo/index',
  firmDetailAPI: '/firm/companyinfo/show',
  firmUpdateAPI: '/firm/companyinfo/update',
  firmDeleteAPI: '/firm/companyinfo/delete',
  wxUserListAPI: '/user/usr/userinfo/index',
  wxUserProfileAPI: '/user/usr/userinfo/show',
  wxUserGroupAPI: '/user/usr/userGroup/queryTagNames',
  wxUserGroupListAPI: '/user/usr/userGroup/index',
  wxUserGroupUpdateAPI: '/user/usr/userGroup/update',
  wxUserGroupDeleteAPI: '/user/usr/userGroup/delete',
  wxUserGroupCreateAPI: '/user/usr/userGroup/create',
  wxUserGroupCheckAPI: '/user/usr/userGroup/checkTagName',
  wxUserGroupLinkAPI: '/user/usr/userGroup/createReference',
  wxUserGroupUserAPI: '/user/usr/userGroup/showTagUser',
  wxUserGroupReUserAPI: '/user/usr/userGroup/showReTagUser',
  wxUserGroupUserUnlinkAPI: '/user/usr/userGroup/deleteReference',
  wxUserStreetAPI: '/user/usr/userGroup/Streets',
  wxUserIndustryAPI: '/user/usr/userGroup/Industries',
  orgaListAPI: '/admin/organization/index',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { label: '进行中', value: 1 },
    { label: '已结案', value: 2 },
    { label: '已驳回', value: 3 }
  ]
}
