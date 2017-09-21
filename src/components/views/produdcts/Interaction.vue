<template>
  <div>
    <kobe-table>
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex" justify="end">
          <el-col :span="16">
            <el-button type="primary" @click="refresh">刷新</el-button>
            <el-button type="primary" @click="batchDelete">批量删除</el-button>
          </el-col>
          <el-select v-model="operation" placeholder="所有" style="width:150px;" @change="open3">
            <el-option label="所有" value="所有"></el-option>
            <el-option label="词汇名称" value="词汇名称"></el-option>
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
        <el-table ref="multipleTable" border stripe :data="response.data" @selection-change="selectIds">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="ID" width="50"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="method" label="订单号"></el-table-column>
          <el-table-column prop="action" label="用户"></el-table-column>
          <el-table-column prop="accept_charset" label="手机/IP地址"></el-table-column>
          <el-table-column prop="accept_charset" label="真实姓名"></el-table-column>
          <el-table-column prop="accept_charset" label="评分">
            <el-rate v-model="value5" disabled show-text text-color="#ff9900" text-template="{value}">
            </el-rate>
          </el-table-column>
          <el-table-column prop="accept_charset" label="评价内容"></el-table-column>
          <el-table-column prop="accept_charset" label="评价时间"></el-table-column>
          <el-table-column label="审核通过" width="120">
            <template scope="scope">
              <el-switch v-model="scope.row.state" on-text="开" off-text="关" @change="checkPost">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column width="100" label="操作">
            <template scope="scope">
              <el-button @click="singleDelete(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer" class="kobe-table-footer">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="response.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="response.pageSize" :total="response.count" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </kobe-table>
    <el-dialog title="评论修改" v-model="showDialog" size="tiny">
      <el-form :model="selected" label-width="80px" :rules="rules" ref="selected">
        <el-row>
          <el-col :span="24">
            <el-form-item label="文档">
              <el-input v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核通过" prop="accept_charset">
              <el-switch on-text="开" off-text="关" v-model="selected.accept_charset" style="margin-left:25px;"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员">
              <el-input v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间">
              <el-input v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评论">
              <el-input type="textarea" v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="回复">
              <el-input type="textarea" v-model="selected.explain"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button @click="replyPost" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  data() {
    return {
      operation: '',
      response: {
        data: null
      },
      npm: [],
      error: null,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      selected: {
        method: '',
        name: '',
        action: '',
        accept_charset: '',
        enctype: ''
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
    replyPost () {
      console.log('发起回复评价http请求')
    },
    checkPost () {
      console.log('发起审核评价http请求')
    },
    /* http请求函数结束 */
    /* 用户行为触发改或删操作的函数开始 */
    batchDelete () {
      this.isBatchOperation = true
      this.needInput = false
      this.needWarning = true
      this.operate('删除', '此操作将删除选定的评价信息，删除后无法恢复。是否继续删除？')
    },
    singleDelete (id) {
      this.selectedId(id)
      this.isBatchOperation = false
      this.needInput = false
      this.needWarning = true
      this.operate('删除', '此操作将删除选定的评价信息，删除后无法恢复。是否继续删除？')
    },
    singleReply (id) {
      this.selectedId(id)
      this.isBatchOperation = false
      this.needInput = true
      this.needWarning = false
      this.operate('评价回复', '')
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
          case '评价回复':
            console.log('警告对话框点击确定后发起评价回复http请求')
            break
          case '删除':
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
<style scoped>

</style>