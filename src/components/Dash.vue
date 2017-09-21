<template>
  <div :class="['wrapper', classes]">
    <header class="main-header">
      <router-link to="/admin" class="logo">
        <span class="logo-mini">
          <img
          src="static/img/LOGO2.png"
          alt="Logo"
          class="img-responsive center-block">
        </span>
        <div class="logo-lg">
          <img src="static/img/LOGO2.png" alt="Logo" class="img-responsive">
          <span>{{ appInfo ? appInfo.mng_config_name : '深传互动' }}</span>
        </div>
      </router-link>

      <nav class="navbar navbar-static-top" role="navigation">
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <!-- <li class="dropdown messages-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-envelope-o"></i> -->
            <!--     <span class="label label-success">{{ userInfo.messages | count }}</span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.messages | count }} message(s)</li> -->
            <!--     <li v-if="userInfo.messages.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <h4> -->
            <!--               Support Team -->
            <!--               <small><i class="fa fa-clock-o"></i> 5 mins</small> -->
            <!--             </h4> -->
            <!--             <p>Why not consider this a test message?</p> -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.messages.length > 0"><a href="javascript:;">See All Messages</a></li> -->
            <!--   </ul> -->
            <!-- </li> -->

            <!-- <li class="dropdown notifications-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-bell-o"></i> -->
            <!--     <span class="label label-warning">{{ userInfo.notifications | count }}</span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.notifications | count }} notification(s)</li> -->
            <!--     <li v-if="userInfo.notifications.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <i class="fa fa-users text-aqua"></i> 5 new members joined today -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.notifications.length > 0"><a href="javascript:;">View all</a></li> -->
            <!--   </ul> -->
            <!-- </li> -->

            <!-- <li class="dropdown tasks-menu"> -->
            <!--   <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> -->
            <!--     <i class="fa fa-flag-o"></i> -->
            <!--     <span class="label label-danger">{{ userInfo.tasks | count }} </span> -->
            <!--   </a> -->
            <!--   <ul class="dropdown-menu"> -->
            <!--     <li class="header">You have {{ userInfo.tasks | count }}  task(s)</li> -->
            <!--     <li v-if="userInfo.tasks.length > 0"> -->
            <!--       <ul class="menu"> -->
            <!--         <li> -->
            <!--           <a href="javascript:;"> -->
            <!--             <h3> -->
            <!--               Design some buttons -->
            <!--               <small class="pull-right">20%</small> -->
            <!--             </h3> -->
            <!--             <div class="progress xs"> -->
            <!--               <div class="progress-bar progress-bar-aqua" -->
            <!--                    style="width: 20%" -->
            <!--                    role="progressbar" -->
            <!--                    aria-valuenow="20" -->
            <!--                    aria-valuemin="0" -->
            <!--                    aria-valuemax="100"> -->
            <!--                 <span class="sr-only">20% Complete</span> -->
            <!--               </div> -->
            <!--             </div> -->
            <!--           </a> -->
            <!--         </li> -->
            <!--       </ul> -->
            <!--     </li> -->
            <!--     <li class="footer" v-if="userInfo.tasks.length > 0"> -->
            <!--       <a href="javascript:;">View all tasks</a> -->
            <!--     </li> -->
            <!--   </ul> -->
            <!-- </li> -->
            <li class="dropdown user user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <img v-bind:src="user.avatar ? user.avatar : 'static/img/defimg1.png'" class="user-image" alt="User Image">
                <!-- <span class="hidden-xs">{{ user.displayName }}</span> -->
                <span class="hidden-xs">{{ user.display_name }}</span>
              </a>
              <ul class="dropdown-menu user-setting-menu">
                <li class="user-header">
                  <img :src="user.avatar ? user.avatar : 'static/img/defimg1.png'" alt="user-image" class="img-circle">
                  <!-- <el-row type="flex" justify="center"> -->
                    <p>姓名：{{ userInfo.nickname ? userInfo.nickname : '暂无'}} -- 手机号：{{ userInfo.phone ? userInfo.phone : '13437140378'}}</p>
                    <!-- <p>手机号：{{ userInfo.companyTelephone ? userInfo.mobile : ''}}</p> -->
                  <!-- </el-row> -->
                  <p>创建时间：{{ userInfo.createdAt ? userInfo.createdAt : 1502071132803 | toDate}}</p>
                </li>
                <li class="user-setting-menu-content user-footer">
                  <!-- <div class="pull-left">
                     <el-button size="small">资料</el-button> 
                  </div> -->
                  <div class="pull-right">
                    <el-button @click="onLogout" size="small">退出</el-button>
                  </div>
                  <div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <sidebar :display-name="user.display_name"
             :picture-url="user.avatar ? user.avatar : 'static/img/defimg1.png'"/>

    <div class="content-wrapper">
      <section class="content-header">
        <div>
          {{ $route.name.toUpperCase() }}
          <span class="content-header-description">{{ $route.meta.description }}</span>
        </div>
        <ol class="breadcrumb">
          <li><router-link to="/admin"><i class="fa fa-home"></i>主页</router-link></li>
          <li class="active"><router-link :to="$route.path">{{$route.name.toUpperCase()}}</router-link></li>
        </ol>
      </section>

      <router-view></router-view>
    </div>

    <footer class="main-footer">
      <strong>Copyright &copy; {{year}} <a href="http://www.shencom.cn/">{{ appInfo ? appInfo.mng_config_copyright : '深传互动' }}</a>.</strong> All rights reserved.
    </footer>
  </div>
</template>

<script>
import api from 'src/api'
import {mapState} from 'vuex'
import config from '../config'
import Sidebar from './views/dash/Sidebar'
import 'hideseek'

export default {
  name: 'Dash',
  components: {
    Sidebar
  },
  data: function () {
    return {
      // section: 'Dash',
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      error: '',
      appInfo: {}
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    user () {
      return {
        display_name: this.userInfo.nickname,
        avatar: this.userInfo.avatar
      }
    }
  },
  methods: {
    onLogout () {
      api.GET(config.basic.logout)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$store.commit('SET_USER_INFO', null)
          this.$store.commit('SET_TOKEN', null)
          this.$router.push('/login')
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    getAppInfo () {
      this.appInfo = this.$store.state.appInfo
    },
    setAppInfo () {
      // const URI = config.appInfoAPI
      const URI = config.dashconfig
      api.GET(URI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          this.getData(response.data.data)
          console.log(this.appInfo, 11111)
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    getData (res) {
      console.log(res, 11112222)
      // mng_config_icon 站点图标
      // mng_config_copyright 版权信息
      // mng_config_name 站点名称
      res.forEach(v => {
        if (v.key.label === 'mng_config_name') {
          this.appInfo.mng_config_name = v.value
        }
        if (v.key.label === 'mng_config_copyright') {
          this.appInfo.mng_config_copyright = v.value
        }
        if (v.key.label === 'mng_config_icon') {
          this.appInfo.mng_config_icon = v.value
        }
      })
    }
  },
  created () {
    this.setAppInfo()
  }
}
</script>

<style lang="scss">
.wrapper.fixed_layout {
  .main-header {
    position: fixed;
    width: 100%;
  }

  .content-wrapper {
    padding-top: 50px;
  }

  .main-sidebar {
    position: fixed;
    height: 100vh;
  }
}
.wrapper.hide_logo {
  @media (max-width: 767px) {
    .main-header .logo {
      display: none;
    }
  }
}

.logo-mini, .logo-lg {
  text-align: left;

  img {
    padding: .4em;
  }
}

.navbar-nav>.user-menu>.dropdown-menu>li.user-header>p {
  font-size: 14px;
}
.logo-lg {
  img {
    display: -webkit-inline-box;
    width: 25%;
  }
}
/* test */
.sidebar-collapse .user-panel {
  height: 20px;
  width: 20px !important;
  padding-left: 14px;
  .image {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
/* test */
.user-panel {
  height: 4em;
  box-sizing: content-box;
}
.user-panel>.image {
  width: 45px;
  height: 45px;
}
.user-panel>.image>img {
  width: 100%;
  height: 45px;
  max-width: 45px;
}
hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
.wrapper {
  min-height: 100%;
  overflow-y: scroll;
}
.content-wrapper {
  min-height: 90vh;
}
.content-header div {
  font-size: 18px;
}
.content-header-description {
  font-size: 14px;
  color: #777;
}
.user-setting-menu {
  margin-right: 1rem;
}
.user-setting-menu .header {
  border-bottom: 1px solid lightgray;
}
.user-setting-menu-content {
  padding-top: 5px;
  padding-bottom: 5px;
}
.content-header {
  border-bottom: 1px solid lightgray;
  padding-bottom: 1rem;
}

.main-header .logo {
  background-color: #3c8dbc;
}
</style>
