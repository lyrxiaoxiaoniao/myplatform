<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button @click="opendialog('add')" type="primary">新增规格</el-button>
                <el-button @click="resFresh" type="primary">刷新</el-button>
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
                <el-table-column prop="value_type" label="value_type"></el-table-column>
                <el-table-column prop="title" label="title"></el-table-column>
                <el-table-column prop="created_at" label="创建时间">
                  <template scope="scope">
                    {{ scope.row.created_at | toDateTime }}
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column label="启用" width="100">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.active"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.active, scope.row.id)">
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="操作" width="120">
                  <template scope="scope"> 
                      <el-button @click="openEditdialog('edit', scope.row)" size="small" icon="edit"></el-button>
                      <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button> 
                  </template>
                </el-table-column>
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
    <el-dialog title="新增规格" v-model="dialogVisible" size="tiny" @close="onClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="value_type" prop="value_type">
            <el-input v-model="ruleForm.value_type"></el-input>
          </el-form-item>
          <el-form-item label="title" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="content" prop="content">
            <el-input v-model="ruleForm.content"></el-input>
          </el-form-item>
          <el-form-item label="启用" prop="active">
            <el-switch on-text="开" off-text="关" v-model="ruleForm.active" style="width:80px;"></el-switch>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="onClose">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改规格" v-model="dialogEditVisible" size="tiny" @close="onEditClose">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="value_type">
            <el-input v-model="editForm.value_type"></el-input>
          </el-form-item>
          <el-form-item label="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="content">
            <el-input v-model="editForm.content"></el-input>
          </el-form-item>
          <el-form-item label="启用" prop="active">
            <el-switch on-text="开" off-text="关" v-model="editForm.active" style="width:80px;"></el-switch>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateForm">确认</el-button>
        <el-button @click="onEditClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    var checkVal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      api.GET(config.checkAawardsProperty, {value_type: value})
      .then(response => {
        if (response.data.errcode === '60000') {
          return callback(new Error('有重名，请重新输入！'))
        } else {
          callback()
        }
      })
    }
    var checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      api.GET(config.checkAawardsProperty, {title: value})
      .then(response => {
        if (response.data.errcode === '60000') {
          return callback(new Error('有重名，请重新输入！'))
        } else {
          callback()
        }
      })
    }
    return {
      multipleSelection: [],
      dialogVisible: false,
      dialogEditVisible: false,
      response: {
        data: []
      },
      ids: [],
      dialogTitle: '',
      dialogType: '',
      form: {
        keyword: ''
      },
      ruleForm: {
        value_type: '',
        content: '',
        title: '',
        active: null
      },
      editForm: {
        value_type: '',
        content: '',
        title: '',
        active: null
      },
      rules: {
        value_type: [
          { validator: checkVal, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
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
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    changeNum (val) {
      if (val) {
        val = 1
      } else {
        val = 0
      }
      return val
    },
    toswitch (active, id) {
      let ids = []
      ids.push(id)
      var obj = {
        ids: ids,
        active: this.changeNum(active)
      }
      api.POST(config.activeAwardsProperty, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.getList()
          this.$notify({
            title: '成功',
            message: '修改状态成功！！！',
            type: 'success'
          })
        }
      })
    },
    opendialog (type, data = {}) {
      this.dialogVisible = true
      this.dialogType = type
      this.dialogTitle = '新增规格'
    },
    openEditdialog (type, data = {}) {
      this.dialogEditVisible = true
      const newData = JSON.parse(JSON.stringify(data))
      this.dialogType = type
      this.editForm = newData
    },
    onClose () {
      this.dialogVisible = false
      this.ruleForm = {
        value_type: '',
        content: '',
        title: '',
        active: null
      }
    },
    onEditClose () {
      this.dialogEditVisible = false
      this.editForm = {
        value_type: '',
        content: '',
        title: '',
        active: null
      }
    },
    updateForm() {
      if (this.editForm.active === true) {
        this.editForm.active = 1
      } else {
        this.editForm.active = 0
      }
      api.POST(config.editAwardsProperty, this.editForm)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('修改规格成功!')
          this.dialogEditVisible = false
          this.getList()
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.active === true) {
            this.ruleForm.active = 1
          } else {
            this.ruleForm.active = 0
          }
          api.POST(config.addAawardsProperty, this.ruleForm)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('新增规格成功!')
              this.dialogVisible = false
              this.getList()
            } else {
              this.$message.error(response.data.errmsg)
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    // 双击行调用函数
    rowDbclick (data, type) {
      this.opendialog(type = 'edit', data)
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
        api.POST(config.removeGoodsAPI, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    resFresh () {
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
      window.alert(1)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    changeActive (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        } else if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.awardsProperty, data)
      .then(response => {
        this.response = this.changeActive(response.data.data)
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