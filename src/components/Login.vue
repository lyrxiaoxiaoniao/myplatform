<template>
  <div class="login-box">
    <slot name="logo">
      <div class="login-logo">
        <a>
          <h2>{{ title }}</h2>
        </a>
      </div>
    </slot>
  
    <div class="login-box-body">
      <slot name="login">
        <form action="" method="post">
          <div class="form-group has-feedback">
            <input v-model="username" type="text" class="form-control" placeholder="请输入用户名">
            <span class="fa fa-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-model="password" type="password" class="form-control" placeholder="请输入密码">
            <span class="fa fa-lock form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback row">
            <div class="col-xs-7">
              <input v-model="mailCode" type="text" class="form-control" placeholder="请输入短信验证码">
            </div>
            <div class="col-xs-5">
              <el-button @click="sendMail" :disabled="mailSended" type="primary" class="btn btn-primary btn-block btn-flat">{{ mailButtonText }}</el-button>
            </div>
          </div>
          <div class="login-button-group">
            <el-button @click.prevent="login" type="primary" class="btn btn-primary btn-block btn-flat">登录</el-button>
          </div>
        </form>
      </slot>
    </div>
    <div class="cover">
      <img :src="cover" alt="">
    </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: "off" */
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'bs-login',
  data() {
    return {
      title: '安全光明',
      mailButtonText: '发送验证码',
      username: '',
      password: '',
      mailSended: false,
      mailCountDown: 60,
      mailTimer: null,
      mailCode: '',
      loginSended: false,
      response: '',
      cover: ''
    }
  },
  computed: {
  },
  methods: {
    sendMail: function () {
      if (this.isStringEmpty(this.username)) {
        this.$message.error('请填写用户名')
        return
      }
      api.GET(config.basic.sendMail, {
        username: this.username
      })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.response = '短信已发送,请查收'
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
        .catch(error => {
          this.response = '短信发送失败'
          this.$message.error(error)
          return
        })

      this.mailSended = true
      this.mailButtonText = `重新发送(${this.mailCountDown--})`
      // set mail button timer
      this.mailTimer = setInterval(() => {
        if (this.mailCountDown === 0) {
          this.mailSended = false
          this.mailButtonText = '发送验证码'
          this.response = ''
          this.mailCountDown = 60
          clearInterval(this.mailTimer)
          this.mailTimer = null
          return
        }
        this.mailButtonText = `重新发送(${this.mailCountDown--})`
      }, 1000)
    },
    login: function () {
      this.response = ''
      // check input info
      if (this.isStringEmpty(this.username) ||
        this.isStringEmpty(this.password) ||
        this.isStringEmpty(this.mailCode)) {
        this.$message.error('请输入正确的信息')
        return
      }

      this.loginSended = true
      // password encrypt
      const encryptedPwd = this.encrypt()

      // encrypt error
      if (!encryptedPwd) {
      }

      // login request
      api.POST(config.basic.login, {
        username: this.username,
        password: encryptedPwd,
        // mail code
        code: this.mailCode
      })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$store.commit('SET_USER_INFO', response.data.data)
            this.$store.commit('SET_TOKEN', response.data.data.token)
            this.$router.push('/admin')
          } else if (response.data.errcode === '0') {
            this.$message.error(response.data.errmsg)
            this.loginSended = false
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
        .catch(error => {
          this.loginSended = false
          this.$message.error(error)
        })
    },
    encrypt(string) {
      const pubkey = config.basic.key

      try {
        let content = this.password
        let crypt = new window.JSEncrypt()
        crypt.setKey(pubkey)
        let crypted = crypt.encrypt(content)
        return crypted
      } catch (ex) {
        return false
      }
    },
    isStringEmpty(string) {
      if (string.length === 0) {
        return true
      }
      return false
    },
    getAppInfo() {
      api.GET(config.appInfoAPI).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          console.log(res)
        }
      })
    }
  },
  mounted() {
    const title = document.getElementsByTagName('title')[0]
    const appid = this.$route.query.appid
    this.getAppInfo()
    console.log(title, appid)
    switch (appid) {
      case 'gmsafety':
        title.innerHTML = '安全光明'
        this.title = '安全光明'
        this.cover = 'static/img/BG2.png'
        break
      default:
        title.innerHTML = '深传互动政务新媒体平台'
        this.title = '深传互动政务新媒体平台'
        this.cover = 'static/img/BG2.png'
    }
  },
  components: {
  }
}
</script>

<style>
.error {
  color: red;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.cover img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
</style>
