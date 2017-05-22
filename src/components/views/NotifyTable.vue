<template>
  <div class="sc-notify-table" v-if="response">
    <div class="notify-table-header">
      <el-row type="flex" justify="space-between">
        <el-col :span="15">
          <el-button type="primary">添加</el-button>
        </el-col>
        <el-col :span="6">
          <el-input class="search-title-input" v-model="searchTitle" placeholder="请输入标题"></el-input>
          <el-button type="primary" icon="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="sc-notify-table-content">
      <el-table
        :data="response.data"
        >
        <el-table-column
          prop="name"
          label="通知标题">
        </el-table-column>
        <el-table-column
          prop="template.name"
          label="微信模板名称"
          >
        </el-table-column>
        <el-table-column
          prop="target"
          label="目标发送数"
          >
        </el-table-column>
        <el-table-column
          prop="sent"
          label="已发送数"
          >
        </el-table-column>
        <el-table-column
          prop="unsent"
          label="未发送数"
          >
        </el-table-column>
        <el-table-column
          prop="unsent"
          label="状态"
          >
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="发送时间"
          >
        </el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button size="small" icon="information"></el-button>
            <el-button size="small" icon="edit"></el-button>
            <el-button size="small" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-notify-table-footer">
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
  name: '',
  data () {
    return {
      notifyURL: config.notifyListAPI,
      searchTitle: '',
      response: null,
      error: null
    }
  },
  computed: {
  },
  methods: {
    handleSizeChange (value) {
      const data = {
        name: this.searchTitle,
        pageSize: value,
        currentPage: this.response.currentPage
      }
      this.updateList(data)
    },
    handleCurrentChange (value) {
      const data = {
        name: this.searchTitle,
        pageSize: this.response.pageSize,
        currentPage: value
      }
      this.updateList(data)
    },
    updateList (form) {
      api.GET(this.notifyURL, form)
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
    },
    getList () {
      api.GET(this.notifyURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            this.response = response.data.data
          }
        })
        .catch(error => {
          this.error = error
          this.$message.error(this.error)
        })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
.sc-notify-table {
  border-top: 1px solid lightgray;
  padding-top: 2rem;
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.notify-table-header {
  margin-left: 2rem;
  margin-bottom: 20px;
}
.search-title-input {
  width: 150px;
}
.sc-notify-table-content {
  margin: 0 1rem;
  margin-bottom: 20px;
}
</style>
