<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="reFresh">刷新</el-button>
                <el-button type="primary" @click="handleCommand">批量删除</el-button>
                <!-- <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="删除">删除</el-dropdown-item>
                    <el-dropdown-item command="移动">移动</el-dropdown-item>
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
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="ID" width="50"></el-table-column>
            <el-table-column prop="article.title" label="文档标题"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column prop="created_on" label="用户/IP地址"></el-table-column>
            <el-table-column prop="created_at" label="评论时间">
              <template scope="scope">
                {{scope.row.created_at | toDateTime}}
              </template>
            </el-table-column> 
            <el-table-column label="审核通过" width="120">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.status,scope.row.id)">
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
         <el-form :model="selected" label-width="80px" ref="selected">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="文档">
                        <el-input v-model="selected.article.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="来源">
                        <el-input v-model="selected.created_on"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审核">
                        <el-switch
                          v-model="selected.status"
                          on-text="开"
                          off-text="关">
                        </el-switch>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="会员">
                        <el-input v-model="selected.explain"></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- <el-col :span="24">
                    <el-form-item label="时间">
                        <el-input v-model="selected.created_at"></el-input>
                    </el-form-item>
                </el-col> -->
                <el-col :span="24">
                    <el-form-item label="评论">
                        <el-input type="textarea" v-model="selected.content"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="24">
                    <el-form-item label="回复">
                        <el-input type="textarea" v-model="selected.des"></el-input>
                    </el-form-item>
                </el-col> -->
            </el-row> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
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
        status: null,
        content: '',
        article: {
          title: '无'
        }
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
      api.POST(config.newcms.auditNcmsCommentAPI, {id: id, status: Number(active), ...data})
      .then(response => {
        this.getList()
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
      this.$confirm('此操作将删除选定的评论信息，删除后无法恢复。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.newcms.removeNcmsCommentAPI, {
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
    // 修改form确认
    editType (formName) {
      this.selected.status = Number(this.selected.status)
      // console.log(this.selected)
      api.POST(config.newcms.editNcmsCommentAPI, this.selected)
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
    getNumber (res) {
      res.data.forEach(v => {
        v.status = Boolean(v.status)
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.newcms.ncmsCommentListAPI, data)
      .then(response => {
        this.response = this.getNumber(response.data.data)
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