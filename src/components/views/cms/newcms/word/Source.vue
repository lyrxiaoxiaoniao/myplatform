<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="openDialog">添加来源</el-button>
                <el-button @click="refresh" type="primary">刷新</el-button>
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
                <el-option label="词汇名称" value="词汇名称"></el-option>
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
            @selection-change="handleSelectionChange"
            @row-dblclick="openDialog">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column prop="name" label="来源名称"></el-table-column>
            <el-table-column prop="count" label="文档数量"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
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
                <el-button @click="openDialog(scope.row, 'edit')" size="small" icon="edit" title="修改"></el-button>
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
          <el-form-item label="来源名称" prop="name" required>
              <el-input placeholder="示例:专题名称" v-model="selected.name"></el-input>
          </el-form-item>
          <el-form-item label="是否有效">
              <el-switch on-text="开" off-text="关" v-model="selected.active"></el-switch>
          </el-form-item>
          <el-form-item label="来源说明">
              <el-input type="textarea" placeholder="" v-model="selected.state"></el-input>
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
      api.GET(config.selectByNameWordSourceListAPI, {name: value})
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
        keyword: ''
      },
      selected: {
        name: '',
        count: '',
        created_at: '',
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
     // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  active 状态值
    transformDate (res) {
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
    handleCommand (command) {
      // if (command === '批量删除') {
      //   this.deleteType()
      // }
      this.deleteType()
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
      api.POST(config.updateActiveWordSourceAPI, obj)
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
        api.POST(config.removeWordSourceListAPI, {
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
    openDialog (data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改来源'
        this.selected = {
          ...this.selected,
          ...data
        }
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增来源'
        this.selected = {
          state: '',
          name: '',
          active: ''
        }
      }
      this.selected.active = Boolean(this.selected.active)
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    getNum (res) {
      if (res === true) {
        res = 1
      } else {
        res = 0
      }
      return res
    },
    // 新增form确认
    createType (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.selected.active = this.getNum(this.selected.active)
          api.POST(config.addWordSourceListAPI, this.selected)
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
      var obj = {
        state: this.selected.state,
        name: this.selected.name,
        active: this.selected.active,
        id: this.selected.id
      }
      api.POST(config.editWordSourceListAPI, obj)
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
      api.GET(config.showWordSourceListAPI, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    refresh () {
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