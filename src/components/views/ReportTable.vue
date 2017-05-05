<template>
  <div class="sc-report-table">
    <div class="sc-report-table-header">
    </div>
    <div class="sc-report-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" sortable></el-table-column>
      </el-table>
    </div>
    <div class="sc-report-table-footer">
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

let response = {
  data: [
    {id: 0, title: '隐患名称11'}
  ]
}

export default {
  name: 'sc-report-table',
  data () {
    return {
      response: response,
      error: null
    }
  },
  computed: {
  },
  methods: {
  },
  components: {
  },
  mounted () {
    console.log(config)
    console.log(api)
  }
}
</script>

<style scoped>
</style>
