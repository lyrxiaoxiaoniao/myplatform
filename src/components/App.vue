<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        section: 'Head',
        response: null,
        error: null
      }
    },
    methods: {
      logout () {
        this.$store.commit('SET_USER', null)
        this.$store.commit('SET_TOKEN', null)

        if (window.localStorage) {
          window.localStorage.setItem('user', null)
          window.localStorage.setItem('token', null)
        }

        this.$router.push('/login')
      }
    },
    created () {
    }
  }
</script>
<style>
  body {
    font-size: 12px;
  }
  .el-table {
    font-size: 12px!important;
  }
  .el-upload__input {
    display: none !important;
  }
</style>
