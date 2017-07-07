<template>
  <div class="GD-container">
    <div class="GD-left">
      <h4>团队组织</h4>
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="GD-right">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button @click="getList" type="primary" style="margin-left:10px;">刷新</el-button>
            <el-button icon="upload2" type="primary"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="团队名称"></el-table-column>
            <el-table-column prop="logo" label="团队logo" width="150">
              <template scope="scope">
                <img width="100%" :src="scope.row.logo" @click="bigImg(scope.row.logo)" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="250"></el-table-column>
            <el-table-column prop="number" label="成员" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="150"></el-table-column>
            <el-table-column 
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="toDetail(scope.row.id)" size="small" icon="information"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
          <el-row type="flex" justify="center">
            <el-button type="text" style="color: #48576a; padding:5px 0;">删除</el-button>
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
      <el-dialog v-model="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'value'
      },
      multipleSelection: [],
      response: {
        data: null
      },
      error: null,
      showDialog: false,
      isDialogDisabled: false,
      showStepsDialog: false,
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    // 0未审核 1.审核通过 2.审核不通过 3.申请认证中  4.认证通过 5.认证驳回
    transformDate (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.status === 0) {
          v.status = '未审核'
        }
        if (v.status === 1) {
          v.status = '审核通过'
        }
        if (v.status === 2) {
          v.status = '审核不通过'
        }
        if (v.status === 3) {
          v.status = '申请认证中'
        }
        if (v.status === 4) {
          v.status = '认证通过'
        }
        if (v.status === 4) {
          v.status = '认证驳回'
        }
      })
      return res
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
    formatDate (value) {
      let date = new Date(value)
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      // let h = date.getHours()
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
      return value
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      console.log(data, node)
      this.getList({type: data.name})
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
    getTree (data = {}) {
      // teamTreeAPI
      api.GET(config.teamTreeAPI, data)
      .then(response => {
        this.data = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      // showTeamAPI
      api.GET(config.showTeamAPI, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
        // console.log(this.response)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    toDetail (id) {
      this.$router.push({
        path: '/admin/team/detail',
        query: {
          id: id
        }
      })
    }
  },
  mounted () {
    this.getTree()
    this.getList()
  }
}
</script>
<style scoped>
.GD-container{
    height: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    position: relative;
}
.GD-left{
  width: 15%;
}
.GD-right{
    width:83%;
    position: absolute;
    top: 0;
    right: 0;
}
</style>