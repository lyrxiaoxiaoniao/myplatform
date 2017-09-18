<template>
  <div class="GD-container">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">      
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="openDialog()" type="primary">+新增</el-button>
              <el-button @click="refresh" type="primary">刷新</el-button>
              <el-button @click="deleteType()" type="primary">批量删除</el-button>                 
            </el-col>
            <el-select v-model="form.audit_state" placeholder="所有信息" style="width:140px;">
              <el-option
                v-for="item in option"
                :key="item.audit_state"
                :label="item.label"
                :value="item.audit_state">
              </el-option>
            </el-select>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="dialogAdvance = true">高级</el-button>
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
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" sortable label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="duty_name" label="角色标识" width="95">
            </el-table-column>
            <el-table-column prop="mobile" width="105" label="角色类别"></el-table-column>
            <el-table-column prop="region_id" label="账号数量" width="90"></el-table-column>
            <el-table-column prop="region_id" label="角色说明"></el-table-column>
            <el-table-column prop="region_id" label="创建时间"></el-table-column>
            <el-table-column prop="detail_address" label="有效状态" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.audit_state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.audit_state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
              width="210"
              label="操作"
              >
              <template scope="scope">
                <!-- <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button> -->
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button size="small" @click="openPermission(scope.row.id)">权</el-button>
                <el-button size="small" @click="openUsers(scope.row.id)">用</el-button>
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
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
<!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" :label-width="formLabelWidth">
           <el-form-item label="关键字">
              <el-input v-model="advancedSearch.keyword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色名称">
              <el-input v-model="advancedSearch.keyword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-input v-model="advancedSearch.keyword" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色类别">
                  <el-select v-model="value1" placeholder="请选择">
                    <el-option
                      v-for="item in roleClass"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属商户" filterable placeholder="输入或选择商户">
                  <el-select v-model="value2" placeholder="请选择">
                    <el-option
                      v-for="item in origins"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>            
            <el-form-item label="是否启用">
              <el-switch
                v-model="enabled"
                on-text="是"
                off-text="否">
              </el-switch>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                  v-model="advancedSearch.keyword"
                  type="datetime"
                  placeholder="选择开始时间">
              </el-date-picker>
              <el-date-picker
                  v-model="advancedSearch.keyword"
                  type="datetime"
                  placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdvance = false">取 消</el-button>
            <el-button type="primary" @click="advance">搜 索</el-button>
        </span>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog :title="dialogTitle" v-model="addShow">
        <el-form :model="addForm" ref="addForm" :rules="rules" :label-width="formLabelWidth">
          <el-form-item label="角色名称" prop="id">
            <el-input v-model="addForm.id" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-row>
              <el-col :span="12">
                <el-form-item label="角色类别">
                  <el-select v-model="value1" placeholder="请选择">
                    <el-option
                      v-for="item in roleClass"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属商户" filterable placeholder="输入或选择商户">
                  <el-select v-model="value2" placeholder="请选择">
                    <el-option
                      v-for="item in origins"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="是否启用">
              <el-switch
                v-model="enabled"
                on-text="是"
                off-text="否">
              </el-switch>
            </el-form-item>
          <el-form-item label="角色标识" prop="id">
            <el-input v-model="addForm.id" placeholder="角色标识"></el-input>
          </el-form-item>
          <el-form-item label="角色简介">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="form.id">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="addShow = false">取 消</el-button>
            <el-button @click="submitForm('addForm')">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
    <!-- 修改 -->
    <el-dialog :title="dialogTitle" v-model="detailShow">
        <el-form :model="detailForm" ref="detailForm" :label-width="formLabelWidth">
          <el-form-item label="角色名称" prop="id">
            <el-input v-model="detailForm.id" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-row>
              <el-col :span="12">
                <el-form-item label="角色类别">
                  <el-select v-model="value1" placeholder="请选择" class="fullwidth">
                    <el-option
                      v-for="item in roleClass"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="归属商户" filterable placeholder="输入或选择商户">
                  <el-select v-model="value2" placeholder="请选择" class="fullwidth">
                    <el-option
                      v-for="item in origins"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="是否启用">
              <el-switch
                v-model="enabled"
                on-text="是"
                off-text="否">
              </el-switch>
            </el-form-item>
          <el-form-item label="角色标识" prop="id">
            <el-input v-model="detailForm.id" placeholder="角色标识"></el-input>
          </el-form-item>
          <el-form-item label="角色简介">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="form.id">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="detailShow = false">取 消</el-button>
            <el-button @click="editForm()">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
    <!-- 角色关联权限弹框 -->
       <el-dialog title="角色关联权限" v-model="correlateShow">
        <el-form :model="permissionForm" :label-width="formLabelWidth">
           <el-form-item label="角色名称">
              <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
            </el-form-item>           
        </el-form>
        <el-tabs class="margin" v-model="activeName"  @tab-click="handleClick" style="margin:0 2em">
          <el-tab-pane label="已关联权限" name="first">
            <rel-tab v-if='firstId'></rel-tab>
          </el-tab-pane>
          <el-tab-pane label="未关联权限" name="second">
            <norel-tab v-if='secondId'></norel-tab>
          </el-tab-pane>  
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="correlateShow = false">取 消</el-button>
            <el-button type="primary" @click="correlateShow = false">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
         <!-- 角色关联用户弹框 -->
       <el-dialog title="角色关联用户" v-model="correlateShow2">
        <el-form :model="permissionForm" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色名称">
                <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色标识">
                <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>         
            <el-form-item label="角色归属">
              <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
            </el-form-item>           
        </el-form>
        <el-tabs class="margin" v-model="activeName"  @tab-click="handleClick" style="margin:0 2em">
          <el-tab-pane label="已关联用户" name="first">
            <rel v-if='firstId'></rel>
          </el-tab-pane>
          <el-tab-pane label="待关联用户" name="second">
            <norel v-if='secondId'></norel>
          </el-tab-pane>  
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="correlateShow2 = false">取 消</el-button>
            <el-button type="primary" @click="correlateShow2 = false">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import relTab from './reltable/rel-perssion'
import norelTab from './reltable/noRel-perssion'
import rel from './reltable/rel-users'
import norel from './reltable/noRel-users'
export default {
  data () {
    return {
      addShow: false,
      firstId: true,
      secondId: true,
      enabled: false,
      correlateShow2: false,
      correlateShow: false,
      activeName: 'first',
      origins: [{
        value: '1',
        label: '商户级别'
      }, {
        value: '2',
        label: '系统级别'
      }],
      roleClass: [{
        value: '1',
        label: '商户级别'
      }, {
        value: '2',
        label: '系统级别'
      }],
      value1: '',
      value2: '',
      formLabelWidth: '80px',
      permissionForm: {
        name: ''
      },
      adSwitch: true,
      advancedSearch: {
        keyword: ''
      },
      dialogAdvance: false,
      detailForm: {
        id: ''
      },
      addForm: {
        id: ''
      },
      dialogVisibleMove: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      dialogTitle: '',
      uploadURL: config.serverURI + config.uploadFilesAPI,
      multipleSelection: [],
      response: {
        data: null,
        audit_state: true
      },
      detailShow: false,
      selectedOptions: [],
      showDialog: false,
      dialogVisible: false,
      dialogImageUrl: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        audit_state: ''
      },
      ids: [],
      rules: {
        display_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '分类说明50字以内', trigger: 'blur' },
          { min: 0, max: 50, message: '分类说明长度在50字以内', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    relTab,
    norelTab,
    rel,
    norel
  },
  methods: {
    // 打开关联权限弹框
    openPermission () {
      this.correlateShow = true
    },
    // 打开关联用户弹框
    openUsers () {
      this.correlateShow2 = true
    },
    // 刷新
    refresh () {
      this.getList()
    },
    detail () {
      this.detailShow = true
    },
    // 进入小区详情页
    edit (id) {
      this.$router.push({ path: '/admin/recycle/village/detail', query: { 'id': id } })
    },
    enterRel (id) {
      this.$store.commit('SET_TOKEN', id)
      this.$router.push({ path: '/admin/recycle/village/relserver', query: { 'id': id } })
    },
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
      if (command === '移动') {
        this.confirmMove()
      }
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
    transformDate (res) {
      res.data.forEach(v => {
        if (v.audit_state === 0) {
          v.audit_state = false
        }
        if (v.audit_state === 1) {
          v.audit_state = true
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
    iconHandleAvatarSuccess(res, file) {
      this.icon = window.URL.createObjectURL(file.raw)
      this.classData.icon = res.data[0]
    },
    handleAvatarSuccess(res, file) {
      this.logo = window.URL.createObjectURL(file.raw)
      this.classData.logo = res.data[0]
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    toswitch (active, id) {
      if (active) {
        active = 1
      } else {
        active = 0
      }
      api.POST(config.village.audit, {id: id, audit_state: active})
      .then(response => {
        this.getList()
        this.onSuccess('启用操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    advance () {
      this.dialogAdvance = false
      this.adSwitch = false
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      api.GET(config.village.advanced, data)
      .then(response => {
        this.response = this.transformDate(response.data)
      })
      .catch(error => {
        this.$message.error(error)
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
    // 模态框显示
    openDialog (e, data = null, type = null) {
      console.log(data)
      if (data !== null && type === 'edit') {
        this.detailShow = true
        this.dialogType = 'edit'
        this.dialogTitle = '修改角色'
        this.detailForm = {
          ...data
        }
      } else {
        this.addShow = true
        this.dialogType = 'add'
        this.dialogTitle = '新增角色'
        this.detailForm = {
          id: ''
        }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let data = {}
          console.log(111)
          this.detailShow = false
          // api.POST(config.createCategoryAPI, data)
          //   .then(response => {
          //     if (response.status !== 200) {
          //       this.error = response.statusText
          //       return
          //     }
          //     if (response.data.errcode === '0000') {
          //       this.onSuccess('创建成功')
          //       this.getList()
          //       this.detailShow = false
          //     }
          //   })
        } else {
          return false
        }
      })
    },
    editForm () {
      var obj = this.classData
      var pid = this.stepsSelection
      obj.parent_id = pid.shift()
      obj.created_at = this.classData.created_at
      api.POST(config.updateCategoryAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.getList()
          this.detailShow = false
        }
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选表单？', '错误', {
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
      this.$confirm('此操作将删除该角色，删除后，拥有该角色的工号权限将会受到影响。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.village.delete, {
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
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
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
    getTree () {
      api.GET(config.village.streetTree)
      .then(response => {
        var newData = response.data.data[0].children[0].children
        this.iteration(newData)
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.village.list, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
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
    this.getTree()
  }
}
</script>
<style scoped>
.GD-container{
    height: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
   border-color: #20a0ff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px !important;
    text-align: center;
}
.avatar {
    width: 140px;
    height: 140px;
    display: block;
}
.FS-moveName{
    font-weight: 600;
    font-size: 14px;
    margin: 7px 0 0 7px;
}

</style>