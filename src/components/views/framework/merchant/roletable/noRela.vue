<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
              <el-button type="primary" @click="onFresh">刷新</el-button>
              <el-button @click="deleteTypeAll" type="primary">批量关联</el-button>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                  <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
              ref="multipleTable"
              style="max-height: 300px;overflow: auto;"
              border
              stripe
              :data="response.data"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="50"></el-table-column>
              <el-table-column prop="display_name" label="权限名称"></el-table-column>
              <el-table-column prop="name" label="权限标识"></el-table-column>
              <el-table-column prop="description" label="创建时间">
                <template scope="scope">
                  {{scope.row.created_at | toDateTime}}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="操作" width="60">
                <template scope="scope"> 
                    <el-button @click="deleteType(scope.row.id)" size="small" class="fa fa-th-large"></el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
            <el-col :span="12">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="response.currentPage"
                :page-sizes="[10 ,15 , 20, 50, 100]"
                :page-size="response.pageSize"
                :total="response.count"
                layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </el-col>
            </el-row>
        </div>
    </kobe-table>
</div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  props: ['userid'],
  data () {
    return {
      response: {
        data: null
      },
      form: {
        keyword: ''
      },
      ids: [],
      users: [],
      multipleSelection: []
    }
  },
  methods: {
    onFresh() {
      this.getList()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    deleteTypeAll () {
      this.deleteType()
    },
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选权限？', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return
      }
      this.users = []
      this.users.push(this.userid)
      this.$confirm('是否确认是否关联权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.merchantRole.relateAdd, {
          permissions: this.ids,
          accounts: this.users
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('关联成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }

      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }

      this.getList(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.merchantRole.relate, {account_id: this.userid, ...data})
      .then(response => {
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
</style>