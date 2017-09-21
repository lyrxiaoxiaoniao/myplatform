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
            <!-- <el-select v-model="form.value" placeholder="所有信息" style="width:120px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button icon="search" type="primary" @click="openDialog('高级搜索')" style="margin-left:10px;">高级</el-button>
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
            @selection-change="selectIds">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="商品"></el-table-column>
            <el-table-column prop="credit_sell_price" label="价格" width="130"></el-table-column>
            <el-table-column prop="sort" label="排序" width="80"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="220"></el-table-column>
            <el-table-column prop="sort" label="库存" width="80"></el-table-column>
            <el-table-column prop="sort" label="销量" width="80"></el-table-column>
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
                <el-button size="small" icon="edit"></el-button>
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
    <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
      <div class="dialog-advanceSearch" v-if="dialog.title === '高级搜索'">
        <advanced-search @closeDialog="closeDialog" @onAdvancedSearch="onAdvancedSearch"></advanced-search>
      </div>
      <div class="dialog-bigImg" v-if="dialog.title === '放大图片'">
        <img width="100%" :src="dialogImageUrl" alt="">
      </div>
      <div class="dialog-move" v-if="dialog.title === '移动'">
        <el-row type="flex" justify="center" class="dialog-main">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">移动到</el-button>
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="movePost">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-putOn" v-if="dialog.title === '上架'">
        <div class="dialog-main">
          <p>此商品将选定的商品进行上架售卖，请选择指定的上架方式：</p>
          <el-row>
            <el-radio class="radio" v-model="radio" label="1" style="padding-left:20px;">立即上架</el-radio>
          </el-row>
          <el-row>
            <el-radio class="radio" v-model="radio" label="2" style="padding-left:20px;">定时上架</el-radio>
            <el-date-picker
              v-model="value1"
              type="datetime"
              placeholder="选择上架时间"
              style="margin-left:10px;">
            </el-date-picker>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="putOnPost">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-pullOff" v-if="dialog.title === '下架'">
        <div class="dialog-main">
          <p>此商品将选定的商品进行下架，停止售卖，请选择指定的下架方式：</p>
          <el-row>
            <el-radio class="radio" v-model="radio" label="1" style="padding-left:20px;">立即下架</el-radio>
          </el-row>
          <el-row>
            <el-radio class="radio" v-model="radio" label="2" style="padding-left:20px;">定时下架</el-radio>
            <el-date-picker
              v-model="value1"
              type="datetime"
              placeholder="选择下架时间"
              style="margin-left:10px;">
            </el-date-picker>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="putOffPost">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-chooseDeliveryPattern" v-if="dialog.title === '运费模板'">
        <el-row type="flex" justify="center" class="dialog-main">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">应用运费模板</el-button>
          <el-cascader
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="chooseDeliveryPatternPost">保存</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  import advancedSearch from './components/advancedSearch'

  export default {
    data () {
      return {
        data: [],
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
        selectedId: 0,
        dialogImageUrl: '',
        stepsSelection: [],
        tableData: null,
        form: {
          keyword: '',
          value: ''
        }
      }
    },
    components: {
      advancedSearch
    },
    methods: {
      addProduct () {
        this.$router.push({
          path: '/admin/goods/product/add'
        })
      },
      handleCommand (command) {
        switch (command) {
          case '复制':
            this.batchCopy()
            break
          case '删除':
            this.batchDelete()
            break
          case '移动':
            this.batchMove()
            break
          case '上架':
            this.batchPutOn()
            break
          case '下架':
            this.batchPullOff()
            break
          case '运费模板':
            this.batchChooseDeliveryPattern()
            break
        }
      },
      bigImg (url) {
        this.dialogImageUrl = url
        this.dialog.visible = true
      },
      /* http请求函数开始 */
      getList (data = {}) {
        api.GET(config.goodsListAPI, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      movePost () {
        console.log('发起移动http请求')
      },
      putOnPost () {
        console.log('发起上架http请求')
      },
      putOffPost () {
        console.log('发起下架http请求')
      },
      chooseDeliveryPatternPost () {
        console.log('发起设置运费模式http请求')
      },
      /* http请求函数结束 */
      /* 用户行为触发改或删操作的函数开始 */
      batchCopy () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = true
        this.operate('复制', '此操作将复制选定的商品。是否继续复制？')
      },
      batchDelete () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = true
        this.operate('删除', '此操作将删除选定的商品。是否继续删除？')
      },
      batchMove () {
        this.isBatchOperation = true
        this.needInput = true
        this.needWarning = false
        this.operate('移动', '', 'tiny')
      },
      batchPutOn () {
        this.isBatchOperation = true
        this.needInput = true
        this.needWarning = false
        this.operate('上架', '', 'tiny')
      },
      batchPullOff () {
        this.isBatchOperation = true
        this.needInput = true
        this.needWarning = false
        this.operate('下架', '', 'tiny')
      },
      batchChooseDeliveryPattern () {
        this.isBatchOperation = false
        this.needInput = true
        this.needWarning = false
        this.operate('运费模板', '', 'tiny')
      },
      singleDelete (id) {
        this.selectId(id)
        this.isBatchOperation = false
        this.needInput = false
        this.needWarning = true
        this.operate('删除', '此操作将删除该分类，分类删除后，数据无法恢复。如果下属有子分类，将无法被删除。是否继续删除？')
      },
      /* 用户行为触发改或删操作的函数结束 */
      /* 用户行为触发查操作的函数开始 */
      handleNodeClick (data, node) {
        this.parentId = data.id
        this.getList({id: this.parentId})
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
      onAdvancedSearch (obj) {
        this.getList(obj)
      },
      /* 用户行为触发查操作的函数结束 */
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
            case '复制':
              console.log('警告对话框点击确定后发起复制http请求')
              break
            case '删除':
              console.log('警告对话框点击确定后发起删除http请求')
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
      // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
      transformData (res) {
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
      // 模态框显示
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
    mounted () {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
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

