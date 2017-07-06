<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="plus" type="primary" style="margin-left:10px;" @click="openDialog"></el-button>
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
            @selection-change="handleSelectionChange">
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column type="index" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="name"></el-table-column>
            <el-table-column prop="method" label="method"></el-table-column>
            <el-table-column prop="action" label="action"></el-table-column>
            <el-table-column prop="accept_charset" label="accept_charset"></el-table-column>
            <!--<el-table-column prop="enctype" label="enctype"></el-table-column>-->
            <el-table-column 
                width="160"
                label="操作"
                >
                <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit" title="修改"></el-button>
                <el-button @click="toDetail(scope.row.id)" size="small" icon="information" title="详情"></el-button>
                <!--<el-button @click="toField(scope.row.id)" size="small" icon="menu" title="表单"></el-button>-->
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
    <el-dialog :title="dialogTitle" v-model="showDialog">
        <el-form :model="selected" label-width="120px" :rules="rules" ref="selected">
          <el-form-item label="method" prop="method" required>
              <el-select v-model="selected.method" placeholder="示例:post/get" style="width:100%;">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="name" prop="name" required>
              <el-input placeholder="示例:表单名" v-model="selected.name"></el-input>
          </el-form-item>
          <el-form-item label="action" prop="action" required>
              <el-input placeholder="示例:https://www.example.com" v-model="selected.action"></el-input>
          </el-form-item>
          <el-form-item label="accept_charset" prop="accept_charset">
              <el-input placeholder="示例:utf-8" v-model="selected.accept_charset"></el-input>
          </el-form-item>
          <el-form-item label="enctype" prop="enctype">
              <el-input placeholder="默认:application/x-www-form-urlencoded" v-model="selected.enctype"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="createType('selected')" v-if="dialogType === 'add'">确定</el-button>
            <el-button @click="editType('selected')" v-if="dialogType === 'edit'">确定</el-button>
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
      api.GET(config.checknameFormAPI, {name: value})
      .then(response => {
        if (response.data.errcode === '5000') {
          return callback(new Error('有重名，请重新输入！'))
        } else {
          callback()
        }
      })
    }
    return {
      response: {
        data: null
      },
      npm: [],
      error: null,
      showDialog: false,
      dialogTitle: '',
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
        accept_charset: 'utf-8',
        enctype: 'application/x-www-form-urlencoded'
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        method: [
          { required: true, message: '不能为空，示例:post/get', trigger: 'blur' }
        ],
        action: [
          { required: true, message: '不能为空，示例:https://www.example.com', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    },
    // 删除表单
    deleteType (id) {
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.removeActivityFormAPI, {
          id: id
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
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改表单'
        this.selected = {
          ...this.selected,
          ...data
        }
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增表单'
        this.selected = {
          method: '',
          name: '',
          action: '',
          accept_charset: 'utf-8',
          enctype: 'application/x-www-form-urlencoded'
        }
      }
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    // 新增form确认
    createType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.addActivityFormAPI, this.selected)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('添加成功')
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
    editType (formName) {
      api.POST(config.editActivityFormAPI, this.selected)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.showDialog = false
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
    getList (data = {}) {
      api.GET(config.showActivityFormAPI, data)
      .then(response => {
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    toDetail (id) {
      this.$router.push({
        path: '/admin/form/detail',
        query: {
          id: id
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
</style>

