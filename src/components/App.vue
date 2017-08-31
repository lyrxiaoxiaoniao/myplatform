<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      section: 'Head',
      response: null,
      error: null
    }
  },
  methods: {
    logout() {
      this.$store.commit('SET_USER', null)
      this.$store.commit('SET_TOKEN', null)

      if (window.localStorage) {
        window.localStorage.setItem('user', null)
        window.localStorage.setItem('token', null)
      }

      this.$router.push('/login')
    }
  },
  created() {
  }
}
</script>
<style>
  html,
body {
  /* height: 100%; */
  width: 100%;
  font-size: 12px;
}

#app {
  height: 100%;
}

.el-table {
  font-size: 12px!important;
}

.el-upload__input {
  display: none !important;
}

.login-box,
.register-box {
  width: 360px;
  margin: 0 auto;
  padding-top: 7%;
}

/* .sc-reservation-foundation-list .infoDialog .el-input {
  min-width: 200px;
}
.sc-reservation-foundation-list .infoDialog .el-textarea {
  min-width: 550px;
} */
.sc-reservation-foundation-list .infoForm .el-form-item {
  width: 47%;
}
.sc-reservation-foundation-list .infoForm .formTextarea{
  width: 94%;
}

.sc-reservation-foundation-list .infoForm .el-form-item .el-form-item__content {
  width: 70%;
}
.sc-reservation-foundation-list .infoForm .el-form-item .el-form-item__content .el-select{
  width: 100%;
}
.sc-reservation-reserve-list .infoForm .el-form-item .el-form-item__content .el-select{
  width: 100%;
}

.sc-reservation-foundation-list .infoForm .el-form-item .el-form-item__label {
  width: 30%;
}
.sc-reservation-foundation-list .infoForm .formTextarea .el-form-item__label{
  width: 15%;
}
</style>
