export default {
  serverURI: 'http://c57e044c.ngrok.io',
  menuAPI: '/admin/menu/show_left',
  appInfoAPI: '/admin/appinfo/show?code=gmaj',
  userListAPI: '/admin/user/index',
  removeUserAPI: '/admin/user/delete',
  caseListAPI: '/cmplnt/content/index',
  shieldCaseAPI: '/cmplnt/content/delete',
  caseDetailAPI: '/cmplnt/content/show',
  caseCatlgAPI: '/cmplnt/category/index',
  uploadImgAPI: '/cms/image/upload',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { value: '进行中', code: 1 },
    { value: '已结案', code: 2 },
    { value: '已驳回', code: 3 }
  ]
}
