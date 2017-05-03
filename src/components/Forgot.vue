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

    <div class="forget-box-body">
      <slot name="forget">
        <form :action="mailURL" @submit.prevent="onSubmit">
          <div class="form-group has-feedback">
            <input class="form-control" type="text" name="username" v-model="username" placeholder="请输入用户名">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="login-button-group">
            <button type="submit" class="btn btn-primary btn-block btn-flat">发送邮件</button>
          </div>
        </form>
      </slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Forget',
  data () {
    return {
      title: 'SHENCOM',
      username: '',
      response: '',
      mailURL: 'http://test.java.shencom.cn/gm/admin/password/sendEmail'
    }
  },
  methods: {
    onSubmit: function () {
      if (this.username.length === 0) {
        window.alert('请填写正确的用户名')
        return false
      }

      axios.get(this.mailURL, {
        params: {
          username: this.username
        }
      })
      .then(response => {
        if (response.data.errcode === '200') {
          this.response = response.data.errmsg
        }
      })
      .catch(error => {
        this.response = '发送失败'
        console.log(error)
        return
      })
    }
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style>
.forget-box-body {
  background-color: #fff;
  padding: 20px;
  border-top: 0;
  color: #666;
}
</style>
