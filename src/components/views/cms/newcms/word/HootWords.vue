<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="openDialog">添加热词</el-button>
                <el-button @click="reFresh" type="primary">刷新</el-button>
                <el-button @click="handleCommand" type="primary">批量删除</el-button>
                <!-- <el-dropdown @command="handleCommand" style="margin-left:10px;">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
            </el-col>
            <!-- <el-select v-model="operation" placeholder="所有" style="width:150px;">
                <el-option label="所有" value="所有"></el-option>
                <el-option label="专题名称" value="专题名称"></el-option>
            </el-select> -->
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="form.keyword">
                  <el-select v-model="form.value" slot="prepend" placeholder="请选择" style="width:110px;">
                    <el-option label="热词名称" value="1"></el-option>
                  </el-select>
                  <el-button @click="onSearch" slot="append" icon="search"></el-button>
                </el-input>
                <!-- <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                  <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input> -->
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
            <el-table-column prop="name" label="热词名称"></el-table-column>
            <el-table-column prop="search_times" label="搜索次数"></el-table-column>
            <el-table-column prop="order_at" label="排序"></el-table-column>
            <el-table-column label="是否推荐" width="120">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.active"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.active, scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
                width="120"
                label="操作"
                >
                <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit" title="修改"></el-button>
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
                :page-sizes="[10 ,15 , 20, 50, 100]"
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
          <el-form-item label="热词名称" prop="name" required>
              <el-input placeholder="示例:专题名称" v-model="selected.name"></el-input>
          </el-form-item>
          <el-form-item label="热词排序">
              <el-input-number v-model="selected.order_at"></el-input-number>
          </el-form-item>
          <el-form-item label="是否推荐">
              <el-switch on-text="开" off-text="关" v-model="selected.active"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="createType('selected')" type="primary" v-if="dialogType === 'add'">确定</el-button>
            <el-button @click="editType('selected')" type="primary" v-if="dialogType === 'edit'">确定</el-button>
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
      api.GET(config.selectByNameHotWordListAPI, {name: value})
      .then(response => {
        if (response.data.errcode === '5000') {
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
      npm: [],
      error: null,
      showDialog: false,
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        value: ''
      },
      selected: {
        name: '',
        search_times: '',
        order_at: '',
        active: null
      },
      ids: [],
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      // if (command === '批量删除') {
      //   this.deleteType()
      // }
      this.deleteType()
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
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
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      var obj = {
        id: id,
        active: this.changeNum(active)
      }
      api.POST(config.updateActiveHotWordListAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！',
            type: 'success'
          })
          this.getList(data)
        }
      })
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
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选点位？', '错误', {
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
        api.POST(config.removeHotWordListAPI, {
          ids: this.ids
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
          order_at: '',
          name: '',
          active: ''
        }
      }
      this.showDialog = true
    },
    getNum (res) {
      if (res === true) {
        res = 1
      } else {
        res = 0
      }
      return res
    },
    closeDialog () {
      this.showDialog = false
    },
    // 新增form确认
    createType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.selected.active = this.getNum(this.selected.active)
          api.POST(config.addHotWordListAPI, this.selected)
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
      this.selected.active = this.getNum(this.selected.active)
      api.POST(config.editHotWordListAPI, this.selected)
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
      api.GET(config.showHotWordListAPI, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
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