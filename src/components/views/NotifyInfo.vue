<template>
  <div class="sc-notify-info" v-if="response">
    <div class="sc-notify-header">
    </div>

    <div class="sc-notify-content">
      <el-table
        :data="response.data"
        >
        <el-table-column
          prop=""
          >
        </el-table-column>
      </el-table>
    </div>

    <div class="sc-notify-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="response.pageSize"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'NotifyIndo',
  data () {
    return {
      response: null,
      error: null,
      infoURL: config.notifyInfoAPI
    }
  },
  methods: {
    handleSizeChange (value) {
    },
    handleCurrentChange (value) {
    },
    getInfo () {
      api.GET(this.infoURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style>
</style>
