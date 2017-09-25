<template>
  <div>
    <kobe-table>
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex" justify="end">
          <el-col :span="14">
            <el-button type="primary" @click="refresh">刷新</el-button>
            <el-button type="primary" @click="batchDelete">批量删除</el-button>
          </el-col>
          <el-select v-model="searchValueObj.freight_way" placeholder="全部物流" style="width:150px;margin-right: 10px" @change="onSearch">
            <el-option v-for="item in freightWayOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchValueObj.send_status" placeholder="全部状态" style="width:150px;margin-right: 10px" @change="onSearch">
            <el-option v-for="item in sendStatusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="8">
            <el-input v-model="searchValueObj.keyword" placeholder="请输入搜索关键字">
              <el-button slot="append" @click="onSearch" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button @click="openDialog('高级搜索')" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
          <el-button icon="upload2" type="primary"></el-button>
          <el-button icon="setting" type="primary"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table ref="multipleTable"
          border
          stripe
          height="428"
          :data="response.data"
          @selection-change="selectIds"
          @row-dblclick="rowDbclick">
          <el-table-column fixed type="selection"></el-table-column>
          <el-table-column fixed prop="id" label="ID"></el-table-column>
          <el-table-column prop="order_number" label="订单号" width="150"></el-table-column>
          <el-table-column prop="awardOrderDetailBeans" label="商品" width="270">
            <template scope="scope">
              <ul class="goodsList">
                <li v-for="value in scope.row.awardOrderDetailBeans" class="goodsList-item">
                  <div>
                    <span>{{value.awardGoodsBean.name}}</span>
                  </div>
                  <div>
                    <p>￥{{value.awardGoodsBean.sell_price}}</p>
                    <p>X{{value.goods_number}}</p>
                  </div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="买家手机号" width="150"></el-table-column>
          <el-table-column prop="price" label="成交金额" width="100"></el-table-column>
          <el-table-column prop="bargain_type" label="成交方式" width="100"></el-table-column>
          <el-table-column prop="created_at" label="订单时间" width="200"></el-table-column>
          <el-table-column prop="pay_way" label="支付方式" width="100"></el-table-column>
          <el-table-column prop="freight_way" label="物流方式" width="100"></el-table-column>
          <el-table-column prop="consignee" label="收货人"></el-table-column>
          <el-table-column prop="address" label="收货地址"></el-table-column>
          <el-table-column prop="send_status" label="状态"></el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer" class="kobe-table-footer">
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="response.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="response.pageSize" :total="response.count" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </kobe-table>
    <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
      <el-form :model="advancedSearchForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号">
              <el-input v-model="advancedSearchForm.order_number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间">
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择开始时间" v-model="advancedSearchForm.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">~~</el-col>
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择结束时间" v-model="advancedSearchForm.date2" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="订单类型">
              <el-select v-model="advancedSearchForm.order_type" placeholder="请选择活动区域" style="width:100%;">
                <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-select v-model="advancedSearchForm.send_status" placeholder="请选择活动区域">
                <el-option v-for="item in sendStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流方式">
              <el-select v-model="advancedSearchForm.freight_way" placeholder="请选择活动区域">
                <el-option v-for="item in freightWayOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维权状态">
              <el-select v-model="advancedSearchForm.region" placeholder="请选择活动区域">
                <el-option label="全部状态" value="1"></el-option>
                <el-option label="退款中" value="2"></el-option>
                <el-option label="退款结束" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式">
              <el-select v-model="advancedSearchForm.pay_way" placeholder="请选择活动区域">
                <el-option v-for="item in payWayOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="交易金额/积分">
              <el-col :span="11">
                <el-input v-model="advancedSearchForm.explain"></el-input>
              </el-col>
              <el-col class="line" :span="2">~~</el-col>
              <el-col :span="11">
                <el-input v-model="advancedSearchForm.explain"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="onAdvancedSearch">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    data() {
      return {
        searchValueObj: {
          freight_way: '',
          send_status: '',
          keyword: '',
          currentPage: 1,
          pageSize: 10
        },
        freightWayOptions: [{
          value: '',
          label: '全部物流'
        }, {
          value: 0,
          label: '上门自提'
        }, {
          value: 1,
          label: '快递发货'
        }, {
          value: 2,
          label: '同城配送'
        }],
        sendStatusOptions: [{
          value: '',
          label: '全部状态'
        }, {
          value: 0,
          label: '未发货'
        }, {
          value: 1,
          label: '已发货'
        }],
        orderTypeOptions: [{
          value: '',
          label: '全部状态'
        }, {
          value: 0,
          label: '未发货'
        }, {
          value: 1,
          label: '已发货'
        }],
        payWayOptions: [{
          value: '',
          label: '全部'
        }, {
          value: 0,
          label: '微信'
        }, {
          value: 1,
          label: '积分'
        }, {
          value: 2,
          label: '借记卡'
        }],
        response: {
          data: null
        },
        advancedSearchForm: {
          num1: '',
          date1: '',
          date2: ''
        },
        dialog: {
          visible: false,
          title: '',
          size: 'small'
        },
        isBatchOperation: false, // 是否是批量操作
        needInput: false, // 是否需要打开输入对话框
        needWarning: false, // 是否需要打开警告对话框
        next: true, // 是否进行下一步
        selectedIds: [],
        selectedId: 0
      }
    },
    methods: {
      /* http请求函数开始 */
      getList(data = {}) {
        api.GET(config.integralMall.order.index, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      deletePost () {
        api.POST(config.integralMall.order.deleteOrder, {ids: this.selectedIds})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.selectedIds.length = 0
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      /* http请求函数结束 */
      /* 用户行为触发改或删操作的函数开始 */
      batchDelete () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = true
        this.operate('删除', '此操作将删除选定的订单。是否继续删除？')
      },
      /* 用户行为触发改或删操作的函数结束 */
      /* 用户行为触发改或删操作的流程开始 */
      async operate (operationName, warnContent, dialogSize) {
        this.next = true
        // 如果是批量操作，是否有选中的记录
        if (this.isBatchOperation) {
          if (!this.selectedIds.length) {
            this.next = await this.warnSelection(this.next, warnContent)
          }
        }
        // 弹出输入对话框或警告对话框
        if (this.next) {
          if (this.needInput) {
            this.next = false
            this.openDialog(operationName, dialogSize)
          }
          if (this.needWarning) {
            this.next = await this.confirmOperation(this.next, warnContent)
          }
        }
        // 警告对话框点击确定后的执行函数
        if (this.next) {
          switch (operationName) {
            case '删除':
              this.deletePost()
              break
          }
        }
      },
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否执行操作
      confirmOperation (next, str) {
        return this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      /* 用户行为触发改或删操作的流程结束 */
      /* 用户行为触发查操作的函数开始 */
      refresh () {
        this.getList()
      },
      handleSizeChange (value) {
        this.searchValueObj.pageSize = value
        this.getListByParams()
      },
      handleCurrentChange (value) {
        this.searchValueObj.currentPage = value
        this.getListByParams()
      },
      onSearch () {
        this.getListByParams()
      },
      // 以searchValueObj为基础，构造getList的参数
      getListByParams () {
        let obj = JSON.parse(JSON.stringify(this.searchValueObj))
        for (var keyName in obj) {
          if (obj[keyName] === '') {
            delete obj[keyName]
          }
        }

        this.getList(obj)
      },
      onAdvancedSearch () {
        let obj = this.advancedSearchForm
        this.getList(obj)
      },
      /* 用户行为触发查操作的函数结束 */
      transformData (res) {
        let obj = res
        if (res.currentPage !== undefined) {
          obj.data.forEach(v => {
            if (v.created_at) {
              v.created_at = this.formatDate(v.created_at)
            }
            this.changeState(v)
          })
        } else {
          if (obj.created_at) {
            obj.created_at = this.formatDate(obj.created_at)
          }
          this.changeState(obj)
        }
        return obj
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
      changeState (obj) {
        switch (obj.pay_status) {
          case 0:
            obj.pay_status = '未支付'
            break
          case 1:
            obj.pay_status = '已支付'
            break
        }
        switch (obj.pay_way) {
          case 0:
            obj.pay_way = '微信'
            break
          case 1:
            obj.pay_way = '积分'
            break
          case 2:
            obj.pay_way = '借记卡'
            break
        }
        switch (obj.bargain_type) {
          case 0:
            obj.bargain_type = '微信'
            break
          case 1:
            obj.bargain_type = '积分'
            break
          case 2:
            obj.bargain_type = '借记卡'
            break
        }
        switch (obj.freight_way) {
          case 0:
            obj.freight_way = '上门自提'
            break
          case 1:
            obj.freight_way = '快递发货'
            break
        }
        switch (obj.send_status) {
          case 0:
            obj.send_status = '未发货'
            break
          case 1:
            obj.send_status = '已发货'
            break
        }
      },
      // 勾选多行生成selectedIds数组
      selectIds (value) {
        let arr = value.map(v => {
          return v.id
        })
        this.selectedIds = JSON.parse(JSON.stringify(arr))
      },
      // 点击单行按钮生成selectedId值
      selectId (value) {
        this.selectedId = value
      },
      // 双击行调用函数
      rowDbclick(row, e) {
        this.$router.push({
          path: '/admin/goods/order/detail',
          query: {
            order_number: row.order_number
          }
        })
      },
      openDialog (value, size) {
        this.dialog.title = value
        this.dialog.visible = true
        this.dialog.size = size
      },
      closeDialog () {
        this.dialog.visible = false
        this.dialog.title = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    },
    mounted() {
      this.getList()
    }
  }
</script>
<style lang="scss" scoped>
  ul.goodsList {
    padding: 0px;
    .goodsList-item {
      display: flex;
      justify-content: space-between;
    }
  }
  .line {
    text-align: center;
  }
</style>

