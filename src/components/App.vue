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
      console.log('-----------------------------------------------------------')
      console.log('在李杨大神的疯狂Carry下，才使本项目上线，有BUG请联系李杨')
      console.log('Email: liyang@shencom.cn')
      console.log('Github: AntiClimax')
      console.log('知乎: 李杨(高级前端专家，游戏，音乐)')
      console.log('爱好：男和上班划水')
      console.log('牛批')
      console.log('------------------------SHENCOM-----------------------------')
      console.log('------------------------------------------------------------')
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
