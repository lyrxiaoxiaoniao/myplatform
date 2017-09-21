<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <!-- <el-button type="primary" @click="toAddStatus">新增商品</el-button> -->
          <el-button type="primary" @click="refresh">刷新</el-button>
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="restore">复原商品</el-dropdown-item>
              <el-dropdown-item command="delete">彻底删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="2" style="margin-right:10px;">
          <!-- <el-select v-model="searchSelectValue" placeholder="所有信息" style="width:105px;" @change="searchSelect">
            <el-option
              v-for="item in searchSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
          </el-input>
        </el-col>
        <el-button @click="openDialog('高级搜索')" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table 
        :data="response.data"
        border
        stripe
        @selection-change="selectIds">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="商品"></el-table-column>
        <el-table-column prop="dutyName" label="价格" width="80"></el-table-column>
        <el-table-column prop="mobile" label="库存" width="80"></el-table-column>
        <el-table-column prop="license" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="signState" label="删除时间" width="150"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="toEditStatus(scope.row.id)" title="修改"></el-button>
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
      <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
        <div class="dialog-advancedSearch" v-show="dialog.title === '高级搜索'">
          <advanced-search @closeDialog="closeDialog" @onAdvancedSearch="onAdvancedSearch"></advanced-search>
        </div>
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  import advancedSearch from './components/advancedSearch'

  export default {
    name: 'sc-productsRecycle-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        advancedSearchForm: {
          name: '',
          detailAddress: '',
          mobile: '',
          orgCode: '',
          dutyName: '',
          signState: 0
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
    components: {
      advancedSearch
    },
    computed: {},
    methods: {
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
      deletePost () {
        console.log('发起删除http请求')
      },
      putOnPost () {
        console.log('发起复原http请求')
      },
      /* http请求函数结束 */
      /* 用户行为触发改或删操作的函数开始 */
      batchRestore () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = true
        this.operate('复原', '此操作将恢复选定商品删除前的状态。是否确定复原？')
      },
      batchDelete () {
        this.isBatchOperation = true
        this.needInput = false
        this.needWarning = true
        this.operate('彻底删除', '此操作将彻底删除选定的商品，从此两茫茫，无法再寻回来了。是否确定如此狠心？')
      },
      /* 用户行为触发改或删操作的函数结束 */
      /* 用户行为触发查操作的函数开始 */
      refresh () {
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
        const data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          ...this.form
        }
        this.getList(data)
      },
      onAdvancedSearch (obj) {
        // data为高级搜索表单数据
        this.getList(obj)
      },
      /* 用户行为触发查操作的函数结束 */
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
            case '复原':
              console.log('警告对话框点击确定后发起复原http请求')
              break
            case '彻底删除':
              console.log('警告对话框点击确定后发起彻底删除http请求')
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
      handleCommand(command) {
        switch (command) {
          case 'restore':
            this.batchRestore()
            break
          case 'delete':
            this.batchDelete()
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
      toAddStatus () {
        this.$router.push({
          path: '/admin/recycle/restaurants/add'
        })
      },
      toEditStatus (id) {
        this.$router.push({
          path: '/admin/recycle/restaurants/edit',
          query: {
            id: id
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
    mounted () {
      this.getList()
    }
  }
</script>