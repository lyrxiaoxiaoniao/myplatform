/* eslint no-useless-escape: "off" */
export default {
  // serverURI: 'http://test.java.shencom.cn/gm',
  serverURI: 'http://192.168.1.22:8080',
  // serverURI: 'http://192.168.1.34:8080',
  basic: {
    key: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArromvW2N\/rg0ADw9zpTL\ncGdO0wNazPcp+SepPrv1dicCamEVPfvPKlWMuYszt\/tE6lNjMT8pphmatPvgjAFy\nKfE1fEpcvHqRSZTUtlo\/fGJzh2nss6mxyDXlqi+sGitjwaGj6\/MXO6zLQcMQmZ\/U\nvliOhECvuLBsAqqLY8ik63Ah7ylWAap3jDD0OvgSy+glqebwfacy9WPYOy4K75n\/\nDQRw9FJBYFg1BtfbVn55Oji3AZ0E3lY96b0JhJGtFM6vjF0bhVDkmP\/XZINPcVZy\nxydRFvxjgA6we\/KmxXDD\/JdZmvGmrZ2XCAhGS3vuk3XJnkMquGYO4GAI13JIs8Z1\nrwIDAQAB\n-----END PUBLIC KEY-----',
    sendMail: '/sys/sendMsgVerify',
    forgetMail: '/admin/password/sendEmail',
    login: '/sys/login',
    refresh: '/sys/user'
  },
  report: {
    detail: '/cmplnt/content/show'
  },
  cms: {
  },
  firm: {
  },
  notify: {
  },
  wxusers: {
  },
  users: {
    deleteUser: '/admin/user/delete',
    userDetail: '/admin/user/show',
    userCreate: '/admin/user/create',
    relatedRole: '/admin/userrole/show/role/related',
    unrelatedRole: '/admin/userrole/show/role/relate',
    linkRole: '/admin/userrole/create',
    unlinkRole: '/admin/userrole/delete'
  },
  role: {
    relatedAuth: '/admin/rolepermission/show/permission/related',
    unrelatedAuth: '/admin/rolepermission/show/permission/relate',
    linkAuth: '/admin/rolepermission/create',
    unLinkAuth: '/admin/rolepermission/delete'
  },
  auth: {
    authList: '/admin/permission/index',
    authCreate: '/admin/permission/create',
    authDelete: '/admin/permission/delete',
    authUpdate: '/admin/permission/update',
    relatedRole: '/admin/rolepermission/show/role/related',
    unrelatedRole: '/admin/rolepermission/show/role/relate',
    linkRole: '/admin/rolepermission/create',
    unLinkRole: '/admin/rolepermission/delete',
    relatedMenu: '/admin/mp/show/menu/related',
    unrelatedMenu: '/admin/mp/show/menu/relate',
    linkMenu: '/admin/mp/create',
    unLinkMenu: '/admin/mp/delete'
  },
  activity: {
    typeList: '/activity/category/index',
    typeCreate: '/activity/category/create',
    typeDelete: '/activity/category/delete',
    typeUpdate: '/activity/category/update',
    stepList: '/activity/stage/index',
    stepCreate: '/activity/stage/create',
    stepDelete: '/activity/stage/delete',
    stepUpdate: '/activity/stage/update',
    optionList: '/activity/option/index',
    optionCreate: '/activity/option/create',
    optionDelete: '/activity/option/delete',
    optionUpdate: '/activity/option/update',
    propertyList: '/activity/property/index',
    propertyCreate: '/activity/property/create',
    propertyDelete: '/activity/property/delete',
    propertyUpdate: '/activity/property/update'
  },
  menuAPI: '/admin/menu/show_left',
  deleteMenuAPI: '/admin/menu/delete',
  addMenuAPI: '/admin/menu/create',
  updateMenuAPI: '/admin/menu/update',
  reatedMenuAPI: '/admin/mp/show/permission/related',
  unreatedMenuAPI: '/admin/mp/show/permission/relate',
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
  advertisementListAPI: '/adv/index',
  addAdvertisementAPI: '/adv/create',
  deleteAdvertisementAPI: '/adv/delete',
  editAdvertisementAPI: '/adv/update',
  showAdvertisementAPI: '/adv/show',
  advPointListAPI: '/advspace/index',
  deleteAdvPointAPI: '/advspace/delete',
  editAdvePointAPI: '/advspace/update',
  addAdvPointAPI: '/advspace/create',
  showAdvPointAPI: '/advspace/show',
  addPointAPI: '/adv/queryspace',
  dictListAPI: '/com/dictionary/option/index',
  dictCreateAPI: '/com/dictionary/option/create',
  dictShowAPI: '/com/dictionary/option/show',
  dictDeleteAPI: '/com/dictionary/option/delete',
  dictElListAPI: '/com/dictionary/property/index',
  dictElCreateAPI: '/com/dictionary/property/create',
  dictElDeleteAPI: '/com/dictionary/property/delete',
  dictElUpdateAPI: '/com/dictionary/property/update',
  roleListAPI: '/admin/role/index',
  roleUserRelatedAPI: '/admin/userrole/show/user/related',
  roleUserUnrelatedAPI: '/admin/userrole/show/user/relate',
  roleUserRelatedDeleteAPI: '/admin/userrole/delete',
  roleRelateUserAPI: '/admin/userrole/create',
  roleUserLockAPI: '/admin/user/lock',
  roleCreateAPI: '/admin/role/create',
  roleDeleteAPI: '/admin/role/delete',
  roleUpdateAPI: '/admin/role/update',
  orgaListAPI: '/admin/organization/index',
  addOrgaAPI: '/admin/organization/create',
  editOrgaAPI: '/admin/organization/update',
  removeOrgaAPI: '/admin/organization/delete',
  dutyRelated: '/admin/op/show/related',
  dutyUnrelated: '/admin/op/show/relate',
  dutyListAPI: '/admin/position/index',
  dutyCreateAPI: '/admin/position/create',
  dutyDeleteAPI: '/admin/position/delete',
  dutyUpdateAPI: '/admin/position/update',
  createRelateAPI: '/admin/op/create/relate',
  deleteRelateAPI: '/admin/op/delete/relate',
  personalListAPI: '/firm/userinfo/index',
  personalDetailAPI: '/firm/userinfo/show',
  personalDeleteAPI: '/firm/userinfo/delete',
  personalUpdateAPI: '/firm/userinfo/update',
  fixedLayout: false,
  hideLogoOnMobile: false,
  reportsStatusCatlg: [
    { label: '进行中', value: 1 },
    { label: '已结案', value: 2 },
    { label: '已驳回', value: 3 }
  ]
}
