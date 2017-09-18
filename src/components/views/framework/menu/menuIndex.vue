<template>
  <div class="GD-container">
    <el-row tpye="flex">
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
            <el-col :span="14">
              <el-button @click="openDialog" type="primary">+新增</el-button>
              <el-button @click="getList()" type="primary">刷新</el-button>
              <el-dropdown @command="handleCommand" style="margin-left:10px;">
                <el-button type="primary">
                  批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
                  <el-dropdown-item command="移动">移动</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-select v-model="form.value" placeholder="所有信息" style="width:140px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="display_name" label="菜单名称"></el-table-column>
            <el-table-column prop="name" label="菜单标识"></el-table-column>
            <el-table-column prop="icon" label="图标" width="95">
            </el-table-column>
            <el-table-column prop="sort" label="同级排序" width="88"></el-table-column>
            <el-table-column prop="url" label="菜单路由" width="88"></el-table-column>
            <el-table-column label="创建时间">
              <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
            </el-table-column>
            <el-table-column label="有效状态" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.active"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.active,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
              width="160"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="openPermission(scope.row.id)" size="small">联</el-button>
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
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="移动" v-model="dialogVisibleMove" size="tiny">
        <div style="width:100%">
            <el-row type="flex" justify="center">
                <el-col :span="4">
                  <p class="FS-moveName">移动到</p>
                </el-col>
                <el-col :span="20">
                    <el-cascader
                      style="width:100%;"
                      change-on-select
                      :options="cascaderData"
                      :props="props"
                      v-model="selectedOptions"
                      @change="handleChangeMove">
                  </el-cascader>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleMove = false">取 消</el-button>
          <el-button type="primary" @click="confirmMove">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 新增 start -->
    <el-dialog :title="dialogTitle" v-model="addDialog">
      <el-form :model="addData" :rules="rules" ref="addData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级菜单">
              <el-cascader
                :options="cascaderData"
                :props="props"
                :change-on-select="true"
                v-model="addData.parent_id"
                @change="handleChange"
                style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="displayName" require>
              <el-input v-model="addData.display_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="同级排序">
              <el-input-number v-model="addData.sort" style="width:120px;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch
                v-model="addData.active"
                on-text="开"
                off-text="关">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单标识" prop="name" require>
              <el-input v-model="addData.name"></el-input>
            </el-form-item>
          </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标">
              <el-input v-model="addData.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="访问路由">
              <el-input v-model="addData.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单说明">
              <el-input type="textarea" v-model="addData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取消</el-button>
          <el-button @click="submitForm('addData')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 新增 end -->
    <!-- 修改 start -->
    <el-dialog :title="dialogTitle" v-model="editDialog">
      <el-form :model="classData" ref="classData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="父级菜单">
              <el-cascader
                :options="cascaderData"
                :props="props"
                :change-on-select="true"
                v-model="stepsSelection"
                @change="handleChange"
                style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="display_name" require>
              <el-input v-model="classData.display_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="同级排序">
              <el-input-number v-model="classData.sort" style="width:120px;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch
                v-model="classData.active"
                on-text="开"
                off-text="关">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单标识">
              <el-input v-model="classData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标">
              <el-input v-model="classData.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="访问路由">
              <el-input v-model="classData.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单说明">
              <el-input type="textarea" v-model="classData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取消</el-button>
          <el-button @click="editForm()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 end -->
    <!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" :label-width="formLabelWidth">
           <el-form-item label="关键字">
              <el-input v-model="advancedSearch.keyword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称">
              <el-input v-model="advancedSearch.display_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单标识">
              <el-input v-model="advancedSearch.name" auto-complete="off"></el-input>
            </el-form-item>            
            <el-form-item label="是否启用">
              <el-switch
                on-text="是"
                v-model="advancedSearch.active"
                off-text="否">
              </el-switch>
            </el-form-item>       
            <el-form-item label="创建时间">
              <el-row type="flex" justify="space-around">
                <el-date-picker
                  v-model="advancedSearch.start_time"
                  type="datetime"
                  placeholder="选择开始时间">
                </el-date-picker>
                <el-date-picker
                  v-model="advancedSearch.end_time"
                  type="datetime"
                  placeholder="选择结束时间">
                </el-date-picker>
              </el-row>
            </el-form-item>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdvance = false">取 消</el-button>
            <el-button type="primary" @click="advance">搜 索</el-button>
        </span>
    </el-dialog>
    <!-- 菜单关联权限弹框 -->
       <el-dialog title="菜单关联权限" v-model="correlateShow">
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
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import relTab from './reltable/rel-perssion'
import norelTab from './reltable/noRel-perssion'
export default {
  data () {
    var displayName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('菜单名称不能为空'))
      } else {
        api.POST(config.frameWorkMenu.check, {display_name: this.addData.display_name})
        .then(response => {
          this.onSuccess('启用操作成功！')
        })
        .catch(error => {
          this.$message.error(error)
        })
        // callback(new Error('重名，该菜单已存在'))
      }
    }
    return {
      editDialog: false,
      addDialog: false,
      activeName: 'first',
      firstId: true,
      secondId: true,
      permissionForm: {
        name: ''
      },
      correlateShow: false,
      formLabelWidth: '80px',
      advancedSearch: {
        keyword: '',
        display_name: '',
        name: '',
        active: '',
        start_time: '',
        end_time: ''
      },
      dialogAdvance: false,
      moveVal: null,
      dialogVisibleMove: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'display_name'
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      uploadURL: config.serverURI + config.uploadFilesAPI,
      multipleSelection: [],
      option: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '栏目名称'
      }, {
        value: '2',
        label: '访问路径'
      }],
      response: {
        data: null
      },
      icon: '',
      logo: '',
      classData: {
        parent_id: [],
        display_name: '',
        sort: null,
        active: 1,
        name: '',
        memo: '',
        url: '',
        icon: ''
      },
      addData: {
        parent_id: [],
        display_name: '',
        sort: null,
        active: 1,
        name: '',
        memo: '',
        url: '',
        icon: ''
      },
      selectedOptions: [],
      showDialog: false,
      dialogVisible: false,
      dialogImageUrl: '',
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        value: ''
      },
      parentId: null,
      ids: [],
      rules: {
        display_name: [
          { required: true, validator: displayName, trigger: 'blur' }
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
    norelTab
  },
  methods: {
    // 打开关联权限弹框
    openPermission (id) {
      this.correlateShow = true
    },
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
      if (command === '移动') {
        this.confirmMove()
      }
    },
    // 高级搜索
    advance () {
      this.advancedSearch.active = Number(this.advancedSearch.active)
      if (this.advancedSearch.start_time) {
        this.advancedSearch.start_time = this.formatDate(this.advancedSearch.start_time)
      }
      if (this.advancedSearch.end_time) {
        this.advancedSearch.end_time = this.formatDate(this.advancedSearch.end_time)
      }
      console.log(this.advancedSearch, 1111)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      this.getList(data)
      this.dialogAdvance = false
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
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
    toswitch (active, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      api.POST(config.frameWorkMenu.active, {id: id, active: Number(active)})
      .then(response => {
        this.getList(data)
        this.onSuccess('启用操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 树形结构选择
    handleChange (value) {
      console.log(value)
    },
    handleChangeMove (value) {
      console.log(value)
      this.moveVal = value
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.getList({parent_id: this.parentId})
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
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改菜单'
        this.editDialog = true
        this.classData = {
          ...this.classData,
          ...data
        }
        this.stepsSelection = []
        if (data.parent) {
          this.stepsSelection.push(data.parent.id)
        } else {
          this.stepsSelection.push(data.id)
        }
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增菜单'
        this.addDialog = true
        // this.classData = {
        //   parent_id: [],
        //   display_name: '',
        //   sort: null,
        //   active: 1,
        //   description: '',
        //   logo: '',
        //   icon: ''
        // }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.classData.active = Number(this.classData.active)
          var obj = this.classData
          var pid = this.stepsSelection
          obj.parent_id = pid.shift()
          console.log(obj)
          api.POST(config.createCategoryAPI, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.onSuccess('创建成功')
                this.getList()
                this.getTree()
                this.showDialog = false
              }
            })
        } else {
          return false
        }
      })
    },
    editForm () {
      this.classData.active = Number(this.classData.active)
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
          this.getTree()
          this.showDialog = false
        }
      })
    },
    // 批量移动
    confirmMove () {
      this.dialogVisibleMove = true
      this.parentId = null
      this.parentId = this.moveVal.shift()
      var obj = {}
      obj.ids = this.ids
      obj.id = this.parentId
      api.POST(config.moveCategoryAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getList()
          this.getTree()
          this.dialogVisibleMove = false
        }
      }).catch(error => {
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
      this.$confirm('是否确认删除该表单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.frameWorkMenu.delete, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
            this.getTree()
          } else {
            this.$message.error(response.data.errmsg)
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
      api.GET(config.frameWorkMenu.showLeft)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.unshift({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.frameWorkMenu.index, data)
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
    this.getTree()
    this.getList()
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