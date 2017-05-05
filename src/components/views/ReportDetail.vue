<template>
  <div v-if="response" class="sc-report-detail">
    <template>
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in 6">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import config from 'src/config'

export default {
  name: 'sc-report-detail',
  data () {
    return {
      response: null,
      error: null
    }
  },
  computed: {
    reportDetailURL () {
      return config.serverURI + config.caseDetailAPI
    },
    caseID () {
      return this.$route.params.id
    }
  },
  methods: {
    getCaseDetail (id) {
      axios.get(this.reportdetail, {
        id: this.caseID
      })
        .then(response => {
          console.log(`Case Detail response ${response}`)

          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
            console.log('case detail')
            console.log(this.response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  components: {
  },
  mounted () {
    console.log('Report Detail Mounted')
  }
}
</script>

<style>
</style>
