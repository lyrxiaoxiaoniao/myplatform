<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
              <el-button type="primary" @click="onFresh">刷新</el-button>
              <el-button @click="deleteTypeAll" type="primary">批量删除</el-button>
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
              <el-table-column prop="display_name" label="角色名称"></el-table-column>
              <el-table-column prop="name" label="角色标识"></el-table-column>
              <el-table-column prop="description" label="角色说明"></el-table-column>
              <el-table-column label="有效状态" width="100px">
                <template scope="scope">
                  <!-- <el-switch
                    v-model="scope.row.active"
                    on-text="开"
                    off-text="关"
                    @change="toswitch(scope.row.active,scope.row.id)">
                  </el-switch> -->
                  {{scope.row.active ? '有效' : '无效'}}
                </template> 
              </el-table-column>
              <el-table-column prop="status" label="操作" width="60">
                <template scope="scope"> 
                    <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
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
        this.$confirm('请进行正确操作，请先勾选角色？', '错误', {
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
      this.$confirm('是否确认是否解除关联', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.authority.relateremove, {
          roles: this.ids,
          permissions: this.users
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('解除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    toswitch (active, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      var obj = {
        id: id,
        active: Number(active)
      }
      api.POST(config.authority.relateractive, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！！！',
            type: 'success'
          })
          this.getList(data)
        }
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
      api.GET(config.authority.related, {permission_id: this.userid, ...data})
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