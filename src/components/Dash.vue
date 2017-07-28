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
          <span>{{ appInfo ? appInfo.appName : '深传互动' }}</span> 
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
                <img v-bind:src="user.avatar" class="user-image" alt="User Image">
                <span class="hidden-xs">{{ user.displayName }}</span>
              </a>
              <ul class="dropdown-menu user-setting-menu">
                <li class="user-header">
                  <img :src="user.avatar" alt="user-image" class="img-circle">
                  <p>深传互动政务新媒体平台</p>
                </li>
                <li class="user-setting-menu-content user-footer">
                  <div class="pull-left">
                    <el-button size="small">资料</el-button>
                  </div>
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
    <sidebar :display-name="user.displayName"
             :picture-url="user.avatar"/>

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
      <strong>Copyright &copy; {{year}} <a href="http://www.shencom.cn/">{{ appInfo ? appInfo.systemAuthor : '深传互动' }}</a>.</strong> All rights reserved.
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
        displayName: this.userInfo.username,
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
      const URI = config.appInfoAPI
      api.GET(URI, {id: 1})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          this.appInfo = response.data.data
        })
        .catch(error => {
          this.$message.error(error)
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

.logo-lg {
  img {
    display: -webkit-inline-box;
    width: 25%;
  }
}

.user-panel {
  height: 4em;
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
