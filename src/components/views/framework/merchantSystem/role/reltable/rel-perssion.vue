<template>
    <div class="lh-container">
    <div class="lh-top">
        <div class="lh-form">
            <kobe-table>
                <div slot="kobe-table-header" class="kobe-table-header">
                  <el-row type="flex">
                  <el-col justify="start">
                    <el-button @click="deleteType()" type="primary">批量移除</el-button>
                  </el-col>
                    <el-col justify="end">
                        <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                        <el-button slot="append" @click="onSearch" icon="search"></el-button>
                        </el-input>
                    </el-col> 
                  </el-row>          
                </div>
                <div slot="kobe-table-content" class="kobe-table">
                <el-table
                    ref="multipleTable"
                    max-height="400"
                    border
                    stripe
                    :data="response.data"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column prop="id" label="ID" sortable width="70"></el-table-column>
                    <el-table-column prop="display_name" label="权限点名称"></el-table-column>
                    <el-table-column prop="name" label="权限标识" width="150"></el-table-column>
                    <el-table-column prop="description" label="权限说明"></el-table-column>
                    <el-table-column label="有效状态" width="88">
                      <template scope="scope">
                        <div v-if="scope.row.active">有效</div>
                        <div v-if="!scope.row.active" class="text-red">无效</div>
                      </template>
                    </el-table-column>
                    <el-table-column width="70" label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="deleteType(scope.row.id)" icon="delete2" title="移除"></el-button>
                    </template>
                    </el-table-column>
                </el-table>
                </div>
                <div slot="kobe-table-footer" class="kobe-table-footer">
                    <el-row type="flex" justify="center">
                    <el-col :span="8">
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
        </div>
        </div>
    </div>    
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['roleId'],
  data () {
    return {
      removeForm: {
        community_id: this.roleId,
        tenement_id: ''
      },
      form: {
        keyword: ''
      },
      response: {
        data: null
      },
      multipleSelection: [],
      permissions: [],
      roles: []
    }
  },
  methods: {
    toswitch (active, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      var obj = {
        id: id,
        active: Number(active)
      }
      api.POST(config.fmrole.permissionActive, obj)
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
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
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
      this.permissions = []
      this.multipleSelection.forEach(v => {
        this.permissions.push(v.id)
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
    getList (data = {}) {
      api.GET(config.fmrole.relatedP, {
        role_id: this.roleId,
        ...data
      })
      .then(response => {
        this.response = this.transform(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.permissions = []
        this.permissions.push(id)
      }
      if (this.permissions.length === 0) {
        this.$confirm('请进行正确操作，请先勾选用户？', '错误', {
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
      this.roles = []
      this.roles.push(this.roleId)
      this.$confirm('是否确认移除权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.fmrole.rpdelete, {
          permissions: this.permissions,
          roles: this.roles
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('移除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    // 转换数据
    transform (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.text-red {
  color: red;
}
.lh-container {
    // padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding-bottom: 1rem;
        .lh-header {
            padding: 0 2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid lightgray;
            div:nth-of-type(1){
                font-size: 16px;
            }
        }
    }
}
</style>