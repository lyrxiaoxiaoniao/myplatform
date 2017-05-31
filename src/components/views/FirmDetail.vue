<template>
  <div class="sc-firm-detail-component">
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-firm-detail',
  data () {
    return {
      response: null,
      error: null
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    getFirmDetail (id) {
      api.GET(config.firmDetailAPI, {
        id
      })
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
            console.log(this.response)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getFirmDetail(this.id)
  }
}
</script>

<style>
</style>
