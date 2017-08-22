<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <!-- <el-button @click="opendialog('add')" type="primary">新增规格</el-button> -->
                <el-button @click="resFresh" type="primary">刷新</el-button>
                <el-dropdown @command="handleCommand" style="margin-left:10px;">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="复原奖品">复原奖品</el-dropdown-item>
                    <el-dropdown-item command="彻底删除">彻底删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                    <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="upload2" type="primary" style="margin-left:10px;"></el-button>
            <el-button icon="setting" type="primary"></el-button>
            </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
                ref="multipleTable"
                border
                stripe
                :data="response.data"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDbclick">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column label="奖品">
                  <template scope="scope">
                      <img :src="scope.row.first_figure" alt="">{{scope.row.name}}
                  </template>
                </el-table-column>
                <el-table-column prop="brief" label="奖品摘要"></el-table-column>
                <el-table-column prop="total_inventory" label="库存" width="120"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="200">
                  <template scope="scope">
                    {{ scope.row.created_at | toDateTime }}
                  </template>
                </el-table-column>
                <el-table-column prop="deleting" label="删除时间" width="200">
                  <template scope="scope">
                    {{ scope.row.deleting | toDateTime }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="启用" width="100">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.active"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.active, scope.row.id)">
                    </el-switch>
                  </template>
                </el-table-column> -->
                <el-table-column prop="status" label="操作" width="120">
                  <template scope="scope"> 
                      <el-button @click="goAwardsDetail(scope.row.id)" size="small" icon="edit"></el-button>
                      <!-- <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button> -->
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
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      multipleSelection: [],
      response: {
        data: []
      },
      ids: [],
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    handleCommand (command) {
      this.deleteType(command)
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
      // console.log(this.multipleSelection)
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    goAwardsDetail (id) {
      this.$router.push({
        path: '/admin/awards/edit',
        query: {
          id: id
        }
      })
    },
    // 双击行调用函数
    rowDbclick (data, type) {
      this.goAwardsDetail()
    },
    // 删除表单
    deleteType (type) {
    //   if (id) {
    //     this.ids = []
    //     this.ids.push(id)
    //   }
      let URL = ''
      if (type === '彻底删除') {
        URL = config.removeRecycleAwardListAPI
      } else if (type === '复原奖品') {
        URL = config.recoverRecycleAwardAPI
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选奖品？', '错误', {
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
      this.$confirm('是否确认' + type + '奖品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(URL, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess(type + '成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    resFresh () {
      this.getList()
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
      window.alert(1)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    changeActive (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        } else if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.recycleAwardListAPI, data)
      .then(response => {
        this.response = this.changeActive(response.data.data)
        console.log(this.response)
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
.line{
    text-align: center;
}
</style>