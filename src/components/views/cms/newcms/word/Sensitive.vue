<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="openDialog">添加敏感词</el-button>
                <!-- <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="删除">删除</el-dropdown-item>
                    <el-dropdown-item command="移动">移动</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                <el-button @click="reFresh" type="primary">刷新</el-button>
                <el-button @click="handleCommand" type="primary">批量删除</el-button>
            </el-col>
            <!-- <el-select v-model="operation" placeholder="所有" style="width:150px;" @change="open3">
                <el-option label="所有" value="所有"></el-option>
                <el-option label="敏感词" value="敏感词"></el-option>
            </el-select> -->
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="upload2" type="primary"  style="margin-left:10px;"></el-button>
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
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column prop="badword" label="敏感词"></el-table-column>
            <el-table-column prop="replacement" label="替换词汇"></el-table-column>
            <el-table-column prop="created_at" label="创建时间">
              <template scope="scope">
                {{scope.row.created_at | toDateTime}}
              </template>
            </el-table-column>
            <el-table-column label="是否有效" width="120">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.active"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.active,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
                width="120"
                label="操作"
                >
                <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
                <el-button @click="openEditDialog(scope.row, 'edit')" size="small" icon="edit" title="修改"></el-button>
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
    <el-dialog title="新增敏感词" v-model="showDialog">
        <el-form :model="selected" label-width="120px" :rules="rules" ref="selected">
          <el-form-item label="敏感词" prop="badword" required>
              <el-input placeholder="示例:你妈的" v-model="selected.badword"></el-input>
          </el-form-item>
          <el-form-item label="替换词" prop="replacement" required>
              <el-input placeholder="示例:你*的" v-model="selected.replacement"></el-input>
          </el-form-item>
          <el-form-item label="是否有效">
              <el-switch on-text="开" off-text="关" v-model="selected.active"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="createType('selected')" type="primary">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="修改敏感词" v-model="showEditDialog">
        <el-form :model="selectedEdit" label-width="120px">
          <el-form-item label="敏感词">
              <el-input placeholder="示例:你妈的" v-model="selectedEdit.badword"></el-input>
          </el-form-item>
          <el-form-item label="替换词">
              <el-input placeholder="示例:你*的" v-model="selectedEdit.replacement"></el-input>
          </el-form-item>
          <el-form-item label="是否有效">
              <el-switch on-text="开" off-text="关" v-model="selectedEdit.active"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeEditDialog">取消</el-button>
            <el-button @click="editType" type="primary">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      api.GET(config.newcms.checkNcmsSensitiveAPI, {badword: value})
      .then(response => {
        if (response.data.errcode === '60000') {
          return callback(new Error('有重名，请重新输入！'))
        } else {
          callback()
        }
      })
    }
    return {
      operation: '',
      response: {
        data: null
      },
      showDialog: false,
      showEditDialog: false,
      form: {
        keyword: ''
      },
      selected: {
        badword: '',
        active: null,
        replacement: ''
      },
      selectedEdit: {
        badword: '',
        active: null,
        replacement: ''
      },
      multipleSelection: [],
      rules: {
        badword: [
          { validator: checkName, trigger: 'blur' }
        ],
        replacement: [
          { required: true, message: '不能为空，请输入替换词', trigger: 'blur' }
        ]
      },
      ids: []
    }
  },
  methods: {
    handleCommand (command) {
      // if (command === '删除') {
      //   this.deleteType()
      // }
      this.deleteType()
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
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    /* 切换状态 */
    toswitch (active, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      api.POST(config.newcms.activeNcmsSensitiveAPI, {id: id, active: Number(active)})
      .then(response => {
        this.getList(data)
        this.onSuccess('状态操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选评论信息？', '错误', {
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
      this.$confirm('此操作将删除该敏感字。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.newcms.removeNcmsSensitiveAPI, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
      })
    },
    // 模态框显示
    openDialog () {
      this.selected = {
        badword: '',
        active: null,
        replacement: ''
      }
      this.showDialog = true
    },
    openEditDialog (data) {
      this.selectedEdit = {
        ...this.selectedEdit,
        ...data
      }
      this.selectedEdit.active = Boolean(this.selectedEdit.active)
      this.showEditDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    closeEditDialog () {
      this.showEditDialog = false
    },
    // 新增form确认
    createType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.selected.active = Number(this.selected.active)
          api.POST(config.newcms.addNcmsSensitiveAPI, this.selected)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('添加成功')
              this.getList()
              this.showDialog = false
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改form确认
    editType () {
      this.selectedEdit.active = Number(this.selectedEdit.active)
      api.POST(config.newcms.editNcmsSensitiveAPI, this.selectedEdit)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.getList()
          this.showEditDialog = false
        }
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
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
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
    changeActive (res) {
      res.data.forEach(v => {
        if (v.active) {
          v.active = Boolean(v.active)
        }
        if (v.is_audit) {
          v.is_audit = Boolean(v.is_audit)
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.newcms.ncmsSensitiveListAPI, data)
      .then(response => {
        this.response = this.changeActive(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    reFresh () {
      this.getList()
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
</style>