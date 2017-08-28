<template>
  <div class="GD-container">
    <el-row>
      <el-col :span="4">
        <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <el-col :span="20">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
              <el-col :span="16">
                <el-button type="primary" @click="addData">发布内容</el-button>
                <el-button type="primary" @click="getList">刷新</el-button>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    批量<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="移动">移动</el-dropdown-item>
                    <el-dropdown-item command="删除">删除</el-dropdown-item>
                    <el-dropdown-item command="复制">复制</el-dropdown-item>
                    <el-dropdown-item command="审核">审核</el-dropdown-item>
                    <el-dropdown-item command="通知">通知</el-dropdown-item>
                    <el-dropdown-item command="提交">提交</el-dropdown-item>
                    <el-dropdown-item command="推送至专题">推送至专题</el-dropdown-item>
                    <el-dropdown-item command="保存固顶">保存固顶</el-dropdown-item>
                    <el-dropdown-item command="推送到微信">推送到微信</el-dropdown-item>
                    <el-dropdown-item command="群发微信通知">群发微信通知</el-dropdown-item>
                    <el-dropdown-item command="归档">归档</el-dropdown-item>
                    <el-dropdown-item command="出档">出档</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="7">
                <el-input v-model="form.keyword" placeholder="请输入内容名称" class="sc-table-header-select">
                  <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
                </el-input>
              </el-col>
              <el-button @click="openDialog('高级搜索')" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
              <el-button type="primary" icon="upload2"></el-button>
              <el-button type="primary" icon="setting"></el-button>
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
              <el-table-column prop="spacename" label="名称"></el-table-column>
              <el-table-column prop="slug" label="分类" width="250"></el-table-column>
              <el-table-column prop="count" label="点击量" width="100"></el-table-column>
              <el-table-column prop="createdAt" label="展示量" width="150"></el-table-column>
              <el-table-column 
                width="180"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="toDetail(scope.row.id)" size="small" icon="edit"></el-button>
                  <el-button size="small" icon="share"></el-button>
                  <el-button @click="deleteId(scope.row.id)" size="small" icon="delete2"></el-button>
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
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
      <div class="dialog-advancedSearch" v-show="dialogTitle === '高级搜索'">
        <el-form :model="ruleForm" label-width="80px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="关键字">
                        <el-input v-model="ruleForm.keyword"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="栏目">
                        <el-select v-model="ruleForm.column" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="发布时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">~~</el-col>
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="ruleForm.date2" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章状态">
                        <el-select v-model="ruleForm.status" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章类型">
                        <el-select v-model="ruleForm.type" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="推荐固顶">
                        <el-checkbox-group v-model="ruleForm.special">
                            <el-checkbox label="固顶文章" name="type"></el-checkbox>
                            <el-checkbox label="推荐文章" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="作者">
                        <el-input v-model="ruleForm.author"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
        </div>
      </div>
      <div class="dialog-moveContent" v-show="dialogTitle === '移动'">
        <el-row type="flex" justify="center">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">移动到</el-button>
          <el-cascader
            :options="moveToOptions"
            v-model="moveToValue"
            @change="handleChange">
          </el-cascader>
        </el-row>
        <div slot="footer" class="dialog-space-footer">
          <p>移动操作主要是改变文章的栏目，本操作不可撤销。</p>
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="moveContent">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-push" v-show="dialogTitle === '推送至专题'">
        <el-row type="flex" justify="center">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">推送到专题</el-button>
          <el-select v-model="selectedSubject" placeholder="请选择活动区域" multiple style="width:100%;" @change="getTargetSubject">
            <el-option
                v-for="item in getSubjectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <div slot="footer" class="dialog-space-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="pushContent">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-fixed" v-show="dialogTitle === '保存固顶'">
        <el-row type="flex" justify="center">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">固顶顺序</el-button>
          <el-input-number v-model="order" :min="1" :max="10"></el-input-number>
        </el-row>
        <div slot="footer" class="dialog-space-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="fixContent">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-mini" v-show="dialogTitle === '删除'||dialogTitle === '复制'||dialogTitle === '审核'||dialogTitle === '退回'||dialogTitle === '提交'||dialogTitle === '归档'||dialogTitle === '出档'">
        <p v-for="item in getDialogTip">{{item}}</p>
        <el-row type="flex" justify="end">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOperation">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-content-table',
  data () {
    return {
      response: {
        data: null
      },
      data: [],
      cascaderData: [],
      form: {
        keyword: ''
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogMini: ['删除', '复制', '审核', '退回', '提交', '归档', '出档'],
      dialogTipArr: [
        ['此操作将删除选定的文章。', '是否继续删除？'],
        ['此操作将复制选定的文章。', '是否继续复制？'],
        ['此操作将通过文章审核，文章将能正常发布和查看。', '是否继续？'],
        ['此操作将不同意通过文章审核，文章将会被退回。', '是否继续？'],
        ['此操作把文章提交给有权限的操作员进行审核。', '是否继续？'],
        ['此操作将归档选定文章，归档后不能进行修改和调整。', '是否继续归档？'],
        ['此操作将把文章从归档状态移除。', '是否继续出档？']
      ],
      isEdit: false,
      ruleForm: {
        keyword: '',
        column: '',
        date1: '',
        date2: '',
        status: '',
        type: '',
        special: [],
        author: ''
      },
      uploadUrl: config.serverURI + config.uploadImgAPI,
      option: [{
        value: '1',
        label: '所有信息'
      }, {
        value: '2',
        label: '栏目名称'
      }, {
        value: '3',
        label: '访问路径'
      }],
      options: [{
        value: '1',
        label: '草稿'
      }, {
        value: '2',
        label: '待审核'
      }, {
        value: '3',
        label: '已审核'
      }, {
        value: '4',
        label: '退回'
      }],
      dynamicTags: [],
      ids: [],
      classData: {
        selectedOptions: [],
        state: false,
        num1: '',
        region: '',
        date1: '',
        date2: '',
        type: []
      },
      multipleSelection: [],
      moveToOptions: [],
      moveToValue: '',
      selectedSubject: [],
      order: 0
    }
  },
  computed: {
    getDialogTip () {
      const index = this.dialogMini.indexOf(this.dialogTitle)
      return this.dialogTipArr[index]
    },
    getSubjectOptions () {
      let arr = []
      api.GET(config.subjectAPI)
      .then(response => {
        arr = response.data.data
      })
      return arr
    }
  },
  methods: {
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
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.getList({id: this.parentId})
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.ruleForm
      }
      this.getList(data)
    },
    onAdvancedSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = {}) {
      api.GET(config.advPointListAPI, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.status === 0) {
          v.status = '未审核'
        }
        if (v.status === 1) {
          v.status = '审核通过'
        }
        if (v.status === 2) {
          v.status = '审核不通过'
        }
        if (v.status === 3) {
          v.status = '申请认证中'
        }
        if (v.status === 4) {
          v.status = '认证通过'
        }
        if (v.status === 5) {
          v.status = '认证驳回'
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
    getTree () {
      api.GET(config.categoryTreeAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.data = newData
        this.cascaderData = newData
        this.moveToOptions = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    deleteId (deleteid) {
      if (deleteid) {
        this.ids = []
        this.ids.push(deleteid)
      }
      this.confirmSelection()
      api.POST(config.deleteContentAPI, {ids: this.ids})
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
    copyContent () {
      this.confirmSelection()
      api.POST(config.copyContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('复制成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    reviewContent () {
      this.confirmSelection()
      api.POST(config.reviewContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('通过审核')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    returnContent () {
      this.confirmSelection()
      api.POST(config.returnContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('退回成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    submitContent () {
      this.confirmSelection()
      api.POST(config.submitContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('提交成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    archiveContent () {
      this.confirmSelection()
      api.POST(config.archiveContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('归档成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    removeFiles () {
      this.confirmSelection()
      api.POST(config.removeFilesAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('出档成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    moveContent () {
      this.confirmSelection()
      api.POST(config.moveContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('移动成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    pushContent () {
      this.confirmSelection()
      api.POST(config.pushContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('推送成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    fixContent () {
      this.confirmSelection()
      api.POST(config.fixContentAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('固顶成功')
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    confirmOperation () {
      switch (this.dialogTitle) {
        case '删除':
          this.deleteId()
          break
        case '复制':
          this.copyContent()
          break
        case '审核':
          this.reviewContent()
          break
        case '退回':
          this.returnContent()
          break
        case '提交':
          this.submitContent()
          break
        case '归档':
          this.archiveContent()
          break
        case '出档':
          this.removeFiles()
          break
      }
      this.closeDialog()
      /*
      this.$confirm(tipContent, tipTitle, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(({ value }) => {
        this.$notify({
          type: 'success',
          message: '操作成功'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消操作'
        })
      })
      */
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    confirmSelection () {
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选？', '错误', {
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
    },
    handleCommand(command) {
      this.openDialog(command)
      /*
      switch (command) {
        case '删除':
          this.confirmOperation(this.tipArr[0][0], this.tipArr[0][1])
          break
        case '复制':
          this.confirmOperation(this.tipArr[1][0], this.tipArr[1][1])
          break
        case '审核':
          this.confirmOperation(this.tipArr[2][0], this.tipArr[2][1])
          break
        case '退回':
          this.confirmOperation(this.tipArr[3][0], this.tipArr[3][1])
          break
        case '提交':
          this.confirmOperation(this.tipArr[4][0], this.tipArr[4][1])
          break
        case '归档':
          this.confirmOperation(this.tipArr[5][0], this.tipArr[5][1])
          break
        case '出档':
          this.confirmOperation(this.tipArr[6][0], this.tipArr[6][1])
          break
        default:
          this.openDialog(command)
      }
      */
    },
    handleChange (value) {
      this.moveToValue = value
    },
    openDialog (value) {
      this.dialogFormVisible = true
      this.dialogTitle = value
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogTitle = ''
    },
    toDetail (id) {
      this.$router.push({
        path: '/admin/team/detail',
        query: {
          id: id
        }
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var obj = {}
          var sendURL
          obj.typeId = Number(this.ruleForm.typename)
          obj.description = this.ruleForm.description
          obj.slug = this.ruleForm.slug
          obj.spacename = this.ruleForm.spacename
          obj.tagList = this.dynamicTags.join(',')
          obj.state = this.changeState(this.ruleForm.state)
          if (this.isEdit) {
            obj.id = this.id
            sendURL = config.editAdvePointAPI
          } else {
            sendURL = config.addAdvPointAPI
          }
          api.POST(sendURL, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功！！！',
                  type: 'success'
                })
                this.getList()
                this.dialogFormVisible = false
              }
            })
        } else {
          return false
        }
      })

      this.ruleForm = {
        description: '',
        slug: '',
        spacename: '',
        typename: null,
        value: '',
        tagList: [],
        state: true
      }
    },
    changeState (state) {
      if (state) {
        return 1
      } else {
        return 0
      }
    },
    getTargetSubject (value) {
      this.selectedSubject = value
    }
  },
  components: {
  },
  mounted () {
    this.getTree()
    this.getList()
  }
}
</script>

<style scoped>
  .sc-report-table {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    padding: 1rem;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .top-ruleForm .el-form-item {
    margin-bottom: 10px;
  }

  .dialog-space-footer {
    margin-top: 15rem;
  }
</style>
