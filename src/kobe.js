/*
 *  Kobe UI Version 0.0.1
 *
 *  A UI Component Collection Based On ElementUI and AdminLTE
 * */
import Login from './components/shencom/Login'
import Forgot from './components/shencom/Forgot'

const install = (Vue) => {
  Vue.component('kobe-login', Login)
  Vue.component('kobe-forgot', Forgot)
}

export default install
