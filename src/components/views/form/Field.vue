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
          <el-table-column prop="name" label="element"></el-table-column>
          <el-table-column prop="type" label="type"></el-table-column>
          <el-table-column prop="label" label="label"></el-table-column>
          <el-table-column prop="sort" label="sort"></el-table-column>
          <el-table-column prop="value" label="value"></el-table-column>
          <el-table-column 
              width="120"
              label="操作"
              >
              <template scope="scope">
              <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
              <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
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
        <el-steps :space="200" :active="active">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        
        <el-form :model="selected" label-width="120px" :rules="rules" ref="selected" style="margin:10px 15px 0 0">
          <el-row type="flex" v-show="active >= 0" style="flex-wrap: wrap;">
            <el-col :span="12">
              <el-form-item label="container_class">
                <el-input v-model="selected.container_class" placeholder="标签外层容器，如form-group"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="sort">
                <el-input v-model="selected.sort" placeholder="标签在表单中的位置"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="label" prop="label" required>
                <el-input v-model="selected.label" placeholder="输入栏名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="label_class">
                <el-input v-model="selected.label_class" placeholder="输入栏class样式，如control-label"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="element" prop="name" required>
                <el-input v-model="selected.name" placeholder="表单标签名称，如input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="type" prop="type" required>
                <el-select v-model="selected.type" placeholder="标签类型，如text，radio，checkbox等" style="width:100%;">
                  <el-option label="text" value="text"></el-option>
                  <el-option label="radio" value="radio"></el-option>
                  <el-option label="checkbox" value="checkbox"></el-option>
                  <el-option label="hidden" value="hidden"></el-option>
                  <el-option label="url" value="url"></el-option>
                  <el-option label="tel" value="tel"></el-option>
                  <el-option label="password" value="password"></el-option>
                  <el-option label="date" value="date"></el-option>
                  <el-option label="datetime" value="datetime"></el-option>
                  <el-option label="time" value="time"></el-option>
                  <el-option label="submit" value="submit"></el-option>
                  <el-option label="file" value="file"></el-option>
                  <el-option label="email" value="email"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" v-show="active >= 1" style="flex-wrap: wrap;">
            <el-col :span="12">
              <el-form-item label="help">
                <el-input v-model="selected.help" placeholder="输入帮助语"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="help_class">
                <el-input v-model="selected.help_class" placeholder="输入帮助class样式，如help-block"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="value">
                <el-input v-model="selected.value" placeholder="输入域预设值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="wrapper_class">
                <el-input v-model="selected.wrapper_class" placeholder="输入域的class样式，如form-control"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="placeholder">
                <el-input v-model="selected.placeholder" placeholder="输入域提示内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="icon">
                <el-input v-model="selected.icon" placeholder="输入域图标，如fa-user，fa-lock"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" v-show="active >= 2 || active > 2" style="flex-wrap: wrap;">
            <el-col :span="12">
              <el-form-item label="minlength">
                <el-input v-model="selected.minlength" placeholder="输入内容最小长度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="maxlength">
                <el-input v-model="selected.maxlength" placeholder="输入内容最大长度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="min">
                <el-input v-model="selected.min" placeholder="输入内容最小值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="max">
                <el-input v-model="selected.max" placeholder="输入内容最大值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="unique">
                <el-input v-model="selected.only" placeholder="输入内容在表中唯一的字段"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="regex">
                <el-input v-model="selected.regex" placeholder="验证输入内容的正则表达式"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="required">
                <el-radio-group v-model="selected.required">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="numeric">
                <el-radio-group v-model="selected.figure">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="digits">
                <el-radio-group v-model="selected.digits">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-button style="margin-top: 12px;" @click="next" v-if="active <= 2">下一步</el-button>

        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="createType('selected')" v-if="dialogType === 'add'">确定</el-button>
            <el-button @click="editType('selected')" v-if="dialogType === 'edit'">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      active: 0,
      response: {
        data: null
      },
      error: null,
      showDialog: false,
      isDialogDisabled: false,
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      selected: {
        name: 'input',
        type: '',
        required: '',
        figure: '',
        digits: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        label: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    next () {
      console.log(this.active)
      if (this.active++ > 2) this.active = 2
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
    },
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改标签'
        this.selected = {
          ...this.selected,
          ...data
        }
        this.getString(this.selected)
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增标签'
        Object.keys(this.selected).forEach(key => {
          this.selected[key] = ''
        })
      }
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    // 删除表单
    deleteType (id) {
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.removeActivityFieldAPI, {
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
    getInt (val) {
      for (var k in val) {
        if (k === 'required' || k === 'figure' || k === 'digits') {
          if (val[k] === '是') {
            val[k] = 1
          } else {
            val[k] = 0
          }
        }
      }
    },
    getString (val) {
      for (var k in val) {
        if (k === 'required' || k === 'figure' || k === 'digits') {
          if (val[k] === 1) {
            val[k] = '是'
          } else {
            val[k] = '否'
          }
        }
      }
    },
    // 新增form确认
    createType (formName) {
      this.getInt(this.selected)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.addActivityFieldAPI, this.selected)
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
      this.getInt(this.selected)
      api.POST(config.editActivityFieldAPI, this.selected)
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
    getList (data = {}) {
      console.log(1)
      api.GET(config.showActivityFieldAPI, data)
      .then(response => {
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
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