<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="openDialog(e, 'edit')">刷新</el-button>
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
            <el-table-column type="index" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="文档标题"></el-table-column>
            <el-table-column prop="method" label="评论内容"></el-table-column>
            <el-table-column prop="action" label="用户/IP地址"></el-table-column>
             <el-table-column prop="accept_charset" label="评论时间"></el-table-column> 
            <el-table-column label="审核通过" width="120">
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
                width="170"
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
                :page-sizes="[10, 20, 50, 100]"
                :page-size="response.pageSize"
                :total="response.count"
                layout="total, sizes, prev, pager, next, jumper">
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
      operation: '',
      response: {
        data: null
      },
      npm: [],
      error: null,
      showDialog: false,
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
      /* eslint-disable */
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.selected = {
          ...this.selected,
          ...data
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
        //   api.POST(config.addActivityFormAPI, this.selected)
        //   .then(response => {
        //     if (response.data.errcode === '0000') {
        //       this.onSuccess('添加成功')
        //       this.showDialog = false
        //     }
        //   })
        //   .catch(error => {
        //     this.$message.error(error)
        //   })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改form确认
    editType (formName) {
    //   api.POST(config.editActivityFormAPI, this.selected)
    //   .then(response => {
    //     if (response.data.errcode === '0000') {
    //       this.onSuccess('修改成功')
    //       this.showDialog = false
    //     }
    //   })
    //   .catch(error => {
    //     this.$message.error(error)
    //   })
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
    //   api.GET(config.showActivityFormAPI, data)
    //   .then(response => {
    //     this.response = response.data.data
    //   })
    //   .catch(error => {
    //     this.$message.error(error)
    //   })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
</style>