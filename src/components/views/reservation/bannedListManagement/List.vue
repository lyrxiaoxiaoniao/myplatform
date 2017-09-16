<template>
  <div class="sc-reservation-foundation-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-button type="primary" icon="plus" @click="openDialog('新增用户')">新增</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="7">
            <el-input v-model="form.keyword" placeholder="请输入关键字" class="sc-table-header-select">
              <el-button slot="append" class="sc-table-search-btn" icon="search" @click="onSearch"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary" @click="openDialog('高级搜索')">高级</el-button>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table 
          :data="response.data"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="ID"></el-table-column>
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="手机号"></el-table-column>
          <el-table-column label="入库时间"></el-table-column>
          <el-table-column label="移除时间"></el-table-column>
          <el-table-column label="操作员ID"></el-table-column>
          <el-table-column label="黑名单原因"></el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button icon="edit" @click="openDialog('详情/编辑')"></el-button>
              <el-button icon="delete2" @click="deleteUsers(scope.row.id)"></el-button>
              <el-button icon="minus"></el-button>
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" size="tiny">
      <div class="advanceSearch-dialog" v-show="dialogTitle==='高级搜索'">
        <el-form :model="advanceSearchForm" label-position="right" label-width="100px">
          <el-form-item label="关键字">
            <el-input v-model="advanceSearchForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="advanceSearchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="advanceSearchForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="advanceSearchForm.time"
              type="datetime"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-input type="textarea" :rows="4" v-model="advanceSearchForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
          </el-row>
        </div>
      </div>
      <div class="add-dialog" v-show="dialogTitle==='新增用户'">
        <el-form :model="addForm" label-position="right" label-width="100px">
          <el-form-item label="姓名">
            <el-input v-model="addForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-input type="textarea" :rows="4" v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="黑名单说明">
            <el-input type="textarea" :rows="5" v-model="addForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="addUser">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="edit-dialog" v-show="dialogTitle==='详情/编辑'">
        <el-form :model="editForm" :inline="true" class="eidtForm" label-position="top">
          <el-form-item label="姓名" class="input">
            <el-input v-model="editForm.name" placeholder="输入加入黑名单用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" class="input">
            <el-input v-model="editForm.mobile" placeholder="输入加入黑名单用户手机号"></el-input>
          </el-form-item>
          <el-form-item label="入库时间" class="input">
            <el-date-picker
              v-model="editForm.inTime"
              type="datetime"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="移除时间" class="input">
            <el-date-picker
              v-model="editForm.outTime"
              type="datetime"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="黑名单原因" class="formTextarea">
            <el-input type="textarea" :rows="4" v-model="editForm.reason" placeholder="输入加入黑名单原因"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="editUser">保存</el-button>
          </el-row>
        </div>
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
      listData: null,
      response: {
        data: null
      },
      options: [{
        value: '1',
        label: '罗湖区'
      },
      {
        value: '2',
        label: '福田区'
      }],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        keyword: ''
      },
      advanceSearchForm: {
        keyword: '',
        name: '',
        mobile: '',
        person: '',
        address: ''
      },
      addForm: {},
      editForm: {
        inTime: '',
        outTime: ''
      },
      selectedIds: []
    }
  },
  methods: {
    getList (data = {}) {
      api.POST(config.content.list, data)
      .then(response => {
        this.response = this.transformData(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformData (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.status === 0) {
          v.status = '待审核'
        }
        if (v.status === 1) {
          v.status = '已审核'
        }
        if (v.status === 2) {
          v.status = '退回'
        }
        if (v.status === 3) {
          v.status = '已归档'
        }
        if (v.status === 4) {
          v.status = '出档'
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
    // 关键词搜索
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    // 高级搜索
    onAdvancedSearch () {
      /*
      var obj = this.ruleForm
      obj.is_recommend = this.changeState(obj.is_recommend)
      obj.is_topped = this.changeState(obj.is_topped)
      */
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize
        // ...obj
      }
      api.POST(config.content.list, data)
      .then(response => {
        this.response = this.transformData(response.data.data)
        this.closeDialog()
        // this.advanceSearchForm
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    handleSizeChange (value) {
      let data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.getList(data)
    },
    deleteUsers (deleteid) {
      if (deleteid) {
        this.selectedIds = []
        this.selectedIds.push(deleteid)
      }
      // this.confirmSelection()
      api.POST(config.content.delete, {ids: this.selectedIds})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    openDialog(titleName) {
      this.dialogTitle = titleName
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    addUser() {
      api.POST(config.copyContentAPI, this.addForm)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('创建成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    editUser() {},
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
    },
    handleSelectionChange (val) {
      this.selectedIds = val.map(v => {
        return v.id
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style>
  .el-form--inline .el-form-item {
    margin-right: 0px!important;
  }

  .eidtForm .el-form-item {
    box-sizing: border-box;
  }

  .eidtForm .input:nth-child(odd) {
    width: 51%;
    padding-right: 10px;
  }

  .eidtForm .input:nth-child(even) {
    width: 48%;
  }

  .eidtForm .formTextarea{
    width: 100%;
  }

  .eidtForm .el-form-item .el-form-item__content {
    width: 100%;
  }

  .eidtForm .el-form-item .el-form-item__content .el-date-editor {
    width: 100%;
  }

  .eidtForm .el-form-item .el-form-item__content .el-select {
    width: 100%;
  }
</style>
