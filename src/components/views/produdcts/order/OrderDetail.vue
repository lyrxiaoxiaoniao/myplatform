<template>
  <div class="OD-container">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;font-size:18px;font-weight:600;">待发货</span>
          <el-button style="float: right;" type="primary" @click="openDialog('发货')">发货</el-button>
          <p>
            <span>订单备注：</span>
          </p>
        </div>
        <div>
          <h4>买家信息：</h4>
          <p>
            <span>收货地址：</span>林先生，13688811903，广东 深圳市 南山区 前海路鼎太风华一期D4栋1103
            <a href="javascript:;">修改地址</a>
          </p>
          <p>
            <span>下单账号：</span>13688811903
            <a href="javascript:;">联系买家</a>
          </p>
          <p>
            <span>买家留言：无</span>
          </p>
        </div>
      </el-card>
    </div>
    <div class="OD-right">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品信息" name="first">
          <el-table border stripe :data="response.data">
            <el-table-column prop="logo" label="商品名称">
              <template scope="scope">
                <img width="100%" :src="scope.row.logo" @click="bigImg(scope.row.logo)" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="title" label="型号" width="200"></el-table-column>
            <el-table-column prop="created_at" label="发货状态" width="200"></el-table-column>
            <el-table-column prop="number" label="退款状态" width="200"></el-table-column>
            <el-table-column prop="status" label="价格" width="150"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="物流信息" name="second">
          <el-steps :space="50" direction="vertical" :active="1">
            <el-step title="步骤 3" icon="time"></el-step>
            <el-step title="步骤 2" icon="time"></el-step>
            <el-step title="步骤 1" icon="time"></el-step>
          </el-steps>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
      <el-form :model="classData" label-width="80px">
        <el-form-item>
          <el-checkbox v-model="checked">全选所有商品</el-checkbox>
        </el-form-item>
        <el-form-item label="请选择发货商品">
          <el-row>
            <el-col :span="1">
              <el-checkbox v-model="checked"></el-checkbox>
            </el-col>
            <el-col :span="7">
              <img src="" />
            </el-col>
            <el-col :span="8">
              绿地飞鸡蛋
            </el-col>
            <el-col :span="8">
              <p>99元</p>
              <p>*1</p>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="选择发货方式">
          <el-radio class="radio" v-model="radio" label="1">快递</el-radio>
          <el-radio class="radio" v-model="radio" label="2">同城配送</el-radio>
          <el-radio class="radio" v-model="radio" label="1">上门自提</el-radio>
          <el-radio class="radio" v-model="radio" label="2">无须物流</el-radio>
        </el-form-item>
        <div v-show="classData.pattern === '快递'||classData.pattern === '同城配送'">
          <el-form-item label="填写快递单号">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="请选择快递公司">
            <el-select></el-select>
          </el-form-item>
        </div>
        <div v-show="classData.pattern === '上门自提'">
          <el-form-item label="自提凭证号">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="选择自提点">
            <el-select></el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="batchDelivery">确定</el-button>
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
        response: {
          data: null
        },
        activeName: 'first',
        checkAll: false,
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
        classData: {
          pattern: '上门自提'
        },
        productsCheckedList: []// 商品选中状态列表
      }
    },
    methods: {
      /* http请求函数开始 */
      getList(data = {}) {
        api.GET(config.showOrderAPI, data)
        .then(response => {
          this.response = response.data.data
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      deliveryPost () {
        console.log('发起发货http请求')
      },
      /* http请求函数结束 */
      /* 用户行为触发改或删操作的函数开始 */
      batchDelivery () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = false
        this.operate('发货', '')
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
        // 弹出输入对话框或警告对话框/直接发起http请求
        if (this.next) {
          if (this.needInput) {
            this.next = false
            this.openDialog(operationName, dialogSize)
          }
          if (this.needWarning) {
            // 弹出警告对话框
            this.next = await this.confirmOperation(this.next, warnContent)
          }
          if (!this.needInput && !this.needWarning) {
            this.next = false
            // 发起http请求
            console.log('直接发起http请求')
          }
        }
        // 警告对话框点击确定后的执行函数
        if (this.next) {
          switch (operationName) {
            case '发货':
              console.log('警告对话框点击确定后发起发货http请求')
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
      toggleAllChecked () {
        if (this.checkAll) {
          // 将所有条目的选中状态变成true
        } else {
          // 将所有条目的选中状态变成false
        }
        this.selectIds(this.productsCheckedList)
      },
      toggleOneChecked () {
        this.selectIds(this.productsCheckedList)
      },
      toggleDeliveryPattern () {
        // 点击单选框，切换display属性
      },
      selectIds (value) {
        let arr = value.map((v, index) => {
          // 返回商品列表对应的id
          return v.id
        })
        this.selectedIds = JSON.parse(JSON.stringify(arr))
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      openDialog (value, size) {
        this.dialog.title = value
        this.dialog.visible = true
        this.dialog.size = size
      },
      closeDialog () {
        this.dialog.visible = false
        this.dialog.title = ''
      }
    },
    mounted () {
      this.getList({id: this.$route.query.id})
      // 初始化productsCheckedList
    }
  }
</script>

<style scoped>
  .OD-container {
    padding: 1rem;
    min-width: 800px;
    max-width: 1200px
  }

  .sendHeader {
    background-color: #fff;
  }

  .OD-right {
    padding-left: 10px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
