<template>
  <div class="GD-container">
    <el-row>
      <el-col :span="4">
        <el-tree :data="treeData" :props="defaultProps"
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
              <el-col :span="15">
                <el-button type="primary" @click="toAdd">发布内容</el-button>
                <el-button type="primary" @click="refresh">刷新</el-button>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    批量<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="删除">删除</el-dropdown-item>
                    <el-dropdown-item command="移动">移动</el-dropdown-item>
                    <!--<el-dropdown-item command="复制">复制</el-dropdown-item>-->
                    <el-dropdown-item command="审核">审核</el-dropdown-item>
                    <el-dropdown-item command="退回">退回</el-dropdown-item>
                    <el-dropdown-item command="提交">提交</el-dropdown-item>
                    <el-dropdown-item command="推送至专题">推送至专题</el-dropdown-item>
                    <el-dropdown-item command="保存固顶">保存固顶</el-dropdown-item>
                    <!--<el-dropdown-item command="推送到微信">推送到微信</el-dropdown-item>
                    <el-dropdown-item command="群发微信通知">群发微信通知</el-dropdown-item>-->
                    <el-dropdown-item command="归档">归档</el-dropdown-item>
                    <el-dropdown-item command="出档">出档</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
              <el-col :span="3">
                <el-select v-model="selectValue" placeholder="所有信息" style="width:105px;">
                  <el-option
                    v-for="item in selectCategoryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
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
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="title" label="内容标题" width="250"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="created_at" label="创建时间" width="150"></el-table-column>
              <el-table-column prop="click" label="点击" width="70"></el-table-column>
              <el-table-column prop="author" label="作者" width="100"></el-table-column>
              <el-table-column prop="status" label="状态" width="100"></el-table-column>
              <el-table-column 
                width="120"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="toEdit(scope.row.id)" size="small" icon="edit"></el-button>
                  <el-button @click="toDelete(scope.row.id)" size="small" icon="delete2"></el-button>
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
                        <el-select v-model="value" placeholder="栏目选择" style="width:100%;" @change="getAdvancedSearchColumn">
                          <el-option
                            v-for="item in advancedCategoryOptions"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="发布时间">
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="ruleForm.start_time" style="width: 100%;"></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">~~</el-col>
                        <el-col :span="11">
                            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="ruleForm.end_time" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章状态">
                        <el-select v-model="ruleForm.states" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in statesOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="文章类型">
                        <el-select v-model="ruleForm.types" placeholder="请选择活动区域" multiple style="width:100%;">
                            <el-option
                                v-for="item in typesOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="推荐固顶">
                    <el-checkbox label="固顶文章" name="type" v-model="ruleForm.is_topped"></el-checkbox>
                    <el-checkbox label="推荐文章" name="type" v-model="ruleForm.is_recommend"></el-checkbox>
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
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
          </el-row>
        </div>
      </div>
      <div class="dialog-moveContent" v-show="dialogTitle === '移动'">
        <el-row type="flex" justify="center">
          <el-button type="text" style="color: #48576a; padding:5px 10px;">移动到</el-button>
          <el-cascader
            :options="cascaderData"
            v-model="moveToValue"
            @change="getMoveToTarget"
            :props="moveDefaultProps">
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
          <el-select v-model="selectedSubject" multiple placeholder="请选择活动区域" style="width:100%;" @change="getTargetSubjects">
            <el-option
                v-for="item in subjectOptions"
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
          <el-input-number v-model="topOrder" :min="1"></el-input-number>
        </el-row>
        <div slot="footer" class="dialog-space-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="fixContent">保存</el-button>
          </el-row>
        </div>
      </div>
      <!--
      <div class="dialog-mini" v-show="dialogTitle === '删除'||dialogTitle === '复制'||dialogTitle === '审核'||dialogTitle === '退回'||dialogTitle === '提交'||dialogTitle === '归档'||dialogTitle === '出档'">
        <p v-for="item in getDialogTip">{{item}}</p>
        <el-row type="flex" justify="end">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOperation">确定</el-button>
        </el-row>
      </div>
      -->
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
      treeData: [],
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
        start_time: '',
        end_time: '',
        states: [],
        types: [],
        author: ''
      },
      uploadUrl: config.serverURI + config.uploadImgAPI,
      selectCategoryOptions: [{
        value: 1,
        label: '所有信息'
      }, {
        value: 2,
        label: '内容标题'
      }, {
        value: 3,
        label: '作者'
      }],
      statesOptions: [{
        value: '0',
        label: '待审核'
      }, {
        value: '1',
        label: '已审核'
      }, {
        value: '2',
        label: '退回'
      }, {
        value: '3',
        label: '已归档'
      }, {
        value: '4',
        label: '出档'
      }],
      typesOptions: [{
        value: '1',
        label: '普通'
      }, {
        value: '2',
        label: '图文'
      }],
      dynamicTags: [],
      ids: [],
      multipleSelection: [],
      moveToValue: [],
      selectedSubject: '',
      subjectOptions: [],
      topOrder: 0,
      defaultProps: {
        children: 'children',
        label: 'display_name'
      },
      moveDefaultProps: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      parentId: 0,
      advancedCategoryOptions: [],
      value: '',
      selectValue: ''
    }
  },
  computed: {
    getDialogTip () {
      const index = this.dialogMini.indexOf(this.dialogTitle)
      return this.dialogTipArr[index]
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
      this.getList({category_id: this.parentId})
    },
    // 搜索按钮
    onSearch () {
      let data = {
        currentPage: 1,
        pageSize: this.response.pageSize
      }
      // 判断选择框是否有选择
      switch (this.selectValue) {
        // 选择作者
        case 3:
          data.author = this.form.keyword
          break
        default:
          Object.assign(data, this.form)
      }
      // console.log(typeof this.selectValue)
      // const data = {
      //   currentPage: 1,
      //   pageSize: this.response.pageSize,
      //   ...this.form
      // }
      this.getList(data)
    },
    // 高级搜索
    onAdvancedSearch () {
      var obj = this.ruleForm
      obj.is_recommend = this.changeState(obj.is_recommend)
      obj.is_topped = this.changeState(obj.is_topped)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...obj
      }
      api.POST(config.content.list, data)
      .then(response => {
        this.response = this.transformData(response.data.data)
        this.closeDialog()
        this.ruleForm = {
          keyword: '',
          start_time: '',
          end_time: '',
          states: [],
          types: [],
          author: ''
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getAdvancedCategoryOptions () {
      api.GET(config.newcms.ncmsCategotyAPI)
      .then(response => {
        var newData = []
        var res = response.data.data[0].children
        res.forEach(value => {
          var obj = {}
          obj.label = value.display_name
          obj.value = value.id
          newData.push(obj)
        })
        newData.unshift({label: '全部分类', value: ''})
        this.advancedCategoryOptions = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getAdvancedSearchColumn (value) {
      this.ruleForm.category_id = value
    },
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
        switch (v.type) {
          case 1:
            v.type = '普通'
            break
          case 2:
            v.type = '图文'
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
      api.GET(config.newcms.ncmsCategotyAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        this.cascaderData = newData
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.treeData = newData
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
    refresh () {
      this.getTree()
      this.getList()
    },
    // 点击单行记录的删除按钮确认操作
    toDelete (deleteid) {
      this.$confirm('此操作将删除选定的文章。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteId(deleteid)
      })
    },
    deleteId (deleteid) {
      if (deleteid) {
        this.ids = []
        this.ids.push(deleteid)
      }
      api.POST(config.content.delete, {ids: this.ids})
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
      api.POST(config.content.changeState, {ids: this.ids, status: 1})
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
      api.POST(config.content.changeState, {ids: this.ids, status: 2})
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
      api.POST(config.content.changeState, {ids: this.ids, status: 0})
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
      api.POST(config.content.changeState, {ids: this.ids, status: 3})
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
      api.POST(config.content.changeState, {ids: this.ids, status: 4})
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
      api.POST(config.content.move, {articles: this.ids, category_id: this.moveToValue[this.moveToValue.length - 1]})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('移动成功')
            this.getList()
            this.closeDialog()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    pushContent () {
      api.POST(config.content.subject, {articles: this.ids, subjects: this.selectedSubject})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('推送成功')
            this.getList()
            this.closeDialog()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    fixContent () {
      api.POST(config.content.top, {articles: this.ids, is_topped: 1, sort: this.topOrder})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('固顶成功')
            this.getList()
            this.closeDialog()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    // 对话框确定按钮绑定的事件，根据对话标题调用不同的函数
    /*
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
    },
    */
    // 确认是否已勾选
    confirmSelection () {
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return false
      } else {
        return true
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    handleCommand(command) {
      if (!this.confirmSelection()) {
        return
      }
      switch (command) {
        case '删除':
          this.$confirm('此操作将删除选定的文章。是否继续删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteId()
          })
          break
        case '复制':
          this.$confirm('此操作将复制选定的文章。是否继续复制？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.copyContent()
          })
          break
        case '审核':
          this.$confirm('此操作将通过文章审核，文章将能正常发布和查看。是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.reviewContent()
          })
          break
        case '退回':
          this.$confirm('此操作将不同意通过文章审核，文章将会被退回。是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.returnContent()
          })
          break
        case '提交':
          this.$confirm('此操作把文章提交给有权限的操作员进行审核。是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitContent()
          })
          break
        case '归档':
          this.$confirm('此操作将归档选定文章，归档后不能进行修改和调整。是否继续归档？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.archiveContent()
          })
          break
        case '出档':
          this.$confirm('此操作将把文章从归档状态移除。是否继续出档？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeFiles()
          })
          break
        default:
          this.openDialog(command)
      }
    },
    // 获取移动路径
    getMoveToTarget (value) {
      this.moveToValue = value
    },
    getSubjectOptions () {
      var arr = []
      api.GET(config.subject.list)
      .then(response => {
        arr = response.data.data.data
        this.subjectOptions = arr.map(value => {
          var obj = {}
          obj.value = value.id
          obj.label = value.display_name
          return obj
        })
      })
    },
    openDialog (value) {
      this.dialogFormVisible = true
      this.dialogTitle = value
      if (this.dialogTitle === '推送至专题') {
        this.getSubjectOptions()
      }
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogTitle = ''
    },
    toEdit (id) {
      this.$router.push({
        path: '/admin/newcms/content/edit',
        query: {
          id: id
        }
      })
    },
    toAdd () {
      this.$router.push({
        path: '/admin/newcms/content/add'
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
    changeState (fieldName) {
      switch (fieldName) {
        case false:
          return 0
        case true:
          return 1
      }
    },
    getTargetSubjects (value) {
      // this.selectedSubject = value
    }
  },
  components: {
  },
  mounted () {
    this.getTree()
    this.getList()
    this.getAdvancedCategoryOptions()
  }
}
</script>

<style scoped>
  .GD-container{
      height: 100%;
      margin-top: 1.5rem;
      padding: 1rem 2rem;
      position: relative;
  }

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
