<template>
  <kobe-table v-if="response">
    <div class="kobe-table-header" slot="kobe-table-header">
      <el-row
        type="flex"
        justify="end">
        <el-button @click="addTag" type="primary">新增</el-button>
      </el-row>
    </div>
    <div class="kobe-table" slot="kobe-table-content">
      <el-table
        :data="response.data"
        stripe
        >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column prop="name" label="标签组名称"></el-table-column>
        <el-table-column prop="count" label="用户数"></el-table-column>
        <el-table-column prop="username" label="创建人"></el-table-column>
        <el-table-column 
          width="260"
          label="操作"
          >
          <template scope="scope">
            <el-button size="small" icon="edit"></el-button>
            <el-button @click="deleteTag(scope.row.id)" size="small" icon="delete2"></el-button>
            <el-button @click="toTagInfo(scope.row.id, scope.row.name)" size="small" icon="information"></el-button>
            <el-button size="small">关联用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="kobe-table-footer" slot="kobe-table-footer">
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
  </kobe-table>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-wechat-tag-table',
  data () {
    return {
      response: null,
      error: null,
      form: {
      }
    }
  },
  methods: {
    toTagInfo (id, name) {
      this.$router.push({
        path: 'wxtaguser',
        query: {
          id: id,
          name: name
        }
      })
    },
    addTag () {
      this.$router.push('wxtagadd')
    },
    deleteTag (id) {
      this.$confirm('是否确认该标签组', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.wxUserGroupDeleteAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateTagList(data)
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateTagList(data)
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateTagList(data)
    },
    updateTagList (data) {
      api.GET(config.wxUserGroupListAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.$message.error(response.statusText)
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
    getTagList () {
      api.GET(config.wxUserGroupListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.$message.error(response.statusText)
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
    this.getTagList()
  }
}
</script>

<style>
</style>
