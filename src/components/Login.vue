<template>
  <div class="login-box">
    <slot name="logo">
      <div class="login-logo">
        <a @click.prevent=""><b>{{ title }}</b></a>
      </div>
      <div class="text-response text-center error" v-if="response">
        {{ response }}
      </div>
    </slot>

    <div class="login-box-body">
      <slot name="login">
        <form action="" method="post">
          <div class="form-group has-feedback">
            <input v-model="username" type="text" class="form-control" placeholder="请输入用户名">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input v-model="password" type="password" class="form-control" placeholder="请输入密码">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback row">
            <div class="col-xs-7">
              <input v-model="mailCode" type="text" class="form-control" placeholder="请输入短信验证码">
            </div>
            <div class="col-xs-5">
              <button @click="sendMail" :disabled="mailSended" type="button" class="btn btn-primary btn-block btn-flat">{{ mailButtonText }}</button>
            </div>
          </div>
          <div class="login-button-group">
            <button @click.prevent="login" :disabled="loginSended" type="submit" class="btn btn-primary btn-block btn-flat">登录</button>
          </div>
        </form>
      </slot>

      <router-link to="/forgot">忘记密码</router-link>
      <br />
      <router-link to="/register">新用户注册</router-link>

    </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: "off" */
import axios from 'axios'

export default {
  name: 'bs-login',
  install (Vue) {
    Vue.component(this.name, this)
  },
  data () {
    return {
      title: 'SHENCOM',
      mailButtonText: '发送验证码',
      username: '',
      password: '',
      mailSended: false,
      mailCountDown: 60,
      mailURL: '/test/sys/sendMsgVerify',
      mailTimer: null,
      mailCode: '',
      loginURL: '/test/sys/login',
      loginSended: false,
      response: ''
    }
  },
  computed: {
  },
  methods: {
    sendMail: function () {
      if (this.isStringEmpty(this.username)) {
        window.alert('请填写用户名')
        return
      }

      // #TODO: send mail
      axios.get(this.mailURL, {
        params: {
          username: this.username
        }
      })
      .then(response => {
        if (response.data.errcode === '200') {
          this.response = '短信已发送,请查收'
        }
      })
      .catch(error => {
        this.response = '短信发送失败'
        console.log(error)
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
        window.alert('请输入正确的信息')
        return
      }

      this.loginSended = true
      // password encrypt
      console.log(this.password)
      this.encrypt()
      console.log(this.password)

      // encrypt error
      if (!this.password) {
      }

      // login request
      axios({
        url: this.loginURL,
        method: 'post',
        data: {
          username: this.username,
          password: this.password,
          // mail code
          code: this.mailCode
        },
        withCredentials: true
      })
      .then(response => {
        console.log(response)
        if (response.data.errcode === '200') {
          this.$router.push('/')
        } else if (response.data.errcode === '0') {
          this.response = response.data.errmsg
          this.loginSended = false
        }
      })
      .catch(error => {
        this.loginSended = false
        console.log(error)
      })
    },
    encrypt: function (string) {
      const pubkey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArromvW2N\/rg0ADw9zpTL\ncGdO0wNazPcp+SepPrv1dicCamEVPfvPKlWMuYszt\/tE6lNjMT8pphmatPvgjAFy\nKfE1fEpcvHqRSZTUtlo\/fGJzh2nss6mxyDXlqi+sGitjwaGj6\/MXO6zLQcMQmZ\/U\nvliOhECvuLBsAqqLY8ik63Ah7ylWAap3jDD0OvgSy+glqebwfacy9WPYOy4K75n\/\nDQRw9FJBYFg1BtfbVn55Oji3AZ0E3lY96b0JhJGtFM6vjF0bhVDkmP\/XZINPcVZy\nxydRFvxjgA6we\/KmxXDD\/JdZmvGmrZ2XCAhGS3vuk3XJnkMquGYO4GAI13JIs8Z1\nrwIDAQAB\n-----END PUBLIC KEY-----'
      // const pubkey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArromvW2Nrg0ADw9zpTL\ncGdO0wNazPcp+SepPrv1dicCamEVPfvPKlWMuYszttE6lNjMT8pphmatPvgjAFy\nKfE1fEpcvHqRSZTUtlofGJzh2nss6mxyDXlqi+sGitjwaGj6MXO6zLQcMQmZU\nvliOhECvuLBsAqqLY8ik63Ah7ylWAap3jDD0OvgSy+glqebwfacy9WPYOy4K75n\nDQRw9FJBYFg1BtfbVn55Oji3AZ0E3lY96b0JhJGtFM6vjF0bhVDkmPXZINPcVZy\nxydRFvxjgA6weKmxXDDJdZmvGmrZ2XCAhGS3vuk3XJnkMquGYO4GAI13JIs8Z1\nrwIDAQAB\n-----END PUBLIC KEY-----'

      try {
        let content = this.password
        let crypt = new window.JSEncrypt()
        crypt.setKey(pubkey)
        let crypted = crypt.encrypt(content)
        this.password = crypted
      } catch (ex) {
        return false
      }
    },
    isStringEmpty: function (string) {
      if (string.length === 0) {
        return true
      }
      return false
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
