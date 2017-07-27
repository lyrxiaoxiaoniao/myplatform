<template>
  <div class="GD-container">
    <div class="GD-left">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick"
              style="max-height:600px;overflow:auto;">
      </el-tree>
    </div>
    <div class="GD-right">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="addProduct" type="primary">新增商品</el-button>
              <el-dropdown @command="handleCommand">
                <el-button type="primary">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="复制">复制</el-dropdown-item>
                  <el-dropdown-item command="删除">删除</el-dropdown-item>
                  <el-dropdown-item command="移动">移动</el-dropdown-item>
                  <el-dropdown-item command="上架">上架</el-dropdown-item>
                  <el-dropdown-item command="下架">下架</el-dropdown-item>
                  <el-dropdown-item command="运费模板">运费模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="primary">刷新</el-button>
            </el-col>
            <el-select v-model="form.value" placeholder="所有信息" style="width:120px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="商品"></el-table-column>
            <el-table-column prop="credit_sell_price" label="价格" width="130"></el-table-column>
            <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
            <el-table-column prop="sort" label="库存" width="80"></el-table-column>
            <el-table-column prop="sort" label="销量" width="80"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="220"></el-table-column>
            <el-table-column label="上架" width="95">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
              width="120"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <!-- <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button> -->
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
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      data: [],
      multipleSelection: [],
      option: [{
        value: '1',
        label: '所有信息'
      }, {
        value: '2',
        label: '商品名称'
      }],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: []
      }],
      response: {
        data: null
      },
      classData: {
        selectedOptions: [],
        state: false,
        num1: ''
      },
      showDialog: false,
      dialogVisible: false,
      dialogImageUrl: '',
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  methods: {
    addProduct () {
      this.$router.push({
        path: '/admin/goods/product/add'
      })
    },
    handleCommand (command) {
      if (command === '复制') {
        this.onTips(command)
      }
      if (command === '删除') {
        this.onTips(command)
      }
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
    transformDate (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
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
    // 树形结构选择
    handleChange (value) {
      console.log(value)
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId})
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
      console.log(this.multipleSelection)
    },
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改分类'
        // this.selected = {
        //   ...this.selected,
        //   ...data
        // }
        // this.getString(this.selected)
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增分类'
        // Object.keys(this.selected).forEach(key => {
        //   this.selected[key] = ''
        // })
      }
      this.showDialog = true
    },
    // 删除表单
    deleteType (id) {
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // api.POST(config.removeActivityFieldAPI, {
        //   id: id
        // })
        // .then(response => {
        //   if (response.data.errcode === '0000') {
        //     this.onSuccess('删除成功')
        //   } else {
        //     this.$message.error('发生错误，请重试')
        //   }
        // })
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
    getList (data = {}) {
      api.GET(config.showGoodsListAPI, data)
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
    },
    // 菜单选择提示
    onTips(tip) {
      this.$confirm('此操作将' + tip + '文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          title: '消息',
          message: '已取消操作'
        })
      })
    }
  },
  mounted () {
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

