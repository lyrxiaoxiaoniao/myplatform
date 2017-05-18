export default {
  serverURI: 'http://192.168.1.2:8080',
  menuAPI: '/admin/menu/show_left',
  appInfoAPI: '/admin/appinfo/show?code=gmaj',
  userListAPI: '/admin/user/index',
  removeUserAPI: '/admin/user/delete',
  caseListAPI: '/cmplnt/content/index',
  shieldCaseAPI: '/cmplnt/content/delete',
  caseDetailAPI: '/cmplnt/content/show',
  caseCatlgAPI: '/cmplnt/category/index',
  uploadImgAPI: '/cms/image/upload',
  uploadCaseImgAPI: '/cmplnt/content/upload',
  articleAPI: '/cms/article/index',
  articleCatlgAPI: '/cms/category/index',
  deleteArticleAPI: '/cms/article/delete',
  addArticleAPI: '/cms/article/create',
  updateCaseAPI: '/cmplnt/content/update',
  addTagAPI: '/cms/tag/create',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { label: '进行中', value: 1 },
    { label: '已结案', value: 2 },
    { label: '已驳回', value: 3 }
  ]
}
