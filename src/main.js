import 'babel-polyfill'
// Import System requirements
import Vue from 'vue'
import VueRouter from 'vue-router'

import {sync} from 'vuex-router-sync'
import routes from './routes'
import store from './store'

// Import Helpers for filters
import {domain, count, prettyDate, pluralize, toDate} from './filters'

// Import Views - Top level
import AppView from './components/App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import AMap from 'vue-amap'
import VueHtml5Editor from 'vue-html5-editor'
import BaiduMap from 'vue-baidu-map'

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)
Vue.filter('toDate', toDate)

Vue.use(VueRouter)
Vue.use(ElementUI)
// Vue.use(AMap)
Vue.use(BaiduMap, {
  ak: 'cMZGi52nYsGFjmo0YagvH2ucBzXCzUou'
})
Vue.use(VueHtml5Editor, {
  name: 'vue-html5-editor',
  showModuleName: false,
  icons: {
    text: 'fa fa-pencil',
    color: 'fa fa-paint-brush',
    font: 'fa fa-font',
    align: 'fa fa-align-justify',
    list: 'fa fa-list',
    link: 'fa fa-chain',
    unlink: 'fa fa-chain-broken',
    tabulation: 'fa fa-table',
    image: 'fa fa-file-image-o',
    hr: 'fa fa-minus',
    eraser: 'fa fa-eraser',
    undo: 'fa-undo fa',
    'full-screen': 'fa fa-arrows-alt',
    info: 'fa fa-info'
  },
  image: {
    sizeLimit: 512 * 1024,
    upload: {
      url: null,
      headers: {},
      params: {},
      fieldName: {}
    },
    compress: {
      width: 1600,
      height: 1600,
      quality: 80
    },
    uploadHandler (responseText) {
      var json = JSON.parse(responseText)
      if (!json.ok) {
        console.log(json.msg)
      } else {
        return json.data
      }
    }
  },
  language: 'zh-cn',
  // 自定义语言
  i18n: {
    'zh-cn': {
      'align': '对齐方式',
      'image': '图片',
      'list': '列表',
      'link': '链接',
      'unlink': '去除链接',
      'table': '表格',
      'font': '文字',
      'full screen': '全屏',
      'text': '排版',
      'eraser': '格式清除',
      'info': '关于',
      'color': '颜色',
      'please enter a url': '请输入地址',
      'create link': '创建链接',
      'bold': '加粗',
      'italic': '倾斜',
      'underline': '下划线',
      'strike through': '删除线',
      'subscript': '上标',
      'superscript': '下标',
      'heading': '标题',
      'font name': '字体',
      'font size': '文字大小',
      'left justify': '左对齐',
      'center justify': '居中',
      'right justify': '右对齐',
      'ordered list': '有序列表',
      'unordered list': '无序列表',
      'fore color': '前景色',
      'background color': '背景色',
      'row count': '行数',
      'column count': '列数',
      'save': '确定',
      'upload': '上传',
      'progress': '进度',
      'unknown': '未知',
      'please wait': '请稍等',
      'error': '错误',
      'abort': '中断',
      'reset': '重置'
    }
  },
  hiddenModules: [],
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    'link',
    'unlink',
    'tabulation',
    'image',
    'hr',
    'eraser',
    'undo',
    'info'
  ]
})

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || {x: 0, y: 0}
  }
})

// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  // window.console.log('Transition', transition)
  if (to.auth && (to.router.app.$store.state.token === 'null')) {
    window.console.log('Not authenticated')
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  } else {
    next()
  }
})

sync(store, router)
// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  router: router,
  store: store,
  render: h => h(AppView)
})

// Check local storage to handle refreshes
if (window.localStorage) {
  var localUserString = window.localStorage.getItem('user') || 'null'
  var localUser = JSON.parse(localUserString)

  if (localUser && store.state.user !== localUser) {
    store.commit('SET_USER', localUser)
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
  }
}
