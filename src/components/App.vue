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
      console.log('app mounted')
    }
  }
</script>
<style>
  .el-upload__input {
    display: none !important;
  }
  .el-dialog--small {
    width: 30% !important;
  }
</style>
