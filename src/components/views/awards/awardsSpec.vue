<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary">新增规格</el-button>
                <el-button type="primary">刷新</el-button>
                <el-dropdown @command="handleCommand" style="margin-left:10px;">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
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
                <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
                <el-table-column prop="goodsName" label="商品" width="150"></el-table-column>
                <el-table-column prop="phone" label="买家手机号"></el-table-column>
                <el-table-column prop="price" label="成交金额" width="100"></el-table-column>
                <el-table-column prop="payway" label="成交方式" width="100"></el-table-column>
                <el-table-column prop="createdAt" label="订单时间" width="100"></el-table-column>
                <el-table-column prop="payway" label="支付方式" width="100"></el-table-column>
                <el-table-column prop="freightWay" label="物流方式" width="100"></el-table-column>
                <el-table-column prop="buyerName" label="收货人" width="100"></el-table-column>
                <el-table-column prop="address" label="收货地址"></el-table-column>
                <el-table-column prop="status" label="状态" width="80"></el-table-column>
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
        data: [{
          sort: 1
        }]
      },
      ids: [],
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
    },
    // 树形结构选择
    handleChange (value) {
      console.log(value)
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
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    // 双击行调用函数
    rowDbclick (row, e) {
      console.log(row)
      this.$router.push({
        path: '/admin/goods/order/detail',
        query: {
          id: row
        }
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选表单？', '错误', {
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
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.removeOrderAPI, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
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
    getList (data = {}) {
    //   mallOrderAPI
      api.GET(config.showOrderAPI, data)
      .then(response => {
        this.response = response.data.data
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