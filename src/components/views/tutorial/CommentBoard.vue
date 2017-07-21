<template>
  <div class="sc-tutorial-signinboard">
    <el-row type="flex">
      <span>查询区间</span>
      <el-date-picker type="datetimerange" v-model="time"></el-date-picker>
      <el-select></el-select>
      <el-button type="primary">查询</el-button>
    </el-row>
    <el-table
      v-if="response"
      border
      stripe
      :data="response.data"
      >
      <el-table-column prop="id" label="排序" width="80"></el-table-column>
      <el-table-column prop="title" label="课程标题"></el-table-column>
      <el-table-column prop="count" label="评论数"></el-table-column>
    </el-table>
  </div>
</template>  

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-commentboard',
  data () {
    return {
      error: null,
      response: null,
      time: []
    }
  },
  methods: {
    getList (data = null) {
      api.GET(config.tutorial.commentBoard, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .error(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
  }
}
</script>
