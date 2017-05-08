<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import api from '../api'
import config from '../config'

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
    },
    setAppInfo () {
      const URI = config.appInfoAPI
      api.request('GET', URI, {params: {id: 1}})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          console.log(`App info Response: ${this.response}`)
          this.response = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    console.log('app mounted')
    // get app info
    // this.setAppInfo()
  }
}
</script>
<style>
  .el-upload__input {
    display: none !important;
  }
</style>
