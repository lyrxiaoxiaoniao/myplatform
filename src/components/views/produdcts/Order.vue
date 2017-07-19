<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="14">
                <el-button type="primary">刷新</el-button>
                <el-select v-model="classData.region" placeholder="更多操作">
                    <el-option label="批量" value="1"></el-option>
                    <el-option label="删除" value="2"></el-option>
                </el-select>
            </el-col>
            <el-select v-model="form.logistics" placeholder="全部物流" style="width:130px;">
                <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="form.status" placeholder="全部状态" style="width:130px;">
                <el-option
                v-for="item in option1"
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
            <el-button @click="open" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
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
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDbclick">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
                <el-table-column prop="goodsName" label="商品" width="150"></el-table-column>
                <el-table-column prop="phone" label="买家手机号"></el-table-column>
                <el-table-column prop="price" label="成交金额" width="100"></el-table-column>
                <el-table-column prop="payWay" label="成交方式" width="100"></el-table-column>
                <el-table-column prop="createdAt" label="订单时间" width="100"></el-table-column>
                <el-table-column prop="payWay" label="支付方式" width="100"></el-table-column>
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
    <el-dialog title="高级搜索" v-model="searchDialog" size="tiny">
        <el-form :model="classData" label-width="80px">
            <el-row>
            <el-col :span="24">
                <el-form-item label="订单号">
                    <el-input v-model="classData.explain"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="时间">
                    <el-col :span="11">
                        <el-date-picker type="datetime" placeholder="选择开始时间" v-model="classData.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">~~</el-col>
                    <el-col :span="11">
                        <el-date-picker type="datetime" placeholder="选择结束时间" v-model="classData.date2" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="订单类型">
                    <el-select v-model="classData.region" placeholder="请选择活动区域" style="width:100%;">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="普通订单" value="2"></el-option>
                        <el-option label="代付订单" value="3"></el-option>
                        <el-option label="维权订单" value="4"></el-option>
                        <el-option label="积分兑换订单" value="5"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="订单状态">
                    <el-select v-model="classData.region" placeholder="请选择活动区域">
                        <el-option label="全部状态" value="1"></el-option>
                        <el-option label="待付款" value="2"></el-option>
                        <el-option label="待发货" value="3"></el-option>
                        <el-option label="已发货" value="4"></el-option>
                        <el-option label="已完成" value="5"></el-option>
                        <el-option label="已关闭" value="6"></el-option>
                        <el-option label="退款中" value="7"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="物流方式">
                    <el-select v-model="classData.region" placeholder="请选择活动区域">
                        <el-option label="全部物流" value="1"></el-option>
                        <el-option label="同城配送" value="2"></el-option>
                        <el-option label="上门自提" value="3"></el-option>
                        <el-option label="快递发货" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="维权状态">
                    <el-select v-model="classData.region" placeholder="请选择活动区域">
                        <el-option label="全部状态" value="1"></el-option>
                        <el-option label="退款中" value="2"></el-option>
                        <el-option label="退款结束" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="付款方式">
                    <el-select v-model="classData.region" placeholder="请选择活动区域">
                        <el-option label="全部" value="1"></el-option>
                        <el-option label="微信支付" value="2"></el-option>
                        <el-option label="支付宝支付" value="3"></el-option>
                        <el-option label="上门现金" value="4"></el-option>
                        <el-option label="积分兑换" value="5"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="交易积分/金额">
                    <el-col :span="11">
                        <el-input v-model="classData.explain"></el-input>
                    </el-col>
                    <el-col class="line" :span="2">~~</el-col>
                    <el-col :span="11">
                        <el-input v-model="classData.explain"></el-input>
                    </el-col>
                </el-form-item>
            </el-col>
            </el-row> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="searchDialog = false">取消</el-button>
            <el-button type="primary">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      multipleSelection: [],
      option: [{
        value: '1',
        label: '全部物流'
      }, {
        value: '2',
        label: '同城配送'
      }, {
        value: '3',
        label: '上门自提'
      }, {
        value: '4',
        label: '快递发货'
      }],
      option1: [{
        value: '1',
        label: '全部状态'
      }, {
        value: '2',
        label: '待付款'
      }, {
        value: '3',
        label: '待发货'
      }, {
        value: '4',
        label: '已发货'
      }, {
        value: '4',
        label: '已完成'
      }, {
        value: '4',
        label: '已关闭'
      }, {
        value: '4',
        label: '退款中'
      }, {
        value: '4',
        label: '退款结束'
      }],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: []
      }],
      response: {
        data: [{
          sort: 1
        }]
      },
      classData: {
        num1: '',
        date1: '',
        date2: ''
      },
      searchDialog: false,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        logistics: '',
        status: ''
      }
    }
  },
  methods: {
    open () {
      this.searchDialog = true
      console.log(this.searchDialog)
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
    },
    // 双击行调用函数
    rowDbclick (row, e) {
      console.log(row)
      this.$router.push({
        path: '/admin/goods/order/detail'
        // query: {
        //   id: id
        // }
      })
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
    //   mallOrderAPI
      api.GET(config.mallOrderAPI, data)
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

