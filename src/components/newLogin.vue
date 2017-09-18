<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="javascript:;">
        <!-- <h2>{{ title }}</h2> -->
        <img :src="toplogo" alt="深传互动">
      </a>
    </div>

    <div class="login-box-body">
        <div class="cover">
            <img :src="cover" alt="">
        </div>
        <div class="login-body">
            <div class="login-adv">
                <!-- <p>深传政务新媒体平台</p>
                <p>一站式政务解决方案专家</p> -->
                <div class="block">
                  <el-carousel :interval="3000" initial-index="0" arrow="never" height="372px" indicator-position="none">
                    <el-carousel-item v-for="item in urls" :key="item">
                      <!-- <h3>{{ item }}</h3> -->
                      <img :src="item">
                    </el-carousel-item>
                  </el-carousel>
                </div>
            </div>
            <div name="login" class="login">
                <p class="userLogin">用户登录</p>
                <form action="" method="post">
                <div class="form-group has-feedback">
                    <input v-model="username" type="text" class="form-control" placeholder="请输入用户名">
                    <span class="newicon newicon-login-user form-control-icon"></span>
                </div>
                <div class="form-group has-feedback">
                    <input v-model="password" type="password" class="form-control" placeholder="请输入密码">
                    <span class="newicon newicon-login-password form-control-icon"></span>
                </div>
                <div class="form-group has-feedback row">
                    <div class="col-xs-7">
                    <input v-model="mailCode" type="text" class="form-control" placeholder="请输入短信验证码">
                    <span class="newicon newicon-login-sure form-control-sure"></span>
                    </div>
                    <div class="col-xs-5">
                    <el-button @click="sendMail" :disabled="mailSended" type="primary" class="btn btn-primary btn-block btn-flat">{{ mailButtonText }}</el-button>
                    </div>
                </div>
                <div class="login-button-group">
                    <el-button @click.prevent="login" type="primary" class="btn btn-primary btn-block btn-flat">登录</el-button>
                </div>
                </form>
            </div>
        </div>
    </div>

    <div class="login-footer">
        <p>
            <a href="javascript:;">版权声明</a>
            <span>|</span>
            <a href="javascript:;">法律声明</a>
            <span>|</span>
            <a href="javascript:;">联系我们</a>
            <span>|</span>
            <a href="javascript:;">网站帮助</a>
            <span>|</span>
            <a href="javascript:;">常见问题</a>
        </p>
        <p>深传互动&copy;版权所有 粤ICP备14046443号-2 COPYRIGHT 2014-2017</p>
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
      toplogo: 'static/img/login/logo--new@2x.png',
      cover: 'static/img/login/banner@2x.png',
      urls: [
        'static/img/login/01.png',
        'static/img/login/02.png'
      ]
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
    const fav = document.getElementById('fav')
    const scid = this.$route.query.scid
    // this.getAppInfo()
    console.log(title, scid)
    switch (scid) {
      case 'gmaj':
        title.innerHTML = '安全光明'
        this.title = '安全光明'
        this.urls = ['static/img/login/gmaj.png']
        this.toplogo = 'static/img/login/logo-gmaj@2x.png'
        fav.href = 'static/img/login/16-16-gmaj@2x.png'
        break
      // case 'gmcg':
      //   title.innerHTML = '光明城管'
      //   this.title = '光明城管'
        // this.urls = ['static/img/login/gmaj.png']
        // this.toplogo = 'static/img/login/logo-gmcg@2x.png'
        // fav.href = 'static/img/login/16-16-gmcg@2x.png'
      //   break
      // case 'szaj':
      //   title.innerHTML = '深圳市安监'
      //   this.title = '深圳市安监'
        // this.urls = ['static/img/login/gmaj.png']
        // this.toplogo = 'static/img/login/logo-szsaj@2x.png'
        // fav.href = 'static/img/login/16-16-szaj@2x.png'
        // break
      default:
        title.innerHTML = '深传互动政务新媒体平台'
        this.title = '深传互动政务新媒体平台'
        this.cover = 'static/img/login/banner@2x.png'
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.login-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    min-width: 1366px;
    min-height: 680px;
    padding-top: 80px; 
    padding-bottom: 120px;
    .login-logo {
        height: 80px;
        width: 100%;
        position: absolute;
        top: 0;
        text-align: left;
        background: url('../../static/img/login/top.png') no-repeat center/cover;
        background-size: 100% 100%;
        a {
            display: block;
            margin: 12px 0 0 30px;
        }
    }
    .login-box-body{
        width: 100%;
        height: 100%;
        position: relative;
        .login-body {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-around;
            .login-adv {
                margin-top: 95px;
                width: 370px;
                height: 90px;
                z-index: 2;
                margin-left: 100px;
                .block {
                  width: 536px;
                  height: 372px;
                  .el-carousel__item:nth-child(2n) {
                    background-color: rgba(0, 0, 0, 0);
                  }
                  .el-carousel__item:nth-child(2n+1) {
                    background-color: rgba(0, 0, 0, 0);
                  }
                }
                p {
                    margin: 0;
                    padding: 0;
                }
                p:nth-of-type(1) {
                    font: 700 40px 'Microsoft YaHei';
                    color: #fff;
                    margin-bottom: 10px;
                }
                p:nth-of-type(2) {
                    font: 500 30px 'Microsoft YaHei';
                    color: #e5fcff;
                }
              }
              .login {
                margin-top: 112px;
                margin-right: 100px;
                width: 330px;
                height: 400px;
                padding: 0 25px;
                background: url('../../static/img/login/denglu.png') no-repeat center/cover;
                background-size: 100% 100%;
                z-index: 1;
                .userLogin {
                    font: 500 20px 'Microsoft YaHei';
                    color: #03b2cb;
                    margin: 30px 0 25px;
                }
                form {
                      .el-button--primary {
                          color: #fff;
                          background-color: #03b2cb;
                          border-color: #03b2cb;
                      }
                      .form-group {
                          margin-bottom: 20px;
                      }
                      .has-feedback .form-control {
                          padding-right: 0;
                          padding-left: 30px;
                      }
                      .form-control-icon {
                          position: absolute;
                          top: 5px;
                          left: 5px;
                          z-index: 2;
                          display: block;
                          width: 24px;
                          height: 24px;
                          pointer-events: none;
                      }
                      .form-control-sure {
                          position: absolute;
                          top: 5px;
                          left: 20px;
                          z-index: 2;
                          display: block;
                          width: 24px;
                          height: 24px;
                          pointer-events: none;
                      }
                    }
              }
        }
        .cover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            flex: 1;
            width: 100%;
            height: 100%;
            z-index: 0;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .login-footer {
        height: 120px;
        width: 100%;
        padding-top: 30px;
        position: absolute;
        bottom: 0;
        background: url('../../static/img/login/footer.png') no-repeat center/cover;
        background-size: 100% 100%;
        p {
            margin: 0;
            text-align: center;
            font: 500 14px 'MicroSoft YaHei';
            // color: #fff;
            color: #a6a6a6;
            a {
                color: #a6a6a6;
                // color: #fff;
            }
            span {
                margin: 0 5px;
            }
        }
    }
}
</style>
